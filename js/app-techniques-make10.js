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
    submittedAnswer: "",
    expectedAnswer: "",
    feedbackPending: false,
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
  lessonState.submittedAnswer = "";
  lessonState.expectedAnswer = "";
  lessonState.feedbackPending = false;
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
  lessonState.submittedAnswer = "";
  lessonState.expectedAnswer = "";
  lessonState.feedbackPending = false;
  lessonState.currentQuestion = null;
}

function clearMake10FeedbackState(lessonState) {
  lessonState.answer = "";
  lessonState.feedback = "";
  lessonState.tone = "";
  lessonState.submittedAnswer = "";
  lessonState.expectedAnswer = "";
  lessonState.feedbackPending = false;
}

function submitMake10Answer(rawAnswer) {
  const lessonState = ensureMake10LessonState();
  const stepId = getMake10Step().id;
  if (!lessonState.currentQuestion || lessonState.feedbackPending) {
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

  const isComplete = lessonState.correctCount >= MAKE10_PRACTICE_QUESTION_COUNT;
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
      advanceMake10AfterPractice();
      renderTechniqueScreen();
      return;
    }
    lessonState.questionIndex += 1;
    clearMake10FeedbackState(lessonState);
    lessonState.currentQuestion = createMake10Question(stepId, lessonState.questionIndex);
    renderTechniqueScreen();
  }, 760);
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
  const feedbackReveal = lessonState.feedbackPending
    ? `<p class="technique-answer-reveal ${lessonState.tone}">
        ${lessonState.tone === "success" ? "Correct" : `Answer: ${escapeHtml(lessonState.expectedAnswer)}`}
      </p>`
    : "";

  return `
    <form class="technique-lesson-card technique-question-shell technique-practice-shell" data-technique-form="${stepId}" autocomplete="off">
      <div class="problem-wrap technique-practice-problem">
        ${getTechniqueCorrectCounterMarkup(
          lessonState.correctCount,
          MAKE10_PRACTICE_QUESTION_COUNT,
          "Correct reps",
        )}
        <p class="technique-question">${prompt}</p>
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
              name="make10Answer"
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
      ${state.useTouchKeypad ? getTechniqueKeypadMarkup() : ""}
      <p class="technique-feedback ${lessonState.tone}">${escapeHtml(lessonState.feedback)}</p>
    </form>
  `;
}

function renderMake10ComparePractice() {
  const lessonState = ensureMake10LessonState();
  const prompt = lessonState.currentQuestion?.prompt || "";
  const total = lessonState.currentQuestion?.total;
  const expected = lessonState.expectedAnswer || lessonState.currentQuestion?.expected || "";
  const displayedSymbol = lessonState.feedbackPending ? expected : "";
  const compareStateClass = lessonState.feedbackPending ? `is-${lessonState.tone}` : "";
  return `
    <section class="technique-lesson-card technique-question-shell technique-practice-shell">
      <div class="problem-wrap technique-practice-problem">
        ${getTechniqueCorrectCounterMarkup(
          lessonState.correctCount,
          MAKE10_PRACTICE_QUESTION_COUNT,
          "Correct reps",
        )}
        <p class="technique-question technique-compare-question">
          <span>${prompt}</span>
          <span class="technique-compare-box ${compareStateClass}" aria-hidden="true">${escapeHtml(displayedSymbol)}</span>
          <span>10</span>
        </p>
      </div>
      <div class="technique-operator-row">
        <button class="${getTechniqueOperatorFeedbackClasses("<", expected, lessonState.submittedAnswer, lessonState.feedbackPending)}" type="button" data-technique-action="make10-symbol-less" ${lessonState.feedbackPending ? "disabled" : ""}>
          <span class="technique-operator-symbol">&lt;</span>
          <span class="technique-operator-label">Less than</span>
        </button>
        <button class="${getTechniqueOperatorFeedbackClasses("=", expected, lessonState.submittedAnswer, lessonState.feedbackPending)}" type="button" data-technique-action="make10-symbol-equal" ${lessonState.feedbackPending ? "disabled" : ""}>
          <span class="technique-operator-symbol">=</span>
          <span class="technique-operator-label">Equal to</span>
        </button>
        <button class="${getTechniqueOperatorFeedbackClasses(">", expected, lessonState.submittedAnswer, lessonState.feedbackPending)}" type="button" data-technique-action="make10-symbol-greater" ${lessonState.feedbackPending ? "disabled" : ""}>
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
        Nice work. You're building fluent number sense with sums around 10. If you want to practice more, press Start Workout.
      </article>
      <div class="technique-action-row technique-action-row-end">
        <button class="primary-button" type="button" data-technique-action="start-make10-workout">
          Start Workout
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
      </div>
      <div class="technique-stage-pills">${getMake10FlowPillsMarkup()}</div>
      ${bodyMarkup}
    </div>
  `;
}
