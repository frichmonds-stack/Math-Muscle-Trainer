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
