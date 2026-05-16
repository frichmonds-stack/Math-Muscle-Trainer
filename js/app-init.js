async function resolveDisplayVersion() {
  function normaliseVersion(value) {
    return String(value || "")
      .trim()
      .replace(/^v/i, "");
  }

  function compareSemver(left, right) {
    const leftParts = normaliseVersion(left)
      .split(".")
      .map((part) => Number(part) || 0);
    const rightParts = normaliseVersion(right)
      .split(".")
      .map((part) => Number(part) || 0);
    const maxLength = Math.max(leftParts.length, rightParts.length);
    for (let index = 0; index < maxLength; index += 1) {
      const leftValue = leftParts[index] || 0;
      const rightValue = rightParts[index] || 0;
      if (leftValue !== rightValue) {
        return leftValue - rightValue;
      }
    }
    return 0;
  }

  try {
    const response = await fetch("CHANGELOG.md", { cache: "no-store" });
    if (!response.ok) {
      return APP_VERSION;
    }
    const changelog = await response.text();
    const releaseMatches = Array.from(changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\](?:\s+-\s+.+)?$/gm)).map(
      (match) => match[1],
    );
    if (!releaseMatches.length) {
      return APP_VERSION;
    }
    const latestChangelogVersion = releaseMatches.sort(compareSemver).at(-1);
    const fallbackVersion = normaliseVersion(APP_VERSION);
    if (!latestChangelogVersion) {
      return APP_VERSION;
    }
    const displayVersion =
      compareSemver(fallbackVersion, latestChangelogVersion) >= 0
        ? fallbackVersion
        : latestChangelogVersion;
    return `v${displayVersion}`;
  } catch (error) {
    return APP_VERSION;
  }
}

async function initialise() {
  if (elements.appVersion) {
    elements.appVersion.textContent = await resolveDisplayVersion();
  }
  applyTheme(state.theme);
  applyColorMode(state.colorMode);
  if (elements.keypadPreferenceOptionsSelect) {
    elements.keypadPreferenceOptionsSelect.value = state.keypadPreference;
  }
  if (elements.colorModeSelect) {
    elements.colorModeSelect.value = state.colorMode;
  }
  if (elements.heroMessage) {
    elements.heroMessage.textContent = getHeroMessage();
  }
  renderHomeDailyThought();
  state.displayMonthKey = getMonthKey(getCurrentMonthDate());

  resetSetupForNextWorkout();
  updatePracticeInputMode();
  if (elements.overviewOperationFilter) {
    elements.overviewOperationFilter.value = "all";
  }
  if (elements.focusOperationFilter) {
    elements.focusOperationFilter.value = "all";
  }
  if (elements.coachOperationFilter) {
    elements.coachOperationFilter.value = "all";
  }
  if (elements.factOperationFilter) {
    elements.factOperationFilter.value = "multiplication";
  }
  syncFactDetailFilterOptions();
  if (elements.recordsOperationSelect) {
    elements.recordsOperationSelect.value = "all";
  }
  syncRecordsModeOptions();
  syncOverviewSelectorLabel();
  syncFocusSelectorLabel();
  syncCoachSelectorLabel();
  syncRecordsSelectorLabels();
  renderDailyProgress();
  renderOverall();
  renderMasterySystem();
  renderFocusAreas();
  renderWorkoutHistory();
  renderCoachTip();
  renderTableRadar();
  renderCalendars();
  renderStreakPanel();
  if (elements.homeWeeklyStrip && !elements.homeWeeklyStrip.children.length) {
    renderHomeWeeklyStrip();
  }
  renderResultsCarousel();
  renderProgressCarousel();
  renderPracticeProgress();
  renderSessionTimer();
  renderQuestionTimer(0);
  renderTechniqueScreen();
  setFeedback("");
  setEndWorkoutDialogContent(null);
  showView("home");
  initialiseCarouselGestures();

  elements.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const settings = readSettings();

    if (settings.error) {
      window.alert(settings.error);
      return;
    }

    startSession(settings);
  });

  elements.settingsForm.addEventListener("input", handleSettingsChange);
  elements.settingsForm.addEventListener("change", handleSettingsChange);
  elements.operationInputs.forEach((input) => {
    input.addEventListener("change", handleSettingsChange);
  });
  elements.masteryGrid?.addEventListener("click", handleMasterySelection);
  elements.operationChoiceGrid?.addEventListener("click", handleOperationResetClick);
  elements.sessionTypeInputs.forEach((input) => {
    input.addEventListener("change", handleSettingsChange);
  });
  elements.additionDifficultyInputs.forEach((input) => {
    input.addEventListener("change", handleSettingsChange);
  });
  elements.subtractionDifficultyInputs.forEach((input) => {
    input.addEventListener("change", handleSettingsChange);
  });
  document.addEventListener("keydown", handleGlobalKeydown);
  elements.answerForm.addEventListener("submit", handleSubmit);
  elements.answerInput.addEventListener("input", handlePracticeAnswerInput);
  elements.skipButton.addEventListener("click", handleSkip);
  elements.practiceKeypad?.addEventListener("click", handlePracticeKeypadClick);
  elements.finishSessionButton.addEventListener("click", handleFinishSession);
  elements.repeatSessionButton.addEventListener("click", () => {
    if (state.settings) {
      startSession(state.settings);
    }
  });
  elements.optionsButton.addEventListener("click", () => {
    elements.optionsDialog.showModal();
  });
  elements.globalOptionsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      elements.optionsDialog.showModal();
    });
  });
  elements.aboutButton?.addEventListener("click", () => {
    elements.aboutDialog?.showModal();
  });
  elements.masteryHelpButton?.addEventListener("click", () => {
    elements.masteryHelpDialog?.showModal();
  });
  elements.homeDashboard?.addEventListener("click", handleHomeDashboardClick);
  elements.optionsCloseButton.addEventListener("click", () => {
    elements.optionsDialog.close();
  });
  elements.aboutCloseButton?.addEventListener("click", () => {
    elements.aboutDialog?.close();
  });
  elements.masteryHelpCloseButton?.addEventListener("click", () => {
    elements.masteryHelpDialog?.close();
  });
  elements.cancelExitTechniqueButton.addEventListener("click", cancelTechniqueExit);
  elements.confirmExitTechniqueButton.addEventListener("click", confirmTechniqueExit);
  elements.cancelEndWorkoutButton.addEventListener("click", () => {
    state.pendingWorkoutView = null;
    setEndWorkoutDialogContent(null);
    elements.endWorkoutDialog.close();
  });
  elements.confirmEndWorkoutButton.addEventListener("click", () => {
    const pendingView = state.pendingWorkoutView;
    state.pendingWorkoutView = null;
    setEndWorkoutDialogContent(null);
    elements.endWorkoutDialog.close();
    completeSession("manual");
    if (pendingView) {
      requestView(pendingView);
    }
  });
  registerBackdropClose(elements.optionsDialog);
  registerBackdropClose(elements.aboutDialog);
  registerBackdropClose(elements.masteryHelpDialog);
  registerBackdropClose(elements.endWorkoutDialog);
  registerBackdropClose(elements.exitTechniqueDialog);
  elements.endWorkoutDialog.addEventListener("close", () => {
    state.pendingWorkoutView = null;
    setEndWorkoutDialogContent(null);
  });
  elements.exitTechniqueDialog.addEventListener("close", () => {
    state.pendingTechniqueView = null;
  });
  elements.resetProgressButton.addEventListener("click", resetProgress);
  elements.overviewOperationFilter?.addEventListener("change", handleOverviewOperationFilterChange);
  elements.focusOperationFilter?.addEventListener("change", handleFocusOperationFilterChange);
  elements.coachOperationFilter?.addEventListener("change", handleCoachOperationFilterChange);
  elements.overviewOperationPrevButton?.addEventListener("click", () => shiftOverviewOperation(-1));
  elements.overviewOperationNextButton?.addEventListener("click", () => shiftOverviewOperation(1));
  elements.focusOperationPrevButton?.addEventListener("click", () => shiftFocusOperation(-1));
  elements.focusOperationNextButton?.addEventListener("click", () => shiftFocusOperation(1));
  elements.coachOperationPrevButton?.addEventListener("click", () => shiftCoachOperation(-1));
  elements.coachOperationNextButton?.addEventListener("click", () => shiftCoachOperation(1));
  elements.factOperationFilter?.addEventListener("change", handleFactOperationFilterChange);
  elements.factDetailFilter?.addEventListener("change", handleFactDetailFilterChange);
  elements.factOperationPrevButton?.addEventListener("click", () => shiftFactOperation(-1));
  elements.factOperationNextButton?.addEventListener("click", () => shiftFactOperation(1));
  elements.factDetailPrevButton?.addEventListener("click", () => shiftFactDetail(-1));
  elements.factDetailNextButton?.addEventListener("click", () => shiftFactDetail(1));
  elements.factRangePrevButton?.addEventListener("click", () => shiftFactTrackerRange(-1));
  elements.factRangeNextButton?.addEventListener("click", () => shiftFactTrackerRange(1));
  elements.tableGrid?.addEventListener("click", handleAdditionTrackerCardClick);
  elements.tableGrid?.addEventListener("keydown", handleAdditionTrackerCardKeydown);
  elements.recordsOperationSelect?.addEventListener("change", handleRecordsFilterChange);
  elements.recordsModeSelect.addEventListener("change", () => {
    renderWorkoutHistory();
    syncRecordsSelectorLabels();
  });
  elements.recordsOperationPrevButton?.addEventListener("click", () => shiftRecordsOperation(-1));
  elements.recordsOperationNextButton?.addEventListener("click", () => shiftRecordsOperation(1));
  elements.recordsModePrevButton?.addEventListener("click", () => shiftRecordsMode(-1));
  elements.recordsModeNextButton?.addEventListener("click", () => shiftRecordsMode(1));
  elements.themeSelect?.addEventListener("change", handleThemeChange);
  elements.colorModeSelect?.addEventListener("change", handleColorModeChange);
  elements.keypadPreferenceOptionsSelect?.addEventListener("change", handleKeypadPreferenceChange);
  elements.progressMonthPrevButton.addEventListener("click", () => shiftDisplayedMonth(-1));
  elements.progressMonthNextButton.addEventListener("click", () => shiftDisplayedMonth(1));
  elements.resultsMonthPrevButton.addEventListener("click", () => shiftDisplayedMonth(-1));
  elements.resultsMonthNextButton.addEventListener("click", () => shiftDisplayedMonth(1));
  elements.resultsPrevButton?.addEventListener("click", () => shiftResultsCarousel(-1));
  elements.resultsNextButton?.addEventListener("click", () => shiftResultsCarousel(1));
  elements.progressPrevButton?.addEventListener("click", () => shiftProgressCarousel(-1));
  elements.progressNextButton?.addEventListener("click", () => shiftProgressCarousel(1));
  document.querySelectorAll(".carousel-inline-nav-button[data-carousel-target][data-carousel-shift]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.carouselShift || 0);
      if (!direction) {
        return;
      }
      if (button.dataset.carouselTarget === "results") {
        shiftResultsCarousel(direction);
      }
      if (button.dataset.carouselTarget === "progress") {
        shiftProgressCarousel(direction);
      }
    });
  });
  elements.resultsCarousel?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-carousel-target='results'][data-carousel-shift]");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    const direction = Number(button.dataset.carouselShift || 0);
    if (direction) {
      shiftResultsCarousel(direction);
    }
  });
  elements.progressCarousel?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-carousel-target='progress'][data-carousel-shift]");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    const direction = Number(button.dataset.carouselShift || 0);
    if (direction) {
      shiftProgressCarousel(direction);
    }
  });

  [elements.checkButton, elements.skipButton].forEach((button) => {
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });
  });

  elements.techniqueScreenShell.addEventListener("click", handleTechniqueTableClick);
  elements.techniqueScreenShell.addEventListener("click", handleTechniqueLessonClick);
  elements.techniqueScreenShell.addEventListener("change", handleTechniqueMenuChange);
  elements.techniqueScreenShell.addEventListener("submit", handleTechniqueLessonSubmit);
  elements.techniqueScreenShell.addEventListener("input", handleTechniqueInput);
  elements.techniqueScreenShell.addEventListener("keydown", handleTechniqueLessonKeydown);
  elements.techniqueExitNavButton?.addEventListener("click", () => {
    handleTechniqueAction("exit");
  });
  let resizeRenderTimeoutId = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeRenderTimeoutId);
    resizeRenderTimeoutId = window.setTimeout(() => {
      updatePracticeInputMode();
      renderResultsCarousel();
      renderProgressCarousel();
      if (typeof renderAppPageIndicator === "function") {
        renderAppPageIndicator();
      }
      resizeRenderTimeoutId = null;
    }, 120);
  });

  elements.viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetView = button.dataset.viewTarget;
      if (targetView) {
        requestView(targetView);
      }
    });
  });

  elements.streakBanner?.addEventListener("click", (event) => {
    const interactiveTarget = event.target instanceof Element
      ? event.target.closest("button, a, input, select, textarea")
      : null;
    if (interactiveTarget) {
      return;
    }
    window.clearTimeout(state.streakBannerTimeoutId);
    elements.streakBanner.classList.remove("is-visible");
  });
}

function renderHomeDailyThought() {
  if (!elements.homeDailyThought || !HOME_DAILY_THOUGHTS.length) {
    return;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayIndex = Math.floor(today.getTime() / 86400000);
  elements.homeDailyThought.textContent = HOME_DAILY_THOUGHTS[dayIndex % HOME_DAILY_THOUGHTS.length];
}

const HOME_ADAPTIVE_RECENT_LIMIT = 40;
const HOME_ADAPTIVE_MIN_ATTEMPTS = 15;
const HOME_ADAPTIVE_HARD_ACCURACY = 0.9;
const HOME_ADAPTIVE_MEDIUM_ACCURACY = 0.8;
const HOME_ADAPTIVE_HARD_MAX_AVERAGE_MS = 4500;
const HOME_ADAPTIVE_DIFFICULTIES = {
  easy: ["easy"],
  medium: ["easy", "medium"],
  hard: ["medium", "hard"],
};
const HOME_ADAPTIVE_FACTOR_RANGES = {
  easy: { minFactor: 1, maxFactor: 5, focusFactor: 5 },
  medium: { minFactor: 1, maxFactor: 10, focusFactor: 7 },
  hard: { minFactor: 2, maxFactor: 12, focusFactor: 12 },
};

function getAdaptiveHomeBand(operation) {
  const recentEntries = normaliseAnswerTelemetry(state.progress.answerTelemetry)
    .filter((entry) => entry.operation === operation && !entry.skipped)
    .slice(0, HOME_ADAPTIVE_RECENT_LIMIT);
  const attempted = recentEntries.length;
  if (attempted < HOME_ADAPTIVE_MIN_ATTEMPTS) {
    return "easy";
  }

  const correct = recentEntries.filter((entry) => entry.correct).length;
  const accuracy = attempted > 0 ? correct / attempted : 0;
  const responseTimes = recentEntries
    .filter((entry) => entry.correct && entry.responseTimeMs !== null)
    .map((entry) => entry.responseTimeMs);
  const averageMs = average(responseTimes);

  if (
    accuracy >= HOME_ADAPTIVE_HARD_ACCURACY &&
    (averageMs === null || averageMs <= HOME_ADAPTIVE_HARD_MAX_AVERAGE_MS)
  ) {
    return "hard";
  }
  if (accuracy >= HOME_ADAPTIVE_MEDIUM_ACCURACY) {
    return "medium";
  }
  return "easy";
}

function getAdaptiveHomeOperationSettings(operation) {
  const band = getAdaptiveHomeBand(operation);
  const settings = {};

  if (operation === "addition") {
    settings.additionDifficulty = HOME_ADAPTIVE_DIFFICULTIES[band][0];
    settings.additionDifficulties = HOME_ADAPTIVE_DIFFICULTIES[band];
  }
  if (operation === "subtraction") {
    settings.subtractionDifficulty = HOME_ADAPTIVE_DIFFICULTIES[band][0];
    settings.subtractionDifficulties = HOME_ADAPTIVE_DIFFICULTIES[band];
  }
  if (operation === "multiplication" || operation === "division") {
    Object.assign(settings, HOME_ADAPTIVE_FACTOR_RANGES[band]);
  }

  return settings;
}

function getHomeWorkoutSettings(operation, options = {}) {
  const questionTarget = options.questionTarget || 20;
  const correctTarget = options.correctTarget || null;
  const sessionType = options.sessionType || "question-goal";
  const timeLimitMinutes = options.timeLimitMinutes || 1;
  return {
    ...defaultSettingsSnapshot(),
    ...getAdaptiveHomeOperationSettings(operation),
    operation,
    sessionType,
    questionPreset: sessionType === "question-goal" ? "custom" : "20",
    questionTarget,
    timePreset: sessionType === "timed" ? "1" : "3",
    timeLimitMinutes,
    freeTrainingMode: "zen",
    adaptiveMode: true,
    negativesMode: false,
    ...(correctTarget ? { correctTarget } : {}),
  };
}

function startHomeWorkout(operation, options = {}) {
  const settingsSnapshot = sanitiseSettingsSnapshot(getHomeWorkoutSettings(operation, options));
  applySettingsSnapshot(settingsSnapshot);
  toggleSetupFields();
  const settings = {
    ...settingsSnapshot,
    ...(options.correctTarget ? { correctTarget: options.correctTarget } : {}),
  };
  startSession(settings);
}

function handleHomeDashboardClick(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const routineButton = event.target.closest("[data-home-routine-operation]");
  if (routineButton) {
    event.preventDefault();
    startHomeWorkout(routineButton.dataset.homeRoutineOperation, {
      sessionType: "question-goal",
      questionTarget: 20,
      correctTarget: 5,
    });
    return;
  }

  const operationButton = event.target.closest("[data-home-operation]");
  if (operationButton) {
    event.preventDefault();
    startHomeWorkout(operationButton.dataset.homeOperation, {
      sessionType: "timed",
      timeLimitMinutes: 1,
    });
    return;
  }

  const lessonButton = event.target.closest("[data-home-lesson]");
  if (lessonButton) {
    event.preventDefault();
    const lessonId = lessonButton.dataset.homeLesson || "make-10";
    resetTechniqueState(state.technique.selectedTable, "addition-lesson");
    state.technique.selectedOperation = "addition";
    state.technique.additionLessonId = lessonId;
    state.technique.additionLesson = createAdditionLessonState(lessonId);
    renderTechniqueScreen();
    requestView("techniques");
  }
}

void initialise();
