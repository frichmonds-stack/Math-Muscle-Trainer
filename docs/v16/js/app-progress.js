function getOperationFilterValue(selectElement, fallback = "all") {
  if (!(selectElement instanceof HTMLSelectElement)) {
    return fallback;
  }

  const value = selectElement.value;
  return value === "addition" ||
    value === "multiplication" ||
    value === "subtraction" ||
    value === "division" ||
    value === "all"
    ? value
    : fallback;
}

function getOverviewOperationFilterValue() {
  return getOperationFilterValue(elements.overviewOperationFilter, "all");
}

function getFocusOperationFilterValue() {
  return getOperationFilterValue(elements.focusOperationFilter, "all");
}

function getCoachOperationFilterValue() {
  return getOperationFilterValue(elements.coachOperationFilter, "all");
}

function getFactOperationFilterValue() {
  if (!elements.factOperationFilter) {
    return "multiplication";
  }
  return OPERATION_OPTIONS.includes(elements.factOperationFilter.value)
    ? elements.factOperationFilter.value
    : "multiplication";
}

function syncFactDetailFilterOptions() {
  if (!elements.factDetailFilter) {
    return;
  }

  const operation = getFactOperationFilterValue();
  const definitions = FACT_TRACKER_DETAIL_OPTIONS[operation] || FACT_TRACKER_DETAIL_OPTIONS.multiplication;
  const previousValue = elements.factDetailFilter.value;

  elements.factDetailFilter.innerHTML = definitions
    .map((definition) => `<option value="${definition.key}">${definition.label}</option>`)
    .join("");
  elements.factDetailFilter.value = definitions.some((definition) => definition.key === previousValue)
    ? previousValue
    : definitions[0].key;
}

function getFactDetailFilterValue() {
  const operation = getFactOperationFilterValue();
  const definitions = FACT_TRACKER_DETAIL_OPTIONS[operation] || FACT_TRACKER_DETAIL_OPTIONS.multiplication;
  const fallback = definitions[0]?.key || "overall";
  if (!elements.factDetailFilter) {
    return fallback;
  }

  const value = elements.factDetailFilter.value;
  return definitions.some((definition) => definition.key === value) ? value : fallback;
}

function updateFactSelectorCarouselState() {
  const operation = getFactOperationFilterValue();
  if (elements.factOperationLabel) {
    elements.factOperationLabel.textContent = OPERATION_LABELS[operation] || "Multiplication";
  }
  const definitions = FACT_TRACKER_DETAIL_OPTIONS[operation] || FACT_TRACKER_DETAIL_OPTIONS.multiplication;
  const detailValue = getFactDetailFilterValue();
  const detailIndex = definitions.findIndex((definition) => definition.key === detailValue);
  const boundedIndex = detailIndex < 0 ? 0 : detailIndex;
  const activeDefinition = definitions[boundedIndex] || definitions[0];
  const showDetailSelector = definitions.length > 1;
  const showRangeSelector = operation === "multiplication" || operation === "division";

  if (elements.factDetailLabel) {
    elements.factDetailLabel.textContent = activeDefinition?.label || "Overall";
  }
  if (elements.factDetailSelector) {
    elements.factDetailSelector.hidden = !showDetailSelector;
    elements.factDetailSelector.style.display = showDetailSelector ? "" : "none";
  }
  if (elements.factRangeNav) {
    elements.factRangeNav.hidden = !showRangeSelector;
    elements.factRangeNav.style.display = showRangeSelector ? "" : "none";
  }

  if (elements.factOperationPrevButton) {
    elements.factOperationPrevButton.disabled = false;
  }
  if (elements.factOperationNextButton) {
    elements.factOperationNextButton.disabled = false;
  }
  if (elements.factDetailPrevButton) {
    elements.factDetailPrevButton.disabled = !showDetailSelector || boundedIndex === 0;
  }
  if (elements.factDetailNextButton) {
    elements.factDetailNextButton.disabled = !showDetailSelector || boundedIndex >= definitions.length - 1;
  }

  if (elements.factsSelectorRow) {
    const widthCh = Math.max(12, "Without regrouping".length + 4);
    elements.factsSelectorRow.style.setProperty("--facts-selector-width", `${widthCh}ch`);
  }
}

const FACT_TRACKER_MULTIPLICATION_RANGES = [
  { label: "x 1 - x 6", minFactor: 1, maxFactor: 6 },
  { label: "x 7 - x 12", minFactor: 7, maxFactor: 12 },
];

function getFactTrackerRangeCount() {
  return FACT_TRACKER_MULTIPLICATION_RANGES.length;
}

function clampFactTrackerRangeIndex(index) {
  const maxIndex = getFactTrackerRangeCount() - 1;
  return Math.max(0, Math.min(maxIndex, Number(index) || 0));
}

function resetFactTrackerRange() {
  state.factTrackerRangeIndex = 0;
}

function updateFactTrackerRangeControls(isMultiplicationView) {
  if (!elements.factRangeNav || !elements.factRangeLabel) {
    return;
  }

  if (!isMultiplicationView) {
    elements.factRangeNav.hidden = true;
    elements.factRangeLabel.textContent = "all";
    if (elements.factRangePrevButton) {
      elements.factRangePrevButton.disabled = true;
    }
    if (elements.factRangeNextButton) {
      elements.factRangeNextButton.disabled = true;
    }
    updateFactSelectorCarouselState();
    return;
  }

  elements.factRangeNav.hidden = false;
  state.factTrackerRangeIndex = clampFactTrackerRangeIndex(state.factTrackerRangeIndex);
  const activeRange = FACT_TRACKER_MULTIPLICATION_RANGES[state.factTrackerRangeIndex];
  elements.factRangeLabel.textContent = activeRange.label;

  if (elements.factRangePrevButton) {
    elements.factRangePrevButton.disabled = state.factTrackerRangeIndex === 0;
  }
  if (elements.factRangeNextButton) {
    elements.factRangeNextButton.disabled =
      state.factTrackerRangeIndex >= getFactTrackerRangeCount() - 1;
  }
  updateFactSelectorCarouselState();
}

function shiftFactTrackerRange(direction) {
  const operation = getFactOperationFilterValue();
  if (operation !== "multiplication" && operation !== "division") {
    return;
  }

  const nextIndex = clampFactTrackerRangeIndex(state.factTrackerRangeIndex + direction);
  if (nextIndex === state.factTrackerRangeIndex) {
    return;
  }
  state.factTrackerRangeIndex = nextIndex;
  renderTableRadar();
}

function shiftFactOperation(direction) {
  if (!elements.factOperationFilter) {
    return;
  }
  const current = getFactOperationFilterValue();
  const currentIndex = Math.max(0, OPERATION_OPTIONS.indexOf(current));
  const nextIndex = (currentIndex + direction + OPERATION_OPTIONS.length) % OPERATION_OPTIONS.length;
  elements.factOperationFilter.value = OPERATION_OPTIONS[nextIndex];
  handleFactOperationFilterChange();
}

function shiftFactDetail(direction) {
  if (!elements.factDetailFilter) {
    return;
  }
  const operation = getFactOperationFilterValue();
  const definitions = FACT_TRACKER_DETAIL_OPTIONS[operation] || FACT_TRACKER_DETAIL_OPTIONS.multiplication;
  if (definitions.length <= 1) {
    return;
  }
  const current = getFactDetailFilterValue();
  const currentIndex = Math.max(
    0,
    definitions.findIndex((definition) => definition.key === current),
  );
  const nextIndex = (currentIndex + direction + definitions.length) % definitions.length;
  if (nextIndex === currentIndex) {
    return;
  }
  elements.factDetailFilter.value = definitions[nextIndex].key;
  handleFactDetailFilterChange();
}

function shiftSelectValue(selectElement, direction) {
  if (!(selectElement instanceof HTMLSelectElement)) {
    return false;
  }
  const options = Array.from(selectElement.options);
  if (!options.length) {
    return false;
  }
  const currentIndex = Math.max(0, options.findIndex((option) => option.value === selectElement.value));
  const nextIndex = (currentIndex + direction + options.length) % options.length;
  if (nextIndex === currentIndex) {
    return false;
  }
  selectElement.value = options[nextIndex].value;
  return true;
}

function syncOverviewSelectorLabel() {
  if (!elements.overviewOperationLabel) {
    return;
  }
  const value = getOverviewOperationFilterValue();
  elements.overviewOperationLabel.textContent = value === "all" ? "All Operations" : getOperationLabel(value);
}

function syncFocusSelectorLabel() {
  if (!elements.focusOperationLabel) {
    return;
  }
  const value = getFocusOperationFilterValue();
  elements.focusOperationLabel.textContent = value === "all" ? "All Operations" : getOperationLabel(value);
}

function syncCoachSelectorLabel() {
  if (!elements.coachOperationLabel) {
    return;
  }
  const value = getCoachOperationFilterValue();
  elements.coachOperationLabel.textContent = value === "all" ? "All Operations" : getOperationLabel(value);
}

function syncRecordsSelectorLabels() {
  if (elements.recordsOperationLabel) {
    const value = getRecordsOperationFilterValue();
    elements.recordsOperationLabel.textContent = value === "all" ? "All Operations" : getOperationLabel(value);
  }
  if (elements.recordsModeLabel && elements.recordsModeSelect instanceof HTMLSelectElement) {
    const selected = Array.from(elements.recordsModeSelect.options).find(
      (option) => option.value === elements.recordsModeSelect.value,
    );
    elements.recordsModeLabel.textContent = selected?.textContent?.trim() || "Workout Type";
  }
}

function shiftOverviewOperation(direction) {
  if (shiftSelectValue(elements.overviewOperationFilter, direction)) {
    handleOverviewOperationFilterChange();
  }
}

function shiftFocusOperation(direction) {
  if (shiftSelectValue(elements.focusOperationFilter, direction)) {
    handleFocusOperationFilterChange();
  }
}

function shiftCoachOperation(direction) {
  if (shiftSelectValue(elements.coachOperationFilter, direction)) {
    handleCoachOperationFilterChange();
  }
}

function shiftRecordsOperation(direction) {
  if (shiftSelectValue(elements.recordsOperationSelect, direction)) {
    handleRecordsFilterChange();
  }
}

function shiftRecordsMode(direction) {
  if (shiftSelectValue(elements.recordsModeSelect, direction)) {
    renderWorkoutHistory();
    syncRecordsSelectorLabels();
  }
}

function getRecordsOperationFilterValue() {
  if (!elements.recordsOperationSelect) {
    return "all";
  }
  const value = elements.recordsOperationSelect.value;
  return value === "addition" ||
    value === "multiplication" ||
    value === "subtraction" ||
    value === "division" ||
    value === "all"
    ? value
    : "all";
}

function matchesOperationFilter(operation, filterValue) {
  return filterValue === "all" ? true : operation === filterValue;
}

function getFactEntriesByOperation(filterValue = "all") {
  return Object.entries(state.progress.facts)
    .map(([key, value]) => {
      const parsed = parseFactKey(key);
      const progress = getFactProgress(key);
      return {
        key,
        ...parsed,
        ...progress,
        operation: progress.operation || parsed.operation || "multiplication",
        symbol: progress.symbol || parsed.symbol || "x",
      };
    })
    .filter((entry) => matchesOperationFilter(entry.operation, filterValue));
}

function getWorkoutHistoryByOperation(filterValue = "all") {
  return state.progress.workoutHistory.filter((record) =>
    matchesOperationFilter(record.operation || "multiplication", filterValue),
  );
}

function prefersTouchKeypad() {
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const maxSide = Math.max(window.innerWidth, window.innerHeight);
  return coarsePointer && maxSide >= 768;
}

function shouldUseTouchKeypad() {
  if (state.keypadPreference === "always-on") {
    return true;
  }
  if (state.keypadPreference === "always-off") {
    return false;
  }
  return prefersTouchKeypad();
}

function updatePracticeInputMode() {
  state.useTouchKeypad = shouldUseTouchKeypad();
  if (elements.practiceKeypad) {
    elements.practiceKeypad.classList.toggle("is-hidden", !state.useTouchKeypad);
  }
  if (elements.answerInput instanceof HTMLInputElement) {
    elements.answerInput.readOnly = false;
    elements.answerInput.setAttribute("inputmode", state.useTouchKeypad ? "none" : "numeric");
  }
  if (elements.practicePanel) {
    elements.practicePanel.classList.toggle("has-touch-keypad", state.useTouchKeypad);
  }
  syncKeypadSignToggleState();
}

function getBestAttemptsInDay(records) {
  const totalsByDay = {};

  records.forEach((record) => {
    const key = record.dateKey || getTodayDateKey();
    totalsByDay[key] = (totalsByDay[key] || 0) + Number(record.attempted || 0);
  });

  return Object.values(totalsByDay).reduce((best, value) => Math.max(best, value), 0);
}

function getOverallStats(filterValue = "all") {
  const factEntries = getFactEntriesByOperation(filterValue);
  const workoutHistory = getWorkoutHistoryByOperation(filterValue);
  const totals = factEntries.reduce(
    (summary, entry) => {
      summary.attempted += entry.attempts;
      summary.correct += entry.correct;
      summary.bestStreak = Math.max(summary.bestStreak, entry.bestStreak || 0);
      return summary;
    },
    { attempted: 0, correct: 0, bestStreak: 0 },
  );

  let fastestAverageMs = null;
  workoutHistory.forEach((record) => {
    if (record.averageMs === null || record.averageMs === undefined) {
      return;
    }
    fastestAverageMs =
      fastestAverageMs === null ? record.averageMs : Math.min(fastestAverageMs, record.averageMs);
  });

  return {
    attempted: totals.attempted,
    correct: totals.correct,
    bestStreak: totals.bestStreak,
    fastestAverageMs,
    workoutsCompleted: workoutHistory.length,
    bestAttemptsInDay: getBestAttemptsInDay(workoutHistory),
  };
}

function renderOverall() {
  const filterValue = getOverviewOperationFilterValue();
  const stats = getOverallStats(filterValue);
  const accuracy = getAccuracy(stats.correct, stats.attempted);
  elements.overallAnswered.textContent = `${stats.attempted}`;
  elements.overallAccuracy.textContent = formatPercent(accuracy);
  elements.overallBestStreak.textContent = `${stats.bestStreak}`;
  elements.overallBestPace.textContent = formatQuestionDuration(stats.fastestAverageMs);
  elements.overallWorkoutCount.textContent = `${stats.workoutsCompleted}`;
  elements.overallBestDayAttempts.textContent = `${stats.bestAttemptsInDay}`;
}

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
    <span class="mastery-rank-dot ${rank.label === currentRankLabel ? "is-current" : ""}"></span>
  `).join("");
}

function renderMasteryMetric(label, value) {
  return `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
}

function renderMasterySnapshotCard(summary) {
  const nextRank = summary.nextRank.label === summary.rank.label ? "Max rank" : `Next: ${summary.nextRank.label}`;
  const coverageLabel = `${summary.coveredSkills.length}/${summary.skillUniverse.length}`;

  return `
    <article class="mastery-card">
      <span class="mastery-card-head">
        <span>
          <span class="section-kicker">${escapeHtml(summary.label)}</span>
          <strong>${escapeHtml(summary.rank.label)}</strong>
        </span>
        <span class="mastery-score" aria-label="${summary.score} mastery score">${summary.score}</span>
      </span>
      <span class="mastery-rank-track" aria-hidden="true">
        ${renderMasteryRankTrack(summary.rank.label)}
      </span>
      <span class="mastery-meter" aria-label="Progress toward mastery score">
        <span style="width: ${summary.score}%"></span>
      </span>
      <span class="mastery-snapshot-metrics">
        ${renderMasteryMetric("Accuracy", formatPercent(summary.accuracy))}
        ${renderMasteryMetric("Coverage", coverageLabel)}
        ${renderMasteryMetric("Best", summary.bestRank.rank)}
      </span>
      <span class="mastery-card-next">${escapeHtml(nextRank)}</span>
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
  const nextRank = summary.nextRank.label === summary.rank.label ? "Max rank" : `Next: ${summary.nextRank.label}`;
  const coverageLabel = `${summary.coveredSkills.length}/${summary.skillUniverse.length} areas`;
  const strongLabels = summary.strongSkills
    .slice(0, 4)
    .map(([skillKey]) => getLearningSkillLabel(summary.operation, skillKey))
    .join(", ");
  const strengthCopy = strongLabels || "No strong areas yet";

  return `
    <article class="mastery-detail-panel">
      <div class="mastery-detail-head">
        <div>
          <p class="section-kicker">${escapeHtml(summary.label)} detail</p>
          <h3>${escapeHtml(summary.rank.label)} current form</h3>
        </div>
        <div class="mastery-score mastery-score-large" aria-label="${summary.score} mastery score">${summary.score}</div>
      </div>

      <div class="mastery-detail-grid">
        <section>
          <h4>Snapshot</h4>
          <div class="mastery-signal-grid">
            ${renderMasteryMetric("Accuracy", formatPercent(summary.accuracy))}
            ${renderMasteryMetric("Recent", formatPercent(summary.recentAccuracy))}
            ${renderMasteryMetric("Fluency", formatPercent(summary.fluency))}
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
            <span>Best earned <strong>${escapeHtml(summary.bestRank.rank)}</strong></span>
          </div>
          <div class="mastery-next">
            <span>${escapeHtml(nextRank)}</span>
            <p>${escapeHtml(summary.nextGoal)}</p>
          </div>
        </section>
      </div>

      <p class="fact-meta">Strongest: ${escapeHtml(strengthCopy)}</p>
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

function getRecordsModeSortValue(record, modeKey) {
  if (modeKey === "timed") {
    return [record.correct, record.accuracy, record.attempted, -(record.averageMs ?? Number.MAX_SAFE_INTEGER)];
  }

  if (modeKey === "question-goal") {
    return [record.accuracy, -(record.averageMs ?? Number.MAX_SAFE_INTEGER), record.correct, record.bestStreak];
  }

  if (modeKey === "isolation") {
    return [record.accuracy, record.correct, -(record.averageMs ?? Number.MAX_SAFE_INTEGER), record.bestStreak];
  }

  if (modeKey === "spar") {
    return [record.correct, record.attempted, record.accuracy, record.bestStreak];
  }

  return [record.correct, record.attempted, record.accuracy, record.bestStreak];
}

function compareWorkoutRecords(left, right, modeKey) {
  const leftValues = getRecordsModeSortValue(left, modeKey);
  const rightValues = getRecordsModeSortValue(right, modeKey);

  for (let index = 0; index < leftValues.length; index += 1) {
    if (leftValues[index] !== rightValues[index]) {
      return rightValues[index] - leftValues[index];
    }
  }

  return right.recordedAt - left.recordedAt;
}

function getRecordModeDefinitions(filterOperation) {
  if (filterOperation === "addition" || filterOperation === "multiplication") {
    return WORKOUT_MODE_DEFINITIONS[filterOperation];
  }

  const merged = new Map();
  Object.values(WORKOUT_MODE_DEFINITIONS).forEach((definitions) => {
    definitions.forEach((item) => {
      if (!merged.has(item.key)) {
        merged.set(item.key, item);
      }
    });
  });
  return Array.from(merged.values());
}

function syncRecordsModeOptions() {
  if (!elements.recordsModeSelect) {
    return;
  }

  const operationFilter = getRecordsOperationFilterValue();
  const definitions = getRecordModeDefinitions(operationFilter);
  const previousValue = elements.recordsModeSelect.value;

  elements.recordsModeSelect.innerHTML = definitions
    .map((item) => `<option value="${item.key}">${item.label}</option>`)
    .join("");

  const nextValue = definitions.some((item) => item.key === previousValue)
    ? previousValue
    : definitions[0]?.key || "timed";
  elements.recordsModeSelect.value = nextValue;
  syncRecordsSelectorLabels();
}

function renderPersonalBests() {
  if (!elements.personalBestsList || !elements.recordsModeSelect) {
    return;
  }

  syncRecordsModeOptions();
  const operationFilter = getRecordsOperationFilterValue();
  const selectedMode = elements.recordsModeSelect.value || "timed";
  const bests = getWorkoutHistoryByOperation(operationFilter)
    .filter((record) => record.modeKey === selectedMode)
    .sort((left, right) => compareWorkoutRecords(left, right, selectedMode))
    .slice(0, 3);

  if (!bests.length) {
    const operationLabel =
      operationFilter === "all" ? "selected operation set" : getOperationLabel(operationFilter);
    elements.personalBestsList.innerHTML = `
      <div class="focus-card empty-state">
        <div class="fact-meta">No records yet for ${operationLabel} in this workout type.</div>
      </div>
    `;
    return;
  }

  elements.personalBestsList.innerHTML = bests
    .map((record, index) => `
      <article class="focus-card record-card">
        <div class="focus-card-top">
          <div class="fact-name">#${index + 1} ${escapeHtml(getWorkoutModeLabel(record))}</div>
          <div class="focus-chip success-chip">${record.correct} correct</div>
        </div>
        <div class="fact-meta focus-meta-row">${getOperationLabel(record.operation || "multiplication")}${
          record.operation === "addition" ? ` (${record.additionDifficulty})` : ""
        } | ${formatRecordDateLabel(record)}</div>
        <div class="focus-metric">${record.attempted} attempts | ${formatPercent(record.accuracy)} accuracy</div>
        <div class="fact-meta focus-meta-row">${record.averageMs === null ? "No pace yet" : `${formatQuestionDuration(record.averageMs)} avg pace`}</div>
      </article>
    `)
    .join("");
}

function renderRecentWorkouts() {
  if (!elements.recentWorkoutsList) {
    return;
  }

  const operationFilter = getRecordsOperationFilterValue();
  const selectedMode = elements.recordsModeSelect?.value || "timed";
  const recent = getWorkoutHistoryByOperation(operationFilter)
    .filter((record) => record.modeKey === selectedMode)
    .slice(0, 4);

  if (!recent.length) {
    elements.recentWorkoutsList.innerHTML = `
      <div class="focus-card empty-state">
        <div class="fact-meta">No recent workouts match these filters yet.</div>
      </div>
    `;
    return;
  }

  elements.recentWorkoutsList.innerHTML = recent
    .map((record) => `
      <article class="focus-card record-card">
        <div class="focus-card-top">
          <div class="fact-name">${escapeHtml(getWorkoutModeLabel(record))}</div>
          <div class="focus-chip subtle-chip">${formatRecordDateLabel(record)}</div>
        </div>
        <div class="fact-meta focus-meta-row">${getOperationLabel(record.operation || "multiplication")}${
          record.operation === "addition" ? ` (${record.additionDifficulty})` : ""
        }</div>
        <div class="focus-metric">${record.correct} correct out of ${record.attempted} attempts</div>
        <div class="fact-meta focus-meta-row">${formatPercent(record.accuracy)} accuracy${record.averageMs === null ? "" : ` | ${formatQuestionDuration(record.averageMs)} avg pace`}</div>
      </article>
    `)
    .join("");
}

function renderWorkoutHistory() {
  renderPersonalBests();
  renderRecentWorkouts();
}

function getTroubleFacts(limit = 5, filterValue = "all") {
  return getFactEntriesByOperation(filterValue)
    .map((value) => ({
      ...value,
      mastery: value.attempts ? value.correct / value.attempts : 0,
      weight:
        value.misses * 4 +
        Math.round((1 - (value.attempts ? value.correct / value.attempts : 0)) * 6) +
        (value.attempts < 3 ? 1 : 0),
    }))
    .filter((fact) => fact.attempts > 0 && (fact.misses > 0 || fact.mastery < 0.8))
    .sort((left, right) => right.weight - left.weight || left.mastery - right.mastery)
    .slice(0, limit);
}

function renderPriorityList(target, troubleFacts) {
  if (!target) {
    return;
  }

  if (!troubleFacts.length) {
    target.innerHTML = `
      <div class="focus-card empty-state">
        <div class="fact-meta">No priority targets yet. Your recent facts are holding together well.</div>
      </div>
    `;
    return;
  }

  target.innerHTML = troubleFacts
    .map((fact) => {
      let chipLabel = "Low Accuracy";

      if (fact.attempts <= 1 && fact.correct === 0) {
        chipLabel = "Fresh Miss";
      } else if (fact.mastery < 0.45) {
        chipLabel = "Needs Reps";
      } else if (fact.misses >= 3) {
        chipLabel = "Sticking Point";
      }
      const safeFactLabel = escapeHtml(formatFactLabelFromKey(fact.key));
      const safeChipLabel = escapeHtml(chipLabel);

      return `
        <article class="focus-card">
          <div class="focus-card-top">
            <div class="fact-name">${safeFactLabel}</div>
            <div class="focus-chip">${safeChipLabel}</div>
          </div>
          <div class="focus-metric">${fact.correct} / ${fact.attempts} correct</div>
          <div class="fact-meta focus-meta-row">${Math.round(fact.mastery * 100)}% accuracy</div>
        </article>
      `;
    })
    .join("");
}

function getBucketLabel(operation, bucketKey) {
  if (operation === "addition") {
    return ADDITION_TRACKER_BUCKETS.find((bucket) => bucket.key === bucketKey)?.label || bucketKey;
  }

  if (operation === "multiplication") {
    return /^x\d+$/.test(bucketKey) ? bucketKey.replace("x", "x ") : bucketKey;
  }

  return bucketKey;
}

function getBucketStatus(attempts, accuracy) {
  if (!attempts) {
    return { tone: "unseen", label: "No reps yet" };
  }

  if (
    attempts >= BUCKET_STATUS_STRONG_MIN_ATTEMPTS &&
    accuracy >= BUCKET_STATUS_STRONG_MIN_ACCURACY
  ) {
    return { tone: "strong", label: "Strong" };
  }

  if (
    attempts >= BUCKET_STATUS_MIN_ATTEMPTS &&
    accuracy >= BUCKET_STATUS_BUILDING_MIN_ACCURACY
  ) {
    return { tone: "steady", label: "Building" };
  }

  return { tone: "needs", label: "Need Reps" };
}

function createBucketDailyKey(dateKey, operation, bucketKey) {
  return `${dateKey}|${operation}|${bucketKey}`;
}

function parseBucketDailyKey(key) {
  const [dateKey = "", operation = "multiplication", ...rest] = String(key).split("|");
  return {
    dateKey,
    operation: operation === "addition" ? "addition" : "multiplication",
    bucketKey: rest.join("|"),
  };
}

function getBucketsForQuestion(question) {
  if (!question) {
    return [];
  }

  if (question.operation === "addition") {
    return [getAdditionTrackerBucketKey(question.a, question.b)];
  }

  if (question.operation === "multiplication") {
    const factors = new Set([Math.abs(question.a), Math.abs(question.b)]);
    return Array.from(factors)
      .filter((factor) => factor >= 1 && factor <= FACTOR_LIMIT)
      .map((factor) => `x${factor}`);
  }

  return [];
}

function updateBucketDailyProgress(question, isCorrect) {
  const dateKey = getTodayDateKey();
  const buckets = getBucketsForQuestion(question);
  if (!buckets.length) {
    return;
  }

  state.progress.bucketDaily = state.progress.bucketDaily || {};
  if (question.operation === "addition") {
    updateAdditionBucketExamples(question, isCorrect);
  }
  buckets.forEach((bucketKey) => {
    const storageKey = createBucketDailyKey(dateKey, question.operation, bucketKey);
    const current = normaliseBucketDailyEntry(state.progress.bucketDaily[storageKey] || {});
    state.progress.bucketDaily[storageKey] = {
      attempted: current.attempted + 1,
      correct: current.correct + (isCorrect ? 1 : 0),
    };
  });
}

function updateAdditionBucketExamples(question, isCorrect) {
  if (!question || question.operation !== "addition") {
    return;
  }

  const bucketKey = getAdditionTrackerBucketKey(question.a, question.b);
  if (!ADDITION_TRACKER_BUCKET_KEYS.has(bucketKey)) {
    return;
  }

  state.progress.additionBucketExamples = state.progress.additionBucketExamples || {};
  const existingExamples = Array.isArray(state.progress.additionBucketExamples[bucketKey])
    ? state.progress.additionBucketExamples[bucketKey]
    : [];
  const byFact = new Map(existingExamples.map((entry) => [entry.factKey, entry]));
  const existing = byFact.get(question.key);
  const now = Date.now();
  const nextAttempts = clampNumber(Number(existing?.attempts ?? 0) + 1, 0, 9999, 1);
  const nextCorrect = clampNumber(
    Number(existing?.correct ?? 0) + (isCorrect ? 1 : 0),
    0,
    nextAttempts,
    0,
  );

  byFact.set(question.key, {
    factKey: question.key,
    left: question.a,
    right: question.b,
    regrouping: hasAdditionRegrouping(question.a, question.b),
    attempts: nextAttempts,
    correct: nextCorrect,
    lastSeenAt: now,
  });

  state.progress.additionBucketExamples[bucketKey] = Array.from(byFact.values())
    .sort((left, right) => right.lastSeenAt - left.lastSeenAt)
    .slice(0, ADDITION_BUCKET_EXAMPLE_CAP);
}

function buildBucketTrendItem(operation, bucketKey) {
  const todayKey = getTodayDateKey();
  const total = { attempted: 0, correct: 0 };

  Object.entries(state.progress.bucketDaily || {}).forEach(([storageKey, record]) => {
    const parsed = parseBucketDailyKey(storageKey);
    if (parsed.operation !== operation || parsed.bucketKey !== bucketKey) {
      return;
    }
    const normalised = normaliseBucketDailyEntry(record);
    total.attempted += normalised.attempted;
    total.correct += normalised.correct;
  });

  const lastWindow = { attempted: 0, correct: 0 };
  const previousWindow = { attempted: 0, correct: 0 };

  for (let index = 0; index < BUCKET_TREND_WINDOW_DAYS; index += 1) {
    const lastDateKey = shiftDateKey(todayKey, -index);
    const previousDateKey = shiftDateKey(todayKey, -(index + BUCKET_TREND_WINDOW_DAYS));

    const lastEntry = normaliseBucketDailyEntry(
      state.progress.bucketDaily?.[createBucketDailyKey(lastDateKey, operation, bucketKey)] || {},
    );
    const previousEntry = normaliseBucketDailyEntry(
      state.progress.bucketDaily?.[
        createBucketDailyKey(previousDateKey, operation, bucketKey)
      ] || {},
    );

    lastWindow.attempted += lastEntry.attempted;
    lastWindow.correct += lastEntry.correct;
    previousWindow.attempted += previousEntry.attempted;
    previousWindow.correct += previousEntry.correct;
  }

  const totalAccuracy = getAccuracy(total.correct, total.attempted);
  const lastAccuracy = getAccuracy(lastWindow.correct, lastWindow.attempted);
  const previousAccuracy = getAccuracy(previousWindow.correct, previousWindow.attempted);
  const status = getBucketStatus(total.attempted, totalAccuracy);

  return {
    operation,
    bucketKey,
    label: getBucketLabel(operation, bucketKey),
    totalAttempted: total.attempted,
    totalCorrect: total.correct,
    totalAccuracy,
    lastAttempted: lastWindow.attempted,
    lastCorrect: lastWindow.correct,
    lastAccuracy,
    previousAttempted: previousWindow.attempted,
    previousCorrect: previousWindow.correct,
    previousAccuracy,
    delta: lastAccuracy - previousAccuracy,
    status,
  };
}

function getBucketTrendItems(filterValue = "all") {
  const operations =
    filterValue === "all" ? ["multiplication", "addition"] : [filterValue];
  const items = [];

  operations.forEach((operation) => {
    if (operation === "multiplication") {
      TABLE_FACTORS.forEach((factor) => {
        items.push(buildBucketTrendItem("multiplication", `x${factor}`));
      });
      return;
    }

    ADDITION_TRACKER_BUCKETS.forEach((bucket) => {
      items.push(buildBucketTrendItem("addition", bucket.key));
    });
  });

  return items;
}

function getPositiveProgressItems(limit = 3, filterValue = "all") {
  return getBucketTrendItems(filterValue)
    .filter(
      (item) =>
        item.totalAttempted >= BUCKET_TREND_MIN_TOTAL_ATTEMPTS &&
        item.lastAttempted >= BUCKET_TREND_MIN_RECENT_ATTEMPTS &&
        item.delta >= BUCKET_TREND_DELTA_THRESHOLD,
    )
    .sort(
      (left, right) =>
        right.delta - left.delta ||
        right.lastAccuracy - left.lastAccuracy ||
        right.totalAttempted - left.totalAttempted,
    )
    .slice(0, limit);
}

function getGrowthOpportunityItems(limit = 4, filterValue = "all") {
  return getBucketTrendItems(filterValue)
    .filter(
      (item) =>
        item.totalAttempted >= BUCKET_TREND_MIN_TOTAL_ATTEMPTS &&
        item.lastAttempted >= BUCKET_TREND_MIN_RECENT_ATTEMPTS &&
        (item.delta <= -BUCKET_TREND_DELTA_THRESHOLD || item.lastAccuracy < 0.7),
    )
    .sort(
      (left, right) =>
        left.delta - right.delta ||
        left.lastAccuracy - right.lastAccuracy ||
        right.totalAttempted - left.totalAttempted,
    )
    .slice(0, limit);
}

function formatBucketTrendDelta(delta) {
  const percent = Math.round(delta * 100);
  if (percent > 0) {
    return `+${percent}% vs prior week`;
  }
  if (percent < 0) {
    return `${percent}% vs prior week`;
  }
  return "No change vs prior week";
}

function renderGrowthList(target, items) {
  if (!target) {
    return;
  }

  if (!items.length) {
    target.innerHTML = `
      <div class="focus-card empty-state">
        <div class="fact-meta">Growth opportunities will appear once bucket trends settle in.</div>
      </div>
    `;
    return;
  }

  target.innerHTML = items
    .map((item) => `
      <article class="focus-card">
        <div class="focus-card-top">
          <div class="fact-name">${escapeHtml(item.label)}</div>
          <div class="focus-chip warning-chip">${escapeHtml(item.status.label)}</div>
        </div>
        <div class="fact-meta focus-meta-row">${item.operation === "addition" ? "Addition bucket" : "Multiplication table"}</div>
        <div class="focus-metric">Last 7 days: ${item.lastCorrect} / ${item.lastAttempted} (${formatPercent(item.lastAccuracy)})</div>
        <div class="fact-meta focus-meta-row">${formatBucketTrendDelta(item.delta)}</div>
      </article>
    `)
    .join("");
}

function renderPositiveProgressList(target, items) {
  if (!target) {
    return;
  }

  if (!items.length) {
    target.innerHTML = `
      <div class="focus-card empty-state">
        <div class="fact-meta">Positive progress buckets will appear after a few days of reps.</div>
      </div>
    `;
    return;
  }

  target.innerHTML = items
    .map((item) => `
      <article class="focus-card">
        <div class="focus-card-top">
          <div class="fact-name">${escapeHtml(item.label)}</div>
          <div class="focus-chip success-chip">${escapeHtml(item.status.label)}</div>
        </div>
        <div class="fact-meta focus-meta-row">${item.operation === "addition" ? "Addition bucket" : "Multiplication table"}</div>
        <div class="focus-metric">Overall: ${item.totalCorrect} / ${item.totalAttempted} (${formatPercent(item.totalAccuracy)})</div>
        <div class="fact-meta focus-meta-row">${formatBucketTrendDelta(item.delta)}</div>
      </article>
    `)
    .join("");
}

function renderProgressFocusAreas() {
  const filterValue = getFocusOperationFilterValue();
  const troubleFacts = getTroubleFacts(3, filterValue);
  const growthItems = getGrowthOpportunityItems(2, filterValue);
  const positiveItems = getPositiveProgressItems(2, filterValue);

  renderPositiveProgressList(elements.progressWinsList, positiveItems);
  renderGrowthList(elements.progressGrowthList, growthItems);
  renderPriorityList(elements.progressPriorityList, troubleFacts);
}

function renderResultsFocusAreas() {
  const filterValue = "all";
  const troubleFacts = getTroubleFacts(3, filterValue);
  const growthItems = getGrowthOpportunityItems(2, filterValue);
  const positiveItems = getPositiveProgressItems(2, filterValue);

  renderPositiveProgressList(elements.resultsWinsList, positiveItems);
  renderGrowthList(elements.resultsGrowthList, growthItems);
  renderPriorityList(elements.resultsPriorityList, troubleFacts);
}

function renderFocusAreas() {
  renderResultsFocusAreas();
  renderProgressFocusAreas();
}

function renderCoachTip() {
  const filterValue = getCoachOperationFilterValue();
  const stats = getOverallStats(filterValue);
  const totalAttempted = stats.attempted;
  const troubleFacts = getTroubleFacts(1, filterValue);

  if (!totalAttempted) {
    elements.coachTip.innerHTML =
      "<strong>Start simple.</strong> A short workout is enough to give the trainer a baseline.";
    return;
  }

  if (troubleFacts.length) {
    const factLabel = escapeHtml(formatFactLabelFromKey(troubleFacts[0].key));
    elements.coachTip.innerHTML = `<strong>Next best target:</strong> spend a few rounds on <strong>${factLabel}</strong> and nearby facts. That pair is costing you the most right now.`;
    return;
  }

  if (stats.bestStreak >= 15) {
    elements.coachTip.innerHTML =
      "<strong>You have momentum.</strong> Push the range wider, try a timed workout, or stretch things out with Free Training.";
    return;
  }

  elements.coachTip.innerHTML =
    "<strong>Consistency wins.</strong> Start with clean reps, then build speed once the form is steady.";
}

function parseFactKey(key) {
  if (typeof key !== "string") {
    return {
      operation: "multiplication",
      symbol: "x",
      left: 0,
      right: 0,
      leftMagnitude: 0,
      rightMagnitude: 0,
    };
  }

  const modernMatch = key.match(/^(multiplication|addition|subtraction|division):(-?\d+)([x+\-\/])(-?\d+)$/i);
  if (modernMatch) {
    const operation = OPERATION_OPTIONS.includes(modernMatch[1])
      ? modernMatch[1]
      : "multiplication";
    const left = Number(modernMatch[2]);
    const symbol = getOperationDisplaySymbol(operation);
    const right = Number(modernMatch[4]);
    return {
      operation,
      symbol,
      left,
      right,
      leftMagnitude: Math.abs(left),
      rightMagnitude: Math.abs(right),
    };
  }

  const legacyMatch = key.match(/^(-?\d+)x(-?\d+)$/i);
  const left = legacyMatch ? Number(legacyMatch[1]) : 0;
  const right = legacyMatch ? Number(legacyMatch[2]) : 0;
  return {
    operation: "multiplication",
    symbol: "x",
    left,
    right,
    leftMagnitude: Math.abs(left),
    rightMagnitude: Math.abs(right),
  };
}

function formatFactLabelFromKey(key) {
  const parsed = parseFactKey(key);
  return `${parsed.left} ${parsed.symbol} ${parsed.right}`;
}

function getTableStatus(table) {
  return getBucketStatus(table.attempts, table.accuracy);
}

function getMultiplicationFactEntries() {
  return Object.entries(state.progress.facts)
    .map(([key]) => ({
      key,
      progress: getFactProgress(key),
      ...parseFactKey(key),
    }))
    .filter((entry) => entry.operation === "multiplication");
}

function getSignedFactGroupKey(entry) {
  const left = `${entry.left >= 0 ? "+" : "-"}${entry.leftMagnitude}`;
  const right = `${entry.right >= 0 ? "+" : "-"}${entry.rightMagnitude}`;
  return [left, right].sort().join("x");
}

function getTableStats(detailMode = "overall") {
  const trackerMode =
    detailMode === "positive" || detailMode === "all-integers" ? detailMode : "overall";
  const allFactEntries = getMultiplicationFactEntries();
  const factEntries =
    trackerMode === "positive"
      ? allFactEntries.filter((entry) => entry.left >= 0 && entry.right >= 0)
      : allFactEntries;

  return TABLE_FACTORS.map((factor) => {
    const relatedEntries = factEntries.filter(
      (entry) => entry.leftMagnitude === factor || entry.rightMagnitude === factor,
    );
    const seenGroupKeys = new Set(
      relatedEntries.map((entry) => {
        if (trackerMode === "all-integers") {
          return getSignedFactGroupKey(entry);
        }
        const low = Math.min(entry.leftMagnitude, entry.rightMagnitude);
        const high = Math.max(entry.leftMagnitude, entry.rightMagnitude);
        return `${low}x${high}`;
      }),
    );
    const totals = relatedEntries.reduce(
      (summary, entry) => {
        summary.attempts += entry.progress.attempts;
        summary.correct += entry.progress.correct;
        summary.misses += entry.progress.misses;
        return summary;
      },
      {
        attempts: 0,
        correct: 0,
        misses: 0,
      },
    );

    const accuracy = getAccuracy(totals.correct, totals.attempts);
    const totalFacts =
      trackerMode === "all-integers" ? MULTIPLICATION_SIGNED_TOTAL_FACTS : TABLE_FACTORS.length;
    const detailLabel =
      trackerMode === "all-integers"
        ? `${seenGroupKeys.size}/${totalFacts} signed facts`
        : trackerMode === "positive"
          ? `${seenGroupKeys.size}/${totalFacts} positive facts`
          : `${seenGroupKeys.size}/${totalFacts} fact groups`;

    return {
      factor,
      totalFacts,
      detailLabel,
      accuracy,
      seenFacts: seenGroupKeys.size,
      ...totals,
      ...getTableStatus({
        attempts: totals.attempts,
        accuracy,
      }),
    };
  });
}

function getDigitBucket(value) {
  const magnitude = Math.abs(Number(value));
  if (magnitude <= 9) {
    return 1;
  }
  if (magnitude <= 99) {
    return 2;
  }
  return 3;
}

function hasAdditionRegrouping(left, right) {
  const sum = left + right;
  if (sum === 10) {
    return false;
  }

  let carry = 0;
  let a = Math.abs(left);
  let b = Math.abs(right);

  while (a > 0 || b > 0) {
    const column = (a % 10) + (b % 10) + carry;
    if (column >= 10) {
      return true;
    }
    carry = Math.floor(column / 10);
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }

  return false;
}

function getAdditionTrackerBucketKey(left, right) {
  const sum = left + right;
  if (sum === 10 && !(left === 0 && right === 0)) {
    return "make-10";
  }

  const first = getDigitBucket(left);
  const second = getDigitBucket(right);
  const low = Math.min(first, second);
  const high = Math.max(first, second);
  return `${low}-${high}`;
}

function getSubtractionTrackerBucketKey(left, right) {
  const leftDigits = getDigitBucket(left);
  const rightDigits = getDigitBucket(right);
  return `${leftDigits}-${rightDigits}`;
}

function buildAdditionTrackerStats() {
  const summary = Object.fromEntries(
    ADDITION_TRACKER_BUCKETS.map((bucket) => [
      bucket.key,
      {
        attempts: 0,
        correct: 0,
        regroupAttempts: 0,
        regroupCorrect: 0,
        noRegroupAttempts: 0,
        noRegroupCorrect: 0,
      },
    ]),
  );

  const additionFacts = getFactEntriesByOperation("addition");
  additionFacts.forEach((fact) => {
    if (!fact.attempts) {
      return;
    }

    const bucketKey = getAdditionTrackerBucketKey(fact.left, fact.right);
    if (!summary[bucketKey]) {
      return;
    }

    const bucket = summary[bucketKey];
    bucket.attempts += fact.attempts;
    bucket.correct += fact.correct;

    const regrouping = hasAdditionRegrouping(fact.left, fact.right);
    if (regrouping) {
      bucket.regroupAttempts += fact.attempts;
      bucket.regroupCorrect += fact.correct;
    } else {
      bucket.noRegroupAttempts += fact.attempts;
      bucket.noRegroupCorrect += fact.correct;
    }
  });

  return summary;
}

function getRatioLabel(correct, attempts) {
  if (!attempts) {
    return "No attempts yet";
  }
  return `${correct} / ${attempts} (${formatPercent(getAccuracy(correct, attempts))})`;
}

function getAdditionMetricSummary(bucket, detailMode) {
  if (detailMode === "with-regrouping") {
    return {
      key: "with-regrouping",
      label: "With regrouping",
      attempts: bucket.regroupAttempts,
      correct: bucket.regroupCorrect,
    };
  }

  if (detailMode === "without-regrouping") {
    return {
      key: "without-regrouping",
      label: "Without regrouping",
      attempts: bucket.noRegroupAttempts,
      correct: bucket.noRegroupCorrect,
    };
  }

  return {
    key: "overall",
    label: "Overall",
    attempts: bucket.attempts,
    correct: bucket.correct,
  };
}

function getAdditionBucketExamples(bucketKey, detailMode = "overall") {
  const source = Array.isArray(state.progress.additionBucketExamples?.[bucketKey])
    ? state.progress.additionBucketExamples[bucketKey]
    : [];

  const filtered =
    detailMode === "with-regrouping"
      ? source.filter((entry) => entry.regrouping)
      : detailMode === "without-regrouping"
        ? source.filter((entry) => !entry.regrouping)
        : source;

  return filtered.slice(0, ADDITION_BUCKET_EXAMPLE_DISPLAY_LIMIT);
}

function getAdditionTrackerFlipKey(bucketKey, detailMode) {
  return `${detailMode}:${bucketKey}`;
}

function isAdditionTrackerBucketFlipped(bucketKey, detailMode) {
  return Boolean(state.additionTrackerFlipMap?.[getAdditionTrackerFlipKey(bucketKey, detailMode)]);
}

function toggleAdditionTrackerBucketFlip(bucketKey, detailMode) {
  const key = getAdditionTrackerFlipKey(bucketKey, detailMode);
  const nextMap = {
    ...(state.additionTrackerFlipMap || {}),
  };
  nextMap[key] = !nextMap[key];
  state.additionTrackerFlipMap = nextMap;
}

function formatAdditionExampleEquation(entry) {
  const left = Number(entry.left);
  const right = Number(entry.right);
  const answer = left + right;
  return `${left} + ${right} = ${answer}`;
}

function buildSubtractionTrackerStats() {
  const summary = Object.fromEntries(
    SUBTRACTION_TRACKER_BUCKETS.map((bucket) => [
      bucket.key,
      {
        attempts: 0,
        correct: 0,
      },
    ]),
  );

  const subtractionFacts = getFactEntriesByOperation("subtraction");
  subtractionFacts.forEach((fact) => {
    if (!fact.attempts) {
      return;
    }
    const bucketKey = getSubtractionTrackerBucketKey(fact.left, fact.right);
    if (!SUBTRACTION_TRACKER_BUCKET_KEYS.has(bucketKey) || !summary[bucketKey]) {
      return;
    }
    summary[bucketKey].attempts += fact.attempts;
    summary[bucketKey].correct += fact.correct;
  });

  return summary;
}

function buildDivisionTrackerStats() {
  const summary = Object.fromEntries(
    TABLE_FACTORS.map((factor) => [
      factor,
      {
        attempts: 0,
        correct: 0,
      },
    ]),
  );

  const divisionFacts = getFactEntriesByOperation("division");
  divisionFacts.forEach((fact) => {
    if (!fact.attempts) {
      return;
    }
    const divisor = clampNumber(Number(fact.right), 1, FACTOR_LIMIT, 1);
    if (!summary[divisor]) {
      return;
    }
    summary[divisor].attempts += fact.attempts;
    summary[divisor].correct += fact.correct;
  });

  return summary;
}

function startAdditionTrackerTraining(bucketKey, detailMode) {
  const bucketDifficultyMap = {
    "make-10": ["easy"],
    "1-1": ["easy"],
    "1-2": ["medium"],
    "2-2": ["medium"],
    "1-3": ["hard"],
    "2-3": ["hard"],
    "3-3": ["hard"],
  };
  const additionDifficulties = bucketDifficultyMap[bucketKey] || ["easy"];
  applySettingsSnapshot({
    ...getFormSettingsSnapshot(),
    operation: "addition",
    sessionType: "question-goal",
    questionPreset: "20",
    questionTarget: 20,
    timePreset: "3",
    timeLimitMinutes: 3,
    additionDifficulty: additionDifficulties[0],
    additionDifficulties,
    additionRegrouping: detailMode !== "without-regrouping",
    negativesMode: false,
  });
  toggleSetupFields();
  requestView("setup");
}

function inferSubtractionDifficulty(entry) {
  const leftDigits = String(Math.abs(Number(entry.left) || 0)).length;
  const rightDigits = String(Math.abs(Number(entry.right) || 0)).length;
  if (leftDigits <= 1 && rightDigits <= 1) {
    return "easy";
  }
  if (leftDigits <= 2 && rightDigits <= 2) {
    return "medium";
  }
  return "hard";
}

function startGenericTrackerTraining(operation, entry) {
  if (operation === "subtraction") {
    const subtractionDifficulty = inferSubtractionDifficulty(entry);
    applySettingsSnapshot({
      ...getFormSettingsSnapshot(),
      operation: "subtraction",
      sessionType: "question-goal",
      questionPreset: "20",
      questionTarget: 20,
      timePreset: "3",
      timeLimitMinutes: 3,
      subtractionDifficulty,
      subtractionDifficulties: [subtractionDifficulty],
      negativesMode: false,
    });
    toggleSetupFields();
    requestView("setup");
    return;
  }

  if (operation === "division") {
    const divisor = clampNumber(Number(entry.right), 1, FACTOR_LIMIT, 2);
    applySettingsSnapshot({
      ...getFormSettingsSnapshot(),
      operation: "division",
      sessionType: "isolation",
      questionPreset: "20",
      questionTarget: 20,
      timePreset: "3",
      timeLimitMinutes: 3,
      focusFactor: divisor,
      minFactor: 1,
      maxFactor: FACTOR_LIMIT,
      negativesMode: false,
    });
    toggleSetupFields();
    requestView("setup");
  }
}

function startSubtractionTrackerTraining(bucketKey) {
  const bucketDifficultyMap = {
    "1-1": ["easy"],
    "2-1": ["medium"],
    "2-2": ["medium"],
    "3-1": ["hard"],
    "3-2": ["hard"],
    "3-3": ["hard"],
  };
  const subtractionDifficulties = bucketDifficultyMap[bucketKey] || ["easy"];
  applySettingsSnapshot({
    ...getFormSettingsSnapshot(),
    operation: "subtraction",
    sessionType: "question-goal",
    questionPreset: "20",
    questionTarget: 20,
    timePreset: "3",
    timeLimitMinutes: 3,
    subtractionDifficulty: subtractionDifficulties[0],
    subtractionDifficulties,
    negativesMode: false,
  });
  toggleSetupFields();
  requestView("setup");
}

function startDivisionTrackerTraining(factor) {
  const safeFactor = clampNumber(Number(factor), 1, FACTOR_LIMIT, 1);
  applySettingsSnapshot({
    ...getFormSettingsSnapshot(),
    operation: "division",
    sessionType: "isolation",
    questionPreset: "20",
    questionTarget: 20,
    timePreset: "3",
    timeLimitMinutes: 3,
    focusFactor: safeFactor,
    minFactor: 1,
    maxFactor: FACTOR_LIMIT,
    negativesMode: false,
  });
  toggleSetupFields();
  requestView("setup");
}

function renderSubtractionTracker() {
  updateFactTrackerRangeControls(false);
  const statsByBucket = buildSubtractionTrackerStats();
  elements.tableGrid.classList.add("addition-table-grid");
  elements.tableGrid.innerHTML = SUBTRACTION_TRACKER_BUCKETS.map((bucketMeta) => {
    const bucket = statsByBucket[bucketMeta.key];
    const attempts = bucket?.attempts || 0;
    const correct = bucket?.correct || 0;
    const accuracy = attempts ? correct / attempts : 0;
    const status = getBucketStatus(attempts, accuracy);
    return `
      <article
        class="table-card ${status.tone}"
        data-train-subtraction-bucket="${bucketMeta.key}"
        role="button"
        tabindex="0"
      >
        <div class="table-card-top table-zone table-zone-head">
          <div class="table-name">${bucketMeta.label}</div>
          <span class="table-pill ${status.tone}">${status.label}</span>
        </div>
        <div class="fact-meta table-card-middle table-zone table-zone-summary">
          ${correct} / ${attempts} correct
        </div>
        <div class="bar-track table-zone table-zone-progress" aria-hidden="true">
          <div class="bar-fill ${status.tone}" style="width: ${Math.round(accuracy * 100)}%"></div>
        </div>
        <div class="table-card-stats table-zone table-zone-footer">
          <span>${formatPercent(accuracy)} accuracy</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderDivisionTracker() {
  updateFactTrackerRangeControls(true);
  elements.tableGrid.classList.add("multiplication-table-grid");
  const statsByFactor = buildDivisionTrackerStats();
  const activeRange = FACT_TRACKER_MULTIPLICATION_RANGES[clampFactTrackerRangeIndex(state.factTrackerRangeIndex)];
  const visibleFactors = TABLE_FACTORS.filter(
    (factor) => factor >= activeRange.minFactor && factor <= activeRange.maxFactor,
  );

  elements.tableGrid.innerHTML = visibleFactors.map((factor) => {
    const bucket = statsByFactor[factor] || { attempts: 0, correct: 0 };
    const attempts = bucket.attempts || 0;
    const correct = bucket.correct || 0;
    const accuracy = attempts ? correct / attempts : 0;
    const status = getBucketStatus(attempts, accuracy);
    return `
      <article
          class="table-card ${status.tone}"
          data-train-division-factor="${factor}"
          role="button"
          tabindex="0"
        >
          <div class="table-card-top table-zone table-zone-head">
          <div class="table-name">${getOperationDisplaySymbol("division")} ${factor}</div>
          <span class="table-pill ${status.tone}">${status.label}</span>
          </div>
        <div class="fact-meta table-card-middle table-zone table-zone-summary">
          ${correct} / ${attempts} correct
        </div>
        <div class="bar-track table-zone table-zone-progress" aria-hidden="true">
          <div class="bar-fill ${status.tone}" style="width: ${Math.round(accuracy * 100)}%"></div>
        </div>
        <div class="table-card-stats table-zone table-zone-footer">
          <span>${formatPercent(accuracy)} accuracy</span>
        </div>
      </article>
    `;
  }).join("");
}

function startMultiplicationTrackerTraining(factor, detailMode) {
  applySettingsSnapshot({
    ...getFormSettingsSnapshot(),
    operation: "multiplication",
    sessionType: "isolation",
    questionPreset: "20",
    questionTarget: 20,
    timePreset: "3",
    timeLimitMinutes: 3,
    focusFactor: factor,
    minFactor: 1,
    maxFactor: FACTOR_LIMIT,
    negativesMode: detailMode === "all-integers",
  });
  toggleSetupFields();
  requestView("setup");
}

function renderAdditionTracker(detailMode = "overall") {
  const activeMode =
    detailMode === "with-regrouping" || detailMode === "without-regrouping"
      ? detailMode
      : "overall";
  const statsByBucket = buildAdditionTrackerStats();
  elements.tableGrid.classList.add("addition-table-grid");

  elements.tableGrid.innerHTML = ADDITION_TRACKER_BUCKETS.map((bucketMeta) => {
    const bucket = statsByBucket[bucketMeta.key];
    const metric = getAdditionMetricSummary(bucket, activeMode);
    const ratio = metric.attempts ? metric.correct / metric.attempts : 0;
    const status = getBucketStatus(metric.attempts, ratio);
    const examples = getAdditionBucketExamples(bucketMeta.key, activeMode);
    const flipped = isAdditionTrackerBucketFlipped(bucketMeta.key, activeMode);
    const examplesMarkup = examples.length
      ? `
        <ul class="addition-example-list">
          ${examples
            .map(
              (entry) =>
                `<li class="addition-example-item">${formatAdditionExampleEquation(entry)}</li>`,
            )
            .join("")}
        </ul>
      `
      : `<div class="fact-meta addition-example-empty">No recent examples yet.</div>`;

    return `
      <article
        class="table-card addition-bucket-card ${status.tone} ${flipped ? "is-flipped" : ""}"
        data-addition-bucket="${bucketMeta.key}"
        data-addition-detail="${activeMode}"
        role="button"
        tabindex="0"
        aria-pressed="${flipped ? "true" : "false"}"
        aria-label="${flipped ? "Show summary" : "Show recent examples"} for ${bucketMeta.label}"
      >
        <div class="addition-bucket-face addition-bucket-front">
          <div class="addition-bucket-head">
            <div class="addition-bucket-title-row">
              <div class="table-name">${bucketMeta.label}</div>
              <button class="addition-card-toggle-button" type="button" data-addition-toggle="${bucketMeta.key}" data-addition-detail="${activeMode}" aria-label="More information">
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <circle cx="8" cy="3.6" r="1.8" fill="currentColor" />
                  <rect x="6.9" y="6.1" width="2.2" height="6.1" rx="1.1" fill="currentColor" />
                </svg>
              </button>
            </div>
            <span class="table-pill ${status.tone}">${status.label}</span>
          </div>
          <div class="bar-track" aria-hidden="true">
            <div class="bar-fill ${status.tone}" style="width: ${Math.round(ratio * 100)}%"></div>
          </div>
          <div class="table-card-stats">
            <span>${getRatioLabel(metric.correct, metric.attempts)}</span>
          </div>
        </div>
        <div class="addition-bucket-face addition-bucket-back">
          <div class="addition-bucket-head">
            <div class="addition-bucket-title-row">
              <div class="table-name">${bucketMeta.label}</div>
              <button class="addition-card-toggle-button" type="button" data-addition-toggle="${bucketMeta.key}" data-addition-detail="${activeMode}" aria-label="Return to summary">
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <circle cx="8" cy="3.6" r="1.8" fill="currentColor" />
                  <rect x="6.9" y="6.1" width="2.2" height="6.1" rx="1.1" fill="currentColor" />
                </svg>
              </button>
            </div>
            <span class="table-pill subtle-chip">Recent</span>
          </div>
          ${examplesMarkup}
        </div>
      </article>
    `;
  }).join("");
}

function handleAdditionTrackerCardClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }
  const toggleButton = target.closest("[data-addition-toggle]");
  if (toggleButton instanceof HTMLElement) {
    const bucketKey = toggleButton.dataset.additionToggle || "";
    const detailMode = toggleButton.dataset.additionDetail || "overall";
    if (!bucketKey) {
      return;
    }
    toggleAdditionTrackerBucketFlip(bucketKey, detailMode);
    renderAdditionTracker(getFactDetailFilterValue());
    return;
  }

  const card = target.closest("[data-addition-bucket]");
  if (card instanceof HTMLElement) {
    const bucketKey = card.dataset.additionBucket || "";
    const detailMode = card.dataset.additionDetail || "overall";
    if (!bucketKey) {
      return;
    }
    startAdditionTrackerTraining(bucketKey, detailMode);
    return;
  }

  const multiplicationCard = target.closest("[data-train-multiplication]");
  if (multiplicationCard instanceof HTMLElement) {
    const factor = clampNumber(Number(multiplicationCard.dataset.trainMultiplication), 1, FACTOR_LIMIT, 1);
    const detailMode = multiplicationCard.dataset.trainDetail || "overall";
    startMultiplicationTrackerTraining(factor, detailMode);
    return;
  }

  const subtractionBucketCard = target.closest("[data-train-subtraction-bucket]");
  if (subtractionBucketCard instanceof HTMLElement) {
    const bucketKey = subtractionBucketCard.dataset.trainSubtractionBucket || "";
    if (bucketKey) {
      startSubtractionTrackerTraining(bucketKey);
      return;
    }
  }

  const divisionCard = target.closest("[data-train-division-factor]");
  if (divisionCard instanceof HTMLElement) {
    const factor = clampNumber(Number(divisionCard.dataset.trainDivisionFactor), 1, FACTOR_LIMIT, 1);
    startDivisionTrackerTraining(factor);
    return;
  }

  const genericCard = target.closest("[data-train-operation]");
  if (!(genericCard instanceof HTMLElement)) {
    return;
  }
  const operation = genericCard.dataset.trainOperation || "";
  const entry = {
    left: Number(genericCard.dataset.trainLeft),
    right: Number(genericCard.dataset.trainRight),
    answer: Number(genericCard.dataset.trainAnswer),
  };
  if (operation === "subtraction" || operation === "division") {
    startGenericTrackerTraining(operation, entry);
  }
}

function handleAdditionTrackerCardKeydown(event) {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }
  if (target.closest("[data-addition-toggle]")) {
    return;
  }
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  event.preventDefault();
  const card =
    target.closest(
      "[data-addition-bucket], [data-train-subtraction-bucket], [data-train-multiplication], [data-train-division-factor], [data-train-operation]",
    );
  if (!(card instanceof HTMLElement)) {
    return;
  }
  card.click();
}

function getAdditionTechniqueCardStatus(lesson) {
  if (!lesson.selectable) {
    return {
      classes: "",
      pill: "Coming Soon",
      note: lesson.description || "Coming soon.",
    };
  }

  const progress = getTechniqueProgressRecord(`addition:${lesson.id}`);
  if (progress.completed) {
    return {
      classes: " is-completed",
      pill: "",
      note: "Review lesson.",
    };
  }

  return {
    classes: " is-active",
    pill: "",
    note: lesson.description,
  };
}

function getAdditionTechniqueGridMarkup() {
  return ADDITION_LESSONS.map((lesson) => {
    const status = getAdditionTechniqueCardStatus(lesson);

    return `
      <button
        class="technique-card${status.classes}"
        type="button"
        data-addition-technique="${lesson.id}"
        ${lesson.selectable ? "" : "disabled"}
      >
        ${status.pill ? `<span class="technique-card-pill">${status.pill}</span>` : ""}
        <strong>${escapeHtml(lesson.title)}</strong>
        <span class="technique-card-note">${escapeHtml(status.note)}</span>
      </button>
    `;
  }).join("");
}

function renderGenericOperationTracker(operation) {
  updateFactTrackerRangeControls(false);
  const entries = getFactEntriesByOperation(operation)
    .filter((entry) => entry.attempts > 0)
    .sort((left, right) => right.attempts - left.attempts || left.misses - right.misses)
    .slice(0, 12);

  if (!entries.length) {
    elements.tableGrid.innerHTML = `
      <div class="table-card unseen">
        <div class="table-name">Start a workout</div>
        <div class="fact-meta">The fact tracker fills in after you answer a few facts.</div>
      </div>
    `;
    return;
  }

  elements.tableGrid.innerHTML = entries
    .map((entry) => {
      const accuracy = getAccuracy(entry.correct, entry.attempts);
      const status = getBucketStatus(entry.attempts, accuracy);
      const symbol = getOperationDisplaySymbol(operation);
      return `
        <article
          class="table-card ${status.tone}"
          data-train-operation="${operation}"
          data-train-left="${entry.left}"
          data-train-right="${entry.right}"
          data-train-answer="${entry.answer}"
          role="button"
          tabindex="0"
        >
          <div class="table-card-top table-zone table-zone-head">
            <div class="table-name">${entry.left} ${symbol} ${entry.right}</div>
            <span class="table-pill ${status.tone}">${status.label}</span>
          </div>
          <div class="fact-meta table-card-middle table-zone table-zone-summary">
            ${entry.correct} / ${entry.attempts} correct
          </div>
          <div class="bar-track table-zone table-zone-progress" aria-hidden="true">
            <div class="bar-fill ${status.tone}" style="width: ${Math.round(accuracy * 100)}%"></div>
          </div>
          <div class="table-card-stats table-zone table-zone-footer">
            <span>${formatPercent(accuracy)} accuracy</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTableRadar() {
  const factOperation = getFactOperationFilterValue();
  const factDetail = getFactDetailFilterValue();
  updateFactSelectorCarouselState();
  elements.tableGrid.classList.remove("multiplication-table-grid");
  elements.tableGrid.classList.remove("addition-table-grid");
  if (elements.factsSlideTitle) {
    const operationCopy =
      factOperation === "addition"
        ? "addition"
        : factOperation === "multiplication"
          ? "multiplication"
          : factOperation === "subtraction"
            ? "subtraction"
            : factOperation === "division"
              ? "division"
              : "";
    elements.factsSlideTitle.textContent = operationCopy
      ? `Track your ${operationCopy} skills.`
      : "Track your skills.";
  }
  if (elements.trackerActionHint) {
    elements.trackerActionHint.textContent =
      factOperation === "addition"
        ? "Click a category to train it. Click the i for more information."
        : "Click a category to train it.";
  }

  if (factOperation === "addition") {
    updateFactTrackerRangeControls(false);
    renderAdditionTracker(factDetail);
    return;
  }

  if (factOperation === "subtraction" || factOperation === "division") {
    if (factOperation === "subtraction") {
      renderSubtractionTracker();
    } else {
      renderDivisionTracker();
    }
    return;
  }

  updateFactTrackerRangeControls(true);
  elements.tableGrid.classList.add("multiplication-table-grid");

  const tableStats = getTableStats(factDetail);
  if (!tableStats.some((table) => table.attempts > 0)) {
    const emptyDetailCopy =
      factDetail === "positive"
        ? "No positive-integer attempts yet."
        : factDetail === "all-integers"
          ? "No signed-integer attempts yet."
          : "The fact tracker fills in after you answer a few facts.";
    elements.tableGrid.innerHTML = `
      <div class="table-card unseen">
        <div class="table-name">Start a workout</div>
        <div class="fact-meta">${emptyDetailCopy}</div>
      </div>
    `;
    return;
  }

  const activeRange = FACT_TRACKER_MULTIPLICATION_RANGES[clampFactTrackerRangeIndex(state.factTrackerRangeIndex)];
  const visibleTables = tableStats.filter(
    (table) => table.factor >= activeRange.minFactor && table.factor <= activeRange.maxFactor,
  );

  elements.tableGrid.innerHTML = visibleTables
    .map((table) => {
      const accuracyLabel = table.attempts
        ? `${formatPercent(table.accuracy)} accuracy`
        : "No attempts yet";
      const detailLabel = table.attempts ? table.detailLabel : "Fresh range";

      return `
        <article
          class="table-card ${table.tone}"
          data-train-multiplication="${table.factor}"
          data-train-detail="${factDetail}"
          role="button"
          tabindex="0"
        >
          <div class="table-card-top table-zone table-zone-head">
            <div class="table-name">x ${table.factor}</div>
            <span class="table-pill ${table.tone}">${table.label}</span>
          </div>
          <div class="fact-meta table-card-middle table-zone table-zone-summary">${detailLabel}</div>
          <div class="bar-track table-zone table-zone-progress" aria-hidden="true">
            <div class="bar-fill ${table.tone}" style="width: ${Math.round(table.accuracy * 100)}%"></div>
          </div>
          <div class="table-card-stats table-zone table-zone-footer">
            <span>${accuracyLabel}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function getAvailableMonthKeys() {
  const monthKeys = new Set([getMonthKey(getCurrentMonthDate())]);

  Object.entries(state.progress.dailyRecords).forEach(([dateKey, record]) => {
    const normalised = normaliseDailyRecord(record);
    if (normalised.attempted || normalised.correct || normalised.sessionsCompleted) {
      monthKeys.add(getMonthKey(parseDateKey(dateKey)));
    }
  });

  return Array.from(monthKeys).sort();
}

function ensureDisplayMonthKey() {
  const availableMonthKeys = getAvailableMonthKeys();
  if (!availableMonthKeys.includes(state.displayMonthKey)) {
    state.displayMonthKey = availableMonthKeys[availableMonthKeys.length - 1];
  }
}

function getMonthNavigationState() {
  const availableMonthKeys = getAvailableMonthKeys();
  const currentMonthKey = getMonthKey(getCurrentMonthDate());
  const activeIndex = availableMonthKeys.indexOf(state.displayMonthKey);

  return {
    availableMonthKeys,
    activeIndex,
    canMovePrev: activeIndex > 0,
    canMoveNext:
      activeIndex > -1 &&
      activeIndex < availableMonthKeys.length - 1 &&
      state.displayMonthKey !== currentMonthKey,
  };
}

function buildCalendarMarkup(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1, 12);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlankDays = firstDay.getDay();
  const cells = [];
  const todayKey = getTodayDateKey();

  for (let index = 0; index < leadingBlankDays; index += 1) {
    cells.push('<div class="calendar-day empty"></div>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day, 12);
    const dateKey = formatDateKey(date);
    const record = getDailyRecord(dateKey);
    const classes = ["calendar-day"];

    if (dateKey === todayKey) {
      classes.push("today");
    }
    if (record.attempted || record.correct || record.sessionsCompleted) {
      classes.push("has-activity");
    }
    if (record.correct > 0) {
      classes.push("has-correct-reps");
    }

    cells.push(`
      <div class="${classes.join(" ")}">
        <div class="calendar-day-top">
          <span class="day-number">${day}</span>
        </div>
        <div class="calendar-day-body">
          <span class="day-reps" aria-label="${record.correct} correct reps">${record.correct || ""}</span>
        </div>
      </div>
    `);
  }

  while (cells.length % 7 !== 0) {
    cells.push('<div class="calendar-day empty"></div>');
  }

  return cells.join("");
}

function renderMonthNavigation() {
  ensureDisplayMonthKey();
  const currentMonthDate = createMonthDateFromKey(state.displayMonthKey);
  const navState = getMonthNavigationState();
  const monthLabel = currentMonthDate.toLocaleDateString(undefined, { month: "long" });
  const yearLabel = String(currentMonthDate.getFullYear());

  elements.currentMonthLabel.textContent = monthLabel;
  elements.resultsMonthLabel.textContent = monthLabel;
  if (elements.progressCalendarYearLabel) {
    elements.progressCalendarYearLabel.textContent = yearLabel;
  }
  if (elements.resultsCalendarYearLabel) {
    elements.resultsCalendarYearLabel.textContent = yearLabel;
  }

  [
    elements.progressMonthPrevButton,
    elements.resultsMonthPrevButton,
  ].forEach((button) => {
    button.disabled = !navState.canMovePrev;
  });

  [
    elements.progressMonthNextButton,
    elements.resultsMonthNextButton,
  ].forEach((button) => {
    button.disabled = !navState.canMoveNext;
  });
}

function renderCalendars() {
  ensureDisplayMonthKey();
  const displayMonthDate = createMonthDateFromKey(state.displayMonthKey);
  const calendarMarkup = buildCalendarMarkup(displayMonthDate);
  const homeMonthDate = getCurrentMonthDate();
  const homeCalendarMarkup = buildCalendarMarkup(homeMonthDate);

  renderMonthNavigation();
  elements.calendarGrid.innerHTML = calendarMarkup;
  elements.resultsCalendarGrid.innerHTML = calendarMarkup;
  if (elements.homeCalendarGrid) {
    elements.homeCalendarGrid.innerHTML = homeCalendarMarkup;
  }
  if (elements.homeCalendarMonthLabel) {
    elements.homeCalendarMonthLabel.textContent = formatMonthLabel(homeMonthDate);
  }
}

function buildHomeWeeklyStripMarkup() {
  const labels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedDays = new Set(
    Object.entries(state.progress.dailyRecords)
      .filter(([, record]) => normaliseDailyRecord(record).sessionsCompleted > 0)
      .map(([dateKey]) => dateKey),
  );

  function getStreakEndingAt(dateKey) {
    let streak = 0;
    let cursor = dateKey;
    while (completedDays.has(cursor)) {
      streak += 1;
      cursor = shiftDateKey(cursor, -1);
    }
    return streak;
  }

  return Array.from({ length: 7 }, (_, index) => {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() - (6 - index));
      const dateKey = formatDateKey(dayDate);
      const label = labels[dayDate.getDay()];
      const dailyRecord = normaliseDailyRecord(state.progress.dailyRecords[dateKey]);
      const completed = dailyRecord.sessionsCompleted > 0;
      const isPastDay = dayDate.getTime() < today.getTime();
      const stateClass = completed ? "is-completed" : isPastDay ? "is-missed" : "";
      const streakForDay = completed ? getStreakEndingAt(dateKey) : 0;
      const hypeTier = Math.min(Math.max(streakForDay, 1), 7);
      const hypeClass = completed ? `hype-${hypeTier}` : "";
      const marker = completed ? "&#128293;" : "";
      return `<span class="weekly-day-pill ${stateClass} ${hypeClass}" title="${label}" aria-label="${label}: ${completed ? "completed" : "not completed"}"><span class="weekly-day-flame" aria-hidden="true">${marker}</span><span class="weekly-day-label">${label}</span></span>`;
    })
    .join("");
}

function renderHomeWeeklyStrip() {
  if (!elements.homeWeeklyStrip) {
    return;
  }
  elements.homeWeeklyStrip.innerHTML = buildHomeWeeklyStripMarkup();
}

function showHomeStreakBanner(streakDays) {
  if (!elements.streakBanner || !elements.streakBannerTitle || streakDays < 1) {
    return;
  }
  elements.streakBannerTitle.textContent = `\u{1F525} ${streakDays} Day Streak!`;
  elements.streakBanner.classList.add("is-visible");
  window.clearTimeout(state.streakBannerTimeoutId);
  state.streakBannerTimeoutId = window.setTimeout(() => {
    elements.streakBanner.classList.remove("is-visible");
  }, 5500);
}

function getDisplayedMonthSummary() {
  ensureDisplayMonthKey();
  const displayMonthDate = createMonthDateFromKey(state.displayMonthKey);
  const monthKey = getMonthKey(displayMonthDate);

  return Object.entries(state.progress.dailyRecords).reduce(
    (summary, [dateKey, record]) => {
      if (getMonthKey(parseDateKey(dateKey)) !== monthKey) {
        return summary;
      }

      const normalised = normaliseDailyRecord(record);
      summary.sessions += normalised.sessionsCompleted || 0;
      summary.reps += normalised.attempted || 0;
      summary.correct += normalised.correct || 0;
      return summary;
    },
    {
      sessions: 0,
      reps: 0,
      correct: 0,
    },
  );
}

function shiftDisplayedMonth(direction) {
  const navState = getMonthNavigationState();
  if (
    (direction < 0 && !navState.canMovePrev) ||
    (direction > 0 && !navState.canMoveNext)
  ) {
    return;
  }

  state.displayMonthKey = navState.availableMonthKeys[navState.activeIndex + direction];
  renderCalendars();
}

function renderStreakPanel() {
  const streakSummary = getPracticeStreakSummary();
  const monthSummary = getDisplayedMonthSummary();
  const currentMonthKey = getMonthKey(getCurrentMonthDate());
  const homeMonthSummary = Object.entries(state.progress.dailyRecords).reduce(
    (summary, [dateKey, record]) => {
      if (getMonthKey(parseDateKey(dateKey)) !== currentMonthKey) {
        return summary;
      }

      const normalised = normaliseDailyRecord(record);
      summary.sessions += normalised.sessionsCompleted || 0;
      summary.reps += normalised.attempted || 0;
      summary.correct += normalised.correct || 0;
      return summary;
    },
    { sessions: 0, reps: 0, correct: 0 },
  );
  const monthAccuracy =
    monthSummary.reps > 0 ? `${Math.round((monthSummary.correct / monthSummary.reps) * 100)}%` : "0%";

  elements.currentPracticeStreak.textContent = `${streakSummary.current}`;
  elements.bestPracticeDayStreak.textContent = `${streakSummary.best}`;
  elements.resultsCurrentPracticeStreak.textContent = `${streakSummary.current}`;
  elements.resultsBestPracticeDayStreak.textContent = `${streakSummary.best}`;
  elements.progressMonthSessions.textContent = `${monthSummary.sessions}`;
  elements.progressMonthReps.textContent = `${monthSummary.reps}`;
  elements.progressMonthAccuracy.textContent = monthAccuracy;
  elements.resultsMonthSessions.textContent = `${monthSummary.sessions}`;
  elements.resultsMonthReps.textContent = `${monthSummary.reps}`;
  elements.resultsMonthAccuracy.textContent = monthAccuracy;
  if (elements.homeCurrentPracticeStreak) {
    elements.homeCurrentPracticeStreak.textContent = `${streakSummary.current}`;
  }
  renderHomeWeeklyStrip();
  if (elements.homeDailyStats) {
    const todayRecord = getDailyRecord();
    const attempts = todayRecord.attempted || 0;
    const correct = todayRecord.correct || 0;
    const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
    elements.homeDailyStats.innerHTML =
      `<span class="home-stat-cell"><span class="home-stat-icon">&#10084;&#65039;</span><span class="home-stat-value">${attempts}</span></span>` +
      `<span class="home-stat-cell"><span class="home-stat-icon">&#11088;</span><span class="home-stat-value">${correct}</span></span>` +
      `<span class="home-stat-cell"><span class="home-stat-icon">&#127919;</span><span class="home-stat-value">${accuracy}%</span></span>`;
  }
  if (elements.homeMonthSessions) {
    elements.homeMonthSessions.textContent = `${homeMonthSummary.sessions}`;
  }
  if (elements.homeMonthReps) {
    elements.homeMonthReps.textContent = `${homeMonthSummary.reps}`;
  }
  if (elements.homeMonthAccuracy) {
    elements.homeMonthAccuracy.textContent =
      homeMonthSummary.reps > 0 ? `${Math.round((homeMonthSummary.correct / homeMonthSummary.reps) * 100)}%` : "0%";
  }
  if (elements.homeSnapshotReps) {
    elements.homeSnapshotReps.textContent = `${state.progress.totalAttempted || 0}`;
  }
  if (elements.homeSnapshotRank) {
    const totalAttempted = state.progress.totalAttempted || 0;
    const totalCorrect = state.progress.totalCorrect || 0;
    elements.homeSnapshotRank.textContent = totalAttempted > 0
      ? `${Math.round((totalCorrect / totalAttempted) * 100)}%`
      : "0%";
  }
  if (elements.homeSnapshotFocus) {
    const responseTimes = normaliseAnswerTelemetry(state.progress.answerTelemetry)
      .filter((entry) => entry.correct && entry.responseTimeMs !== null)
      .slice(0, 50)
      .map((entry) => entry.responseTimeMs);
    const averageMs = average(responseTimes);
    elements.homeSnapshotFocus.textContent = averageMs === null ? "--" : `${(averageMs / 1000).toFixed(1)}s`;
  }
  const todayKey = getTodayDateKey();
  OPERATION_OPTIONS.forEach((operation) => {
    const correctToday = normaliseAnswerTelemetry(state.progress.answerTelemetry)
      .filter((entry) => entry.dateKey === todayKey && entry.operation === operation && entry.correct)
      .length;
    const cappedCorrect = Math.min(correctToday, 5);
    const titleCaseOperation = operation.charAt(0).toUpperCase() + operation.slice(1);
    const statusElement = elements[`homeRoutine${titleCaseOperation}Status`];
    const checkElement = elements[`homeRoutine${titleCaseOperation}Check`];
    if (statusElement) {
      statusElement.textContent = `${cappedCorrect} / 5 correct`;
    }
    if (checkElement) {
      const complete = correctToday >= 5;
      checkElement.textContent = complete ? "\u2713" : "";
      checkElement.classList.toggle("is-complete", complete);
    }
  });
  const hasHomeData =
    streakSummary.current > 0 ||
    homeMonthSummary.sessions > 0 ||
    homeMonthSummary.reps > 0;
  if (elements.homeCalendarSummary) {
    elements.homeCalendarSummary.classList.toggle("is-hidden", !hasHomeData);
  }
  if (elements.homeCalendarEmptyState) {
    elements.homeCalendarEmptyState.classList.toggle("is-hidden", hasHomeData);
  }
}

function buildCarouselIndicatorMarkup(currentIndex, total) {
  const dots = Array.from({ length: total }, (_, index) => {
    const active = index === currentIndex;
    return `<span class="carousel-position-dot ${active ? "is-active" : ""}" aria-hidden="true"></span>`;
  }).join("");
  return `
    <span class="carousel-position-dots" aria-hidden="true">${dots}</span>
  `;
}

function buildSimpleDotMarkup(currentIndex, total) {
  return Array.from({ length: total }, (_, index) => {
    const active = index === currentIndex;
    return `<span class="carousel-position-dot ${active ? "is-active" : ""}" aria-hidden="true"></span>`;
  }).join("");
}

function isTabletCoarsePointer() {
  return (
    window.matchMedia("(pointer: coarse)").matches &&
    window.matchMedia("(min-width: 768px)").matches
  );
}

function renderAppPageIndicator() {
  return;
}

function renderResultsCarousel() {
  elements.resultsSlides.forEach((slide) => {
    const isActiveSlide =
      slide.dataset.resultsSlide === RESULTS_SLIDES[state.resultsSlideIndex];
    slide.classList.toggle("is-active", isActiveSlide);
    slide.setAttribute("aria-hidden", isActiveSlide ? "false" : "true");
  });

  if (elements.resultsPrevButton) {
    elements.resultsPrevButton.hidden = false;
    elements.resultsPrevButton.disabled = RESULTS_SLIDES.length < 2;
  }
  if (elements.resultsNextButton) {
    elements.resultsNextButton.hidden = false;
    elements.resultsNextButton.disabled = RESULTS_SLIDES.length < 2;
  }
  if (elements.resultsCarouselIndicator) {
    elements.resultsCarouselIndicator.innerHTML = buildCarouselIndicatorMarkup(
      state.resultsSlideIndex,
      RESULTS_SLIDES.length,
    );
  }
  if (elements.resultsCarouselKickerLabel) {
    const activeSlide = elements.resultsSlides.find((slide) => slide.classList.contains("is-active"));
    const activeKicker = activeSlide?.dataset.carouselKicker?.trim();
    elements.resultsCarouselKickerLabel.textContent = activeKicker || "Results";
  }
}

function shiftResultsCarousel(direction) {
  const totalSlides = RESULTS_SLIDES.length;
  if (totalSlides < 1) {
    return;
  }
  state.resultsSlideIndex = (state.resultsSlideIndex + direction + totalSlides) % totalSlides;
  renderResultsCarousel();
}

function renderProgressCarousel() {
  elements.progressSlides.forEach((slide) => {
    const isActiveSlide =
      slide.dataset.progressSlide === PROGRESS_SLIDES[state.progressSlideIndex];
    slide.classList.toggle("is-active", isActiveSlide);
    slide.setAttribute("aria-hidden", isActiveSlide ? "false" : "true");
  });

  if (elements.progressPrevButton) {
    elements.progressPrevButton.hidden = false;
    elements.progressPrevButton.disabled = PROGRESS_SLIDES.length < 2;
  }
  if (elements.progressNextButton) {
    elements.progressNextButton.hidden = false;
    elements.progressNextButton.disabled = PROGRESS_SLIDES.length < 2;
  }
  if (elements.progressCarouselIndicator) {
    elements.progressCarouselIndicator.innerHTML = buildCarouselIndicatorMarkup(
      state.progressSlideIndex,
      PROGRESS_SLIDES.length,
    );
  }
  if (elements.progressCarouselKickerLabel) {
    const activeSlide = elements.progressSlides.find((slide) => slide.classList.contains("is-active"));
    const activeKicker = activeSlide?.dataset.carouselKicker?.trim();
    elements.progressCarouselKickerLabel.textContent = activeKicker || "My Progress";
  }
}

function shiftProgressCarousel(direction) {
  const totalSlides = PROGRESS_SLIDES.length;
  if (totalSlides < 1) {
    return;
  }
  state.progressSlideIndex = (state.progressSlideIndex + direction + totalSlides) % totalSlides;
  renderProgressCarousel();
}

function bindCarouselSwipe(container, onSwipeNext, onSwipePrev) {
  if (!(container instanceof HTMLElement)) {
    return;
  }

  const swipeState = {
    startX: 0,
    startY: 0,
    tracking: false,
  };

  container.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        swipeState.tracking = false;
        return;
      }
      swipeState.tracking = true;
      swipeState.startX = event.touches[0].clientX;
      swipeState.startY = event.touches[0].clientY;
    },
    { passive: true },
  );

  container.addEventListener(
    "touchend",
    (event) => {
      if (!swipeState.tracking || event.changedTouches.length !== 1) {
        swipeState.tracking = false;
        return;
      }

      const endX = event.changedTouches[0].clientX;
      const endY = event.changedTouches[0].clientY;
      const deltaX = endX - swipeState.startX;
      const deltaY = endY - swipeState.startY;
      swipeState.tracking = false;

      if (Math.abs(deltaX) < 56 || Math.abs(deltaY) > 76) {
        return;
      }

      if (deltaX < 0) {
        onSwipeNext();
        return;
      }

      onSwipePrev();
    },
    { passive: true },
  );
}

function initialiseCarouselGestures() {
  bindCarouselSwipe(elements.resultsCarousel, () => shiftResultsCarousel(1), () => shiftResultsCarousel(-1));
  bindCarouselSwipe(elements.progressCarousel, () => shiftProgressCarousel(1), () => shiftProgressCarousel(-1));

  if (!(elements.appShell instanceof HTMLElement)) {
    return;
  }

  const topViews = ["home", "setup", "techniques", "progress"];
  const swipeState = {
    startX: 0,
    startY: 0,
    tracking: false,
  };

  elements.appShell.addEventListener(
    "touchstart",
    (event) => {
      if (!isTabletCoarsePointer() || state.active || event.touches.length !== 1) {
        swipeState.tracking = false;
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("button, input, select, textarea, [role='button'], .results-carousel, .progress-carousel")
      ) {
        swipeState.tracking = false;
        return;
      }
      swipeState.tracking = true;
      swipeState.startX = event.touches[0].clientX;
      swipeState.startY = event.touches[0].clientY;
    },
    { passive: true },
  );

  elements.appShell.addEventListener(
    "touchend",
    (event) => {
      if (!swipeState.tracking || event.changedTouches.length !== 1) {
        swipeState.tracking = false;
        return;
      }
      const deltaX = event.changedTouches[0].clientX - swipeState.startX;
      const deltaY = event.changedTouches[0].clientY - swipeState.startY;
      swipeState.tracking = false;
      if (Math.abs(deltaX) < 64 || Math.abs(deltaY) > 72) {
        return;
      }

      const currentIndex = topViews.indexOf(state.view);
      if (currentIndex < 0) {
        return;
      }
      const nextIndex =
        deltaX < 0
          ? Math.min(topViews.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);
      if (nextIndex === currentIndex) {
        return;
      }
      requestView(topViews[nextIndex]);
    },
    { passive: true },
  );
}

function registerBackdropClose(dialog) {
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const isInside =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;

    if (!isInside) {
      dialog.close();
    }
  });
}

function handleSettingsChange(event) {
  const changedField =
    event?.target?.id === "minFactor" ? "min" : event?.target?.id === "maxFactor" ? "max" : "";
  if (changedField) {
    syncIsolationRangeControls(changedField);
  }
  toggleSetupFields();
}

function handleOverviewOperationFilterChange() {
  renderOverall();
  syncOverviewSelectorLabel();
}

function handleFocusOperationFilterChange() {
  renderProgressFocusAreas();
  syncFocusSelectorLabel();
}

function handleCoachOperationFilterChange() {
  renderCoachTip();
  syncCoachSelectorLabel();
}

function handleFactOperationFilterChange() {
  resetFactTrackerRange();
  syncFactDetailFilterOptions();
  renderTableRadar();
  updateFactSelectorCarouselState();
}

function handleFactDetailFilterChange() {
  resetFactTrackerRange();
  renderTableRadar();
  updateFactSelectorCarouselState();
}

function handleRecordsFilterChange() {
  syncRecordsModeOptions();
  renderWorkoutHistory();
  syncRecordsSelectorLabels();
}

function handleThemeChange(event) {
  const select = event.target;
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }
  const theme = sanitiseTheme(select.value);
  applyTheme(theme);
  saveTheme(theme);
}

function handleColorModeChange(event) {
  const select = event.target;
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }
  const mode = sanitiseColorMode(select.value);
  applyColorMode(mode);
  saveColorMode(mode);
}

function handleKeypadPreferenceChange(event) {
  const select = event.target;
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }
  const preference = sanitiseKeypadPreference(select.value);
  state.keypadPreference = preference;
  if (elements.keypadPreferenceSelect && elements.keypadPreferenceSelect !== select) {
    elements.keypadPreferenceSelect.value = preference;
  }
  if (elements.keypadPreferenceOptionsSelect && elements.keypadPreferenceOptionsSelect !== select) {
    elements.keypadPreferenceOptionsSelect.value = preference;
  }
  saveKeypadPreference(preference);
  updatePracticeInputMode();
}

function resetProgress() {
  const shouldReset = window.confirm("Reset all saved trainer progress on this browser?");
  if (!shouldReset) {
    return;
  }

  state.progress = defaultProgress();
  state.displayMonthKey = getMonthKey(getCurrentMonthDate());
  saveProgress();
  renderDailyProgress();
  renderOverall();
  renderMasterySystem();
  renderFocusAreas();
  renderWorkoutHistory();
  renderCoachTip();
  renderTableRadar();
  renderCalendars();
  renderStreakPanel();
  renderProgressCarousel();
  window.alert("Saved progress cleared.");
}
