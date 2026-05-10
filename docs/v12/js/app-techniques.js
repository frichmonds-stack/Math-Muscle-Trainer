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

function getMultiplicationLessonPlan(table = state.technique.selectedTable || TECHNIQUE_TABLE) {
  const safeTable = TABLE_FACTORS.includes(Number(table)) ? Number(table) : TECHNIQUE_TABLE;
  const plans = {
    1: {
      menuNote: "Learn why 1 keeps a number unchanged.",
      title: "Keep the number.",
      ruleCopy: "Multiplying by 1 means one group. The answer stays the same as the other factor.",
      examples: [
        { factor: 7, caption: "One group of 7 is 7." },
        { factor: 12, caption: "One group of 12 is 12." },
      ],
      switchCopy: "The fact can flip, but there is still only one group of the other number.",
      hint(question) {
        return `Multiplying by 1 keeps <strong>${escapeHtml(question.otherFactor)}</strong> unchanged.`;
      },
    },
    2: {
      menuNote: "Use doubles to build the 2x table.",
      title: "Double it.",
      ruleCopy: "Multiplying by 2 means doubling the other factor.",
      examples: [
        { factor: 6, caption: "Double 6 to get 12." },
        { factor: 9, caption: "Double 9 to get 18." },
      ],
      switchCopy: "Whether the 2 comes first or second, double the other factor.",
      hint(question) {
        return `Double <strong>${escapeHtml(question.otherFactor)}</strong>: ${escapeHtml(question.otherFactor)} + ${escapeHtml(question.otherFactor)}.`;
      },
    },
    3: {
      menuNote: "Build triples from doubles plus one more group.",
      title: "Double, then add one group.",
      ruleCopy: "For 3x facts, double the factor, then add one more copy of it.",
      examples: [
        { factor: 4, caption: "4 x 3 is 4 + 4 + 4." },
        { factor: 8, caption: "8 x 3 is double 8, then add 8." },
      ],
      switchCopy: "The order can flip, but 3 groups and groups of 3 still make the same total.",
      hint(question) {
        const doubled = question.otherFactor * 2;
        return `Double ${escapeHtml(question.otherFactor)} to get ${escapeHtml(doubled)}, then add ${escapeHtml(question.otherFactor)}.`;
      },
    },
    4: {
      menuNote: "Double the double for 4x facts.",
      title: "Double twice.",
      ruleCopy: "Multiplying by 4 is the same as doubling, then doubling again.",
      examples: [
        { factor: 5, caption: "Double 5 to 10, then double 10 to 20." },
        { factor: 7, caption: "Double 7 to 14, then double 14 to 28." },
      ],
      switchCopy: "If the fact flips, still double the other factor twice.",
      hint(question) {
        const first = question.otherFactor * 2;
        return `Double ${escapeHtml(question.otherFactor)} to ${escapeHtml(first)}, then double ${escapeHtml(first)}.`;
      },
    },
    5: {
      menuNote: "Use skip-counting and the clock pattern for 5x.",
      title: "Count by fives.",
      ruleCopy: "The 5x table moves in steps of 5. Answers end in 5 or 0.",
      examples: [
        { factor: 6, caption: "5, 10, 15, 20, 25, 30." },
        { factor: 9, caption: "Nine fives lands on 45." },
      ],
      switchCopy: "When the order flips, count groups of 5 or use half of 10x.",
      hint(question) {
        return `Use 10x, then halve it: ${escapeHtml(question.otherFactor)} x 10 = ${escapeHtml(question.otherFactor * 10)}.`;
      },
    },
    6: {
      menuNote: "Build 6x from 5x plus one more group.",
      title: "Use 5x, then add one group.",
      ruleCopy: "For 6x facts, use the nearby 5x fact, then add one more group.",
      examples: [
        { factor: 4, caption: "4 x 6 is 4 x 5 plus 4." },
        { factor: 8, caption: "8 x 6 is 8 x 5 plus 8." },
      ],
      switchCopy: "The fact can flip, but 6x stays close to the 5x anchor.",
      hint(question) {
        const anchor = question.otherFactor * 5;
        return `${escapeHtml(question.otherFactor)} x 5 = ${escapeHtml(anchor)}, then add ${escapeHtml(question.otherFactor)}.`;
      },
    },
    7: {
      menuNote: "Break 7x into 5x plus 2x.",
      title: "Use 5x plus 2x.",
      ruleCopy: "For 7x facts, split 7 into 5 + 2. Add the 5x fact and the double.",
      examples: [
        { factor: 6, caption: "6 x 7 is 6 x 5 plus 6 x 2." },
        { factor: 8, caption: "8 x 7 is 40 plus 16." },
      ],
      switchCopy: "When the order flips, keep the same split: 7 groups are 5 groups plus 2 groups.",
      hint(question) {
        return `${escapeHtml(question.otherFactor)} x 5 plus ${escapeHtml(question.otherFactor)} x 2.`;
      },
    },
    8: {
      menuNote: "Double three times or use 10x minus 2x.",
      title: "Double, double, double.",
      ruleCopy: "Multiplying by 8 means doubling three times because 8 is 2 x 2 x 2.",
      examples: [
        { factor: 3, caption: "3 -> 6 -> 12 -> 24." },
        { factor: 7, caption: "7 -> 14 -> 28 -> 56." },
      ],
      switchCopy: "The order can flip. You can also use 10x minus 2x when that feels easier.",
      hint(question) {
        const first = question.otherFactor * 2;
        const second = first * 2;
        return `Double chain: ${escapeHtml(question.otherFactor)} -> ${escapeHtml(first)} -> ${escapeHtml(second)} -> ${escapeHtml(second * 2)}.`;
      },
    },
    9: {
      menuNote: "Use 10x minus one group for 9x.",
      title: "Almost 10x.",
      ruleCopy: "The 9x table is one group less than 10x.",
      examples: [
        { factor: 6, caption: "6 x 10 = 60, so 6 x 9 = 54." },
        { factor: 12, caption: "12 x 10 = 120, so 12 x 9 = 108." },
      ],
      switchCopy: "If the fact flips, still think 10 groups minus one group.",
      hint(question) {
        return `${escapeHtml(question.otherFactor)} x 10 = ${escapeHtml(question.otherFactor * 10)}, then subtract ${escapeHtml(question.otherFactor)}.`;
      },
    },
    10: {
      menuNote: "Learn the 10x place-value shortcut.",
      title: "Place the zero.",
      ruleCopy: "When multiplying a whole number by 10, place a zero next to the number.",
      examples: [
        { factor: 7, caption: "Keep the 7. Place the zero next to it." },
        { factor: 12, caption: "The 12 stays. The zero goes after it." },
      ],
      switchCopy: "It doesn't matter which way the fact is written. We can still use the same 10x shortcut.",
      hint(question) {
        return `Take <strong class="technique-factor">${escapeHtml(question.otherFactor)}</strong> and place a zero next to it.`;
      },
    },
    11: {
      menuNote: "Use the repeat pattern and nearby facts for 11x.",
      title: "Ten groups plus one group.",
      ruleCopy: "Multiplying by 11 means 10 groups plus one extra group.",
      examples: [
        { factor: 6, caption: "6 x 11 is 60 plus 6." },
        { factor: 12, caption: "12 x 11 is 120 plus 12." },
      ],
      switchCopy: "Small 11x facts often repeat digits, and every 11x fact can use 10x plus one group.",
      hint(question) {
        return `${escapeHtml(question.otherFactor)} x 10 = ${escapeHtml(question.otherFactor * 10)}, then add ${escapeHtml(question.otherFactor)}.`;
      },
    },
    12: {
      menuNote: "Use 10x plus 2x for 12x.",
      title: "Ten groups plus two groups.",
      ruleCopy: "Multiplying by 12 means 10 groups plus 2 more groups.",
      examples: [
        { factor: 6, caption: "6 x 12 is 60 plus 12." },
        { factor: 9, caption: "9 x 12 is 90 plus 18." },
      ],
      switchCopy: "When the fact flips, split 12 into 10 + 2 and combine the parts.",
      hint(question) {
        return `${escapeHtml(question.otherFactor)} x 10 plus double ${escapeHtml(question.otherFactor)}.`;
      },
    },
  };

  return {
    table: safeTable,
    kicker: `${safeTable}x Technique`,
    completeTitle: `${safeTable}x technique complete.`,
    completeCopy: `You finished the ${safeTable}x lesson and can review any section whenever you want.`,
    ...plans[safeTable],
  };
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
  const colourAttrs = getTechniqueAnswerColourAttrs(question);

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
  const colourAttrs = getTechniqueAnswerColourAttrs(question);

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
          <p class="section-kicker">Practice More</p>
          <h2>Keep the ${plan.table}x table feeling easy.</h2>
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

    const attrs = !isActive
      ? `data-technique-stage-jump="${step.id}" tabindex="0" role="button" aria-label="Go to ${escapeHtml(step.label)}"`
      : "";
    const lockMarkup = "";

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
      <p class="technique-feedback ${lessonState.tone}">${escapeHtml(lessonState.feedback)}</p>
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
          <span class="technique-operator-symbol">&lt;</span>
          <span class="technique-operator-label">Less than</span>
        </button>
        <button class="ghost-button technique-operator-button" type="button" data-technique-action="make10-symbol-equal">
          <span class="technique-operator-symbol">=</span>
          <span class="technique-operator-label">Equal to</span>
        </button>
        <button class="ghost-button technique-operator-button" type="button" data-technique-action="make10-symbol-greater">
          <span class="technique-operator-symbol">&gt;</span>
          <span class="technique-operator-label">Greater than</span>
        </button>
      </div>
      <p class="technique-feedback ${lessonState.tone}">${escapeHtml(lessonState.feedback)}</p>
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

const ADDITION_COMPONENT_PRACTICE_COUNT = 5;
const ADDITION_FINAL_PRACTICE_COUNT = 10;

const ADDITION_LESSON_PLANS = {
  "make-10": {
    completeTitle: "Make 10 lesson complete.",
    completeCopy: "You can find partners to 10, use subtraction to find the missing partner, and judge sums around 10.",
    workout: { difficulties: ["easy"], regrouping: false },
    components: [
      {
        title: "Find the partner",
        copy: "Every number has a partner that makes 10. The faster you see the partner, the faster bigger addition gets.",
        examples: ["0 + 10 = 10", "1 + 9 = 10", "2 + 8 = 10", "3 + 7 = 10", "4 + 6 = 10", "5 + 5 = 10"],
        questionKind: "make10-partner",
      },
      {
        title: "Use 10 minus",
        copy: "If the partner is hiding, subtract from 10. The difference is the number you need.",
        examples: ["10 - 1 = 9", "10 - 3 = 7", "10 - 6 = 4", "10 - 8 = 2"],
        questionKind: "make10-difference",
      },
      {
        title: "Feel around 10",
        copy: "A pair can land below 10, exactly on 10, or above 10. This sense helps you choose a strategy quickly.",
        examples: ["2 + 6 is below 10", "4 + 6 is exactly 10", "8 + 5 is above 10"],
        questionKind: "make10-compare",
      },
    ],
    final: {
      copy: "Mix the partner, difference, and around-10 moves.",
      questionKinds: ["make10-partner", "make10-difference", "make10-compare", "make10-sum"],
    },
  },
  "adding-by-1s": {
    completeTitle: "Adding by 1s lesson complete.",
    completeCopy: "You can add small ones-place jumps and notice when the ones place rolls into a new ten.",
    workout: { difficulties: ["medium"], regrouping: true },
    components: [
      {
        title: "One more",
        copy: "Adding 1 moves to the next number. Most of the number stays the same.",
        examples: ["34 + 1 = 35", "208 + 1 = 209", "679 + 1 = 680"],
        questionKind: "ones-one-more",
      },
      {
        title: "Add a few ones",
        copy: "For +2 through +9, keep the larger number in your head and move the ones forward.",
        examples: ["42 + 3 = 45", "156 + 4 = 160", "281 + 7 = 288"],
        questionKind: "ones-few",
      },
      {
        title: "Cross the next ten",
        copy: "When the ones pass 9, they reset and the tens place grows by 1.",
        examples: ["38 + 4 = 42", "297 + 6 = 303", "685 + 8 = 693"],
        questionKind: "ones-cross-ten",
      },
    ],
    final: {
      copy: "Mix one-more, small jumps, and cross-ten facts.",
      questionKinds: ["ones-one-more", "ones-few", "ones-cross-ten"],
    },
  },
  "adding-by-10s": {
    completeTitle: "Adding by 10s lesson complete.",
    completeCopy: "You can add one or more tens and handle facts that cross into the next hundred.",
    workout: { difficulties: ["medium"], regrouping: true },
    components: [
      {
        title: "One more ten",
        copy: "Adding 10 usually changes the tens place and leaves the ones place alone.",
        examples: ["24 + 10 = 34", "68 + 10 = 78", "305 + 10 = 315"],
        questionKind: "tens-one",
      },
      {
        title: "Several tens",
        copy: "For +20, +30, and larger tens, count by tens while the ones stay anchored.",
        examples: ["41 + 20 = 61", "76 + 30 = 106", "218 + 50 = 268"],
        questionKind: "tens-many",
      },
      {
        title: "Cross a hundred",
        copy: "If the tens pass 90, the hundreds place grows and the tens wrap around.",
        examples: ["86 + 20 = 106", "275 + 40 = 315", "491 + 30 = 521"],
        questionKind: "tens-cross-hundred",
      },
    ],
    final: {
      copy: "Mix +10, larger tens, and cross-hundred facts.",
      questionKinds: ["tens-one", "tens-many", "tens-cross-hundred"],
    },
  },
  "adding-by-100s": {
    completeTitle: "Adding by 100s lesson complete.",
    completeCopy: "You can add hundreds while keeping tens and ones steady, then cross into new thousands.",
    workout: { difficulties: ["hard"], regrouping: true },
    components: [
      {
        title: "One more hundred",
        copy: "Adding 100 usually changes the hundreds place. The tens and ones stay steady.",
        examples: ["245 + 100 = 345", "708 + 100 = 808", "934 + 100 = 1034"],
        questionKind: "hundreds-one",
      },
      {
        title: "Several hundreds",
        copy: "For +200, +300, and larger hundreds, count the hundreds up by that amount.",
        examples: ["361 + 200 = 561", "428 + 500 = 928", "1275 + 300 = 1575"],
        questionKind: "hundreds-many",
      },
      {
        title: "Cross a thousand",
        copy: "When the hundreds pass 900, the thousands place grows and the hundreds continue from there.",
        examples: ["860 + 300 = 1160", "975 + 200 = 1175", "1840 + 500 = 2340"],
        questionKind: "hundreds-cross-thousand",
      },
    ],
    final: {
      copy: "Mix one-hundred, several-hundred, and cross-thousand facts.",
      questionKinds: ["hundreds-one", "hundreds-many", "hundreds-cross-thousand"],
    },
  },
  "adding-by-1000s": {
    completeTitle: "Adding by 1000s lesson complete.",
    completeCopy: "You can add thousands while keeping the lower places organized.",
    workout: { difficulties: ["hard"], regrouping: true },
    components: [
      {
        title: "One more thousand",
        copy: "Adding 1000 changes the thousands place. The last three digits usually stay the same.",
        examples: ["2345 + 1000 = 3345", "8092 + 1000 = 9092", "9760 + 1000 = 10760"],
        questionKind: "thousands-one",
      },
      {
        title: "Several thousands",
        copy: "For +2000, +3000, and larger thousands, count the thousands up by that amount.",
        examples: ["4125 + 2000 = 6125", "6830 + 4000 = 10830", "12350 + 5000 = 17350"],
        questionKind: "thousands-many",
      },
      {
        title: "Keep lower places steady",
        copy: "The hundreds, tens, and ones still matter. Say the full number after the thousands change.",
        examples: ["7098 + 3000 = 10098", "15875 + 6000 = 21875", "24960 + 8000 = 32960"],
        questionKind: "thousands-large",
      },
    ],
    final: {
      copy: "Mix +1000, larger thousands, and full-number reading.",
      questionKinds: ["thousands-one", "thousands-many", "thousands-large"],
    },
  },
  "counting-on-easy": {
    completeTitle: "Counting On (Easy) lesson complete.",
    completeCopy: "You can start from the larger addend, count on the smaller addend, and switch the fact when it helps.",
    workout: { difficulties: ["easy"], regrouping: true },
    components: [
      {
        title: "Start with the bigger number",
        copy: "Counting on is faster when the larger addend is your starting point.",
        examples: ["7 + 2: start at 7", "8 + 3: start at 8", "6 + 1: start at 6"],
        questionKind: "count-easy-start",
      },
      {
        title: "Count the small addend",
        copy: "Move forward one step for each part of the smaller addend.",
        examples: ["7 + 2: 8, 9", "5 + 3: 6, 7, 8", "8 + 4: 9, 10, 11, 12"],
        questionKind: "count-easy-small",
      },
      {
        title: "Switch if it is easier",
        copy: "Addition can flip around. 2 + 8 is the same total as 8 + 2.",
        examples: ["2 + 8 = 8 + 2", "3 + 7 = 7 + 3", "1 + 9 = 9 + 1"],
        questionKind: "count-easy-switch",
      },
    ],
    final: {
      copy: "Mix single-digit facts where counting on is the fastest move.",
      questionKinds: ["count-easy-start", "count-easy-small", "count-easy-switch"],
    },
  },
  "counting-on-medium": {
    completeTitle: "Counting On (Medium) lesson complete.",
    completeCopy: "You can add a single digit to a two-digit number, bridge to the next ten when needed, and flip facts when useful.",
    workout: { difficulties: ["medium"], regrouping: true },
    components: [
      {
        title: "Add onto the two-digit number",
        copy: "Keep the two-digit number whole, then count on the single digit.",
        examples: ["24 + 3 = 27", "51 + 6 = 57", "82 + 4 = 86"],
        questionKind: "count-medium-direct",
      },
      {
        title: "Count through the next ten",
        copy: "When the jump crosses a ten, land on the ten first, then finish the leftovers.",
        examples: ["48 + 5 = 50 + 3", "67 + 6 = 70 + 3", "89 + 4 = 90 + 3"],
        questionKind: "count-medium-cross",
      },
      {
        title: "Flip to keep the bigger number first",
        copy: "If the single digit comes first, flip the fact so the two-digit number does the heavy lifting.",
        examples: ["6 + 43 = 43 + 6", "8 + 75 = 75 + 8", "4 + 92 = 92 + 4"],
        questionKind: "count-medium-switch",
      },
    ],
    final: {
      copy: "Mix two-digit plus single-digit counting-on facts.",
      questionKinds: ["count-medium-direct", "count-medium-cross", "count-medium-switch"],
    },
  },
  "bridging-10-easy": {
    completeTitle: "Bridging to 10 (Easy) lesson complete.",
    completeCopy: "You can find the gap to 10, split the addend, and finish the single-digit bridge.",
    workout: { difficulties: ["easy"], regrouping: true },
    components: [
      {
        title: "Find the gap to 10",
        copy: "Start with the first number and find how much it needs to reach 10.",
        examples: ["8 needs 2", "7 needs 3", "6 needs 4"],
        questionKind: "bridge-easy-gap",
      },
      {
        title: "Split the second number",
        copy: "Break the second addend into the gap plus what is left.",
        examples: ["8 + 5: split 5 into 2 + 3", "7 + 6: split 6 into 3 + 3", "9 + 4: split 4 into 1 + 3"],
        questionKind: "bridge-easy-split",
      },
      {
        title: "Make 10, then finish",
        copy: "Use the first piece to make 10. Add the leftover piece after that.",
        examples: ["8 + 5 = 10 + 3 = 13", "7 + 6 = 10 + 3 = 13", "9 + 4 = 10 + 3 = 13"],
        questionKind: "bridge-easy-complete",
      },
    ],
    final: {
      copy: "Mix single-digit bridge-to-10 facts.",
      questionKinds: ["bridge-easy-gap", "bridge-easy-split", "bridge-easy-complete"],
    },
  },
  "bridging-10-medium": {
    completeTitle: "Bridging to 10 (Medium) lesson complete.",
    completeCopy: "You can bridge a two-digit number to the next ten, split a single digit, and finish the leftover.",
    workout: { difficulties: ["medium"], regrouping: true },
    components: [
      {
        title: "Find the next ten",
        copy: "Find how far the two-digit number is from the next clean ten.",
        examples: ["47 needs 3 to reach 50", "68 needs 2 to reach 70", "84 needs 6 to reach 90"],
        questionKind: "bridge-medium-gap",
      },
      {
        title: "Split the single digit",
        copy: "Split the addend into the bridge piece and the leftover piece.",
        examples: ["47 + 8: split 8 into 3 + 5", "68 + 7: split 7 into 2 + 5", "84 + 9: split 9 into 6 + 3"],
        questionKind: "bridge-medium-split",
      },
      {
        title: "Bridge, then add leftovers",
        copy: "Land on the next ten first. Then add what remains.",
        examples: ["47 + 8 = 50 + 5 = 55", "68 + 7 = 70 + 5 = 75", "84 + 9 = 90 + 3 = 93"],
        questionKind: "bridge-medium-complete",
      },
    ],
    final: {
      copy: "Mix two-digit plus single-digit bridge facts.",
      questionKinds: ["bridge-medium-gap", "bridge-medium-split", "bridge-medium-complete"],
    },
  },
  "bridging-advanced": {
    completeTitle: "Bridging Advanced lesson complete.",
    completeCopy: "You can bridge double-digit facts to a useful ten or hundred and carry the leftover through.",
    workout: { difficulties: ["hard"], regrouping: true },
    components: [
      {
        title: "Choose the next anchor",
        copy: "The anchor is the next clean ten or hundred that makes the sum easier.",
        examples: ["78 can bridge to 80", "187 can bridge to 200", "346 can bridge to 350"],
        questionKind: "bridge-advanced-anchor",
      },
      {
        title: "Split a double-digit addend",
        copy: "Use the first piece to reach the anchor. Keep the rest as the leftover.",
        examples: ["78 + 45: split 45 into 2 + 43", "187 + 38: split 38 into 13 + 25", "346 + 77: split 77 into 4 + 73"],
        questionKind: "bridge-advanced-split",
      },
      {
        title: "Add the leftover",
        copy: "Once you reach the anchor, the remaining piece is usually easier to add.",
        examples: ["78 + 45 = 80 + 43 = 123", "187 + 38 = 200 + 25 = 225", "346 + 77 = 350 + 73 = 423"],
        questionKind: "bridge-advanced-leftover",
      },
      {
        title: "Pick the smoother route",
        copy: "Sometimes switching addends creates a smaller bridge. Choose the route with the cleaner anchor.",
        examples: ["68 + 29 can bridge 68 to 70", "96 + 37 can bridge 96 to 100", "145 + 58 can bridge 145 to 150"],
        questionKind: "bridge-advanced-choice",
      },
    ],
    final: {
      copy: "Mix double-digit bridging, anchor choices, splits, and full sums.",
      questionKinds: ["bridge-advanced-anchor", "bridge-advanced-split", "bridge-advanced-leftover", "bridge-advanced-choice"],
    },
  },
  "bridging-expert": {
    completeTitle: "Bridging Expert lesson complete.",
    completeCopy: "You can bridge three-digit facts through hundreds and thousands with controlled splits.",
    workout: { difficulties: ["hard"], regrouping: true },
    components: [
      {
        title: "Find the next hundred",
        copy: "For large facts, a clean hundred is often the strongest anchor.",
        examples: ["368 needs 32 to reach 400", "785 needs 15 to reach 800", "946 needs 54 to reach 1000"],
        questionKind: "bridge-expert-anchor",
      },
      {
        title: "Split a large addend",
        copy: "Separate the bridge piece from the rest of the addend.",
        examples: ["368 + 79: split 79 into 32 + 47", "785 + 68: split 68 into 15 + 53", "946 + 87: split 87 into 54 + 33"],
        questionKind: "bridge-expert-split",
      },
      {
        title: "Carry through the anchor",
        copy: "After the bridge, finish from the clean hundred or thousand.",
        examples: ["368 + 79 = 400 + 47 = 447", "785 + 68 = 800 + 53 = 853", "946 + 87 = 1000 + 33 = 1033"],
        questionKind: "bridge-expert-cross",
      },
      {
        title: "Choose when to bridge",
        copy: "A bridge is strongest when the gap is small enough to split cleanly.",
        examples: ["594 + 36 bridges to 600", "728 + 95 bridges to 800", "879 + 48 bridges to 900"],
        questionKind: "bridge-expert-choice",
      },
    ],
    final: {
      copy: "Mix three-digit anchors, large splits, carry-through facts, and route choices.",
      questionKinds: ["bridge-expert-anchor", "bridge-expert-split", "bridge-expert-cross", "bridge-expert-choice"],
    },
  },
};

function getAdditionRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function getAdditionRandomItem(items) {
  return items[getAdditionRandomInt(0, items.length - 1)];
}

function getAdditionNextMultiple(value, unit) {
  return Math.ceil((value + 1) / unit) * unit;
}

function createAdditionNumericQuestion(prompt, expected, hint = "") {
  return {
    inputType: "numeric",
    prompt,
    expected: `${expected}`,
    hint,
  };
}

function createAdditionCompareQuestion(prompt, leftValue, rightValue, hint = "") {
  return {
    inputType: "compare",
    prompt,
    compactPrompt: `${leftValue}`,
    compareTarget: `${rightValue}`,
    expected: leftValue < rightValue ? "<" : leftValue > rightValue ? ">" : "=",
    hint,
  };
}

function createPlaceValueQuestion(unit, multiplierMin, multiplierMax, baseMin, baseMax, crossingMode = "any") {
  let base = getAdditionRandomInt(baseMin, baseMax);
  const addend = unit * getAdditionRandomInt(multiplierMin, multiplierMax);

  if (crossingMode === "hundred") {
    const ones = getAdditionRandomInt(0, 9);
    base = getAdditionRandomItem([70, 80, 90]) + ones + getAdditionRandomInt(0, 4) * 100;
  } else if (crossingMode === "thousand") {
    base = getAdditionRandomInt(820, 980) + getAdditionRandomInt(0, 2) * 1000;
  }

  return createAdditionNumericQuestion(
    `${base} + ${addend} = ?`,
    base + addend,
    `Keep the lower places steady and add ${addend}.`,
  );
}

function createBridgeNumbers(startMin, startMax, addendMin, addendMax, unit, forceBridge = true) {
  let base = startMin;
  let addend = addendMin;
  let gap = 0;
  let attempts = 0;

  while (attempts < 80) {
    attempts += 1;
    base = getAdditionRandomInt(startMin, startMax);
    addend = getAdditionRandomInt(addendMin, addendMax);
    gap = getAdditionNextMultiple(base, unit) - base;
    if ((!forceBridge || gap > 0) && gap < addend) {
      break;
    }
  }

  return {
    base,
    addend,
    anchor: base + gap,
    gap,
    leftover: addend - gap,
    total: base + addend,
  };
}

function createMake10PartnerQuestion() {
  const left = getAdditionRandomInt(0, 9);
  return createAdditionNumericQuestion(`${left} + ? = 10`, 10 - left, `Find the partner that takes ${left} to 10.`);
}

function createMake10DifferenceQuestion() {
  const value = getAdditionRandomInt(0, 9);
  return createAdditionNumericQuestion(`10 - ${value} = ?`, 10 - value, "Subtract from 10 to reveal the partner.");
}

function createMake10CompareQuestion() {
  const target = getAdditionRandomItem(["less", "equal", "greater"]);
  let left = 0;
  let right = 0;
  if (target === "equal") {
    left = getAdditionRandomInt(0, 10);
    right = 10 - left;
  } else if (target === "less") {
    left = getAdditionRandomInt(0, 7);
    right = getAdditionRandomInt(0, 9 - left);
  } else {
    left = getAdditionRandomInt(2, 9);
    right = getAdditionRandomInt(11 - left, 9);
  }
  return createAdditionCompareQuestion(`${left} + ${right}`, left + right, 10, "Compare the total with 10.");
}

function createMake10SumQuestion() {
  const left = getAdditionRandomInt(0, 9);
  const right = getAdditionRandomInt(0, 10 - left);
  return createAdditionNumericQuestion(`${left} + ${right} = ?`, left + right, "Use your 10 partners to see the total.");
}

function createOnesQuestion(mode) {
  let base = getAdditionRandomInt(21, 898);
  let addend = mode === "one-more" ? 1 : getAdditionRandomInt(2, 9);
  if (mode === "cross-ten") {
    base = 10 * getAdditionRandomInt(2, 89) + getAdditionRandomInt(6, 9);
    addend = getAdditionRandomInt(10 - (base % 10), 9);
  }
  return createAdditionNumericQuestion(`${base} + ${addend} = ?`, base + addend, "Move the ones forward.");
}

function createTensQuestion(mode) {
  let addend = mode === "one" ? 10 : 10 * getAdditionRandomInt(2, 6);
  let base = getAdditionRandomInt(20, 899);
  if (mode === "cross-hundred") {
    const hundreds = getAdditionRandomInt(0, 4) * 100;
    const tens = getAdditionRandomInt(7, 9);
    base = hundreds + tens * 10 + getAdditionRandomInt(0, 9);
    addend = 10 * getAdditionRandomInt(10 - tens, 6);
  }
  return createAdditionNumericQuestion(`${base} + ${addend} = ?`, base + addend, "Count the tens while tracking the hundreds.");
}

function createHundredsQuestion(mode) {
  const addend = mode === "one" ? 100 : 100 * getAdditionRandomInt(2, 6);
  const base = mode === "cross-thousand"
    ? getAdditionRandomInt(820, 980) + getAdditionRandomInt(0, 2) * 1000
    : getAdditionRandomInt(120, 2400);
  return createAdditionNumericQuestion(`${base} + ${addend} = ?`, base + addend, "Add the hundreds and keep the lower places organized.");
}

function createThousandsQuestion(mode) {
  const addend = mode === "one" ? 1000 : 1000 * getAdditionRandomInt(2, 8);
  const base = mode === "large" ? getAdditionRandomInt(6000, 24999) : getAdditionRandomInt(1100, 9999);
  return createAdditionNumericQuestion(`${base} + ${addend} = ?`, base + addend, "Add the thousands, then say the full number.");
}

function createCountingEasyQuestion(mode) {
  let left = getAdditionRandomInt(5, 9);
  let right = getAdditionRandomInt(1, 4);
  if (mode === "switch") {
    left = getAdditionRandomInt(1, 4);
    right = getAdditionRandomInt(6, 9);
  }
  return createAdditionNumericQuestion(`${left} + ${right} = ?`, left + right, "Start with the larger addend and count on.");
}

function createCountingMediumQuestion(mode) {
  let base = getAdditionRandomInt(21, 89);
  let addend = getAdditionRandomInt(2, 8);
  if (mode === "cross") {
    base = 10 * getAdditionRandomInt(2, 8) + getAdditionRandomInt(6, 9);
    addend = getAdditionRandomInt(10 - (base % 10), 9);
  }
  const flip = mode === "switch";
  return createAdditionNumericQuestion(
    `${flip ? addend : base} + ${flip ? base : addend} = ?`,
    base + addend,
    "Keep the two-digit number whole, then count on.",
  );
}

function createBridgeGapQuestion(min, max, unit) {
  let base = getAdditionRandomInt(min, max);
  while (base % unit === 0) {
    base = getAdditionRandomInt(min, max);
  }
  const gap = getAdditionNextMultiple(base, unit) - base;
  return createAdditionNumericQuestion(`${base} + ? = ${base + gap}`, gap, "Find the gap to the next clean anchor.");
}

function createBridgeSplitQuestion(min, max, addendMin, addendMax, unit) {
  const facts = createBridgeNumbers(min, max, addendMin, addendMax, unit);
  return createAdditionNumericQuestion(
    `${facts.addend} = ${facts.gap} + ?`,
    facts.leftover,
    `Use ${facts.gap} to move ${facts.base} to ${facts.anchor}.`,
  );
}

function createBridgeCompleteQuestion(min, max, addendMin, addendMax, unit) {
  const facts = createBridgeNumbers(min, max, addendMin, addendMax, unit);
  return createAdditionNumericQuestion(
    `${facts.base} + ${facts.addend} = ?`,
    facts.total,
    `${facts.base} + ${facts.gap} = ${facts.anchor}, then add ${facts.leftover}.`,
  );
}

function createBridgeAnchorQuestion(min, max, unit) {
  const base = getAdditionRandomInt(min, max);
  const anchor = getAdditionNextMultiple(base, unit);
  return createAdditionNumericQuestion(`${base} bridges to ?`, anchor, `The next ${unit === 100 ? "hundred" : "ten"} is ${anchor}.`);
}

function createAdditionQuestion(kind) {
  switch (kind) {
    case "make10-partner":
      return createMake10PartnerQuestion();
    case "make10-difference":
      return createMake10DifferenceQuestion();
    case "make10-compare":
      return createMake10CompareQuestion();
    case "make10-sum":
      return createMake10SumQuestion();
    case "ones-one-more":
      return createOnesQuestion("one-more");
    case "ones-few":
      return createOnesQuestion("few");
    case "ones-cross-ten":
      return createOnesQuestion("cross-ten");
    case "tens-one":
      return createTensQuestion("one");
    case "tens-many":
      return createTensQuestion("many");
    case "tens-cross-hundred":
      return createTensQuestion("cross-hundred");
    case "hundreds-one":
      return createHundredsQuestion("one");
    case "hundreds-many":
      return createHundredsQuestion("many");
    case "hundreds-cross-thousand":
      return createHundredsQuestion("cross-thousand");
    case "thousands-one":
      return createThousandsQuestion("one");
    case "thousands-many":
      return createThousandsQuestion("many");
    case "thousands-large":
      return createThousandsQuestion("large");
    case "count-easy-start":
    case "count-easy-small":
      return createCountingEasyQuestion("direct");
    case "count-easy-switch":
      return createCountingEasyQuestion("switch");
    case "count-medium-direct":
      return createCountingMediumQuestion("direct");
    case "count-medium-cross":
      return createCountingMediumQuestion("cross");
    case "count-medium-switch":
      return createCountingMediumQuestion("switch");
    case "bridge-easy-gap":
      return createBridgeGapQuestion(6, 9, 10);
    case "bridge-easy-split":
      return createBridgeSplitQuestion(6, 9, 3, 9, 10);
    case "bridge-easy-complete":
      return createBridgeCompleteQuestion(6, 9, 3, 9, 10);
    case "bridge-medium-gap":
      return createBridgeGapQuestion(21, 89, 10);
    case "bridge-medium-split":
      return createBridgeSplitQuestion(21, 89, 3, 9, 10);
    case "bridge-medium-complete":
      return createBridgeCompleteQuestion(21, 89, 3, 9, 10);
    case "bridge-advanced-anchor":
      return createBridgeAnchorQuestion(41, 398, getAdditionRandomItem([10, 100]));
    case "bridge-advanced-split":
      return createBridgeSplitQuestion(41, 398, 12, 89, getAdditionRandomItem([10, 100]));
    case "bridge-advanced-leftover":
    case "bridge-advanced-choice":
      return createBridgeCompleteQuestion(41, 398, 12, 89, getAdditionRandomItem([10, 100]));
    case "bridge-expert-anchor":
      return createBridgeAnchorQuestion(301, 978, 100);
    case "bridge-expert-split":
      return createBridgeSplitQuestion(301, 978, 35, 160, 100);
    case "bridge-expert-cross":
    case "bridge-expert-choice":
      return createBridgeCompleteQuestion(301, 978, 35, 160, 100);
    default:
      return createPlaceValueQuestion(1, 1, 9, 1, 99);
  }
}

function getAdditionLessonPlan(lessonId) {
  return ADDITION_LESSON_PLANS[lessonId] || ADDITION_LESSON_PLANS["make-10"];
}

function getAdditionLessonFlow(plan) {
  const flow = [];
  plan.components.forEach((component, index) => {
    const number = index + 1;
    flow.push({
      id: `idea-${number}`,
      type: "idea",
      label: `Idea ${number}`,
      component,
    });
    flow.push({
      id: `practice-${number}`,
      type: "practice",
      label: `Practice ${number}`,
      component,
    });
  });
  flow.push({
    id: "final-practice",
    type: "final",
    label: "Final Practice",
    component: plan.final,
  });
  flow.push({
    id: "complete",
    type: "complete",
    label: "Complete",
  });
  return flow;
}

function createAdditionLessonState(lessonId) {
  return {
    lessonId,
    flowIndex: 0,
    maxFlowIndexReached: 0,
    questionIndex: 0,
    correctCount: 0,
    answer: "",
    feedback: "",
    tone: "",
    currentQuestion: null,
    lastPracticeScore: null,
  };
}

function ensureAdditionLessonState() {
  const lessonId = state.technique.additionLessonId || "make-10";
  if (!state.technique.additionLesson || state.technique.additionLesson.lessonId !== lessonId) {
    state.technique.additionLesson = createAdditionLessonState(lessonId);
  }
  return state.technique.additionLesson;
}

function getAdditionFlowStep() {
  const lessonState = ensureAdditionLessonState();
  const plan = getAdditionLessonPlan(lessonState.lessonId);
  const flow = getAdditionLessonFlow(plan);
  return flow[lessonState.flowIndex] || flow[0];
}

function getAdditionPracticeGoal(step) {
  if (step.type === "final") {
    return step.component.count || ADDITION_FINAL_PRACTICE_COUNT;
  }
  return step.component.practiceCount || ADDITION_COMPONENT_PRACTICE_COUNT;
}

function createAdditionQuestionForStep(step) {
  if (step.type === "final") {
    return createAdditionQuestion(getAdditionRandomItem(step.component.questionKinds));
  }
  return createAdditionQuestion(step.component.questionKind);
}

function beginAdditionLessonPractice(step) {
  const lessonState = ensureAdditionLessonState();
  lessonState.questionIndex = 0;
  lessonState.correctCount = 0;
  lessonState.answer = "";
  lessonState.feedback = "";
  lessonState.tone = "";
  lessonState.currentQuestion = createAdditionQuestionForStep(step);
}

function setAdditionLessonFlowIndex(nextIndex) {
  const lessonState = ensureAdditionLessonState();
  const plan = getAdditionLessonPlan(lessonState.lessonId);
  const flow = getAdditionLessonFlow(plan);
  const boundedIndex = Math.max(0, Math.min(flow.length - 1, nextIndex));
  lessonState.flowIndex = boundedIndex;
  lessonState.maxFlowIndexReached = Math.max(lessonState.maxFlowIndexReached || 0, boundedIndex);
  lessonState.answer = "";
  lessonState.feedback = "";
  lessonState.tone = "";

  const step = flow[boundedIndex];
  if (step.type === "practice" || step.type === "final") {
    beginAdditionLessonPractice(step);
  } else {
    lessonState.currentQuestion = null;
    lessonState.questionIndex = 0;
    lessonState.correctCount = 0;
  }
}

function moveAdditionLessonFlow(direction) {
  const lessonState = ensureAdditionLessonState();
  setAdditionLessonFlowIndex(lessonState.flowIndex + direction);
}

function jumpToAdditionLessonStep(stepId) {
  const lessonState = ensureAdditionLessonState();
  const flow = getAdditionLessonFlow(getAdditionLessonPlan(lessonState.lessonId));
  const targetIndex = flow.findIndex((step) => step.id === stepId);
  if (targetIndex < 0) {
    return;
  }
  setAdditionLessonFlowIndex(targetIndex);
  renderTechniqueScreen();
}

function submitAdditionLessonAnswer(rawAnswer) {
  const lessonState = ensureAdditionLessonState();
  const step = getAdditionFlowStep();
  if (!lessonState.currentQuestion || (step.type !== "practice" && step.type !== "final")) {
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
  const isComplete = lessonState.questionIndex >= getAdditionPracticeGoal(step);
  if (isComplete) {
    lessonState.lastPracticeScore = lessonState.correctCount;
    if (step.type === "final") {
      markTechniqueCompleted(`addition:${lessonState.lessonId}`);
    }
    setAdditionLessonFlowIndex(lessonState.flowIndex + 1);
    return;
  }

  lessonState.feedback = isCorrect ? "Correct." : `Not quite. Correct answer: ${expected}`;
  lessonState.tone = isCorrect ? "success" : "error";
  lessonState.answer = "";
  lessonState.currentQuestion = createAdditionQuestionForStep(step);
}

function getAdditionLessonFlowPillsMarkup() {
  const lessonState = ensureAdditionLessonState();
  const flow = getAdditionLessonFlow(getAdditionLessonPlan(lessonState.lessonId));
  return flow.map((step, index) => {
    const isActive = index === lessonState.flowIndex;
    const classes = ["technique-stage-pill"];
    if (isActive) {
      classes.push("is-active");
    } else {
      classes.push("is-unlocked");
    }

    const attrs = !isActive
      ? `data-addition-stage-jump="${step.id}" tabindex="0" role="button" aria-label="Go to ${escapeHtml(step.label)}"`
      : "";

    return `
      <span class="${classes.join(" ")}" ${attrs}>
        <span>${escapeHtml(step.label)}</span>
      </span>
    `;
  }).join("");
}

function renderAdditionIdeaBlock(step) {
  const component = step.component;
  return `
    <section class="technique-lesson-card addition-idea-card">
      <h3 class="technique-step-title">${escapeHtml(component.title)}</h3>
      <p class="technique-helper">${escapeHtml(component.copy)}</p>
      <div class="technique-rule-grid">
        ${component.examples
          .map(
            (example) => `
              <article class="technique-example-card">
                <p class="technique-equation addition-example-equation">${escapeHtml(example)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="technique-action-row">
        <button class="ghost-button" type="button" data-technique-action="addition-back">
          Back
        </button>
        <button class="primary-button" type="button" data-technique-action="addition-next">
          Practice
        </button>
      </div>
    </section>
  `;
}

function renderAdditionNumericPractice(step) {
  const lessonState = ensureAdditionLessonState();
  const question = lessonState.currentQuestion || createAdditionQuestionForStep(step);
  lessonState.currentQuestion = question;
  const answerState = lessonState.tone === "success" ? "correct" : lessonState.tone === "error" ? "error" : "idle";
  const goal = getAdditionPracticeGoal(step);

  return `
    <form class="technique-lesson-card technique-question-shell technique-practice-shell" data-technique-form="addition-practice" autocomplete="off">
      <div class="technique-question-meta">
        <span class="technique-progress-copy">Rep ${Math.min(lessonState.questionIndex + 1, goal)} of ${goal}</span>
      </div>
      <div class="problem-wrap technique-practice-problem">
        <p class="technique-question">${escapeHtml(question.prompt)}</p>
      </div>
      <div class="technique-input-row technique-practice-input-row">
        <div class="technique-answer-wrap ${
          answerState === "correct" ? "is-correct" : answerState === "error" ? "is-error" : ""
        }">
          <label class="answer-field">
            <span class="sr-only">Lesson answer</span>
            <input
              type="text"
              name="additionLessonAnswer"
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
      ${question.hint ? `<article class="technique-hint addition-practice-hint">${escapeHtml(question.hint)}</article>` : ""}
      ${state.useTouchKeypad ? getTechniqueKeypadMarkup() : ""}
      <p class="technique-feedback ${lessonState.tone}">${escapeHtml(lessonState.feedback)}</p>
    </form>
  `;
}

function renderAdditionComparePractice(step) {
  const lessonState = ensureAdditionLessonState();
  const question = lessonState.currentQuestion || createAdditionQuestionForStep(step);
  lessonState.currentQuestion = question;
  const goal = getAdditionPracticeGoal(step);

  return `
    <section class="technique-lesson-card technique-question-shell technique-practice-shell">
      <div class="technique-question-meta">
        <span class="technique-progress-copy">Rep ${Math.min(lessonState.questionIndex + 1, goal)} of ${goal}</span>
      </div>
      <div class="problem-wrap technique-practice-problem">
        <p class="technique-question technique-compare-question">
          <span>${escapeHtml(question.prompt)}</span>
          <span class="technique-compare-box" aria-hidden="true"></span>
          <span>${escapeHtml(question.compareTarget)}</span>
        </p>
        <p class="technique-compare-mini">${escapeHtml(question.compactPrompt)}</p>
      </div>
      ${question.hint ? `<article class="technique-hint addition-practice-hint">${escapeHtml(question.hint)}</article>` : ""}
      <div class="technique-operator-row">
        <button class="ghost-button technique-operator-button" type="button" data-technique-action="addition-symbol-less">
          <span class="technique-operator-symbol">&lt;</span>
          <span class="technique-operator-label">Less than</span>
        </button>
        <button class="ghost-button technique-operator-button" type="button" data-technique-action="addition-symbol-equal">
          <span class="technique-operator-symbol">=</span>
          <span class="technique-operator-label">Equal to</span>
        </button>
        <button class="ghost-button technique-operator-button" type="button" data-technique-action="addition-symbol-greater">
          <span class="technique-operator-symbol">&gt;</span>
          <span class="technique-operator-label">Greater than</span>
        </button>
      </div>
      <p class="technique-feedback ${lessonState.tone}">${escapeHtml(lessonState.feedback)}</p>
    </section>
  `;
}

function renderAdditionPracticeBlock(step) {
  const question = ensureAdditionLessonState().currentQuestion || createAdditionQuestionForStep(step);
  ensureAdditionLessonState().currentQuestion = question;
  return question.inputType === "compare"
    ? renderAdditionComparePractice(step)
    : renderAdditionNumericPractice(step);
}

function renderAdditionFinalIntro(step) {
  return `
    <section class="technique-lesson-card addition-idea-card">
      <h3 class="technique-step-title">Final Practice</h3>
      <p class="technique-helper">${escapeHtml(step.component.copy)}</p>
      <article class="technique-hint">
        This set blends every atomic move from the lesson. Use the whole skill now.
      </article>
      <div class="technique-action-row">
        <button class="ghost-button" type="button" data-technique-action="addition-back">
          Back
        </button>
        <button class="primary-button" type="button" data-technique-action="addition-next">
          Start Final Practice
        </button>
      </div>
    </section>
  `;
}

function renderAdditionCompleteBlock(plan) {
  return `
    <section class="technique-lesson-card">
      <h3 class="technique-step-title">${escapeHtml(plan.completeTitle)}</h3>
      <p class="technique-helper">${escapeHtml(plan.completeCopy)}</p>
      <article class="technique-hint">
        Nice work. That lesson is now linked to your training menu for review.
      </article>
      <div class="technique-action-row">
        <button class="primary-button" type="button" data-technique-action="start-addition-workout">
          Start Focused Workout
        </button>
        <button class="ghost-button" type="button" data-technique-action="addition-restart">
          Restart Lesson
        </button>
        <button class="ghost-button" type="button" data-technique-action="back-to-techniques">
          Back to Lessons
        </button>
      </div>
    </section>
  `;
}

function renderAdditionLessonScreen(lesson) {
  const lessonState = ensureAdditionLessonState();
  const plan = getAdditionLessonPlan(lessonState.lessonId);
  const step = getAdditionFlowStep();
  let bodyMarkup = "";

  if (step.type === "idea") {
    bodyMarkup = renderAdditionIdeaBlock(step);
  } else if (step.type === "practice") {
    bodyMarkup = renderAdditionPracticeBlock(step);
  } else if (step.type === "final") {
    bodyMarkup = lessonState.currentQuestion
      ? renderAdditionPracticeBlock(step)
      : renderAdditionFinalIntro(step);
  } else {
    bodyMarkup = renderAdditionCompleteBlock(plan);
  }

  return `
    <div class="technique-lesson-wrap">
      <div class="technique-lesson-head">
        <div>
          <p class="section-kicker">Addition Technique</p>
          <h2>${escapeHtml(lesson.title)}</h2>
        </div>
        <button class="ghost-button subtle-button" type="button" data-technique-action="back-to-techniques">
          Back to Lessons
        </button>
      </div>
      <div class="technique-stage-pills">${getAdditionLessonFlowPillsMarkup()}</div>
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

  ensureAdditionLessonState();
  return renderAdditionLessonScreen(lesson);
}

function renderTechniqueCelebrationScreen() {
  const plan = getMultiplicationLessonPlan(state.technique.selectedTable);
  return `
    <div class="technique-celebration-shell">
      <div class="technique-completion-card">
        <p class="section-kicker">Lesson Complete</p>
        <h2>${escapeHtml(plan.completeTitle)}</h2>
        <p class="technique-completion-copy">
          ${escapeHtml(plan.completeCopy)} You locked in ${TECHNIQUE_COMPLETION_GOAL} solo reps.
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

  if (form.dataset.techniqueForm === "addition-practice") {
    submitAdditionLessonAnswer(state.technique.additionLesson?.answer || "");
    renderTechniqueScreen();
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
    if (input.name === "additionLessonAnswer") {
      const nextValue = sanitiseTechniqueEntry(input.value);
      input.value = nextValue;
      ensureAdditionLessonState().answer = nextValue;
      return;
    }

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
    applySettingsSnapshot(
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
      'input[name="techniqueAnswer"]:not([disabled]), input[name="additionLessonAnswer"]:not([disabled]), input[name="make10Answer"]:not([disabled])',
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
  state.technique.make10Lesson = null;
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

