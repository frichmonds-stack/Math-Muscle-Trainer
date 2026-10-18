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
    const dailyReps = Number(record.attempted || 0);
    const goalRatio = dailyReps / DAILY_REP_GOAL;

    if (dateKey === todayKey) {
      classes.push("today");
    }
    if (record.attempted || record.correct || record.sessionsCompleted) {
      classes.push("has-activity");
    }
    if (goalRatio >= 1.5) {
      classes.push("goal-extra");
    } else if (goalRatio >= 1) {
      classes.push("goal-met");
    } else if (goalRatio >= 0.5) {
      classes.push("goal-half");
    } else if (goalRatio > 0) {
      classes.push("goal-started");
    }

    cells.push(`
      <div class="${classes.join(" ")}" aria-label="${day}: ${Math.round(goalRatio * 100)}% of daily goal">
        <div class="calendar-day-top">
          <span class="day-number">${day}</span>
        </div>
        <div class="calendar-day-body" aria-hidden="true"></div>
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

  renderMonthNavigation();
  elements.calendarGrid.innerHTML = calendarMarkup;
  elements.resultsCalendarGrid.innerHTML = calendarMarkup;
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

function getLastSevenDailyRecords() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, index) => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - (6 - index));
    const dateKey = formatDateKey(dayDate);
    return {
      dateKey,
      label: dayDate.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2),
      record: normaliseDailyRecord(state.progress.dailyRecords[dateKey]),
    };
  });
}

function getLastSevenSummary() {
  return getLastSevenDailyRecords().reduce(
    (summary, day) => {
      summary.attempted += day.record.attempted || 0;
      summary.correct += day.record.correct || 0;
      if (day.record.sessionsCompleted > 0) {
        summary.workoutDays += 1;
      }
      return summary;
    },
    { attempted: 0, correct: 0, workoutDays: 0 },
  );
}

function buildHomeRepsGraphMarkup() {
  const dailyGoal = DAILY_REP_GOAL;
  const goalHeight = 66;
  const days = getLastSevenDailyRecords();
  const values = days.map((day) => day.record.attempted || 0);
  const bars = values.map((value, index) => {
    const label = days[index].label;
    const goalRatio = dailyGoal > 0 ? value / dailyGoal : 0;
    const height = value > 0 ? Math.max(5, Math.min(100, Math.round(goalRatio * goalHeight))) : 3;
    return `<span class="home-reps-day" style="--rep-height: ${height}%"><strong>${value}</strong><span>${label}</span></span>`;
  }).join("");

  return `
    <span class="home-reps-days" style="--rep-goal-height: ${goalHeight}%" aria-hidden="true">
      <span class="home-reps-goal-line"></span>
      ${bars}
    </span>
  `;
}

function renderHomeRepsGraph() {
  if (!elements.homeRepsGraph) {
    return;
  }
  elements.homeRepsGraph.innerHTML = buildHomeRepsGraphMarkup();
}

function renderHomeAccuracyVisual(accuracy) {
  if (!elements.homeAccuracyVisual) {
    return;
  }
  const clampedAccuracy = clampNumber(Number(accuracy), 0, 100, 0);
  elements.homeAccuracyVisual.style.setProperty("--accuracy-score", `${clampedAccuracy}%`);
  elements.homeAccuracyVisual.dataset.tier =
    clampedAccuracy >= 95 ? "peak" : clampedAccuracy >= 80 ? "strong" : clampedAccuracy >= 55 ? "steady" : "low";
  elements.homeAccuracyVisual.innerHTML = getLastSevenDailyRecords()
    .map((day) => {
      const attempted = day.record.attempted || 0;
      const correct = day.record.correct || 0;
      const dayAccuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      const fill = attempted > 0 ? Math.max(10, dayAccuracy) : 0;
      const stateClass = attempted > 0 ? "has-data" : "is-empty";
      return `
        <span class="home-accuracy-day ${stateClass}" style="--accuracy-day-score: ${fill}%" title="${day.label}: ${dayAccuracy}%">
          <i aria-hidden="true"></i>
          <small>${day.label}</small>
        </span>
      `;
    })
    .join("");
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

function getDisplayedMonthOperationReps() {
  ensureDisplayMonthKey();
  const displayMonthDate = createMonthDateFromKey(state.displayMonthKey);
  const monthKey = getMonthKey(displayMonthDate);
  const totals = Object.fromEntries(OPERATION_OPTIONS.map((operation) => [operation, 0]));

  state.progress.workoutHistory.forEach((record) => {
    if (getMonthKey(parseDateKey(record.dateKey || getTodayDateKey())) !== monthKey) {
      return;
    }
    const operation = OPERATION_OPTIONS.includes(record.operation)
      ? record.operation
      : "multiplication";
    totals[operation] += Number(record.attempted || 0);
  });

  return totals;
}

function buildOperationRepsBreakdownMarkup(totals) {
  const labels = OPERATION_OPTIONS.map((operation) =>
    `<span><i class="${operation}"></i><strong>${getOperationLabel(operation)}</strong><em>${totals[operation] || 0}</em></span>`,
  ).join("");

  return `
    <span class="operation-reps-labels">${labels}</span>
  `;
}

function renderOperationRepsBreakdowns() {
  const totals = getDisplayedMonthOperationReps();
  const markup = buildOperationRepsBreakdownMarkup(totals);
  [elements.progressOperationRepsBreakdown, elements.resultsOperationRepsBreakdown]
    .filter(Boolean)
    .forEach((element) => {
      element.innerHTML = markup;
    });
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
  renderOperationRepsBreakdowns();
  renderHomeWeeklyStrip();
  renderHomeRepsGraph();
  const weeklySummary = getLastSevenSummary();
  if (elements.homeSnapshotReps) {
    elements.homeSnapshotReps.textContent = `${weeklySummary.attempted}`;
  }
  if (elements.homeCurrentPracticeStreak) {
    elements.homeCurrentPracticeStreak.textContent =
      `${streakSummary.current} ${streakSummary.current === 1 ? "day" : "days"}`;
  }
  if (elements.homeSnapshotRank) {
    const totalAccuracy = weeklySummary.attempted > 0
      ? Math.round((weeklySummary.correct / weeklySummary.attempted) * 100)
      : 0;
    elements.homeSnapshotRank.textContent = `${totalAccuracy}%`;
    renderHomeAccuracyVisual(totalAccuracy);
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
      statusElement.textContent = correctToday >= 5 ? "Complete" : `${cappedCorrect} / 5 correct`;
    }
    if (checkElement) {
      const complete = correctToday >= 5;
      checkElement.textContent = complete ? "\u2713" : "";
      checkElement.classList.toggle("is-complete", complete);
      checkElement.closest(".training-plan-step")?.classList.toggle("is-complete", complete);
    }
  });
}
