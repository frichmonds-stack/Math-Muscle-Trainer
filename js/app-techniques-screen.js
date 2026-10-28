function renderTechniqueCelebrationScreen() {
  const plan = getMultiplicationLessonPlan(state.technique.selectedTable);
  return `
    <div class="technique-celebration-shell">
      <div class="technique-completion-card">
        <p class="section-kicker">Lesson Complete</p>
        <h2>${escapeHtml(plan.completeTitle)}</h2>
        <p class="technique-completion-copy">
          ${escapeHtml(plan.completeCopy)}
        </p>
        <div class="technique-completion-actions">
          <button class="ghost-button" type="button" data-technique-action="back-to-techniques">
            Learn More
          </button>
          <button class="ghost-button" type="button" data-technique-action="open-practice">
            Practice More
          </button>
          <button class="primary-button" type="button" data-technique-action="back-to-setup">
            Start Workout
          </button>
        </div>
      </div>
    </div>
  `;
}

function getTechniqueStageMarkup() {
  if (state.technique.stage === "rule") {
    return renderTechniqueRuleStage();
  }

  if (state.technique.stage === "switch") {
    return renderTechniqueSwitchStage();
  }

  if (state.technique.stage === "pattern") {
    return renderTechniquePatternStage();
  }

  if (state.technique.stage === "guided") {
    return renderTechniqueGuidedStage();
  }

  return renderTechniqueQuickCheckStage();
}

function focusTechniqueField() {
  const root = elements.techniqueScreenShell;
  if (!root) {
    return;
  }

  let target = null;

  if (state.technique.focusFieldName) {
    target = root.querySelector(`[name="${state.technique.focusFieldName}"]`);
  }

  if (!target) {
    target = root.querySelector("[data-technique-autofocus]");
  }

  if (target) {
    window.requestAnimationFrame(() => {
      target.focus();
      if (target.name === "techniqueAnswer" && typeof target.select === "function") {
        target.select();
      }
    });
  }
}

function renderTechniqueLessonScreen() {
  const stageMeta = getTechniqueStageMeta(state.technique.stage);

  return `
    <div class="technique-lesson-wrap">
      <div class="technique-lesson-head">
        <div>
          <p class="section-kicker">${stageMeta.kicker}</p>
          <h2>${stageMeta.title}</h2>
        </div>
      </div>
      <div class="technique-stage-pills">${getTechniqueStagePillsMarkup()}</div>
      ${getTechniqueStageMarkup()}
    </div>
  `;
}

function renderTechniqueScreen() {
  if (!elements.techniqueScreenShell) {
    return;
  }
  const isLessonMode =
    state.technique.mode === "lesson" || state.technique.mode === "addition-lesson";
  if (elements.techniqueExitNavButton) {
    elements.techniqueExitNavButton.classList.toggle("is-hidden", !isLessonMode);
  }

  if (state.technique.mode === "menu") {
    elements.techniqueScreenShell.innerHTML = renderTechniqueMenuScreen();
  } else if (state.technique.mode === "addition-lesson") {
    elements.techniqueScreenShell.innerHTML = renderAdditionTechniqueLessonScreen();
  } else if (state.technique.mode === "celebration") {
    elements.techniqueScreenShell.innerHTML = renderTechniqueCelebrationScreen();
  } else if (state.technique.mode === "practice") {
    elements.techniqueScreenShell.innerHTML = renderTechniquePracticeStage();
  } else {
    elements.techniqueScreenShell.innerHTML = renderTechniqueLessonScreen();
  }

  if (typeof refreshPageSwipers === "function") {
    refreshPageSwipers();
  }
  syncTechniqueInputColours();
  focusTechniqueField();
}

function openTechniqueExitDialog(targetView) {
  state.pendingTechniqueView = targetView;
  if (!elements.exitTechniqueDialog.open) {
    elements.exitTechniqueDialog.showModal();
  }
}

function getTechniqueKeypadMarkup() {
  return `
    <div class="practice-keypad technique-keypad" aria-label="Technique number pad">
      <button class="ghost-button" type="button" data-keypad-key="7">7</button>
      <button class="ghost-button" type="button" data-keypad-key="8">8</button>
      <button class="ghost-button" type="button" data-keypad-key="9">9</button>
      <button class="ghost-button" type="button" data-keypad-key="4">4</button>
      <button class="ghost-button" type="button" data-keypad-key="5">5</button>
      <button class="ghost-button" type="button" data-keypad-key="6">6</button>
      <button class="ghost-button" type="button" data-keypad-key="1">1</button>
      <button class="ghost-button" type="button" data-keypad-key="2">2</button>
      <button class="ghost-button" type="button" data-keypad-key="3">3</button>
      <button class="ghost-button keypad-sign-toggle" type="button" data-keypad-key="sign" disabled>&#177;</button>
      <button class="ghost-button" type="button" data-keypad-key="0">0</button>
      <button class="ghost-button" type="button" data-keypad-key="backspace">&#9003;</button>
    </div>
  `;
}

function getViewLabelForDialog(view) {
  if (view === "progress") {
    return "My Progress";
  }
  if (view === "techniques") {
    return "Learn Techniques";
  }
  return "Work Out";
}

function setEndWorkoutDialogContent(targetView = null) {
  const leavingToAnotherView = typeof targetView === "string" && targetView.length > 0;
  if (elements.endWorkoutDialogTitle) {
    elements.endWorkoutDialogTitle.textContent = leavingToAnotherView
      ? "Leave workout?"
      : "End workout?";
  }
  if (elements.endWorkoutDialogCopy) {
    elements.endWorkoutDialogCopy.textContent = leavingToAnotherView
      ? `Your results will be saved, then you'll move to ${getViewLabelForDialog(targetView)}.`
      : "Your results will be saved and this workout will finish.";
  }
  if (elements.endWorkoutDialogConfirmLabel) {
    elements.endWorkoutDialogConfirmLabel.textContent = "End Workout";
  }
}

function openEndWorkoutDialog(targetView = null) {
  state.pendingWorkoutView = typeof targetView === "string" ? targetView : null;
  setEndWorkoutDialogContent(state.pendingWorkoutView);
  if (!elements.endWorkoutDialog.open) {
    elements.endWorkoutDialog.showModal();
  }
}

function cancelTechniqueExit() {
  state.pendingTechniqueView = null;
  elements.exitTechniqueDialog.close();
}

function confirmTechniqueExit() {
  const targetView = state.pendingTechniqueView || "techniques";
  state.pendingTechniqueView = null;
  elements.exitTechniqueDialog.close();
  const selectedOperation = state.technique.selectedOperation;
  resetTechniqueState(state.technique.selectedTable, "menu", selectedOperation);
  renderTechniqueScreen();

  if (targetView !== "techniques") {
    showView(targetView);
  }
}

function requestView(targetView) {
  if (!targetView) {
    return;
  }

  if (state.active) {
    if (!viewMatchesButton(state.view, targetView)) {
      openEndWorkoutDialog(targetView);
    }
    return;
  }

  if (
    state.view === "techniques" &&
    ["lesson", "practice", "addition-lesson"].includes(state.technique.mode) &&
    targetView !== "techniques"
  ) {
    openTechniqueExitDialog(targetView);
    return;
  }

  if (targetView === "techniques" && state.view !== "techniques") {
    resetTechniqueState(state.technique.selectedTable, "menu");
    renderTechniqueScreen();
  }

  showView(targetView);
}

function viewMatchesButton(view, buttonTarget) {
  if (buttonTarget === "setup") {
    return ["setup", "countdown", "practice", "results"].includes(view);
  }

  return buttonTarget === view;
}

// Views that use the fit-to-screen layout (ADR-0019). Screens join as they are reworked; once
// every view is listed, the older scrolling rules in css/14-responsive.css can go.
const FIT_SCREEN_VIEWS = ["home", "setup", "techniques", "countdown", "practice", "results", "progress"];

function showView(view) {
  state.view = view;
  const isHomeView = view === "home";

  elements.screens.forEach((screen) => {
    const isActiveScreen = screen.dataset.view === view;
    screen.classList.toggle("is-active", isActiveScreen);
    screen.setAttribute("aria-hidden", isActiveScreen ? "false" : "true");
  });

  elements.pageShell?.classList.toggle("is-home-shell", isHomeView);
  elements.pageShell?.classList.toggle("is-fit-shell", FIT_SCREEN_VIEWS.includes(view));
  document.body.classList.toggle("is-focused-view", !isHomeView);

  elements.navButtons.forEach((button) => {
    const isActiveButton = viewMatchesButton(view, button.dataset.viewTarget);
    button.classList.toggle("is-active", isActiveButton);
    if (isActiveButton) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
    button.disabled = false;
  });

  if (elements.optionsButton) {
    elements.optionsButton.disabled = false;
  }

  if (typeof renderAppPageIndicator === "function") {
    renderAppPageIndicator();
  }
}

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  return (
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT" ||
    target.isContentEditable
  );
}

function closeOpenDialog() {
  if (elements.endWorkoutDialog.open) {
    elements.endWorkoutDialog.close();
    return true;
  }

  if (elements.optionsDialog.open) {
    elements.optionsDialog.close();
    return true;
  }

  if (elements.feedbackDialog?.open) {
    elements.feedbackDialog.close();
    return true;
  }

  if (elements.exitTechniqueDialog.open) {
    elements.exitTechniqueDialog.close();
    state.pendingTechniqueView = null;
    return true;
  }

  return false;
}

function handleGlobalKeydown(event) {
  if (event.defaultPrevented) {
    return;
  }

  if (event.key === "Escape") {
    if (closeOpenDialog()) {
      event.preventDefault();
      return;
    }

    if (
      !state.active &&
      state.view === "techniques" &&
      ["lesson", "practice", "addition-lesson"].includes(state.technique.mode)
    ) {
      event.preventDefault();
      openTechniqueExitDialog("techniques");
    }

    return;
  }

  if (
    state.active ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    isTypingTarget(event.target)
  ) {
    return;
  }

  if (state.view === "results") {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      shiftResultsCarousel(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      shiftResultsCarousel(1);
    }
    return;
  }

  if (state.view === "progress") {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      shiftProgressCarousel(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      shiftProgressCarousel(1);
    }
  }
}
