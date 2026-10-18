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
    submittedAnswer: "",
    expectedAnswer: "",
    feedbackPending: false,
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
  lessonState.submittedAnswer = "";
  lessonState.expectedAnswer = "";
  lessonState.feedbackPending = false;
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
  lessonState.submittedAnswer = "";
  lessonState.expectedAnswer = "";
  lessonState.feedbackPending = false;

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
  if (
    !lessonState.currentQuestion ||
    lessonState.feedbackPending ||
    (step.type !== "practice" && step.type !== "final")
  ) {
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

  const isComplete = lessonState.correctCount >= getAdditionPracticeGoal(step);
  lessonState.submittedAnswer = submitted;
  lessonState.expectedAnswer = expected;
  lessonState.feedback = isCorrect ? "Correct." : `Correct answer: ${expected}`;
  lessonState.tone = isCorrect ? "success" : "error";
  lessonState.feedbackPending = true;
  renderTechniqueScreen();

  window.clearTimeout(state.techniqueAdvanceTimeoutId);
  state.techniqueAdvanceTimeoutId = window.setTimeout(() => {
    state.techniqueAdvanceTimeoutId = null;
    if (isComplete) {
      lessonState.lastPracticeScore = lessonState.correctCount;
      if (step.type === "final") {
        markTechniqueCompleted(`addition:${lessonState.lessonId}`);
      }
      setAdditionLessonFlowIndex(lessonState.flowIndex + 1);
      renderTechniqueScreen();
      return;
    }
    lessonState.questionIndex += 1;
    lessonState.answer = "";
    lessonState.feedback = "";
    lessonState.tone = "";
    lessonState.submittedAnswer = "";
    lessonState.expectedAnswer = "";
    lessonState.feedbackPending = false;
    lessonState.currentQuestion = createAdditionQuestionForStep(step);
    renderTechniqueScreen();
  }, 760);
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
  const feedbackReveal = lessonState.feedbackPending
    ? `<p class="technique-answer-reveal ${lessonState.tone}">
        ${lessonState.tone === "success" ? "Correct" : `Answer: ${escapeHtml(lessonState.expectedAnswer)}`}
      </p>`
    : "";

  return `
    <form class="technique-lesson-card technique-question-shell technique-practice-shell" data-technique-form="addition-practice" autocomplete="off">
      <div class="problem-wrap technique-practice-problem">
        ${getTechniqueCorrectCounterMarkup(lessonState.correctCount, goal, "Correct reps")}
        <p class="technique-question">${escapeHtml(question.prompt)}</p>
        ${feedbackReveal}
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
              ${lessonState.feedbackPending ? "disabled" : ""}
              data-technique-autofocus="true"
            />
          </label>
          <span class="technique-answer-signal">
            ${getTechniqueStatusIconMarkup(answerState, "technique-status-icon-inline")}
          </span>
        </div>
        <button class="primary-button" type="submit" ${lessonState.feedbackPending ? "disabled" : ""}>Check Answer</button>
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
  const expected = lessonState.expectedAnswer || question.expected || "";
  const displayedSymbol = lessonState.feedbackPending ? expected : "";
  const compareStateClass = lessonState.feedbackPending ? `is-${lessonState.tone}` : "";
  return `
    <section class="technique-lesson-card technique-question-shell technique-practice-shell">
      <div class="problem-wrap technique-practice-problem">
        ${getTechniqueCorrectCounterMarkup(lessonState.correctCount, goal, "Correct reps")}
        <p class="technique-question technique-compare-question">
          <span>${escapeHtml(question.prompt)}</span>
          <span class="technique-compare-box ${compareStateClass}" aria-hidden="true">${escapeHtml(displayedSymbol)}</span>
          <span>${escapeHtml(question.compareTarget)}</span>
        </p>
      </div>
      ${question.hint ? `<article class="technique-hint addition-practice-hint">${escapeHtml(question.hint)}</article>` : ""}
      <div class="technique-operator-row">
        <button class="${getTechniqueOperatorFeedbackClasses("<", expected, lessonState.submittedAnswer, lessonState.feedbackPending)}" type="button" data-technique-action="addition-symbol-less" ${lessonState.feedbackPending ? "disabled" : ""}>
          <span class="technique-operator-symbol">&lt;</span>
          <span class="technique-operator-label">Less than</span>
        </button>
        <button class="${getTechniqueOperatorFeedbackClasses("=", expected, lessonState.submittedAnswer, lessonState.feedbackPending)}" type="button" data-technique-action="addition-symbol-equal" ${lessonState.feedbackPending ? "disabled" : ""}>
          <span class="technique-operator-symbol">=</span>
          <span class="technique-operator-label">Equal to</span>
        </button>
        <button class="${getTechniqueOperatorFeedbackClasses(">", expected, lessonState.submittedAnswer, lessonState.feedbackPending)}" type="button" data-technique-action="addition-symbol-greater" ${lessonState.feedbackPending ? "disabled" : ""}>
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
        Nice work. This lesson is now saved in your training menu for review. If you want to practice more, press Start Workout.
      </article>
      <div class="technique-action-row technique-action-row-end">
        <button class="primary-button" type="button" data-technique-action="start-addition-workout">
          Start Workout
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
