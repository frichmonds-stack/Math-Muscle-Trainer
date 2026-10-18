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
    const parsed = parseBucketDailyStorageKey(storageKey);
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

    if (operation === "addition") {
      ADDITION_TRACKER_BUCKETS.forEach((bucket) => {
        items.push(buildBucketTrendItem("addition", bucket.key));
      });
    }
    // Subtraction and division do not record bucketDaily rows, so they have no trend items.
  });

  return items;
}

function isBucketTrendDeltaAtLeast(delta, threshold) {
  // Small tolerance so a nominal 8-point change (e.g. 100% vs 92%) is not lost to float error.
  return delta >= threshold - 1e-9;
}

function getPositiveProgressItems(limit = 3, filterValue = "all") {
  return getBucketTrendItems(filterValue)
    .filter(
      (item) =>
        item.totalAttempted >= BUCKET_TREND_MIN_TOTAL_ATTEMPTS &&
        item.lastAttempted >= BUCKET_TREND_MIN_RECENT_ATTEMPTS &&
        isBucketTrendDeltaAtLeast(item.delta, BUCKET_TREND_DELTA_THRESHOLD),
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
        (isBucketTrendDeltaAtLeast(-item.delta, BUCKET_TREND_DELTA_THRESHOLD) ||
          item.lastAccuracy < 0.7),
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
