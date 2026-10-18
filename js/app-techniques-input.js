function sanitiseTechniqueEntry(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function applyTechniqueInputColour(input) {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  if (input.name !== "techniqueAnswer" && !input.classList.contains("technique-inline-input")) {
    input.classList.remove("is-technique-colored");
    input.style.removeProperty("--technique-factor-stop");
    return;
  }

  const table = Number(state.technique.selectedTable || TECHNIQUE_TABLE);
  if (table !== TECHNIQUE_TABLE) {
    input.classList.remove("is-technique-colored");
    input.style.removeProperty("--technique-factor-stop");
    return;
  }

  const value = sanitiseTechniqueEntry(input.value);
  if (!value) {
    input.classList.remove("is-technique-colored");
    input.style.removeProperty("--technique-factor-stop");
    return;
  }

  const splitMode = String(input.dataset.techniqueSplitMode || "");
  const explicitFactorDigits = Math.max(1, Number(input.dataset.techniqueFactorDigits) || 1);
  let factorChars = 0;

  if (splitMode === "factor-plus-zero") {
    factorChars =
      value.length <= explicitFactorDigits
        ? value.length
        : Math.min(explicitFactorDigits, value.length - 1);
  } else {
    const trailingZeros = value.match(/0+$/)?.[0]?.length || 0;
    factorChars = Math.max(value.length - trailingZeros, 0);
  }
  const factorStop = value.length > 0 ? (factorChars / value.length) * 100 : 100;
  input.classList.add("is-technique-colored");
  input.style.setProperty("--technique-factor-stop", `${factorStop}%`);
}

function syncTechniqueInputColours() {
  const root = elements.techniqueScreenShell;
  if (!root) {
    return;
  }

  root
    .querySelectorAll('.technique-inline-input, input[name="techniqueAnswer"]')
    .forEach((input) => {
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      applyTechniqueInputColour(input);
    });
}

function updateTechniquePatternRow(name, value) {
  const factor = Number(name.replace("pattern-", ""));
  const row = getTechniquePatternRowByFactor(factor);
  if (!row) {
    return;
  }

  row.value = value;
  if (!value) {
    row.status = "idle";
  } else if (value === row.expected) {
    row.status = "correct";
  } else {
    row.status = "error";
  }

  if (isTechniquePatternComplete()) {
    state.technique.patternFeedback = {
      message: `Strong. The whole ${state.technique.selectedTable}x pattern is holding together.`,
      tone: "success",
    };
  } else {
    state.technique.patternFeedback = {
      message: "",
      tone: "",
    };
  }
}

function renderTechniquePatternProgress() {
  const root = elements.techniqueScreenShell;
  if (!root || state.technique.stage !== "pattern") {
    return;
  }

  state.technique.patternRows.forEach((row) => {
    const rowElement = root.querySelector(`[data-technique-pattern-row="${row.factor}"]`);
    if (!rowElement) {
      return;
    }

    rowElement.className = getTechniquePatternRowClasses(row);
    const input = rowElement.querySelector(`input[name="pattern-${row.factor}"]`);
    if (input) {
      const isWide = row.blank === "answer-full" || row.blank === "factor";
      input.className = getTechniquePatternInputClasses(row, isWide);
      applyTechniqueInputColour(input);
    }

    const signal = rowElement.querySelector(".technique-pattern-signal");
    if (signal) {
      signal.innerHTML = getTechniquePatternSignalMarkup(row);
    }
  });

  const feedback = root.querySelector("[data-technique-pattern-feedback]");
  if (feedback) {
    feedback.textContent = state.technique.patternFeedback.message;
  }

  const continueButton = root.querySelector('[data-technique-action="next-stage"]');
  if (continueButton instanceof HTMLButtonElement) {
    continueButton.disabled = !isTechniquePatternComplete();
  }
}

function submitGuidedTechniqueAnswer() {
  const question = state.technique.guidedQuestions[state.technique.guidedIndex];
  const answer = state.technique.guidedAnswer.trim();

  clearTechniqueAdvanceTimer();

  if (answer === `${question.answer}`) {
    state.technique.guidedSolved = true;
    state.technique.guidedHintVisible = false;
    state.technique.guidedFeedback = {
      message: "Correct.",
      tone: "success",
    };
    renderTechniqueScreen();
    state.techniqueAdvanceTimeoutId = window.setTimeout(() => {
      if (state.technique.guidedIndex >= state.technique.guidedQuestions.length - 1) {
        setTechniqueStage("quick-check");
      } else {
        state.technique.guidedIndex += 1;
      }

      state.technique.guidedAnswer = "";
      state.technique.guidedSolved = false;
      state.technique.guidedHintVisible = false;
      state.technique.guidedFeedback = { message: "", tone: "" };
      clearTechniqueAdvanceTimer();
      renderTechniqueScreen();
    }, TECHNIQUE_AUTO_ADVANCE_MS);
    return;
  }

  state.technique.guidedSolved = false;
  state.technique.guidedFeedback = {
    message: "Not quite. Try again.",
    tone: "error",
  };
  renderTechniqueScreen();
}

function submitQuickCheckAnswer() {
  const question = state.technique.quickCheckQuestion;
  const answer = state.technique.quickCheckAnswer.trim();
  clearTechniqueAdvanceTimer();

  if (answer === `${question.answer}`) {
    state.technique.quickCheckCorrect += 1;
    state.technique.quickCheckSolved = true;
    state.technique.quickCheckHintVisible = false;
    state.technique.quickCheckHintOffered = false;
    state.technique.quickCheckFeedback = {
      message:
        state.technique.quickCheckCorrect >= TECHNIQUE_COMPLETION_GOAL
          ? "Correct. Solo reps complete."
          : "Correct.",
      tone: "success",
    };

    if (state.technique.quickCheckCorrect >= TECHNIQUE_COMPLETION_GOAL) {
      markTechniqueCompleted(state.technique.selectedTable);
    }

    renderTechniqueScreen();
    state.techniqueAdvanceTimeoutId = window.setTimeout(() => {
      if (state.technique.quickCheckCorrect >= TECHNIQUE_COMPLETION_GOAL) {
        state.technique.mode = "celebration";
      } else {
        state.technique.quickCheckQuestion = createTechniqueQuestion(state.technique.selectedTable);
      }

      state.technique.quickCheckAnswer = "";
      state.technique.quickCheckSolved = false;
      state.technique.quickCheckHintVisible = false;
      state.technique.quickCheckHintOffered = false;
      state.technique.quickCheckFeedback = { message: "", tone: "" };
      clearTechniqueAdvanceTimer();
      renderTechniqueScreen();
    }, TECHNIQUE_AUTO_ADVANCE_MS);
    return;
  } else {
    state.technique.quickCheckAnswer = "";
    state.technique.quickCheckSolved = false;
    state.technique.quickCheckHintVisible = false;
    state.technique.quickCheckHintOffered = true;
    state.technique.quickCheckFeedback = {
      message: "Not quite. Try again.",
      tone: "error",
    };
  }

  renderTechniqueScreen();
}

function submitTechniquePracticeAnswer() {
  const question = state.technique.practiceQuestion;
  const answer = state.technique.practiceAnswer.trim();
  clearTechniqueAdvanceTimer();

  if (answer === `${question.answer}`) {
    state.technique.practiceSolved = true;
    state.technique.practiceHintVisible = false;
    state.technique.practiceFeedback = {
      message: "Correct.",
      tone: "success",
    };
    renderTechniqueScreen();
    state.techniqueAdvanceTimeoutId = window.setTimeout(() => {
      state.technique.practiceQuestion = createTechniqueQuestion(state.technique.selectedTable);
      state.technique.practiceAnswer = "";
      state.technique.practiceSolved = false;
      state.technique.practiceHintVisible = false;
      state.technique.practiceFeedback = { message: "", tone: "" };
      clearTechniqueAdvanceTimer();
      renderTechniqueScreen();
    }, TECHNIQUE_AUTO_ADVANCE_MS);
    return;
  } else {
    state.technique.practiceAnswer = "";
    state.technique.practiceSolved = false;
    state.technique.practiceFeedback = {
      message: "Not quite. Try again.",
      tone: "error",
    };
  }

  renderTechniqueScreen();
}

function handleTechniqueLessonSubmit(event) {
  const form = event.target;

  if (!(form instanceof HTMLFormElement) || !form.dataset.techniqueForm) {
    return;
  }

  event.preventDefault();

  if (form.dataset.techniqueForm === "pattern") {
    return;
  }

  if (form.dataset.techniqueForm === "guided") {
    submitGuidedTechniqueAnswer();
    return;
  }

  if (form.dataset.techniqueForm === "quick-check") {
    if (state.technique.quickCheckSolved) {
      return;
    }
    submitQuickCheckAnswer();
    return;
  }

  if (form.dataset.techniqueForm === "practice") {
    submitTechniquePracticeAnswer();
    return;
  }

  if (form.dataset.techniqueForm === "addition-practice") {
    submitAdditionLessonAnswer(state.technique.additionLesson?.answer || "");
    renderTechniqueScreen();
    return;
  }
}

function handleTechniqueInput(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  if (input.name.startsWith("pattern-")) {
    const nextValue = sanitiseTechniqueEntry(input.value);
    input.value = nextValue;
    applyTechniqueInputColour(input);
    state.technique.focusFieldName = input.name;
    updateTechniquePatternRow(input.name, nextValue);
    renderTechniquePatternProgress();
    return;
  }

  if (input.name !== "techniqueAnswer") {
    if (input.name === "additionLessonAnswer") {
      const nextValue = sanitiseTechniqueEntry(input.value);
      input.value = nextValue;
      ensureAdditionLessonState().answer = nextValue;
      return;
    }
    return;
  }

  const nextValue = sanitiseTechniqueEntry(input.value);
  input.value = nextValue;
  applyTechniqueInputColour(input);
  state.technique.focusFieldName = input.name;

  if (state.technique.mode === "practice") {
    state.technique.practiceAnswer = nextValue;
    return;
  }

  if (state.technique.stage === "guided") {
    state.technique.guidedAnswer = nextValue;
    return;
  }

  if (state.technique.stage === "quick-check") {
    if (state.technique.quickCheckSolved) {
      return;
    }
    clearTechniqueAdvanceTimer();
    state.technique.quickCheckAnswer = nextValue;
  }
}

function jumpToTechniqueStage(stage) {
  const targetIndex = getTechniqueStageIndex(stage);
  if (targetIndex < 0 || targetIndex > getMaxUnlockedTechniqueStageIndex()) {
    return;
  }
  clearTechniqueAdvanceTimer();
  setTechniqueStage(stage);
  renderTechniqueScreen();
}

function handleTechniqueAction(action) {
  clearTechniqueAdvanceTimer();

  if (action === "next-stage") {
    if (state.technique.stage === "pattern" && !isTechniquePatternComplete()) {
      return;
    }
    advanceTechniqueStage();
    renderTechniqueScreen();
    return;
  }

  if (action === "prev-stage") {
    retreatTechniqueStage();
    renderTechniqueScreen();
    return;
  }

  if (action === "show-guided-hint") {
    state.technique.guidedHintVisible = true;
    renderTechniqueScreen();
    return;
  }

  if (action === "show-quick-hint") {
    state.technique.quickCheckHintVisible = true;
    renderTechniqueScreen();
    return;
  }

  if (action === "next-quick") {
    if (state.technique.quickCheckCorrect >= TECHNIQUE_COMPLETION_GOAL) {
      state.technique.mode = "celebration";
    } else {
      state.technique.quickCheckQuestion = createTechniqueQuestion(state.technique.selectedTable);
      state.technique.quickCheckAnswer = "";
      state.technique.quickCheckSolved = false;
      state.technique.quickCheckHintVisible = false;
      state.technique.quickCheckHintOffered = false;
      state.technique.quickCheckFeedback = { message: "", tone: "" };
    }

    renderTechniqueScreen();
    return;
  }

  if (action === "show-practice-hint") {
    state.technique.practiceHintVisible = true;
    renderTechniqueScreen();
    return;
  }

  if (action === "next-practice") {
    state.technique.practiceQuestion = createTechniqueQuestion(state.technique.selectedTable);
    state.technique.practiceAnswer = "";
    state.technique.practiceSolved = false;
    state.technique.practiceHintVisible = false;
    state.technique.practiceFeedback = { message: "", tone: "" };
    renderTechniqueScreen();
    return;
  }

  if (action === "open-practice") {
    state.technique.mode = "practice";
    state.technique.practiceQuestion = createTechniqueQuestion(state.technique.selectedTable);
    state.technique.practiceAnswer = "";
    state.technique.practiceSolved = false;
    state.technique.practiceHintVisible = false;
    state.technique.practiceFeedback = { message: "", tone: "" };
    renderTechniqueScreen();
    return;
  }

  if (action === "back-to-techniques") {
    const selectedOperation = state.technique.selectedOperation;
    resetTechniqueState(state.technique.selectedTable, "menu", selectedOperation);
    renderTechniqueScreen();
    return;
  }

  if (action === "addition-next") {
    moveAdditionLessonFlow(1);
    renderTechniqueScreen();
    return;
  }

  if (action === "addition-back") {
    moveAdditionLessonFlow(-1);
    renderTechniqueScreen();
    return;
  }

  if (action === "addition-restart") {
    state.technique.additionLesson = createAdditionLessonState(state.technique.additionLessonId || "make-10");
    renderTechniqueScreen();
    return;
  }

  if (action === "start-addition-workout") {
    const plan = getAdditionLessonPlan(state.technique.additionLessonId || "make-10");
    const difficulties = Array.isArray(plan.workout?.difficulties) && plan.workout.difficulties.length
      ? plan.workout.difficulties
      : ["easy"];
    const snapshot = defaultSettingsSnapshot();
    applySettingsSnapshot(
      sanitiseSettingsSnapshot({
        ...snapshot,
        operation: "addition",
        sessionType: "question-goal",
        questionPreset: "custom",
        questionTarget: 20,
        additionDifficulty: difficulties[0],
        additionDifficulties: difficulties,
        additionRegrouping: plan.workout?.regrouping !== false,
      }),
    );
    toggleSetupFields();
    resetTechniqueState(state.technique.selectedTable, "menu", state.technique.selectedOperation);
    renderTechniqueScreen();
    showView("setup");
    return;
  }

  if (
    action === "addition-symbol-less" ||
    action === "addition-symbol-equal" ||
    action === "addition-symbol-greater"
  ) {
    const symbol =
      action === "addition-symbol-less"
        ? "<"
        : action === "addition-symbol-greater"
          ? ">"
          : "=";
    submitAdditionLessonAnswer(symbol);
    renderTechniqueScreen();
    return;
  }

  if (action === "back-to-setup") {
    resetTechniqueState(state.technique.selectedTable, "menu");
    renderTechniqueScreen();
    showView("setup");
    return;
  }

  if (action === "exit") {
    openTechniqueExitDialog("techniques");
  }
}

function handleTechniqueLessonClick(event) {
  const keypadButton = event.target.closest(".technique-keypad [data-keypad-key]");
  if (keypadButton instanceof HTMLButtonElement) {
    const input = elements.techniqueScreenShell?.querySelector(
      'input[name="techniqueAnswer"]:not([disabled]), input[name="additionLessonAnswer"]:not([disabled])',
    );
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const key = String(keypadButton.dataset.keypadKey || "");
    let nextValue = input.value;
    if (key === "backspace") {
      nextValue = nextValue.slice(0, -1);
    } else if (/^\d$/.test(key)) {
      nextValue = `${nextValue}${key}`;
    } else {
      return;
    }

    input.value = sanitiseTechniqueEntry(nextValue);
    applyTechniqueInputColour(input);
    input.focus();
    input.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  const additionStagePill = event.target.closest("[data-addition-stage-jump]");
  if (additionStagePill) {
    jumpToAdditionLessonStep(additionStagePill.dataset.additionStageJump);
    return;
  }

  const stagePill = event.target.closest("[data-technique-stage-jump]");
  if (stagePill) {
    jumpToTechniqueStage(stagePill.dataset.techniqueStageJump);
    return;
  }

  const actionButton = event.target.closest("[data-technique-action]");
  if (!actionButton) {
    return;
  }

  handleTechniqueAction(actionButton.dataset.techniqueAction);
}

function handleTechniqueLessonKeydown(event) {
  const additionStagePill = event.target.closest("[data-addition-stage-jump]");
  if (additionStagePill) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      jumpToAdditionLessonStep(additionStagePill.dataset.additionStageJump);
    }
    return;
  }

  const stagePill = event.target.closest("[data-technique-stage-jump]");
  if (!stagePill) {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    jumpToTechniqueStage(stagePill.dataset.techniqueStageJump);
  }
}

function handleTechniqueTableClick(event) {
  const operationShiftButton = event.target.closest("[data-technique-operation-shift]");
  if (operationShiftButton instanceof HTMLButtonElement) {
    const direction = Number(operationShiftButton.dataset.techniqueOperationShift || 0);
    if (!direction) {
      return;
    }
    const operationOptions = ["multiplication", "addition", "subtraction", "division"];
    const currentIndex = Math.max(0, operationOptions.indexOf(state.technique.selectedOperation));
    const nextIndex = (currentIndex + direction + operationOptions.length) % operationOptions.length;
    state.technique.selectedOperation = operationOptions[nextIndex];
    state.technique.mode = "menu";
    state.technique.additionLessonId = "";
    renderTechniqueScreen();
    return;
  }

  const multiplicationButton = event.target.closest("[data-technique-select]");
  if (multiplicationButton) {
    const table = Number(multiplicationButton.dataset.techniqueSelect);
    if (!isTechniqueAvailable(table)) {
      return;
    }

    resetTechniqueState(table, "lesson", "multiplication");
    renderTechniqueScreen();
    return;
  }

  const additionButton = event.target.closest("[data-addition-technique]");
  if (!additionButton) {
    return;
  }

  const lessonId = String(additionButton.dataset.additionTechnique || "");
  const lesson = ADDITION_LESSONS.find((item) => item.id === lessonId);
  if (!lesson || !lesson.selectable) {
    return;
  }

  state.technique.selectedOperation = "addition";
  state.technique.additionLessonId = lesson.id;
  state.technique.mode = "addition-lesson";
  state.technique.additionLesson = createAdditionLessonState(lesson.id);
  renderTechniqueScreen();
}

function handleTechniqueMenuChange(event) {
  const select = event.target.closest("[data-technique-operation-select]");
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }

  const selectedOperation = select.value;
  state.technique.selectedOperation =
    selectedOperation === "addition" ||
      selectedOperation === "multiplication" ||
      selectedOperation === "subtraction" ||
      selectedOperation === "division"
      ? selectedOperation
      : "";
  state.technique.mode = "menu";
  state.technique.additionLessonId = "";
  renderTechniqueScreen();
}
