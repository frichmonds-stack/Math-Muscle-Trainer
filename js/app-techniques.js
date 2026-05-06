function setTechniqueStage(stage) {
  const stageIndex = getTechniqueStageIndex(stage);
  if (stageIndex < 0) {
    return;
  }

  state.technique.stage = stage;
  state.technique.maxStageReachedIndex = Math.max(
    state.technique.maxStageReachedIndex ?? 0,
    stageIndex,
  );
}

function advanceTechniqueStage() {
  const currentIndex = getTechniqueStageIndex(state.technique.stage);
  const nextStep = TECHNIQUE_STEPS[currentIndex + 1];
  if (nextStep) {
    setTechniqueStage(nextStep.id);
  }
}

function retreatTechniqueStage() {
  const currentIndex = getTechniqueStageIndex(state.technique.stage);
  const previousStep = TECHNIQUE_STEPS[currentIndex - 1];
  if (previousStep) {
    setTechniqueStage(previousStep.id);
  }
}

function isTechniqueAvailable(table) {
  return table === TECHNIQUE_TABLE;
}

function clearTechniqueAdvanceTimer() {
  window.clearTimeout(state.techniqueAdvanceTimeoutId);
  state.techniqueAdvanceTimeoutId = null;
}

function getTechniqueProgressRecord(table) {
  return {
    completed: false,
    completedAt: null,
    ...(state.progress.techniques?.[table] || {}),
  };
}

function markTechniqueCompleted(table) {
  state.progress.techniques = state.progress.techniques || {};
  state.progress.techniques[table] = {
    completed: true,
    completedAt: Date.now(),
  };
  saveProgress();
}

function resetTechniqueState(table = TECHNIQUE_TABLE, mode = "menu", selectedOperation = "addition") {
  clearTechniqueAdvanceTimer();
  state.technique = createTechniqueState(table, mode);
  state.technique.selectedOperation = selectedOperation;
}

function getMaxUnlockedTechniqueStageIndex() {
  return Math.max(
    getTechniqueStageIndex(state.technique.stage),
    Number(state.technique.maxStageReachedIndex ?? 0),
  );
}

function getTechniqueHintMarkup(question) {
  const factorMarkup =
    question.otherFactor === TECHNIQUE_TABLE
      ? `<strong>${escapeHtml(question.otherFactor)}</strong>`
      : `<strong class="technique-factor">${escapeHtml(question.otherFactor)}</strong>`;
  return `Take ${factorMarkup} and place a zero next to it.`;
}

function getTechniqueFactorDigitsForQuestion(question) {
  return String(question?.otherFactor ?? "").replace(/[^\d]/g, "").length || 1;
}

function getTechniqueCardStatus(table) {
  if (!isTechniqueAvailable(table)) {
    return {
      classes: "",
      pill: "Coming Soon",
      note: "Coming soon.",
    };
  }

  const progress = getTechniqueProgressRecord(table);
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
    note: "Learn the 10x shortcut.",
  };
}

function getTechniqueTableGridMarkup() {
  return TABLE_FACTORS.map((factor) => {
    const available = isTechniqueAvailable(factor);
    const status = getTechniqueCardStatus(factor);

    return `
      <button
        class="technique-card${status.classes}"
        type="button"
        data-technique-select="${factor}"
        ${available ? "" : "disabled"}
      >
        ${status.pill ? `<span class="technique-card-pill">${status.pill}</span>` : ""}
        <strong>x ${factor}</strong>
        <span class="technique-card-note">${status.note}</span>
      </button>
    `;
  }).join("");
}

function getTechniqueStagePillsMarkup() {
  const activeIndex = getTechniqueStageIndex(state.technique.stage);
  const maxUnlockedIndex = getMaxUnlockedTechniqueStageIndex();

  return TECHNIQUE_STEPS.map((step, index) => {
    const isActive = index === activeIndex;
    const isUnlocked = index <= maxUnlockedIndex;
    const classes = ["technique-stage-pill"];
    if (isActive) {
      classes.push("is-active");
    } else if (isUnlocked) {
      classes.push("is-unlocked");
    } else {
      classes.push("is-locked");
    }

    const attrs = isUnlocked && !isActive
      ? `data-technique-stage-jump="${step.id}" tabindex="0" role="button" aria-label="Go to ${escapeHtml(step.label)}"`
      : "";
    const lockMarkup = isUnlocked
      ? ""
      : `
          <span class="technique-stage-lock" aria-hidden="true">
            <svg viewBox="0 0 16 16" role="presentation">
              <path d="M5.25 6V4.8a2.75 2.75 0 1 1 5.5 0V6" />
              <rect x="3.3" y="6" width="9.4" height="7.7" rx="1.8" ry="1.8" />
            </svg>
          </span>
        `;

    return `
      <span class="${classes.join(" ")}" ${attrs}>
        <span>${step.label}</span>
        ${lockMarkup}
      </span>
    `;
  }).join("");
}

function getTechniquePatternRowByFactor(factor) {
  return state.technique.patternRows.find((row) => row.factor === factor);
}

function isTechniquePatternComplete() {
  return state.technique.patternRows
    .filter((row) => row.blank)
    .every((row) => row.status === "correct");
}

function getTechniquePatternSignalMarkup(row) {
  return getTechniqueStatusIconMarkup(row.status);
}

function getTechniqueStatusIconMarkup(status, extraClass = "") {
  const classes = ["technique-status-icon"];
  if (extraClass) {
    classes.push(extraClass);
  }

  if (status === "correct") {
    classes.push("is-correct");
    return `
      <span class="${classes.join(" ")}" aria-label="Correct">
        <svg viewBox="0 0 16 16" role="presentation">
          <path d="M3.2 8.4 6.6 11.8 12.8 5.6" />
        </svg>
      </span>
    `;
  }

  if (status === "error") {
    classes.push("is-error");
    return `
      <span class="${classes.join(" ")}" aria-label="Try again">
        <svg viewBox="0 0 16 16" role="presentation">
          <path d="M4.6 4.6 11.4 11.4 M11.4 4.6 4.6 11.4" />
        </svg>
      </span>
    `;
  }

  return `<span class="${classes.join(" ")}" aria-hidden="true"></span>`;
}

function getTechniquePatternRowClasses(row) {
  const classes = ["technique-pattern-row"];
  if (row.status === "correct") {
    classes.push("is-correct");
  } else if (row.status === "error") {
    classes.push("is-error");
  }
  return classes.join(" ");
}

function getTechniquePatternInputClasses(row, isWide = false) {
  const classes = ["technique-inline-input"];
  if (isWide) {
    classes.push("is-wide");
  }
  if (row.status === "correct") {
    classes.push("is-correct");
  } else if (row.status === "error") {
    classes.push("is-error");
  }
  return classes.join(" ");
}

function getTechniquePatternRowMarkup(row) {
  const autofocus =
    state.technique.focusFieldName === `pattern-${row.factor}` ? 'data-technique-autofocus="true"' : "";

  if (row.blank === "answer-stem") {
    return `
      <div class="${getTechniquePatternRowClasses(row)}" data-technique-pattern-row="${row.factor}">
        <span>${formatTechniqueCarryValue(row.factor)} x ${formatTechniqueNumber(TECHNIQUE_TABLE)} =</span>
        <input
          class="${getTechniquePatternInputClasses(row)}"
          type="text"
          name="pattern-${row.factor}"
          inputmode="numeric"
          pattern="[0-9]*"
          value="${escapeHtml(row.value)}"
          aria-label="Missing digits before the zero in ${row.factor} times 10"
          ${autofocus}
        />
        <span><span class="technique-zero">0</span></span>
        <span class="technique-pattern-signal">${getTechniquePatternSignalMarkup(row)}</span>
      </div>
    `;
  }

  if (row.blank === "answer-full") {
    return `
      <div class="${getTechniquePatternRowClasses(row)}" data-technique-pattern-row="${row.factor}">
        <span>${formatTechniqueCarryValue(row.factor)} x ${formatTechniqueNumber(TECHNIQUE_TABLE)} =</span>
        <input
          class="${getTechniquePatternInputClasses(row, true)}"
          type="text"
          name="pattern-${row.factor}"
          inputmode="numeric"
          pattern="[0-9]*"
          value="${escapeHtml(row.value)}"
          data-technique-factor-digits="${String(row.factor).length}"
          data-technique-split-mode="factor-plus-zero"
          aria-label="Missing answer in ${row.factor} times 10"
          ${autofocus}
        />
        <span class="technique-pattern-signal">${getTechniquePatternSignalMarkup(row)}</span>
      </div>
    `;
  }

  if (row.blank === "factor") {
    return `
      <div class="${getTechniquePatternRowClasses(row)}" data-technique-pattern-row="${row.factor}">
        <input
          class="${getTechniquePatternInputClasses(row, true)}"
          type="text"
          name="pattern-${row.factor}"
          inputmode="numeric"
          pattern="[0-9]*"
          value="${escapeHtml(row.value)}"
          aria-label="Missing factor in the ${row.factor} times 10 fact"
          ${autofocus}
        />
        <span>x ${formatTechniqueNumber(TECHNIQUE_TABLE)} = ${formatTechniqueAnswerValue(
          row.factor * TECHNIQUE_TABLE,
          row.factor,
        )}</span>
        <span class="technique-pattern-signal">${getTechniquePatternSignalMarkup(row)}</span>
      </div>
    `;
  }

  if (row.blank === "table") {
    return `
      <div class="${getTechniquePatternRowClasses(row)}" data-technique-pattern-row="${row.factor}">
        <span>${formatTechniqueCarryValue(row.factor)} x</span>
        <input
          class="${getTechniquePatternInputClasses(row)}"
          type="text"
          name="pattern-${row.factor}"
          inputmode="numeric"
          pattern="[0-9]*"
          value="${escapeHtml(row.value)}"
          aria-label="Missing 10 factor in the ${row.factor} times 10 fact"
          ${autofocus}
        />
        <span>= ${formatTechniqueAnswerValue(row.factor * TECHNIQUE_TABLE, row.factor)}</span>
        <span class="technique-pattern-signal">${getTechniquePatternSignalMarkup(row)}</span>
      </div>
    `;
  }

  return `
    <div class="${getTechniquePatternRowClasses(row)}" data-technique-pattern-row="${row.factor}">
      <span>${formatTechniqueCarryValue(row.factor)} x ${formatTechniqueNumber(TECHNIQUE_TABLE)} = ${formatTechniqueAnswerValue(
        row.factor * TECHNIQUE_TABLE,
        row.factor,
      )}</span>
    </div>
  `;
}

function getTechniqueStageMeta(stage) {
  switch (stage) {
    case "rule":
      return {
        kicker: "10x Technique",
        title: "Place the Zero.",
      };
    case "switch":
      return {
        kicker: "10x Technique",
        title: "The order can flip.",
      };
    case "pattern":
      return {
        kicker: "10x Technique",
        title: "Warm Up.",
      };
    case "guided":
      return {
        kicker: "10x Technique",
        title: "Try it with support.",
      };
    case "quick-check":
      return {
        kicker: "10x Technique",
        title: "Show it on your own.",
      };
    default:
      return {
        kicker: "10x Technique",
        title: "Keep the 10x table feeling easy.",
      };
  }
}

function renderTechniqueMenuScreen() {
  const selectedOperation = state.technique.selectedOperation;
  const selectedOperationLabel =
    selectedOperation === "addition"
      ? "Addition"
      : selectedOperation === "multiplication"
        ? "Multiplication"
        : "Select an operation";
  let bodyMarkup = "";

  if (selectedOperation === "multiplication") {
    bodyMarkup = `
      <div class="technique-table-grid">${getTechniqueTableGridMarkup()}</div>
    `;
  } else if (selectedOperation === "addition") {
    bodyMarkup = `
      <div class="technique-table-grid">${getAdditionTechniqueGridMarkup()}</div>
    `;
  }

  return `
    <div class="technique-menu-shell">
      <div class="technique-menu-head technique-menu-head-compact">
        <div class="technique-menu-title-block">
          <h2>Techniques</h2>
          <p class="techniques-copy">Learn mental mathematics techniques to improve accuracy and speed.</p>
          <div class="facts-selector-row technique-selector-row" aria-label="Technique controls">
            <div class="fact-carousel-selector progress-inline-selector" aria-label="Technique operation">
              <button class="fact-range-button" type="button" data-technique-operation-shift="-1" aria-label="Previous operation">&#8249;</button>
              <span class="fact-carousel-label">${selectedOperationLabel}</span>
              <button class="fact-range-button" type="button" data-technique-operation-shift="1" aria-label="Next operation">&#8250;</button>
            </div>
          </div>
        </div>
      </div>

      ${bodyMarkup}
    </div>
  `;
}

function renderTechniqueRuleStage() {
  return `
    <section class="technique-lesson-card">
      <p class="technique-helper">
        When multiplying a number by ${formatTechniqueNumber(
          TECHNIQUE_TABLE,
        )}, place a zero next to the number.
      </p>
      <div class="technique-rule-grid">
        <article class="technique-example-card">
          <p class="technique-equation">${formatTechniqueFactorValue(7)} x ${formatTechniqueNumber(TECHNIQUE_TABLE)} = ${formatTechniqueAnswerValue(70, 7)}</p>
          <p class="technique-caption">Keep the ${formatTechniqueFactorValue(7)}. Place the zero next to it.</p>
        </article>
        <article class="technique-example-card">
          <p class="technique-equation">${formatTechniqueFactorValue(12)} x ${formatTechniqueNumber(TECHNIQUE_TABLE)} = ${formatTechniqueAnswerValue(120, 12)}</p>
          <p class="technique-caption">The ${formatTechniqueFactorValue(12)} stays. The zero goes after it.</p>
        </article>
      </div>
      <div class="technique-action-row technique-action-row-end">
        <button class="primary-button" type="button" data-technique-action="next-stage">
          Continue
        </button>
      </div>
    </section>
  `;
}

function renderTechniqueSwitchStage() {
  return `
    <section class="technique-lesson-card">
      <p class="technique-helper">
        It doesn't matter which way the fact is written, we can still use the same technique.
      </p>
      <div class="technique-switch-grid">
        <article class="technique-switch-card">
          <p class="technique-equation">${formatTechniqueFactorValue(6)} x ${formatTechniqueNumber(TECHNIQUE_TABLE)} = ${formatTechniqueAnswerValue(60, 6)}</p>
          <p class="technique-caption">Start with the ${formatTechniqueFactorValue(6)}. Then place the zero.</p>
        </article>
        <article class="technique-switch-card">
          <p class="technique-equation">${formatTechniqueNumber(TECHNIQUE_TABLE)} x ${formatTechniqueFactorValue(6)} = ${formatTechniqueAnswerValue(60, 6)}</p>
          <p class="technique-caption">The 6 is still the number that matters.</p>
        </article>
        <article class="technique-switch-card">
          <p class="technique-equation">${formatTechniqueFactorValue(9)} x ${formatTechniqueNumber(TECHNIQUE_TABLE)} = ${formatTechniqueAnswerValue(90, 9)}</p>
          <p class="technique-caption">Same idea.</p>
        </article>
        <article class="technique-switch-card">
          <p class="technique-equation">${formatTechniqueNumber(TECHNIQUE_TABLE)} x ${formatTechniqueFactorValue(9)} = ${formatTechniqueAnswerValue(90, 9)}</p>
          <p class="technique-caption">Same answer.</p>
        </article>
      </div>
      <div class="technique-action-row">
        <button class="ghost-button" type="button" data-technique-action="prev-stage">
          Back
        </button>
        <button class="primary-button" type="button" data-technique-action="next-stage">
          Continue
        </button>
      </div>
    </section>
  `;
}

function renderTechniquePatternStage() {
  return `
    <section class="technique-lesson-card">
      <p class="technique-helper">
        Fill in the blanks to make each fact true.
      </p>
      <div class="technique-pattern-grid">
        ${state.technique.patternRows.map(getTechniquePatternRowMarkup).join("")}
      </div>
      <p class="sr-only" aria-live="polite" data-technique-pattern-feedback>
        ${state.technique.patternFeedback.message}
      </p>
      <div class="technique-action-row">
        <button class="ghost-button" type="button" data-technique-action="prev-stage">
          Back
        </button>
        <div class="technique-side-actions">
          <button
            class="primary-button"
            type="button"
            data-technique-action="next-stage"
            ${isTechniquePatternComplete() ? "" : "disabled"}
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderTechniqueGuidedStage() {
  const question = state.technique.guidedQuestions[state.technique.guidedIndex];
  const feedback = state.technique.guidedFeedback;
  const answerState = state.technique.guidedSolved
    ? "correct"
    : feedback.tone === "error"
      ? "error"
      : "idle";
  const factorDigits = getTechniqueFactorDigitsForQuestion(question);

  return `
    <form class="technique-lesson-card technique-question-shell technique-practice-shell" data-technique-form="guided" autocomplete="off">
      <div class="technique-question-meta">
        <span class="technique-progress-copy">Assisted rep ${
          state.technique.guidedIndex + 1
        } of ${state.technique.guidedQuestions.length}</span>
      </div>
      <div class="problem-wrap technique-practice-problem">
        <p class="technique-question">${formatTechniqueEquation(question)} = ?</p>
      </div>
      <div class="technique-input-row technique-practice-input-row">
        <div class="technique-answer-wrap ${
          answerState === "correct" ? "is-correct" : answerState === "error" ? "is-error" : ""
        }">
          <label class="answer-field">
            <span class="sr-only">Technique answer</span>
            <input
              type="text"
              name="techniqueAnswer"
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder="Type the full answer"
              value="${escapeHtml(state.technique.guidedAnswer)}"
              data-technique-factor-digits="${factorDigits}"
              data-technique-split-mode="factor-plus-zero"
              ${state.technique.guidedSolved ? "disabled" : ""}
              data-technique-autofocus="true"
            />
          </label>
          <span class="technique-answer-signal">
            ${getTechniqueStatusIconMarkup(answerState, "technique-status-icon-inline")}
          </span>
        </div>
        <button class="primary-button" type="submit" ${state.technique.guidedSolved ? "disabled" : ""}>
          Check Answer
        </button>
      </div>
      ${state.useTouchKeypad ? getTechniqueKeypadMarkup() : ""}
      ${
        state.technique.guidedHintVisible
          ? `<div class="technique-hint">${getTechniqueHintMarkup(question)}</div>`
          : ""
      }
      <p class="technique-feedback ${feedback.tone}">${feedback.message}</p>
      <p class="sr-only" aria-live="polite">${feedback.message}</p>
      <div class="technique-action-row">
        <button class="ghost-button" type="button" data-technique-action="prev-stage">
          Back
        </button>
        <div class="technique-side-actions">
          ${
            !state.technique.guidedHintVisible && !state.technique.guidedSolved
              ? `
                <button class="ghost-button" type="button" data-technique-action="show-guided-hint">
                  Show Hint
                </button>
              `
              : ""
          }
        </div>
      </div>
    </form>
  `;
}

function renderTechniqueQuickCheckStage() {
  const question = state.technique.quickCheckQuestion;
  const feedback = state.technique.quickCheckFeedback;
  const answerState = state.technique.quickCheckSolved
    ? "correct"
    : feedback.tone === "error"
      ? "error"
      : "idle";
  const hintAvailable =
    state.technique.quickCheckHintVisible || state.technique.quickCheckHintOffered;
  const factorDigits = getTechniqueFactorDigitsForQuestion(question);

  return `
    <form class="technique-lesson-card technique-question-shell technique-practice-shell" data-technique-form="quick-check" autocomplete="off">
      <div class="technique-question-meta">
        <span class="technique-progress-copy">Correct answers: ${
          state.technique.quickCheckCorrect
        } / ${TECHNIQUE_COMPLETION_GOAL}</span>
      </div>
      <div class="problem-wrap technique-practice-problem">
        <p class="technique-question">${formatTechniqueEquation(question)} = ?</p>
      </div>
      <div class="technique-input-row technique-practice-input-row">
        <div class="technique-answer-wrap ${
          answerState === "correct" ? "is-correct" : answerState === "error" ? "is-error" : ""
        }">
          <label class="answer-field">
            <span class="sr-only">Solo reps answer</span>
            <input
              type="text"
              name="techniqueAnswer"
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder="Type the full answer"
              value="${escapeHtml(state.technique.quickCheckAnswer)}"
              data-technique-factor-digits="${factorDigits}"
              data-technique-split-mode="factor-plus-zero"
              ${state.technique.quickCheckSolved ? "disabled" : ""}
              data-technique-autofocus="true"
            />
          </label>
          <span class="technique-answer-signal">
            ${getTechniqueStatusIconMarkup(answerState, "technique-status-icon-inline")}
          </span>
        </div>
        <button class="primary-button" type="submit" ${state.technique.quickCheckSolved ? "disabled" : ""}>
          Check Answer
        </button>
      </div>
      ${state.useTouchKeypad ? getTechniqueKeypadMarkup() : ""}
      ${
        state.technique.quickCheckHintVisible
          ? `<div class="technique-hint">${getTechniqueHintMarkup(question)}</div>`
          : ""
      }
      <p class="technique-feedback ${feedback.tone}">${feedback.message}</p>
      <p class="sr-only" aria-live="polite">${feedback.message}</p>
      <div class="technique-action-row">
        <button class="ghost-button" type="button" data-technique-action="prev-stage">
          Back
        </button>
        <div class="technique-side-actions">
          ${
            hintAvailable && !state.technique.quickCheckSolved && !state.technique.quickCheckHintVisible
              ? `
                <button class="ghost-button" type="button" data-technique-action="show-quick-hint">
                  Hint
                </button>
              `
              : ""
          }
        </div>
      </div>
    </form>
  `;
}

function renderTechniquePracticeStage() {
  const question = state.technique.practiceQuestion;
  const feedback = state.technique.practiceFeedback;
  const factorDigits = getTechniqueFactorDigitsForQuestion(question);
  const answerState = state.technique.practiceSolved
    ? "correct"
    : feedback.tone === "error"
      ? "error"
      : "idle";

  return `
    <div class="technique-lesson-wrap">
      <div class="technique-lesson-head">
        <div>
          <p class="section-kicker">Practice More</p>
          <h2>Keep the 10x table feeling easy.</h2>
        </div>
        <button class="ghost-button subtle-button" type="button" data-technique-action="back-to-techniques">
          Back to Techniques
        </button>
      </div>

      <form class="technique-lesson-card technique-question-shell technique-practice-shell" data-technique-form="practice" autocomplete="off">
        <div class="technique-question-meta">
          <span class="technique-progress-copy">Questions can flip either way now.</span>
        </div>
        <div class="problem-wrap technique-practice-problem">
          <p class="technique-question">${formatTechniqueEquation(question)} = ?</p>
        </div>
        <div class="technique-input-row technique-practice-input-row">
          <div class="technique-answer-wrap ${
            answerState === "correct" ? "is-correct" : answerState === "error" ? "is-error" : ""
          }">
            <label class="answer-field">
              <span class="sr-only">Practice answer</span>
              <input
                type="text"
                name="techniqueAnswer"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="Type the full answer"
                value="${escapeHtml(state.technique.practiceAnswer)}"
                data-technique-factor-digits="${factorDigits}"
                data-technique-split-mode="factor-plus-zero"
                data-technique-autofocus="true"
              />
            </label>
            <span class="technique-answer-signal">
              ${getTechniqueStatusIconMarkup(answerState, "technique-status-icon-inline")}
            </span>
          </div>
          <button class="primary-button" type="submit">
            Check Answer
          </button>
        </div>
        ${state.useTouchKeypad ? getTechniqueKeypadMarkup() : ""}
        ${
          state.technique.practiceHintVisible
            ? `<div class="technique-hint">${getTechniqueHintMarkup(question)}</div>`
            : ""
        }
        <p class="technique-feedback ${feedback.tone}">${feedback.message}</p>
        <div class="technique-action-row">
          ${
            !state.technique.practiceHintVisible
              ? `
                <button class="ghost-button" type="button" data-technique-action="show-practice-hint">
                  Hint
                </button>
              `
              : '<span class="technique-progress-copy">Use the hint when you want a quick reminder.</span>'
          }
          <div class="technique-side-actions">
            ${
              state.technique.practiceSolved
                ? `
                  <button class="primary-button" type="button" data-technique-action="next-practice">
                    Next Practice Question
                  </button>
                `
                : ""
            }
          </div>
        </div>
      </form>
    </div>
  `;
}

const MAKE10_FLOW = [
  { id: "idea-1", label: "Idea 1" },
  { id: "practice-1", label: "Practice 1" },
  { id: "idea-2", label: "Idea 2" },
  { id: "practice-2", label: "Practice 2" },
  { id: "idea-3", label: "Idea 3" },
  { id: "practice-3", label: "Practice 3" },
  { id: "complete", label: "Complete" },
];
const MAKE10_PRACTICE_QUESTION_COUNT = 10;

function createMake10Question(flowStepId, questionIndex = 0) {
  if (flowStepId === "practice-1") {
    const left = Math.floor(Math.random() * 10);
    return {
      prompt: `${left} + ? = 10`,
      expected: `${10 - left}`,
    };
  }

  if (flowStepId === "practice-2") {
    const value = Math.floor(Math.random() * 10);
    return {
      prompt: `10 - ${value} = ?`,
      expected: `${10 - value}`,
    };
  }

  const symbolTarget = ["<", "=", ">"][questionIndex % 3];
  let left = 0;
  let right = 0;
  if (symbolTarget === "=") {
    left = Math.floor(Math.random() * 10);
    right = 10 - left;
  } else if (symbolTarget === "<") {
    left = Math.floor(Math.random() * 8);
    right = Math.floor(Math.random() * (9 - left));
  } else {
    left = 1 + Math.floor(Math.random() * 9);
    right = Math.max(1, 11 - left + Math.floor(Math.random() * left));
  }
  const total = left + right;
  return {
    prompt: `${left} + ${right}`,
    total,
    expected: total < 10 ? "<" : total > 10 ? ">" : "=",
  };
}

function createMake10LessonState() {
  return {
    flowIndex: 0,
    questionIndex: 0,
    correctCount: 0,
    answer: "",
    feedback: "",
    tone: "",
    currentQuestion: null,
    lastPracticeScore: null,
  };
}

function ensureMake10LessonState() {
  if (!state.technique.make10Lesson) {
    state.technique.make10Lesson = createMake10LessonState();
  }
  return state.technique.make10Lesson;
}

function getMake10Step() {
  const lessonState = ensureMake10LessonState();
  return MAKE10_FLOW[lessonState.flowIndex] || MAKE10_FLOW[0];
}

function beginMake10Practice(stepId) {
  const lessonState = ensureMake10LessonState();
  lessonState.questionIndex = 0;
  lessonState.correctCount = 0;
  lessonState.answer = "";
  lessonState.feedback = "";
  lessonState.tone = "";
  lessonState.currentQuestion = createMake10Question(stepId, lessonState.questionIndex);
}

function moveMake10Flow(direction) {
  const lessonState = ensureMake10LessonState();
  const nextIndex = Math.max(0, Math.min(MAKE10_FLOW.length - 1, lessonState.flowIndex + direction));
  if (nextIndex === lessonState.flowIndex) {
    return;
  }

  lessonState.flowIndex = nextIndex;
  lessonState.answer = "";
  lessonState.feedback = "";
  lessonState.tone = "";

  const stepId = MAKE10_FLOW[nextIndex].id;
  if (stepId === "practice-1" || stepId === "practice-2" || stepId === "practice-3") {
    beginMake10Practice(stepId);
  } else {
    lessonState.currentQuestion = null;
  }
}

function advanceMake10AfterPractice() {
  const lessonState = ensureMake10LessonState();
  lessonState.lastPracticeScore = lessonState.correctCount;
  lessonState.flowIndex = Math.min(MAKE10_FLOW.length - 1, lessonState.flowIndex + 1);
  lessonState.answer = "";
  lessonState.feedback = "";
  lessonState.tone = "";
  lessonState.currentQuestion = null;
}

function submitMake10Answer(rawAnswer) {
  const lessonState = ensureMake10LessonState();
  const stepId = getMake10Step().id;
  if (!lessonState.currentQuestion) {
    return;
  }

  const expected = lessonState.currentQuestion.expected;
  const submitted = String(rawAnswer ?? "").trim();
  if (!submitted) {
    lessonState.feedback = "Type an answer first.";
    lessonState.tone = "error";
    return;
  }

  const isCorrect = submitted === expected;
  if (isCorrect) {
    lessonState.correctCount += 1;
  }

  lessonState.questionIndex += 1;
  const isComplete = lessonState.questionIndex >= MAKE10_PRACTICE_QUESTION_COUNT;

  if (isComplete) {
    lessonState.feedback = "";
    lessonState.tone = "";
    advanceMake10AfterPractice();
    return;
  }

  lessonState.feedback = isCorrect
    ? "Correct."
    : `Not quite. Correct answer: ${expected}`;
  lessonState.tone = isCorrect ? "success" : "error";
  lessonState.answer = "";
  lessonState.currentQuestion = createMake10Question(stepId, lessonState.questionIndex);
}

function getMake10FlowPillsMarkup() {
  const lessonState = ensureMake10LessonState();
  return MAKE10_FLOW.map((step, index) => {
    const isActive = index === lessonState.flowIndex;
    const isUnlocked = index <= lessonState.flowIndex;
    const classes = ["technique-stage-pill"];
    if (isActive) {
      classes.push("is-active");
    } else if (isUnlocked) {
      classes.push("is-unlocked");
    } else {
      classes.push("is-locked");
    }

    const attrs = isUnlocked && !isActive
      ? `data-technique-stage-jump="${step.id}" tabindex="0" role="button" aria-label="Go to ${escapeHtml(step.label)}"`
      : "";
    const lockMarkup = isUnlocked
      ? ""
      : `
          <span class="technique-stage-lock" aria-hidden="true">
            <svg viewBox="0 0 16 16" role="presentation">
              <path d="M5.25 6V4.8a2.75 2.75 0 1 1 5.5 0V6" />
              <rect x="3.3" y="6" width="9.4" height="7.7" rx="1.8" ry="1.8" />
            </svg>
          </span>
        `;

    return `
      <span class="${classes.join(" ")}" ${attrs}>
        <span>${step.label}</span>
        ${lockMarkup}
      </span>
    `;
  }).join("");
}

function renderMake10IdeaBlock(title, copy, examples, primaryLabel = "Continue") {
  return `
    <section class="technique-lesson-card make10-idea-card">
      <p class="technique-helper">${copy}</p>
      <div class="technique-rule-grid">
        ${examples
          .map(
            (example) => `
              <article class="technique-example-card">
                <p class="technique-equation">${example}</p>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="technique-action-row">
        <button class="ghost-button" type="button" data-technique-action="make10-back">
          Back
        </button>
        <button class="primary-button" type="button" data-technique-action="make10-next">
          ${primaryLabel}
        </button>
      </div>
    </section>
  `;
}

function renderMake10NumericPractice() {
  const lessonState = ensureMake10LessonState();
  const stepId = getMake10Step().id;
  const prompt = lessonState.currentQuestion?.prompt || "";
  const answerState = lessonState.tone === "success" ? "correct" : lessonState.tone === "error" ? "error" : "idle";

  return `
    <form class="technique-lesson-card technique-question-shell technique-practice-shell" data-technique-form="${stepId}" autocomplete="off">
      <div class="problem-wrap technique-practice-problem">
        <p class="technique-question">${prompt}</p>
      </div>
      <div class="technique-input-row technique-practice-input-row">
        <div class="technique-answer-wrap ${
          answerState === "correct" ? "is-correct" : answerState === "error" ? "is-error" : ""
        }">
          <label class="answer-field">
            <span class="sr-only">Lesson answer</span>
            <input
              type="text"
              name="make10Answer"
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder="Type your answer"
              value="${escapeHtml(lessonState.answer)}"
              data-technique-autofocus="true"
            />
          </label>
          <span class="technique-answer-signal">
            ${getTechniqueStatusIconMarkup(answerState, "technique-status-icon-inline")}
          </span>
        </div>
        <button class="primary-button" type="submit">Check Answer</button>
      </div>
      ${state.useTouchKeypad ? getTechniqueKeypadMarkup() : ""}
      <p class="technique-feedback ${lessonState.tone}">${lessonState.feedback}</p>
    </form>
  `;
}

function renderMake10ComparePractice() {
  const lessonState = ensureMake10LessonState();
  const prompt = lessonState.currentQuestion?.prompt || "";
  const total = lessonState.currentQuestion?.total;
  const compactPrompt = Number.isFinite(total) ? `${total}` : "";

  return `
    <section class="technique-lesson-card technique-question-shell technique-practice-shell">
      <div class="problem-wrap technique-practice-problem">
        <p class="technique-question technique-compare-question">
          <span>${prompt}</span>
          <span class="technique-compare-box" aria-hidden="true"></span>
          <span>10</span>
        </p>
        <p class="technique-compare-mini">${compactPrompt}</p>
      </div>
      <div class="technique-operator-row">
        <button class="ghost-button technique-operator-button" type="button" data-technique-action="make10-symbol-less">
          <span class="technique-operator-symbol"><</span>
          <span class="technique-operator-label">Less than</span>
        </button>
        <button class="ghost-button technique-operator-button" type="button" data-technique-action="make10-symbol-equal">
          <span class="technique-operator-symbol">=</span>
          <span class="technique-operator-label">Equal to</span>
        </button>
        <button class="ghost-button technique-operator-button" type="button" data-technique-action="make10-symbol-greater">
          <span class="technique-operator-symbol">></span>
          <span class="technique-operator-label">Greater than</span>
        </button>
      </div>
      <p class="technique-feedback ${lessonState.tone}">${lessonState.feedback}</p>
    </section>
  `;
}

function renderMake10CompleteBlock() {
  return `
    <section class="technique-lesson-card">
      <p class="technique-helper">Build to 10 lesson complete.</p>
      <article class="technique-hint">
        Nice work. You're building fluent number sense with sums around 10.
      </article>
      <div class="technique-action-row">
        <button class="primary-button" type="button" data-technique-action="start-make10-workout">
          Start Focused Workout
        </button>
        <button class="ghost-button" type="button" data-technique-action="make10-restart">
          Restart Lesson
        </button>
        <button class="ghost-button" type="button" data-technique-action="back-to-techniques">
          Back to Lessons
        </button>
      </div>
    </section>
  `;
}

function renderMake10LessonScreen(lesson) {
  const step = getMake10Step();
  let bodyMarkup = "";

  if (step.id === "idea-1") {
    bodyMarkup = renderMake10IdeaBlock(
      "Idea 1",
      "When we add the following pairs of single digits together, they always sum to 10. Knowing which numbers add to 10 makes more complex addition problems much easier to calculate mentally.",
      ["0 + 10", "1 + 9", "2 + 8", "3 + 7", "4 + 6", "5 + 5"],
    );
  } else if (step.id === "practice-1") {
    bodyMarkup = renderMake10NumericPractice();
  } else if (step.id === "idea-2") {
    bodyMarkup = renderMake10IdeaBlock(
      "Idea 2",
      "A different way to look at it is the difference between 10 and a number is its match to make 10.",
      ["10 - 0 = 10", "10 - 1 = 9", "10 - 2 = 8", "10 - 3 = 7", "10 - 4 = 6", "10 - 5 = 5", "10 - 6 = 4", "10 - 7 = 3", "10 - 8 = 2", "10 - 9 = 1"],
    );
  } else if (step.id === "practice-2") {
    bodyMarkup = renderMake10NumericPractice();
  } else if (step.id === "idea-3") {
    bodyMarkup = renderMake10IdeaBlock(
      "Idea 3",
      "It's important to get a sense of whether 2 numbers sum to a total that is above, below, or equal to 10.",
      [
        "Example 1: 2 + 6 [ ] 10 -> 8 [ ] 10 -> 8 < 10",
        "Example 2: 4 + 6 [ ] 10 -> 10 [ ] 10 -> 10 = 10",
        "Example 3: 8 + 5 [ ] 10 -> 13 [ ] 10 -> 13 > 10",
      ],
    );
  } else if (step.id === "practice-3") {
    bodyMarkup = renderMake10ComparePractice();
  } else {
    bodyMarkup = renderMake10CompleteBlock();
  }

  return `
    <div class="technique-lesson-wrap">
      <div class="technique-lesson-head">
        <div>
          <p class="section-kicker">Addition Technique</p>
          <h2>${lesson.title}</h2>
        </div>
        <button class="ghost-button subtle-button" type="button" data-technique-action="back-to-techniques">
          Back to Lessons
        </button>
      </div>
      <div class="technique-stage-pills">${getMake10FlowPillsMarkup()}</div>
      ${bodyMarkup}
    </div>
  `;
}

function renderAdditionTechniqueLessonScreen() {
  const lesson = ADDITION_LESSONS.find((item) => item.id === state.technique.additionLessonId);

  if (!lesson) {
    return `
      <div class="technique-lesson-wrap">
        <div class="technique-lesson-head">
          <div>
            <p class="section-kicker">Addition Lessons</p>
            <h2>Choose a lesson</h2>
          </div>
        </div>
        <section class="technique-lesson-card">
          <p class="technique-helper">Select an addition lesson from the menu to continue.</p>
          <div class="technique-action-row">
            <button class="primary-button" type="button" data-technique-action="back-to-techniques">
              Back to Techniques
            </button>
          </div>
        </section>
      </div>
    `;
  }

  const helperCopy = "This lesson is staged for a future release.";

  if (lesson.id === "make-10") {
    ensureMake10LessonState();
    return renderMake10LessonScreen(lesson);
  }

  return `
    <div class="technique-lesson-wrap">
      <div class="technique-lesson-head">
        <div>
          <p class="section-kicker">Addition Technique</p>
          <h2>${lesson.title}</h2>
        </div>
        <button class="ghost-button subtle-button" type="button" data-technique-action="back-to-techniques">
          Back to Lessons
        </button>
      </div>
      <section class="technique-lesson-card">
        <p class="technique-helper">${lesson.description}</p>
        <article class="technique-hint">
          ${helperCopy}
        </article>
        <div class="technique-action-row">
          <button class="ghost-button" type="button" data-technique-action="back-to-techniques">
            Choose Another Lesson
          </button>
          <button class="primary-button" type="button" data-technique-action="back-to-setup">
            Go to Work Out
          </button>
        </div>
      </section>
    </div>
  `;
}

function renderTechniqueCelebrationScreen() {
  return `
    <div class="technique-celebration-shell">
      <div class="technique-completion-card">
        <p class="section-kicker">Lesson Complete</p>
        <h2>10x technique complete.</h2>
        <p class="technique-completion-copy">
          You finished the lesson and locked in ${TECHNIQUE_COMPLETION_GOAL} solo reps. Keep building from here, or head back and choose your next move.
        </p>
        <div class="technique-completion-actions">
          <button class="ghost-button" type="button" data-technique-action="back-to-techniques">
            Back to Techniques
          </button>
          <button class="ghost-button" type="button" data-technique-action="open-practice">
            Practice More
          </button>
          <button class="primary-button" type="button" data-technique-action="back-to-setup">
            Go to Work Out
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
        <button class="ghost-button subtle-button" type="button" data-technique-action="exit">
          Exit Lesson
        </button>
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
    elements.endWorkoutDialogConfirmLabel.textContent = leavingToAnotherView
      ? `End Workout and Go to ${getViewLabelForDialog(targetView)}`
      : "End Workout";
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

function showView(view) {
  state.view = view;
  const isHomeView = view === "home";

  elements.screens.forEach((screen) => {
    const isActiveScreen = screen.dataset.view === view;
    screen.classList.toggle("is-active", isActiveScreen);
    screen.setAttribute("aria-hidden", isActiveScreen ? "false" : "true");
  });

  elements.pageShell?.classList.toggle("is-home-shell", isHomeView);
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

  elements.optionsButton.disabled = !isHomeView;
  if (elements.aboutButton) {
    elements.aboutButton.disabled = !isHomeView;
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

function sanitiseTechniqueEntry(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function applyTechniqueInputColour(input) {
  if (!(input instanceof HTMLInputElement)) {
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
      message: "Strong. The whole 10x pattern is holding together.",
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

  if (answer === `${question.answer}`) {
    state.technique.practiceSolved = true;
    state.technique.practiceHintVisible = false;
    state.technique.practiceFeedback = {
      message: "Correct.",
      tone: "success",
    };
  } else {
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

  if (form.dataset.techniqueForm === "practice-1" || form.dataset.techniqueForm === "practice-2") {
    submitMake10Answer(state.technique.make10Lesson?.answer || "");
    renderTechniqueScreen();
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
    if (input.name === "make10Answer") {
      const nextValue = sanitiseTechniqueEntry(input.value);
      input.value = nextValue;
      ensureMake10LessonState().answer = nextValue;
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

  if (action === "make10-next") {
    moveMake10Flow(1);
    renderTechniqueScreen();
    return;
  }

  if (action === "make10-back") {
    moveMake10Flow(-1);
    renderTechniqueScreen();
    return;
  }

  if (action === "make10-restart") {
    state.technique.make10Lesson = createMake10LessonState();
    renderTechniqueScreen();
    return;
  }

  if (action === "start-make10-workout") {
    const snapshot = defaultSettingsSnapshot();
    applySettingsToForm(
      sanitiseSettingsSnapshot({
        ...snapshot,
        operation: "addition",
        sessionType: "question-goal",
        questionPreset: "custom",
        questionTarget: 20,
      }),
    );
    toggleSetupFields();
    resetTechniqueState(state.technique.selectedTable, "menu", state.technique.selectedOperation);
    renderTechniqueScreen();
    showView("setup");
    return;
  }

  if (
    action === "make10-symbol-less" ||
    action === "make10-symbol-equal" ||
    action === "make10-symbol-greater"
  ) {
    const symbol =
      action === "make10-symbol-less"
        ? "<"
        : action === "make10-symbol-greater"
          ? ">"
          : "=";
    submitMake10Answer(symbol);
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
      'input[name="techniqueAnswer"]:not([disabled]), input[name="make10Answer"]:not([disabled])',
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
    const operationOptions = ["multiplication", "addition"];
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
  state.technique.make10Lesson = lesson.id === "make-10" ? createMake10LessonState() : null;
  renderTechniqueScreen();
}

function handleTechniqueMenuChange(event) {
  const select = event.target.closest("[data-technique-operation-select]");
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }

  const selectedOperation = select.value;
  state.technique.selectedOperation =
    selectedOperation === "addition" || selectedOperation === "multiplication"
      ? selectedOperation
      : "";
  state.technique.mode = "menu";
  state.technique.additionLessonId = "";
  renderTechniqueScreen();
}

