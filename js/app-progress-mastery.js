const MASTERY_RANKS = [
  { label: "Rookie", minScore: 0, minAttempts: 0, minCoverage: 0 },
  { label: "Novice", minScore: 15, minAttempts: 20, minCoverage: 0.08 },
  { label: "Adept", minScore: 32, minAttempts: 60, minCoverage: 0.22 },
  { label: "Expert", minScore: 50, minAttempts: 120, minCoverage: 0.4 },
  { label: "Elite", minScore: 68, minAttempts: 220, minCoverage: 0.58 },
  { label: "Master", minScore: 82, minAttempts: 360, minCoverage: 0.75 },
  { label: "Legend", minScore: 92, minAttempts: 520, minCoverage: 0.9 },
];

function getMasteryRankIndex(rankLabel) {
  return MASTERY_RANKS.findIndex((rank) => rank.label === rankLabel);
}

function getOperationSkillUniverse(operation) {
  if (operation === "addition") {
    return ADDITION_TRACKER_BUCKETS.map((bucket) => bucket.key);
  }
  if (operation === "subtraction") {
    return SUBTRACTION_TRACKER_BUCKETS.map((bucket) => bucket.key);
  }
  if (operation === "division") {
    return TABLE_FACTORS.map((factor) => `d${factor}`);
  }
  return TABLE_FACTORS.map((factor) => `x${factor}`);
}

function getTelemetryForOperation(operation) {
  return normaliseAnswerTelemetry(state.progress.answerTelemetry)
    .filter((entry) => entry.operation === operation)
    .sort((left, right) => right.timestamp - left.timestamp);
}

function getMasteryRank(score, attempts, coverageRatio) {
  return MASTERY_RANKS.reduce((best, rank) => {
    if (score >= rank.minScore && attempts >= rank.minAttempts && coverageRatio >= rank.minCoverage) {
      return rank;
    }
    return best;
  }, MASTERY_RANKS[0]);
}

function getNextMasteryRank(rank) {
  const index = getMasteryRankIndex(rank.label);
  return MASTERY_RANKS[Math.min(index + 1, MASTERY_RANKS.length - 1)];
}

function getOperationBestRankRecord(operation) {
  const bestRanks = normaliseOperationBestRanks(state.progress.operationBestRanks);
  state.progress.operationBestRanks = bestRanks;
  return bestRanks[operation] || { rank: "Rookie", score: 0, earnedAt: 0 };
}

function updateOperationBestRank(summary) {
  const existing = getOperationBestRankRecord(summary.operation);
  const currentIndex = getMasteryRankIndex(summary.rank.label);
  const existingIndex = getMasteryRankIndex(existing.rank);
  const shouldUpdate =
    currentIndex > existingIndex ||
    (currentIndex === existingIndex && summary.score > existing.score);

  if (!shouldUpdate) {
    return existing;
  }

  const updated = {
    rank: summary.rank.label,
    score: summary.score,
    earnedAt: Date.now(),
  };
  state.progress.operationBestRanks[summary.operation] = updated;
  queueProgressSave();
  return updated;
}

function getMasterySignalScore(value, max = 1) {
  return Math.round(clampNumber(value, 0, max, 0) / max * 100);
}

function getOperationMastery(operation) {
  const factEntries = getFactEntriesByOperation(operation);
  const telemetry = getTelemetryForOperation(operation);
  const workouts = getWorkoutHistoryByOperation(operation);
  const recent = telemetry.filter((entry) => !entry.skipped).slice(0, 60);
  const attempts = factEntries.reduce((sum, entry) => sum + entry.attempts, 0);
  const correct = factEntries.reduce((sum, entry) => sum + entry.correct, 0);
  const accuracy = getAccuracy(correct, attempts);
  const recentCorrect = recent.filter((entry) => entry.correct).length;
  const recentAccuracy = getAccuracy(recentCorrect, recent.length);
  const fluencyAttempts = recent.filter((entry) => entry.correct && entry.responseTimeMs !== null);
  const fluentCorrect = fluencyAttempts.filter(
    (entry) => entry.responseTimeMs <= getFluencyThresholdMs(operation),
  ).length;
  const fluency = getAccuracy(fluentCorrect, Math.max(1, recentCorrect));
  const skillUniverse = getOperationSkillUniverse(operation);
  const skillStats = new Map(skillUniverse.map((skillKey) => [skillKey, { attempts: 0, correct: 0 }]));

  factEntries.forEach((entry) => {
    const skillKeys = entry.operation === "multiplication"
      ? Array.from(new Set([Math.abs(entry.left), Math.abs(entry.right)]))
          .filter((factor) => factor >= 1 && factor <= FACTOR_LIMIT)
          .map((factor) => `x${factor}`)
      : [getLearningSkillKey({
          operation: entry.operation,
          a: entry.left,
          b: entry.right,
          left: entry.left,
          right: entry.right,
        })];
    skillKeys.forEach((skillKey) => {
      const stats = skillStats.get(skillKey) || { attempts: 0, correct: 0 };
      stats.attempts += entry.attempts;
      stats.correct += entry.correct;
      skillStats.set(skillKey, stats);
    });
  });

  const coveredSkills = Array.from(skillStats.entries()).filter(([, stats]) =>
    stats.attempts >= BUCKET_STATUS_MIN_ATTEMPTS && getAccuracy(stats.correct, stats.attempts) >= 0.7,
  );
  const strongSkills = Array.from(skillStats.entries()).filter(([, stats]) =>
    stats.attempts >= BUCKET_STATUS_STRONG_MIN_ATTEMPTS && getAccuracy(stats.correct, stats.attempts) >= 0.9,
  );
  const coverageRatio = getAccuracy(coveredSkills.length, skillUniverse.length);
  const uniqueDates = new Set(telemetry.map((entry) => entry.dateKey)).size;
  const retention = Math.min(1, uniqueDates / 4) * (recent.length >= 10 ? Math.max(recentAccuracy, accuracy) : accuracy);
  const recentWorkouts = workouts.slice(0, 6).filter((record) => record.attempted > 0);
  const workoutAccuracies = recentWorkouts.map((record) => record.accuracy);
  const averageWorkoutAccuracy = average(workoutAccuracies) || 0;
  const variance = workoutAccuracies.length
    ? average(workoutAccuracies.map((value) => Math.abs(value - averageWorkoutAccuracy))) || 0
    : 1;
  const consistency = workoutAccuracies.length >= 2
    ? clampNumber(1 - variance * 2.5, 0, 1, 0)
    : accuracy * 0.5;
  const hardAttempts = telemetry.filter((entry) => entry.difficultyBand === "hard").length;
  const hardCorrect = telemetry.filter((entry) => entry.difficultyBand === "hard" && entry.correct).length;
  const difficulty = operation === "addition" || operation === "subtraction"
    ? Math.min(1, getAccuracy(hardCorrect, Math.max(1, hardAttempts)) * Math.min(hardAttempts / 20, 1))
    : Math.min(1, Math.max(...coveredSkills.map(([skillKey]) => Number(String(skillKey).replace(/^[xd]/, ""))), 0) / FACTOR_LIMIT);
  const score = Math.round(
    accuracy * 30 +
    fluency * 20 +
    coverageRatio * 20 +
    retention * 15 +
    consistency * 10 +
    difficulty * 5,
  );
  const rank = getMasteryRank(score, attempts, coverageRatio);
  const nextRank = getNextMasteryRank(rank);
  const nextGoal = getOperationMasteryGoal({
    rank,
    nextRank,
    attempts,
    accuracy,
    recentAccuracy,
    fluency,
    coverageRatio,
    retention,
    consistency,
  });

  return {
    operation,
    label: getOperationLabel(operation),
    score,
    rank,
    bestRank: getOperationBestRankRecord(operation),
    nextRank,
    nextGoal,
    attempts,
    accuracy,
    recentAccuracy,
    fluency,
    coverageRatio,
    retention,
    consistency,
    strongSkills,
    coveredSkills,
    skillUniverse,
  };
}

function getOperationMasteryGoal(summary) {
  if (summary.rank.label === "Legend") {
    return "Keep the rank warm with spaced review across the full operation.";
  }
  if (summary.attempts < summary.nextRank.minAttempts) {
    return `Reach ${summary.nextRank.minAttempts} total attempts with steady practice.`;
  }
  if (summary.coverageRatio < summary.nextRank.minCoverage) {
    return "Build more skill areas so the rank reflects broad coverage.";
  }
  if (summary.accuracy < 0.85 || summary.recentAccuracy < 0.85) {
    return "Raise recent accuracy toward 85% before pushing speed.";
  }
  if (summary.fluency < 0.65) {
    return "Turn correct answers into quicker, easier recall.";
  }
  if (summary.retention < 0.6) {
    return "Return across multiple days so the app can confirm retention.";
  }
  if (summary.consistency < 0.65) {
    return "Keep performance steady across the next few workouts.";
  }
  return `Push the full evidence score toward ${summary.nextRank.label}.`;
}

function getMasterySummaryCopy(strongest) {
  return strongest
    ? `${strongest.label} leads at ${strongest.rank.label} with ${strongest.score} mastery points.`
    : "Complete a few workouts to start building operation ranks.";
}

function getMasterySelectionOptions() {
  return ["overview", ...OPERATION_OPTIONS];
}

function getMasterySelectionLabel(selection) {
  return selection === "overview" ? "Overview" : getOperationLabel(selection);
}

function renderMasteryRankTrack(currentRankLabel) {
  return MASTERY_RANKS.map((rank) => `
    <span class="mastery-rank-dot ${rank.label === currentRankLabel ? "is-current" : ""}" title="${escapeHtml(rank.label)}"></span>
  `).join("");
}

function renderMasteryMetric(label, value) {
  return `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
}

// An untrained operation shows "-" rather than a 0% that reads like a failed score.
function formatMasteryPercent(summary, value) {
  return summary.attempts > 0 ? formatPercent(value) : "-";
}

function renderMasterySnapshotCard(summary) {
  const coverageLabel = `${summary.coveredSkills.length}/${summary.skillUniverse.length}`;

  return `
    <article class="mastery-card">
      <span class="mastery-card-head">
        <span>
          <span class="section-kicker">${escapeHtml(summary.label)}</span>
          <strong>${escapeHtml(summary.rank.label)}</strong>
        </span>
        <span class="mastery-score" aria-label="${summary.score} out of 100 mastery score"><strong>${summary.score}</strong><small>/100</small></span>
      </span>
      <span class="mastery-rank-track" aria-hidden="true">
        ${renderMasteryRankTrack(summary.rank.label)}
      </span>
      <span class="mastery-meter" aria-label="Progress toward mastery score">
        <span style="width: ${summary.score}%"></span>
      </span>
      <span class="mastery-snapshot-metrics">
        ${renderMasteryMetric("Accuracy", formatMasteryPercent(summary, summary.accuracy))}
        ${renderMasteryMetric("Coverage", coverageLabel)}
        ${renderMasteryMetric("Attempts", String(summary.attempts))}
      </span>
    </article>
  `;
}

function renderMasteryModeControls(selection) {
  return `
    <div class="mastery-view-controls">
      <div class="fact-carousel-selector progress-inline-selector" aria-label="Mastery view mode">
        <button class="fact-range-button" type="button" data-mastery-selection-shift="-1" aria-label="Previous mastery view">&#8249;</button>
        <span class="fact-carousel-label">${escapeHtml(getMasterySelectionLabel(selection))}</span>
        <button class="fact-range-button" type="button" data-mastery-selection-shift="1" aria-label="Next mastery view">&#8250;</button>
      </div>
    </div>
  `;
}

function renderMasteryDetailPanel(summary) {
  const coverageLabel = `${summary.coveredSkills.length}/${summary.skillUniverse.length} areas`;
  const strongLabels = summary.strongSkills
    .slice(0, 4)
    .map(([skillKey]) => getLearningSkillLabel(summary.operation, skillKey))
    .join(", ");
  const strengthCopy = strongLabels
    ? `<p class="fact-meta">Strong areas: ${escapeHtml(strongLabels)}</p>`
    : "";

  return `
    <article class="mastery-detail-panel">
      <div class="mastery-detail-head">
        <div>
          <p class="section-kicker">${escapeHtml(summary.label)} detail</p>
          <h3>${escapeHtml(summary.rank.label)} current form</h3>
        </div>
        <div class="mastery-score mastery-score-large" aria-label="${summary.score} out of 100 mastery score"><strong>${summary.score}</strong><small>/100</small></div>
      </div>

      <div class="mastery-detail-grid">
        <section>
          <h4>Snapshot</h4>
          <div class="mastery-signal-grid">
            ${renderMasteryMetric("Accuracy", formatMasteryPercent(summary, summary.accuracy))}
            ${renderMasteryMetric("Recent", formatMasteryPercent(summary, summary.recentAccuracy))}
            ${renderMasteryMetric("Fluency", formatMasteryPercent(summary, summary.fluency))}
            ${renderMasteryMetric("Coverage", coverageLabel)}
            ${renderMasteryMetric("Stability", getMasterySignalScore(summary.consistency))}
            ${renderMasteryMetric("Attempts", String(summary.attempts))}
          </div>
        </section>

        <section>
          <h4>Rank path</h4>
          <div class="mastery-rank-track mastery-rank-track-detail" aria-hidden="true">
            ${renderMasteryRankTrack(summary.rank.label)}
          </div>
          <div class="mastery-form-row">
            <span>Current form <strong>${escapeHtml(summary.rank.label)}</strong></span>
            <span>Score <strong>${summary.score}/100</strong></span>
          </div>
          <div class="mastery-next">
            <span>Training focus</span>
            <p>${escapeHtml(summary.nextGoal)}</p>
          </div>
        </section>
      </div>

      ${strengthCopy}
    </article>
  `;
}

function renderMasterySystem() {
  if (!elements.masteryGrid) {
    return;
  }

  const summaries = OPERATION_OPTIONS.map(getOperationMastery).map((summary) => ({
    ...summary,
    bestRank: updateOperationBestRank(summary),
  }));
  const strongest = summaries
    .filter((summary) => summary.attempts > 0)
    .sort((left, right) => right.score - left.score)[0];
  const masterySelections = getMasterySelectionOptions();
  if (!masterySelections.includes(state.masterySelection)) {
    state.masterySelection = "overview";
  }
  if (!strongest && state.masterySelection === "overview") {
    state.masterySelection = "overview";
  }
  const selectedSummary = summaries.find((summary) => summary.operation === state.masterySelection) ||
    strongest ||
    summaries[0];

  const modeControls = renderMasteryModeControls(state.masterySelection);
  const overviewMarkup = `<div class="mastery-overview-grid">${summaries.map(renderMasterySnapshotCard).join("")}</div>`;
  const detailMarkup = renderMasteryDetailPanel(selectedSummary);
  elements.masteryGrid.innerHTML = `
    ${modeControls}
    ${state.masterySelection === "overview" ? overviewMarkup : detailMarkup}
  `;
}

function handleMasterySelection(event) {
  const selectionShiftButton = event.target.closest("[data-mastery-selection-shift]");
  if (selectionShiftButton) {
    const direction = Number(selectionShiftButton.dataset.masterySelectionShift || 0);
    if (!direction) {
      return;
    }
    const masterySelections = getMasterySelectionOptions();
    const currentIndex = Math.max(0, masterySelections.indexOf(state.masterySelection));
    const nextIndex = (currentIndex + direction + masterySelections.length) % masterySelections.length;
    state.masterySelection = masterySelections[nextIndex];
    renderMasterySystem();
    return;
  }
}
