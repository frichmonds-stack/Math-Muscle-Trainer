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
  return TABLE_FACTORS.includes(Number(table));
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
  return TECHNIQUE_STEPS.length - 1;
}

function getTechniqueHintMarkup(question) {
  return getMultiplicationLessonPlan(question.table).hint(question);
}

function getTechniqueFactorDigitsForQuestion(question) {
  return String(question?.otherFactor ?? "").replace(/[^\d]/g, "").length || 1;
}

function getTechniqueAnswerColourAttrs(question) {
  if (Number(question?.table) !== TECHNIQUE_TABLE) {
    return "";
  }
  return `data-technique-factor-digits="${getTechniqueFactorDigitsForQuestion(question)}" data-technique-split-mode="factor-plus-zero"`;
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
    note: getMultiplicationLessonPlan(table).menuNote,
  };
}

function getTechniqueTableGridMarkup() {
  return TABLE_FACTORS.map((factor, index) => {
    const available = isTechniqueAvailable(factor);
    const status = getTechniqueCardStatus(factor);

    return `
      <button
        class="technique-card${status.classes}"
        type="button"
        data-technique-select="${factor}"
        data-swiper-page="${Math.floor(index / 6) + 1}"
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

  return TECHNIQUE_STEPS.map((step, index) => {
    const isActive = index === activeIndex;
    const classes = ["technique-stage-pill"];
    if (isActive) {
      classes.push("is-active");
    } else {
      classes.push("is-unlocked");
    }

    const attrs = !isActive
      ? `data-technique-stage-jump="${step.id}" tabindex="0" role="button" aria-label="Go to ${escapeHtml(step.label)}"`
      : "";

    return `
      <span class="${classes.join(" ")}" ${attrs}>
        <span>${step.label}</span>
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

function getTechniqueOperatorFeedbackClasses(symbol, expected, submittedAnswer, feedbackPending) {
  const classes = ["ghost-button", "technique-operator-button"];
  if (feedbackPending && symbol === expected) {
    classes.push("is-correct");
  }
  if (feedbackPending && symbol === submittedAnswer && symbol !== expected) {
    classes.push("is-error");
  }
  return classes.join(" ");
}

function getTechniqueCorrectCounterMarkup(correctCount, requiredCount, label = "Correct reps") {
  const total = Math.max(0, Number(requiredCount) || 0);
  if (total < 1) {
    return "";
  }
  const filled = Math.max(0, Math.min(total, Number(correctCount) || 0));
  const dots = Array.from({ length: total }, (_, index) => {
    const isFilled = index < filled;
    return `
      <span class="technique-correct-dot ${isFilled ? "is-filled" : ""}" aria-hidden="true">
        ${isFilled ? "\u2713" : ""}
      </span>
    `;
  }).join("");

  return `
    <div class="technique-correct-counter" aria-label="${escapeHtml(label)}: ${filled} of ${total}">
      ${dots}
    </div>
  `;
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
  const table = state.technique.selectedTable;
  const colourAttrs =
    table === TECHNIQUE_TABLE
      ? `data-technique-factor-digits="${String(row.factor).length}" data-technique-split-mode="factor-plus-zero"`
      : "";

  if (row.blank === "answer-stem") {
    return `
      <div class="${getTechniquePatternRowClasses(row)}" data-technique-pattern-row="${row.factor}">
        <span>${formatTechniqueCarryValue(row.factor, table)} x ${formatTechniqueNumber(table)} =</span>
        <input
          class="${getTechniquePatternInputClasses(row)}"
          type="text"
          name="pattern-${row.factor}"
          inputmode="numeric"
          pattern="[0-9]*"
          value="${escapeHtml(row.value)}"
          aria-label="Missing digits before the zero in ${row.factor} times ${table}"
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
        <span>${formatTechniqueCarryValue(row.factor, table)} x ${formatTechniqueNumber(table)} =</span>
        <input
          class="${getTechniquePatternInputClasses(row, true)}"
          type="text"
          name="pattern-${row.factor}"
          inputmode="numeric"
          pattern="[0-9]*"
          value="${escapeHtml(row.value)}"
          ${colourAttrs}
          aria-label="Missing answer in ${row.factor} times ${table}"
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
          aria-label="Missing factor in the ${row.factor} times ${table} fact"
          ${autofocus}
        />
        <span>x ${formatTechniqueNumber(table)} = ${formatTechniqueAnswerValue(
          row.factor * table,
          row.factor,
          table,
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
          aria-label="Missing ${table} factor in the ${row.factor} times ${table} fact"
          ${autofocus}
        />
        <span>= ${formatTechniqueAnswerValue(row.factor * table, row.factor, table)}</span>
        <span class="technique-pattern-signal">${getTechniquePatternSignalMarkup(row)}</span>
      </div>
    `;
  }

  return `
    <div class="${getTechniquePatternRowClasses(row)}" data-technique-pattern-row="${row.factor}">
      <span>${formatTechniqueCarryValue(row.factor, table)} x ${formatTechniqueNumber(table)} = ${formatTechniqueAnswerValue(
        row.factor * table,
        row.factor,
        table,
      )}</span>
    </div>
  `;
}

function getTechniqueStageMeta(stage) {
  const plan = getMultiplicationLessonPlan();
  switch (stage) {
    case "rule":
      return {
        kicker: plan.kicker,
        title: plan.title,
      };
    case "switch":
      return {
        kicker: plan.kicker,
        title: "The order can flip.",
      };
    case "pattern":
      return {
        kicker: plan.kicker,
        title: "Warm Up.",
      };
    case "guided":
      return {
        kicker: plan.kicker,
        title: "Try it with support.",
      };
    case "quick-check":
      return {
        kicker: plan.kicker,
        title: "Show it on your own.",
      };
    default:
      return {
        kicker: plan.kicker,
        title: `Keep the ${plan.table}x table feeling easy.`,
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
        : selectedOperation === "subtraction"
          ? "Subtraction"
          : selectedOperation === "division"
            ? "Division"
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
  } else if (selectedOperation === "subtraction" || selectedOperation === "division") {
    bodyMarkup = `
      <div class="technique-empty-state">
        <section class="technique-coming-soon-card">
          <p class="section-kicker">Coming Soon</p>
          <h3>${escapeHtml(selectedOperationLabel)} Techniques</h3>
          <p>We are building this pathway next. Keep training in Practice mode for now.</p>
        </section>
      </div>
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
  const plan = getMultiplicationLessonPlan();
  return `
    <section class="technique-lesson-card">
      <p class="technique-helper">
        ${escapeHtml(plan.ruleCopy)}
      </p>
      <div class="technique-rule-grid">
        ${plan.examples
          .map(
            (example) => `
              <article class="technique-example-card">
                <p class="technique-equation">${formatTechniqueFactorValue(example.factor)} x ${formatTechniqueNumber(plan.table)} = ${formatTechniqueAnswerValue(
                  example.factor * plan.table,
                  example.factor,
                  plan.table,
                )}</p>
                <p class="technique-caption">${escapeHtml(example.caption)}</p>
              </article>
            `,
          )
          .join("")}
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
  const plan = getMultiplicationLessonPlan();
  const switchFactors = plan.table === 1 ? [7, 12] : [6, 9];
  return `
    <section class="technique-lesson-card">
      <p class="technique-helper">
        ${escapeHtml(plan.switchCopy)}
      </p>
      <div class="technique-switch-grid">
        ${switchFactors
          .flatMap((factor) => [
            {
              left: factor,
              right: plan.table,
              caption: `Start from ${factor} x ${plan.table}.`,
            },
            {
              left: plan.table,
              right: factor,
              caption: `Flip it to ${plan.table} x ${factor}. The answer stays ${factor * plan.table}.`,
            },
          ])
          .map(
            (example) => `
              <article class="technique-switch-card">
                <p class="technique-equation">${formatTechniqueEquation(example.left, example.right)} = ${formatTechniqueAnswerValue(
                  example.left * example.right,
                  example.left === plan.table ? example.right : example.left,
                  plan.table,
                )}</p>
                <p class="technique-caption">${escapeHtml(example.caption)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="technique-action-row">
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
  const colourAttrs = getTechniqueAnswerColourAttrs(question);

  return `
    <form class="technique-lesson-card technique-question-shell technique-practice-shell" data-technique-form="guided" autocomplete="off">
      <div class="problem-wrap technique-practice-problem">
        ${getTechniqueCorrectCounterMarkup(
          state.technique.guidedIndex + (state.technique.guidedSolved ? 1 : 0),
          state.technique.guidedQuestions.length,
          "Assisted correct reps",
        )}
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
              ${colourAttrs}
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
      <p class="technique-feedback ${feedback.tone}">${feedback.tone === "error" ? feedback.message : ""}</p>
      <p class="sr-only" aria-live="polite">${feedback.message}</p>
      <div class="technique-action-row">
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
  const colourAttrs = getTechniqueAnswerColourAttrs(question);

  return `
    <form class="technique-lesson-card technique-question-shell technique-practice-shell" data-technique-form="quick-check" autocomplete="off">
      <div class="problem-wrap technique-practice-problem">
        ${getTechniqueCorrectCounterMarkup(
          state.technique.quickCheckCorrect,
          TECHNIQUE_COMPLETION_GOAL,
          "Solo correct reps",
        )}
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
              ${colourAttrs}
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
      <p class="technique-feedback ${feedback.tone}">${feedback.tone === "error" ? feedback.message : ""}</p>
      <p class="sr-only" aria-live="polite">${feedback.message}</p>
      <div class="technique-action-row">
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
  const plan = getMultiplicationLessonPlan(question.table);
  const colourAttrs = getTechniqueAnswerColourAttrs(question);
  const answerState = state.technique.practiceSolved
    ? "correct"
    : feedback.tone === "error"
      ? "error"
      : "idle";

  return `
    <div class="technique-lesson-wrap">
      <div class="technique-lesson-head">
        <div>
          <p class="section-kicker">${plan.table}x Practice</p>
          <h2>Practice multiplying by ${plan.table}.</h2>
        </div>
        <button class="ghost-button subtle-button" type="button" data-technique-action="back-to-techniques">
          Back to Techniques
        </button>
      </div>

      <form class="technique-lesson-card technique-question-shell technique-practice-shell" data-technique-form="practice" autocomplete="off">
        <div class="technique-question-meta">
          <span class="technique-progress-copy">Same lesson focus. Workout pace.</span>
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
                ${colourAttrs}
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
        <p class="technique-feedback ${feedback.tone}" aria-live="polite">${feedback.tone === "error" ? feedback.message : ""}</p>
        <div class="technique-action-row">
          ${
            !state.technique.practiceHintVisible && !state.technique.practiceSolved
              ? `
                <button class="ghost-button" type="button" data-technique-action="show-practice-hint">
                  Hint
                </button>
              `
              : '<span class="technique-progress-copy">Use the hint when you want a quick reminder.</span>'
          }
        </div>
      </form>
    </div>
  `;
}
