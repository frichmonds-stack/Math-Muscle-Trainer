async function resolveDisplayVersion() {
  function compareSemver(left, right) {
    const leftParts = String(left)
      .split(".")
      .map((part) => Number(part) || 0);
    const rightParts = String(right)
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
    const latest = releaseMatches.sort(compareSemver).at(-1);
    return latest ? `v${latest}` : APP_VERSION;
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
  elements.optionsCloseButton.addEventListener("click", () => {
    elements.optionsDialog.close();
  });
  elements.aboutCloseButton?.addEventListener("click", () => {
    elements.aboutDialog?.close();
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
}

void initialise();
