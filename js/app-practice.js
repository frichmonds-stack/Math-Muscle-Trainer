function evaluateFactAnswer(operation, left, right) {
  if (operation === "addition") {
    return left + right;
  }
  if (operation === "subtraction") {
    return left - right;
  }
  if (operation === "division") {
    return right === 0 ? 0 : left / right;
  }
  return left * right;
}

function createFact(operation, left, right) {
  const commutative = operation === "addition" || operation === "multiplication";
  const ordered = commutative
    ? [left, right].sort((first, second) => first - second)
    : [left, right];
  const storageSymbol = operation === "division" ? "/" : OPERATION_SYMBOLS[operation] || "x";
  const displaySymbol = operation === "division" ? "÷" : OPERATION_SYMBOLS[operation] || "x";
  return {
    operation,
    symbol: displaySymbol,
    a: ordered[0],
    b: ordered[1],
    key: `${operation}:${ordered[0]}${storageSymbol}${ordered[1]}`,
    answer: evaluateFactAnswer(operation, left, right),
  };
}

function addFactVariant(map, operation, left, right) {
  const fact = createFact(operation, left, right);
  if (!map.has(fact.key)) {
    map.set(fact.key, fact);
  }
}

function getRotatingMessage(storageKey, messages) {
  try {
    const previousMessage = window.sessionStorage.getItem(storageKey);
    const choices = messages.filter((message) => message !== previousMessage);
    const pool = choices.length ? choices : messages;
    const message = pool[Math.floor(Math.random() * pool.length)];
    window.sessionStorage.setItem(storageKey, message);
    return message;
  } catch (error) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

function addSignedVariants(map, leftMagnitude, rightMagnitude, includeNegatives) {
  if (!includeNegatives) {
    addFactVariant(map, "multiplication", leftMagnitude, rightMagnitude);
    return;
  }

  [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ].forEach(([leftSign, rightSign]) => {
    addFactVariant(
      map,
      "multiplication",
      leftMagnitude * leftSign,
      rightMagnitude * rightSign,
    );
  });
}

function buildMultiplicationPool(settings) {
  const map = new Map();

  if (settings.sessionType === "isolation") {
    for (let factor = settings.minFactor; factor <= settings.maxFactor; factor += 1) {
      addSignedVariants(map, settings.focusFactor, factor, settings.negativesMode);
    }

    return Array.from(map.values());
  }

  for (let left = settings.minFactor; left <= settings.maxFactor; left += 1) {
    for (let right = left; right <= settings.maxFactor; right += 1) {
      addSignedVariants(map, left, right, settings.negativesMode);
    }
  }

  return Array.from(map.values());
}

function getRandomNumberByDigits(digits) {
  if (digits <= 1) {
    return Math.floor(Math.random() * 10);
  }

  if (digits === 2) {
    return 10 + Math.floor(Math.random() * 90);
  }

  return 100 + Math.floor(Math.random() * 900);
}

function buildAdditionPool(settings) {
  const selectedDifficulties = Array.isArray(settings.additionDifficulties)
    ? settings.additionDifficulties.filter((value) => ["easy", "medium", "hard"].includes(value))
    : [];
  const fallbackDifficulty =
    settings.additionDifficulty === "easy" ||
    settings.additionDifficulty === "medium" ||
    settings.additionDifficulty === "hard"
      ? settings.additionDifficulty
      : "easy";
  const difficulties = selectedDifficulties.length ? selectedDifficulties : [fallbackDifficulty];
  const buckets = difficulties.flatMap((difficulty) => ADDITION_DIGIT_BUCKETS[difficulty] || []);
  const allowRegrouping = settings.additionRegrouping !== false;
  const targetTotal = 120;
  const perBucketTarget = Math.max(24, Math.floor(targetTotal / buckets.length));
  const map = new Map();

  buckets.forEach(([leftDigits, rightDigits]) => {
    let created = 0;
    let attempts = 0;
    const maxAttempts = perBucketTarget * 40;

    while (created < perBucketTarget && attempts < maxAttempts) {
      attempts += 1;
      const beforeSize = map.size;
      const left = getRandomNumberByDigits(leftDigits);
      const right = getRandomNumberByDigits(rightDigits);
      if (!allowRegrouping && hasAdditionRegroupingCore(left, right)) {
        continue;
      }
      addFactVariant(map, "addition", left, right);
      if (map.size > beforeSize) {
        created += 1;
      }
    }
  });

  if (!map.size) {
    addFactVariant(map, "addition", 1, 1);
    addFactVariant(map, "addition", 2, 3);
    addFactVariant(map, "addition", 10, 5);
  }

  return Array.from(map.values());
}

function buildSubtractionPool(settings) {
  const selectedDifficulties = Array.isArray(settings.subtractionDifficulties)
    ? settings.subtractionDifficulties.filter((value) => ["easy", "medium", "hard"].includes(value))
    : [];
  const fallbackDifficulty =
    settings.subtractionDifficulty === "easy" ||
    settings.subtractionDifficulty === "medium" ||
    settings.subtractionDifficulty === "hard"
      ? settings.subtractionDifficulty
      : "easy";
  const difficulties = selectedDifficulties.length ? selectedDifficulties : [fallbackDifficulty];
  const buckets = difficulties.flatMap((difficulty) => SUBTRACTION_DIGIT_BUCKETS[difficulty] || []);
  const targetTotal = 120;
  const perBucketTarget = Math.max(24, Math.floor(targetTotal / Math.max(1, buckets.length)));
  const map = new Map();

  buckets.forEach(([leftDigits, rightDigits]) => {
    let created = 0;
    let attempts = 0;
    const maxAttempts = perBucketTarget * 40;

    while (created < perBucketTarget && attempts < maxAttempts) {
      attempts += 1;
      const beforeSize = map.size;
      let left = getRandomNumberByDigits(leftDigits);
      let right = getRandomNumberByDigits(rightDigits);
      if (left < right) {
        const swap = left;
        left = right;
        right = swap;
      }
      addFactVariant(map, "subtraction", left, right);
      if (map.size > beforeSize) {
        created += 1;
      }
    }
  });

  if (!map.size) {
    addFactVariant(map, "subtraction", 5, 2);
  }
  return Array.from(map.values());
}

function buildDivisionPool(settings) {
  const map = new Map();
  for (let divisor = settings.minFactor; divisor <= settings.maxFactor; divisor += 1) {
    for (let quotient = settings.minFactor; quotient <= settings.maxFactor; quotient += 1) {
      const dividend = divisor * quotient;
      addFactVariant(map, "division", dividend, divisor);
    }
  }

  if (!map.size) {
    addFactVariant(map, "division", 12, 3);
  }
  return Array.from(map.values());
}

function buildPool(settings) {
  return OPERATION_CONFIG[settings.operation]?.buildPool(settings) || [];
}

function randomiseDisplay(fact) {
  if (fact.operation === "subtraction" || fact.operation === "division") {
    return {
      ...fact,
      left: fact.a,
      right: fact.b,
    };
  }

  const swap = Math.random() > 0.5;

  return {
    ...fact,
    left: swap ? fact.b : fact.a,
    right: swap ? fact.a : fact.b,
  };
}

function inferOperationFromFactKey(key) {
  if (typeof key !== "string") {
    return "multiplication";
  }

  if (key.startsWith("addition:")) {
    return "addition";
  }
  if (key.startsWith("subtraction:")) {
    return "subtraction";
  }
  if (key.startsWith("division:")) {
    return "division";
  }

  return "multiplication";
}

function inferSymbolFromFactKey(key) {
  const operation = inferOperationFromFactKey(key);
  if (operation === "division") {
    return "÷";
  }
  return OPERATION_SYMBOLS[operation] || "x";
}

function getFactProgress(key) {
  return {
    operation: inferOperationFromFactKey(key),
    symbol: inferSymbolFromFactKey(key),
    attempts: 0,
    correct: 0,
    magnitudeCorrect: 0,
    signCorrect: 0,
    signErrors: 0,
    misses: 0,
    bestStreak: 0,
    currentStreak: 0,
    averageMs: null,
    firstSeenAt: 0,
    lastSeenAt: 0,
    ...(state.progress.facts[key] || {}),
  };
}

function pickQuestion() {
  const pool = state.questionPool.length ? state.questionPool : buildPool(state.settings);
  if (!pool.length) {
    return null;
  }

  const weightedPool = pool.map((fact) => {
    const factProgress = getFactProgress(fact.key);
    let weight = 1;

    if (state.settings.adaptiveMode) {
      const accuracy =
        factProgress.attempts > 0 ? factProgress.correct / factProgress.attempts : 0;
      weight += factProgress.misses * 3;
      weight += factProgress.attempts === 0 ? 3 : 0;
      weight += Math.round((1 - accuracy) * 5);
      if (factProgress.currentStreak === 0 && factProgress.attempts > 0) {
        weight += 2;
      }
    }

    return { fact, weight };
  });
  const selectionPool =
    pool.length > 1 && state.lastQuestionKey
      ? weightedPool.filter((item) => item.fact.key !== state.lastQuestionKey)
      : weightedPool;
  const safePool = selectionPool.length ? selectionPool : weightedPool;
  const totalWeight = safePool.reduce((sum, item) => sum + item.weight, 0);
  let target = Math.random() * totalWeight;

  for (const item of safePool) {
    target -= item.weight;
    if (target <= 0) {
      return randomiseDisplay(item.fact);
    }
  }

  return randomiseDisplay(safePool[safePool.length - 1].fact);
}

function getDailyRecord(dateKey = getTodayDateKey()) {
  return {
    ...defaultDailyRecord(),
    ...normaliseDailyRecord(state.progress.dailyRecords[dateKey]),
  };
}

function writeDailyRecord(dateKey, record) {
  state.progress.dailyRecords[dateKey] = normaliseDailyRecord(record);
}

function updateDailyRecordForAttempt(isCorrect) {
  const dateKey = getTodayDateKey();
  const record = getDailyRecord(dateKey);
  record.attempted += 1;
  if (isCorrect) {
    record.correct += 1;
  }
  if (record.attempted >= DAILY_TARGET) {
    record.attemptGoalEarned = true;
  }
  if (record.correct >= DAILY_TARGET) {
    record.accuracyGoalEarned = true;
    record.attemptGoalEarned = true;
  }
  writeDailyRecord(dateKey, record);
}

function updateDailyRecordForSkip() {
  const dateKey = getTodayDateKey();
  const record = getDailyRecord(dateKey);
  record.skipped += 1;
  writeDailyRecord(dateKey, record);
}

function updateDailyRecordForSessionCompletion() {
  if (!state.session.answered && !state.session.skipped) {
    return;
  }

  const dateKey = getTodayDateKey();
  const record = getDailyRecord(dateKey);
  record.sessionsCompleted += 1;
  if (record.attempted >= DAILY_TARGET) {
    record.attemptGoalEarned = true;
  }
  if (record.correct >= DAILY_TARGET) {
    record.accuracyGoalEarned = true;
    record.attemptGoalEarned = true;
  }
  writeDailyRecord(dateKey, record);
}

function getWorkoutDayKeys() {
  return Object.entries(state.progress.dailyRecords)
    .filter(([, record]) => normaliseDailyRecord(record).attemptGoalEarned)
    .map(([key]) => key)
    .sort();
}

function calculateBestPracticeStreak(keys) {
  if (!keys.length) {
    return 0;
  }

  let best = 1;
  let current = 1;

  for (let index = 1; index < keys.length; index += 1) {
    if (keys[index] === shiftDateKey(keys[index - 1], 1)) {
      current += 1;
    } else {
      current = 1;
    }
    best = Math.max(best, current);
  }

  return best;
}

function calculateCurrentPracticeStreak(keys) {
  if (!keys.length) {
    return 0;
  }

  const keySet = new Set(keys);
  const todayKey = getTodayDateKey();
  const yesterdayKey = shiftDateKey(todayKey, -1);
  let anchor = null;

  if (keySet.has(todayKey)) {
    anchor = todayKey;
  } else if (keySet.has(yesterdayKey)) {
    anchor = yesterdayKey;
  } else {
    return 0;
  }

  let streak = 0;
  let cursor = anchor;
  while (keySet.has(cursor)) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  return streak;
}

function getPracticeStreakSummary() {
  const workoutDays = getWorkoutDayKeys();
  return {
    current: calculateCurrentPracticeStreak(workoutDays),
    best: calculateBestPracticeStreak(workoutDays),
  };
}

function setRewardProgress(element, ratio) {
  element.style.setProperty("--reward-progress", `${Math.min(Math.max(ratio, 0), 1)}`);
}

function renderDailyProgress() {
  if (
    !elements.attemptBadge ||
    !elements.accuracyBadge ||
    !elements.attemptProgressLabel ||
    !elements.accuracyProgressLabel
  ) {
    return;
  }

  const todayRecord = getDailyRecord();
  const attemptedRatio = Math.min(todayRecord.attempted / DAILY_TARGET, 1);
  const correctRatio = Math.min(todayRecord.correct / DAILY_TARGET, 1);

  setRewardProgress(elements.attemptBadge, attemptedRatio);
  setRewardProgress(elements.accuracyBadge, correctRatio);

  elements.attemptProgressLabel.textContent = `${Math.min(todayRecord.attempted, DAILY_TARGET)} / 10`;
  elements.accuracyProgressLabel.textContent = `${Math.min(todayRecord.correct, DAILY_TARGET)} / 10`;

  elements.attemptBadge.classList.toggle("is-earned", todayRecord.attemptGoalEarned);
  elements.accuracyBadge.classList.toggle("is-earned", todayRecord.accuracyGoalEarned);
}

function renderQuestionTimer(value) {
  elements.questionTimer.textContent =
    typeof value === "number" ? formatQuestionDuration(value) : value;
}

function getElapsedSessionMs() {
  if (!state.sessionStartedAt) {
    return 0;
  }

  if (state.sessionEndedAt) {
    return state.sessionEndedAt - state.sessionStartedAt;
  }

  return state.active && !state.countingDown
    ? window.performance.now() - state.sessionStartedAt
    : 0;
}

function renderSessionTimer() {
  if (!state.settings) {
    elements.sessionTimer.textContent = "0:00";
    return;
  }

  const elapsedMs = getElapsedSessionMs();

  if (usesSessionCountdown(state.settings)) {
    const remainingMs = Math.max(0, state.settings.timeLimitMinutes * 60000 - elapsedMs);
    elements.sessionTimer.textContent = formatStopwatch(remainingMs);
    return;
  }

  elements.sessionTimer.textContent = formatStopwatch(elapsedMs);
}

function renderPracticeProgress() {
  const settings = state.settings || getCurrentSettingsPreview();
  const sparMode = isSparMode(settings);
  let fillRatio = 0;
  let progressLabel = "Ready";
  let fillColor = ENDLESS_COLORS[0];

  if (settings.sessionType === "question-goal" || settings.sessionType === "isolation") {
    fillRatio =
      settings.questionTarget > 0
        ? Math.min(state.session.answered / settings.questionTarget, 1)
        : 0;
    progressLabel = `${state.session.answered} / ${settings.questionTarget} answered`;
  } else if (sparMode) {
    fillRatio = Math.min(state.session.sparStrikes / 3, 1);
    fillColor = "#c6452d";
    progressLabel = `${state.session.sparStrikes} / 3 strikes`;
  } else if (settings.sessionType === "timed") {
    const elapsedMs = getElapsedSessionMs();
    fillRatio = Math.min(elapsedMs / (settings.timeLimitMinutes * 60000), 1);
    fillColor = "#c6452d";
    progressLabel = `${formatStopwatch(
      Math.max(0, settings.timeLimitMinutes * 60000 - elapsedMs),
    )} left`;
  } else {
    const completedBands = Math.floor(state.session.answered / DAILY_TARGET);
    const withinBand = state.session.answered % DAILY_TARGET;
    fillRatio =
      state.session.answered > 0 && withinBand === 0
        ? 1
        : withinBand / DAILY_TARGET;
    fillColor = ENDLESS_COLORS[completedBands % ENDLESS_COLORS.length];
    progressLabel = `${state.session.answered} answered`;
  }

  elements.progressFill.style.width = `${fillRatio * 100}%`;
  elements.progressFill.style.background = fillColor;
  elements.progressText.textContent = progressLabel;
  elements.practiceAttemptedCount.textContent = `${state.session.answered}`;
  elements.progressTrack?.classList.toggle("is-hidden", sparMode);
  elements.progressText?.classList.toggle("is-hidden", sparMode);
  renderSparStrikeHud(state.session.sparStrikes, sparMode);
  renderStreakEffects();
  renderComboIndicator();
}

function getStreakEffectTier(streak) {
  if (streak >= 8) {
    return "flame";
  }
  if (streak >= 4) {
    return "spark";
  }
  if (streak >= 2) {
    return "smoke";
  }
  return "";
}

function renderStreakEffects() {
  const tier = getStreakEffectTier(state.session.streak);
  const tiers = ["smoke", "spark", "flame"];

  tiers.forEach((candidate) => {
    const className = `streak-${candidate}`;
    elements.progressTrack?.classList.toggle(className, tier === candidate);
    elements.problemWrap?.classList.toggle(className, tier === candidate);
    elements.practicePanel?.classList.toggle(className, tier === candidate);
  });
}

function renderSparStrikeHud(strikes, active) {
  if (!elements.sparStrikeHud) {
    return;
  }

  elements.sparStrikeHud.classList.toggle("is-hidden", !active);
  elements.sparStrikeHud.setAttribute("aria-hidden", active ? "false" : "true");
  elements.sparStrikeBoxes.forEach((box, index) => {
    box.classList.toggle("is-hit", active && index < strikes);
  });
}

function renderComboIndicator() {
  if (!elements.comboIndicator) {
    return;
  }

  const streak = state.session.streak;
  const tier = getStreakEffectTier(streak);
  const visible = streak >= 2;
  elements.comboIndicator.classList.toggle("is-visible", visible);
  elements.comboIndicator.setAttribute("aria-hidden", visible ? "false" : "true");
  elements.comboIndicator.classList.toggle("tier-smoke", tier === "smoke");
  elements.comboIndicator.classList.toggle("tier-spark", tier === "spark");
  elements.comboIndicator.classList.toggle("tier-flame", tier === "flame");
  elements.comboIndicator.textContent = visible ? `COMBO x${streak}` : "COMBO x0";
}

function setFeedback(message, tone = "") {
  elements.feedback.textContent = message;
  elements.feedback.classList.remove("success", "error");
  if (tone) {
    elements.feedback.classList.add(tone);
  }
}

function clearAnswerFeedbackVisuals() {
  const field = elements.answerInput?.closest(".answer-field");
  if (field) {
    field.classList.remove("is-correct", "is-error", "is-sign-error");
  }
  if (elements.answerStatusIcon) {
    elements.answerStatusIcon.textContent = "";
    elements.answerStatusIcon.classList.remove("is-correct", "is-error", "is-sign-error");
  }
}

function setAnswerFeedbackVisual(tone) {
  const field = elements.answerInput?.closest(".answer-field");
  if (!field || !elements.answerStatusIcon) {
    return;
  }

  clearAnswerFeedbackVisuals();
  if (tone === "success") {
    field.classList.add("is-correct");
    elements.answerStatusIcon.classList.add("is-correct");
    elements.answerStatusIcon.textContent = "✓";
    return;
  }

  if (tone === "sign-error") {
    field.classList.add("is-sign-error");
    elements.answerStatusIcon.classList.add("is-sign-error");
    elements.answerStatusIcon.textContent = "±";
    return;
  }

  field.classList.add("is-error");
  elements.answerStatusIcon.classList.add("is-error");
  elements.answerStatusIcon.textContent = "✕";
}

function sanitisePracticeAnswerInput(value) {
  const raw = String(value || "");
  const hasLeadingSign = raw.trim().startsWith("-");
  const digits = raw.replace(/[^\d]/g, "");
  const signPrefix = canUseNegativeInput() && hasLeadingSign ? "-" : "";
  return `${signPrefix}${digits}`;
}

function handlePracticeAnswerInput(event) {
  const input = event?.target;
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const cleaned = sanitisePracticeAnswerInput(input.value);
  if (cleaned !== input.value) {
    input.value = cleaned;
  }
  clearAnswerFeedbackVisuals();
  syncKeypadSignToggleState();
}

function askNextQuestion() {
  const nextQuestion = pickQuestion();
  if (!nextQuestion) {
    completeSession("manual");
    return;
  }

  state.currentQuestion = nextQuestion;
  state.questionStartedAt = window.performance.now();
  state.lastQuestionKey = state.currentQuestion.key;

  elements.problemText.textContent = `${state.currentQuestion.left} ${state.currentQuestion.symbol} ${state.currentQuestion.right}`;
  elements.answerInput.value = "";
  elements.answerInput.disabled = false;
  elements.checkButton.disabled = false;
  elements.skipButton.disabled = isSparMode(state.settings);
  elements.answerInput.focus();
  syncKeypadSignToggleState();
  clearAnswerFeedbackVisuals();
  setFeedback("");
  renderQuestionTimer(0);
  renderPracticeProgress();
}

function updateLiveTimers() {
  if (!state.active || state.countingDown || !state.currentQuestion) {
    return;
  }

  const questionElapsedMs = window.performance.now() - state.questionStartedAt;
  const sessionElapsedMs = getElapsedSessionMs();

  renderQuestionTimer(questionElapsedMs);
  renderSessionTimer();
  renderPracticeProgress();

  if (usesSessionCountdown(state.settings) && sessionElapsedMs >= state.settings.timeLimitMinutes * 60000) {
    completeSession("timer");
  }
}

function startHudTimer() {
  window.clearInterval(state.hudIntervalId);
  state.hudIntervalId = window.setInterval(updateLiveTimers, 100);
}

function stopHudTimer() {
  window.clearInterval(state.hudIntervalId);
  state.hudIntervalId = null;
}

function stopCountdown() {
  window.clearTimeout(state.countdownTimeoutId);
  state.countdownTimeoutId = null;
  state.countingDown = false;
}

function beginPracticeSession() {
  state.countingDown = false;
  state.sessionStartedAt = window.performance.now();
  state.sessionEndedAt = 0;

  showView("practice");
  renderSessionTimer();
  renderPracticeProgress();
  renderDailyProgress();
  askNextQuestion();
  startHudTimer();
}

function runCountdownStep(stepIndex) {
  const step = COUNTDOWN_STEPS[stepIndex];
  elements.countdownNumber.textContent = step;
  elements.countdownNumber.classList.remove("countdown-pop");
  window.requestAnimationFrame(() => {
    elements.countdownNumber.classList.add("countdown-pop");
  });

  const isLastStep = stepIndex === COUNTDOWN_STEPS.length - 1;
  const delay = isLastStep ? 650 : 1000;

  state.countdownTimeoutId = window.setTimeout(() => {
    if (!state.active) {
      return;
    }

    if (isLastStep) {
      beginPracticeSession();
      return;
    }

    runCountdownStep(stepIndex + 1);
  }, delay);
}

function startSession(settings) {
  stopCountdown();
  stopHudTimer();
  window.clearTimeout(state.advanceTimeoutId);

  state.active = true;
  state.countingDown = true;
  state.settings = settings;
  state.questionPool = buildPool(settings);
  if (!state.questionPool.length) {
    const fallbackFactor = settings.operation === "addition" ? 1 : 2;
    state.questionPool = [createFact(settings.operation, fallbackFactor, fallbackFactor)];
  }
  state.session = createEmptySession();
  state.currentQuestion = null;
  state.lastQuestionKey = null;
  state.questionStartedAt = 0;
  state.sessionStartedAt = 0;
  state.sessionEndedAt = 0;

  elements.sessionBadge.textContent = getSessionBadgeLabel(settings);
  if (elements.countdownCopy) {
    elements.countdownCopy.textContent =
      settings.operation === "addition"
        ? "Type the answer to each addition fact."
        : settings.operation === "subtraction"
          ? "Type the answer to each subtraction fact."
          : settings.operation === "division"
            ? "Type the answer to each division fact."
            : "Type the answer to the times tables.";
  }
  elements.answerInput.disabled = true;
  elements.checkButton.disabled = true;
  elements.skipButton.disabled = true;
  elements.problemText.textContent = "Get ready";
  syncKeypadSignToggleState();
  renderQuestionTimer(0);
  renderSessionTimer();
  renderPracticeProgress();
  renderDailyProgress();
  setFeedback("");
  showView("countdown");
  runCountdownStep(0);
}

function isSessionComplete() {
  if (
    state.settings.sessionType === "question-goal" ||
    state.settings.sessionType === "isolation"
  ) {
    return state.session.answered >= state.settings.questionTarget;
  }

  if (isSparMode(state.settings)) {
    return state.session.sparStrikes >= 3;
  }

  return false;
}

function finishSessionProgress() {
  if (!state.session.answered && !state.session.skipped) {
    return;
  }

  const accuracy = getAccuracy(state.session.correct, state.session.answered);
  const averageMs = average(state.session.responseTimes);

  state.progress.bestStreak = Math.max(state.progress.bestStreak, state.session.bestStreak);
  state.progress.bestAccuracy = Math.max(state.progress.bestAccuracy, accuracy);

  if (averageMs !== null) {
    if (state.progress.fastestAverageMs === null || averageMs < state.progress.fastestAverageMs) {
      state.progress.fastestAverageMs = averageMs;
    }
  }

  state.progress.sessionsCompleted += 1;
}

function getWorkoutModeKey(settings) {
  if (settings.sessionType === "timed") {
    return "timed";
  }

  if (settings.sessionType === "question-goal") {
    return "question-goal";
  }

  if (settings.sessionType === "isolation") {
    return "isolation";
  }

  return settings.freeTrainingMode === "spar" ? "spar" : "zen";
}

function getWorkoutModeLabelFromSettings(settings) {
  const modeKey = getWorkoutModeKey(settings);
  const operationLabel = getOperationLabel(settings.operation);
  if (modeKey === "timed") {
    return `${operationLabel} High Intensity Training`;
  }
  if (modeKey === "question-goal") {
    return `${operationLabel} Target Reps`;
  }
  if (modeKey === "isolation") {
    return `Isolation Training (x ${settings.focusFactor})`;
  }
  if (modeKey === "spar") {
    return settings.sparTiming === "timed"
      ? `${operationLabel} Spar Mode (Timed)`
      : `${operationLabel} Spar Mode`;
  }
  return `${operationLabel} Zen Mode`;
}

function getWorkoutModeLabel(record) {
  if (record.modeLabel) {
    return record.modeLabel;
  }

  const operationLabel = getOperationLabel(record.operation);
  if (record.modeKey === "timed") {
    return `${operationLabel} High Intensity Training`;
  }
  if (record.modeKey === "question-goal") {
    return `${operationLabel} Target Reps`;
  }
  if (record.modeKey === "isolation") {
    return `Isolation Training (x ${record.focusFactor || 7})`;
  }
  if (record.modeKey === "spar") {
    return record.sparTiming === "timed"
      ? `${operationLabel} Spar Mode (Timed)`
      : `${operationLabel} Spar Mode`;
  }
  return `${operationLabel} Zen Mode`;
}

function appendWorkoutHistory(reason) {
  if (!state.session.answered && !state.session.skipped) {
    return;
  }

  const averageMs = average(state.session.responseTimes);
  const record = normaliseWorkoutRecord({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    operation: state.settings.operation,
    modeKey: getWorkoutModeKey(state.settings),
    modeLabel: getWorkoutModeLabelFromSettings(state.settings),
    dateKey: getTodayDateKey(),
    recordedAt: Date.now(),
    attempted: state.session.answered,
    correct: state.session.correct,
    accuracy: getAccuracy(state.session.correct, state.session.answered),
    skipped: state.session.skipped,
    bestStreak: state.session.bestStreak,
    averageMs,
    reason,
    freeTrainingMode: state.settings.freeTrainingMode,
    sparTiming: state.settings.sparTiming,
    timeLimitMinutes: usesSessionCountdown(state.settings) ? state.settings.timeLimitMinutes : 0,
    focusFactor: state.settings.focusFactor,
    minFactor: state.settings.minFactor,
    maxFactor: state.settings.maxFactor,
    additionDifficulty: state.settings.additionDifficulty,
    additionDifficulties: state.settings.additionDifficulties,
    additionRegrouping: state.settings.additionRegrouping,
  });

  state.progress.workoutHistory = [record, ...state.progress.workoutHistory].slice(0, 50);
}

function updateFactProgress(question, isCorrect, responseTimeMs) {
  const existing = getFactProgress(question.key);
  const magnitudeCorrect =
    typeof isCorrect === "object" ? Boolean(isCorrect.magnitudeCorrect) : Boolean(isCorrect);
  const signCorrect =
    typeof isCorrect === "object" ? Boolean(isCorrect.signCorrect) : Boolean(isCorrect);
  const signError =
    typeof isCorrect === "object" ? Boolean(isCorrect.signError) : false;
  const fullyCorrect =
    typeof isCorrect === "object" ? Boolean(isCorrect.isCorrect) : Boolean(isCorrect);
  const timestampNow = Date.now();
  const updated = {
    ...existing,
    operation: question.operation || "multiplication",
    symbol: question.symbol || "x",
    attempts: existing.attempts + 1,
    correct: existing.correct + (fullyCorrect ? 1 : 0),
    magnitudeCorrect: existing.magnitudeCorrect + (magnitudeCorrect ? 1 : 0),
    signCorrect: existing.signCorrect + (signCorrect ? 1 : 0),
    signErrors: existing.signErrors + (signError ? 1 : 0),
    misses: existing.misses + (fullyCorrect ? 0 : 1),
    currentStreak: fullyCorrect ? existing.currentStreak + 1 : 0,
    bestStreak: fullyCorrect
      ? Math.max(existing.bestStreak, existing.currentStreak + 1)
      : existing.bestStreak,
    averageMs:
      responseTimeMs === null
        ? existing.averageMs
        : existing.averageMs === null
          ? responseTimeMs
          : (existing.averageMs * existing.attempts + responseTimeMs) / (existing.attempts + 1),
    firstSeenAt: existing.firstSeenAt || timestampNow,
    lastSeenAt: timestampNow,
  };

  state.progress.facts[question.key] = updated;
  state.progress.facts = compactFactProgressMap(state.progress.facts);
}

function registerRecentAnswer(answerValue, evaluation, skipped, responseTimeMs) {
  state.session.recent.unshift({
    key: state.currentQuestion.key,
    operation: state.currentQuestion.operation,
    symbol: state.currentQuestion.symbol,
    equation: `${state.currentQuestion.left} ${state.currentQuestion.symbol} ${state.currentQuestion.right}`,
    answer: state.currentQuestion.answer,
    provided: answerValue,
    isCorrect: Boolean(evaluation?.isCorrect),
    signError: Boolean(evaluation?.signError),
    skipped,
    responseTimeMs,
  });
  state.session.recent = state.session.recent.slice(0, 8);
}

function registerAnswer(evaluation, answerValue, options = {}) {
  const skipped = Boolean(options.skipped);
  const responseTimeMs = skipped ? null : window.performance.now() - state.questionStartedAt;
  const sparMode = isSparMode(state.settings);

  if (skipped) {
    state.session.skipped += 1;
    state.session.streak = 0;
    state.progress.totalSkipped += 1;
    if (sparMode) {
      state.session.sparStrikes += 1;
    }
    updateDailyRecordForSkip();
    updateFactProgress(state.currentQuestion, false, null);
    updateBucketDailyProgress(state.currentQuestion, false);
    registerRecentAnswer("Skipped", null, true, null);
  } else {
    const isCorrect = Boolean(evaluation.isCorrect);
    state.session.answered += 1;
    state.session.correct += isCorrect ? 1 : 0;
    state.session.streak = isCorrect ? state.session.streak + 1 : 0;
    state.session.bestStreak = Math.max(state.session.bestStreak, state.session.streak);
    state.session.responseTimes.push(responseTimeMs);
    state.progress.totalAnswered += 1;
    state.progress.totalAttempted = state.progress.totalAnswered;
    state.progress.totalCorrect += isCorrect ? 1 : 0;
    state.progress.totalMagnitudeCorrect += evaluation.magnitudeCorrect ? 1 : 0;
    state.progress.totalSignCorrect += evaluation.signCorrect ? 1 : 0;
    state.progress.totalSignErrors += evaluation.signError ? 1 : 0;
    if (sparMode && !isCorrect) {
      state.session.sparStrikes += 1;
    }
    updateDailyRecordForAttempt(isCorrect);
    updateFactProgress(state.currentQuestion, evaluation, responseTimeMs);
    updateBucketDailyProgress(state.currentQuestion, isCorrect);
    registerRecentAnswer(answerValue, evaluation, false, responseTimeMs);
  }

  queueProgressSave();
  renderDailyProgress();
  renderPracticeProgress();

  elements.answerInput.disabled = true;
  elements.checkButton.disabled = true;
  elements.skipButton.disabled = true;
  syncKeypadSignToggleState();
  clearAnswerFeedbackVisuals();
}

function queueNextQuestion(delay) {
  window.clearTimeout(state.advanceTimeoutId);
  state.advanceTimeoutId = window.setTimeout(() => {
    if (!state.active) {
      return;
    }

    if (isSessionComplete()) {
      completeSession(isSparMode(state.settings) ? "knockout" : "goal");
      return;
    }

    askNextQuestion();
  }, delay);
}

function handleSubmit(event) {
  event.preventDefault();

  if (!state.active || state.countingDown || !state.currentQuestion) {
    return;
  }

  const rawValue = elements.answerInput.value.trim();
  if (!rawValue) {
    setAnswerFeedbackVisual("error");
    setFeedback("Type an answer first.", "error");
    if (!state.useTouchKeypad) {
      elements.answerInput.focus();
    }
    return;
  }

  if (!/^-?\d+$/.test(rawValue)) {
    setAnswerFeedbackVisual("error");
    setFeedback("Use whole numbers only.", "error");
    if (!state.useTouchKeypad) {
      elements.answerInput.focus();
    }
    return;
  }

  const numericValue = Number(rawValue);
  const expectedValue = state.currentQuestion.answer;
  const magnitudeCorrect = Math.abs(numericValue) === Math.abs(expectedValue);
  const signCorrect =
    magnitudeCorrect && (numericValue === expectedValue || Math.sign(numericValue) === Math.sign(expectedValue));
  const evaluation = {
    isCorrect: numericValue === expectedValue,
    magnitudeCorrect,
    signCorrect,
    signError: magnitudeCorrect && numericValue !== expectedValue,
  };

  registerAnswer(evaluation, numericValue);
  setAnswerFeedbackVisual(
    evaluation.isCorrect ? "success" : evaluation.signError ? "sign-error" : "error",
  );
  setFeedback(
    evaluation.isCorrect
      ? "Correct."
      : `Not quite. Correct answer: ${expectedValue}`,
    evaluation.isCorrect ? "success" : "error",
  );
  queueNextQuestion(evaluation.isCorrect ? 320 : 520);
}

function handleSkip() {
  if (!state.active || state.countingDown || !state.currentQuestion) {
    return;
  }

  const correctAnswer = state.currentQuestion.answer;
  registerAnswer(null, "Skipped", { skipped: true });
  setAnswerFeedbackVisual("error");
  setFeedback(`Skipped. Correct answer: ${correctAnswer}`, "error");
  queueNextQuestion(420);
}

function canUseNegativeInput() {
  return Boolean(state.settings?.negativesMode);
}

function syncKeypadSignToggleState() {
  if (!elements.practiceKeypad) {
    return;
  }

  const signButton = elements.practiceKeypad.querySelector('[data-keypad-key="sign"]');
  if (!(signButton instanceof HTMLButtonElement)) {
    return;
  }

  const enabled = canUseNegativeInput();
  const isNegative = elements.answerInput.value.startsWith("-");
  signButton.disabled = !enabled;
  signButton.setAttribute("aria-pressed", enabled && isNegative ? "true" : "false");
}

function handlePracticeKeypadClick(event) {
  const button = event.target.closest("[data-keypad-key]");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const key = button.dataset.keypadKey;
  if (!key) {
    return;
  }

  if (!state.active || state.countingDown || !state.currentQuestion) {
    return;
  }

  let nextValue = elements.answerInput.value;

  if (key === "backspace") {
    nextValue = nextValue.slice(0, -1);
  } else if (key === "sign") {
    if (!canUseNegativeInput()) {
      return;
    }
    nextValue = nextValue.startsWith("-") ? nextValue.slice(1) : `-${nextValue}`;
  } else if (/^\d$/.test(key)) {
    nextValue = `${nextValue}${key}`;
  } else {
    return;
  }

  elements.answerInput.value = sanitisePracticeAnswerInput(nextValue);
  syncKeypadSignToggleState();
}

function renderResults(reason) {
  const accuracy = getAccuracy(state.session.correct, state.session.answered);
  const averageMs = average(state.session.responseTimes);
  const latestRecord = state.progress.workoutHistory[0] || null;
  const previousModeRecords = latestRecord
    ? state.progress.workoutHistory
        .slice(1)
        .filter(
          (record) =>
            record.modeKey === latestRecord.modeKey &&
            (record.operation || "multiplication") ===
              (latestRecord.operation || "multiplication"),
        )
        .sort((left, right) => compareWorkoutRecords(left, right, latestRecord.modeKey))
    : [];
  const improved =
    Boolean(latestRecord) &&
    previousModeRecords.length > 0 &&
    compareWorkoutRecords(latestRecord, previousModeRecords[0], latestRecord.modeKey) < 0;
  const strongPerformance =
    accuracy >= 0.9 ||
    (state.session.correct === state.session.answered && state.session.answered >= 8) ||
    state.session.bestStreak >= 10;

  let titleMessage = getRotatingMessage(
    `${RESULTS_MESSAGE_KEY_PREFIX}-completed`,
    RESULTS_TITLE_POOLS.completed,
  );
  let highlightTitle = false;

  if (improved) {
    titleMessage = getRotatingMessage(
      `${RESULTS_MESSAGE_KEY_PREFIX}-progress`,
      RESULTS_TITLE_POOLS.progress,
    );
    highlightTitle = true;
  } else if (strongPerformance) {
    titleMessage = getRotatingMessage(
      `${RESULTS_MESSAGE_KEY_PREFIX}-strong`,
      RESULTS_TITLE_POOLS.strong,
    );
    highlightTitle = true;
  }

  if (reason === "manual" && !improved && !strongPerformance) {
    titleMessage = "A journey of a thousand miles begins with one step.";
  }

  elements.resultsTitle.textContent = titleMessage;
  elements.resultsTitle.classList.toggle("results-title-highlight", highlightTitle);

  elements.resultQuestions.textContent = `${state.session.answered}`;
  elements.resultCorrect.textContent = `${state.session.correct}`;
  elements.resultAccuracy.textContent = formatPercent(accuracy);
  elements.resultPace.textContent = formatQuestionDuration(averageMs);
  elements.resultBestStreak.textContent = `${state.session.bestStreak}`;
  elements.resultSkipped.textContent = `${state.session.skipped}`;
}

function completeSession(reason = "manual") {
  if (!state.active) {
    return;
  }

  state.active = false;
  state.countingDown = false;
  state.questionPool = [];
  state.sessionEndedAt = state.sessionStartedAt ? window.performance.now() : 0;
  window.clearTimeout(state.advanceTimeoutId);
  stopHudTimer();
  stopCountdown();

  elements.answerInput.disabled = true;
  elements.checkButton.disabled = true;
  elements.skipButton.disabled = true;
  clearAnswerFeedbackVisuals();

  updateDailyRecordForSessionCompletion();
  finishSessionProgress();
  appendWorkoutHistory(reason);
  saveProgress();

  renderQuestionTimer("Done");
  renderSessionTimer();
  renderDailyProgress();
  renderOverall();
  renderFocusAreas();
  syncRecordsModeOptions();
  renderWorkoutHistory();
  renderCoachTip();
  renderTableRadar();
  renderCalendars();
  renderStreakPanel();
  const streakSummary = getPracticeStreakSummary();
  showHomeStreakBanner(streakSummary.current);
  renderResults(reason);
  state.resultsSlideIndex = 0;
  renderResultsCarousel();
  resetSetupForNextWorkout();
  showView("results");
}

function handleFinishSession() {
  if (!state.active || state.countingDown) {
    return;
  }

  openEndWorkoutDialog();
}

