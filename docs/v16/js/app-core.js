const PRODUCT_STORAGE_PREFIX = "math-muscle-trainer";
const LEGACY_PRODUCT_STORAGE_PREFIX = ["multiplication", "trainer"].join("-");
const STORAGE_KEY = `${PRODUCT_STORAGE_PREFIX}-progress-v2`;
const LEGACY_STORAGE_KEYS = [
  `${LEGACY_PRODUCT_STORAGE_PREFIX}-progress-v2`,
  `${LEGACY_PRODUCT_STORAGE_PREFIX}-progress-v1`,
];
const HERO_MESSAGE_KEY = `${PRODUCT_STORAGE_PREFIX}-hero-message-v1`;
const RESULTS_MESSAGE_KEY_PREFIX = `${PRODUCT_STORAGE_PREFIX}-results-message-v1`;
const THEME_STORAGE_KEY = `${PRODUCT_STORAGE_PREFIX}-theme-v1`;
const LEGACY_THEME_STORAGE_KEYS = [`${LEGACY_PRODUCT_STORAGE_PREFIX}-theme-v1`];
const COLOR_MODE_STORAGE_KEY = `${PRODUCT_STORAGE_PREFIX}-color-mode-v1`;
const LEGACY_COLOR_MODE_STORAGE_KEYS = [`${LEGACY_PRODUCT_STORAGE_PREFIX}-color-mode-v1`];
const KEYPAD_PREFERENCE_STORAGE_KEY = `${PRODUCT_STORAGE_PREFIX}-keypad-preference-v1`;
const LEGACY_KEYPAD_PREFERENCE_STORAGE_KEYS = [
  `${LEGACY_PRODUCT_STORAGE_PREFIX}-keypad-preference-v1`,
];
const APP_VERSION = "v0.19.0";
const FACTOR_LIMIT = 12;
const TABLE_FACTORS = Array.from({ length: FACTOR_LIMIT }, (_, index) => index + 1);
const QUESTION_PRESETS = [10, 20, 30];
const TIME_PRESETS = [1, 3, 5];
const DAILY_TARGET = 10;
const COUNTDOWN_STEPS = ["3", "2", "1", "START!"];
const ENDLESS_COLORS = [
  "#c6452d",
  "#e2752d",
  "#d0a14a",
  "#7c8794",
  "#4e5d6b",
  "#2f7a49",
  "#885d4b",
  "#6f4f45",
  "#9d5a2f",
  "#39424b",
];
const HERO_MESSAGES = [
  "Strength is built one steady rep at a time.",
  "Short workouts build strong recall.",
  "Every rep makes the next one lighter.",
  "Progress comes from showing up again.",
  "Strong habits are built on ordinary days.",
  "Hard work beats talent alone",
  "Productive struggle unleashes potential",
  "The weight gets lighter when the pattern gets familiar.",
  "Discipline turns effort into strength.",
  "When you build your mind, you don't have to use your muscles",
  "When the going gets tough, the tough get going.",
];
const HOME_DAILY_THOUGHTS = [
  "Grow your brain & begin your reign.",
  "Short workouts build strong recall.",
  "Every clean rep makes the next one lighter.",
  "Show up small. Grow strong.",
  "Fast facts begin with calm form.",
  "Practice turns patterns into power.",
  "Correct form builds progress.",
];
const RESULTS_TITLE_POOLS = {
  completed: [
    "Great job on showing up today.",
    "Another workout in the books.",
    "You put the work in today.",
    "Showing up counts.",
  ],
  progress: [
    "One step closer to better.",
    "You're building real momentum.",
    "You beat a previous mark.",
    "Progress looks good on you.",
  ],
  strong: [
    "Beast Mode.",
    "Fire.",
    "You were locked in.",
    "That effort showed.",
  ],
};

const OPERATION_CONFIG = {
  multiplication: {
    label: "Multiplication",
    symbol: "x",
    buildPool(settings) {
      return buildMultiplicationPool(settings);
    },
  },
  addition: {
    label: "Addition",
    symbol: "+",
    buildPool(settings) {
      return buildAdditionPool(settings);
    },
  },
  subtraction: {
    label: "Subtraction",
    symbol: "-",
    buildPool(settings) {
      return buildSubtractionPool(settings);
    },
  },
  division: {
    label: "Division",
    symbol: "/",
    buildPool(settings) {
      return buildDivisionPool(settings);
    },
  },
};

const RESULTS_SLIDES = ["summary", "tracker", "focus"];
const PROGRESS_SLIDES = ["overview", "mastery", "tracker", "facts", "focus", "records", "coach"];
const TECHNIQUE_TABLE = 10;
const TECHNIQUE_COMPLETION_GOAL = 5;
const TECHNIQUE_AUTO_ADVANCE_MS = 1000;
const TECHNIQUE_STEPS = [
  { id: "rule", label: "Idea #1" },
  { id: "switch", label: "Idea #2" },
  { id: "pattern", label: "Warm Up" },
  { id: "guided", label: "Assisted Reps" },
  { id: "quick-check", label: "Solo Reps" },
];
const THEME_OPTIONS = [
  { key: "original", label: "Original" },
  { key: "sunny-beach-day", label: "Sunny Beach Day" },
  { key: "jungle", label: "Jungle" },
  { key: "aang", label: "Aang" },
  { key: "solo-leveling", label: "Solo Leveling" },
  { key: "mudkip", label: "Mudkip" },
];
const COLOR_MODE_OPTIONS = ["dark", "light"];
const KEYPAD_PREFERENCE_OPTIONS = ["auto", "always-on", "always-off"];
const FACT_TRACKER_DETAIL_OPTIONS = {
  addition: [
    { key: "overall", label: "Overall" },
    { key: "with-regrouping", label: "With regrouping" },
    { key: "without-regrouping", label: "Without regrouping" },
  ],
  subtraction: [
    { key: "overall", label: "Overall" },
  ],
  division: [
    { key: "overall", label: "Overall" },
  ],
  multiplication: [
    { key: "overall", label: "Overall" },
    { key: "positive", label: "Positive Integers" },
    { key: "all-integers", label: "All Integers" },
  ],
};
const MULTIPLICATION_SIGNED_TOTAL_FACTS = (TABLE_FACTORS.length - 1) * 4 + 3;

const OPERATION_OPTIONS = ["addition", "subtraction", "multiplication", "division"];
const OPERATION_LABELS = {
  multiplication: "Multiplication",
  addition: "Addition",
  subtraction: "Subtraction",
  division: "Division",
};
const OPERATION_SYMBOLS = {
  multiplication: "x",
  addition: "+",
  subtraction: "-",
  division: "/",
};
const OPERATION_DISPLAY_SYMBOLS = {
  multiplication: "x",
  addition: "+",
  subtraction: "-",
  division: "\u00f7",
};
const BUCKET_STATUS_MIN_ATTEMPTS = 6;
const BUCKET_STATUS_STRONG_MIN_ATTEMPTS = 10;
const BUCKET_STATUS_BUILDING_MIN_ACCURACY = 0.7;
const BUCKET_STATUS_STRONG_MIN_ACCURACY = 0.9;
const BUCKET_TREND_WINDOW_DAYS = 7;
const BUCKET_TREND_MIN_TOTAL_ATTEMPTS = 6;
const BUCKET_TREND_MIN_RECENT_ATTEMPTS = 3;
const BUCKET_TREND_DELTA_THRESHOLD = 0.08;
const ROLLING_WINDOW_DAYS = 31;
const ADDITION_BUCKET_EXAMPLE_CAP = 5;
const ADDITION_BUCKET_EXAMPLE_DISPLAY_LIMIT = 5;
const PROGRESS_SAVE_DEBOUNCE_MS = 250;
const FACT_PROGRESS_MAX_PER_OPERATION = 1200;
const FACT_PROGRESS_MAX_TOTAL = 2000;
const ANSWER_TELEMETRY_MAX_ENTRIES = 500;
const MASTERY_RANK_LABELS = ["Rookie", "Novice", "Adept", "Expert", "Elite", "Master", "Legend"];
const ADDITION_DIGIT_BUCKETS = {
  easy: [
    [1, 1],
  ],
  medium: [
    [1, 2],
    [2, 2],
  ],
  hard: [
    [1, 3],
    [2, 3],
    [3, 3],
  ],
};
const ADDITION_TRACKER_BUCKETS = [
  { key: "make-10", label: "Make 10 Facts" },
  { key: "1-1", label: "1-digit + 1-digit" },
  { key: "1-2", label: "1-digit + 2-digit" },
  { key: "2-2", label: "2-digit + 2-digit" },
  { key: "1-3", label: "3-digit + 1-digit" },
  { key: "2-3", label: "3-digit + 2-digit" },
  { key: "3-3", label: "3-digit + 3-digit" },
];
const ADDITION_TRACKER_BUCKET_KEYS = new Set(
  ADDITION_TRACKER_BUCKETS.map((bucket) => bucket.key),
);
const SUBTRACTION_TRACKER_BUCKETS = [
  { key: "1-1", label: "1-digit - 1-digit" },
  { key: "2-1", label: "2-digit - 1-digit" },
  { key: "2-2", label: "2-digit - 2-digit" },
  { key: "3-1", label: "3-digit - 1-digit" },
  { key: "3-2", label: "3-digit - 2-digit" },
  { key: "3-3", label: "3-digit - 3-digit" },
];
const SUBTRACTION_TRACKER_BUCKET_KEYS = new Set(
  SUBTRACTION_TRACKER_BUCKETS.map((bucket) => bucket.key),
);
const ADDITION_LESSONS = [
  {
    id: "make-10",
    title: "Make 10",
    description: "Spot number pairs that combine to 10 quickly.",
    status: "ready",
    selectable: true,
  },
  {
    id: "adding-by-1s",
    title: "Adding by 1s",
    description: "Multi-digit numbers plus 1s-only place value changes.",
    status: "ready",
    selectable: true,
  },
  {
    id: "adding-by-10s",
    title: "Adding by 10s",
    description: "Multi-digit numbers plus 10s-only place value changes.",
    status: "ready",
    selectable: true,
  },
  {
    id: "adding-by-100s",
    title: "Adding by 100s",
    description: "Multi-digit numbers plus 100s-only place value changes.",
    status: "ready",
    selectable: true,
  },
  {
    id: "adding-by-1000s",
    title: "Adding by 1000s",
    description: "Multi-digit numbers plus 1000s-only place value changes.",
    status: "ready",
    selectable: true,
  },
  {
    id: "counting-on-easy",
    title: "Counting On (Easy)",
    description: "Single + single facts with counting on strategies.",
    status: "ready",
    selectable: true,
  },
  {
    id: "counting-on-medium",
    title: "Counting On (Medium)",
    description: "Double + single combinations with counting on.",
    status: "ready",
    selectable: true,
  },
  {
    id: "bridging-10-easy",
    title: "Bridging to 10 (Easy)",
    description: "Single + single with a bridge-to-10 move first.",
    status: "ready",
    selectable: true,
  },
  {
    id: "bridging-10-medium",
    title: "Bridging to 10 (Medium)",
    description: "Double + single bridging to a clean group of 10.",
    status: "ready",
    selectable: true,
  },
  {
    id: "bridging-advanced",
    title: "Bridging Advanced",
    description: "Double + double facts, bridge to nearest 10 or 100.",
    status: "ready",
    selectable: true,
  },
  {
    id: "bridging-expert",
    title: "Bridging Expert",
    description: "Triple mixes with multi-bridge choices and carry decisions.",
    status: "ready",
    selectable: true,
  },
];

const WORKOUT_MODE_DEFINITIONS = {
  multiplication: [
    { key: "timed", label: "H.I.T" },
    { key: "question-goal", label: "Target Reps" },
    { key: "isolation", label: "Isolation" },
    { key: "zen", label: "Zen Mode" },
    { key: "spar", label: "Spar Mode" },
  ],
  addition: [
    { key: "timed", label: "H.I.T" },
    { key: "question-goal", label: "Target Reps" },
    { key: "zen", label: "Zen Mode" },
    { key: "spar", label: "Spar Mode" },
  ],
  subtraction: [
    { key: "timed", label: "H.I.T" },
    { key: "question-goal", label: "Target Reps" },
    { key: "zen", label: "Zen Mode" },
    { key: "spar", label: "Spar Mode" },
  ],
  division: [
    { key: "timed", label: "H.I.T" },
    { key: "question-goal", label: "Target Reps" },
    { key: "isolation", label: "Isolation" },
    { key: "zen", label: "Zen Mode" },
    { key: "spar", label: "Spar Mode" },
  ],
};
const SUBTRACTION_DIGIT_BUCKETS = {
  easy: [
    [1, 1],
  ],
  medium: [
    [2, 1],
    [2, 2],
  ],
  hard: [
    [3, 1],
    [3, 2],
    [3, 3],
  ],
};
let operationPruneTimerId = null;

const elements = {
  appShell: document.querySelector(".app-shell"),
  pageShell: document.querySelector(".page-shell"),
  pageHeader: document.querySelector(".page-header"),
  screens: Array.from(document.querySelectorAll(".screen")),
  navButtons: Array.from(document.querySelectorAll(".nav-button, .app-dock-button")),
  viewButtons: Array.from(document.querySelectorAll("[data-view-target]")),
  globalOptionsButtons: Array.from(document.querySelectorAll("[data-open-options]")),
  optionsButton: document.getElementById("optionsButton"),
  aboutButton: document.getElementById("aboutButton"),
  optionsDialog: document.getElementById("optionsDialog"),
  aboutDialog: document.getElementById("aboutDialog"),
  optionsCloseButton: document.getElementById("optionsCloseButton"),
  aboutCloseButton: document.getElementById("aboutCloseButton"),
  appVersion: document.getElementById("appVersion"),
  heroMessage: document.getElementById("heroMessage"),
  setupOperationPanel: document.getElementById("setupOperationPanel"),
  operationChoiceGrid: document.getElementById("operationChoiceGrid"),
  operationResetButtons: Array.from(document.querySelectorAll("[data-operation-reset]")),
  setupStepShell: document.getElementById("setupStepShell"),
  operationInputs: Array.from(document.querySelectorAll('input[name="operation"]')),
  sessionTypeInputs: Array.from(document.querySelectorAll('input[name="sessionType"]')),
  additionDifficultyInputs: Array.from(document.querySelectorAll('input[name="additionDifficulty"]')),
  subtractionDifficultyInputs: Array.from(document.querySelectorAll('input[name="subtractionDifficulty"]')),
  settingsForm: document.getElementById("settingsForm"),
  sessionTypeField: document.getElementById("sessionTypeField"),
  setupSettingsPanel: document.getElementById("setupSettingsPanel"),
  setupSettingsAwaiting: document.getElementById("setupSettingsAwaiting"),
  setupStartButton: document.getElementById("setupStartButton"),
  minFactor: document.getElementById("minFactor"),
  maxFactor: document.getElementById("maxFactor"),
  isolationField: document.getElementById("isolationField"),
  isolationSessionChoice: document.getElementById("isolationSessionChoice"),
  focusFactor: document.getElementById("focusFactor"),
  adaptiveMode: document.getElementById("adaptiveMode"),
  negativesMode: document.getElementById("negativesMode"),
  negativesToggleRow: document.getElementById("negativesToggleRow"),
  additionRegroupingMode: document.getElementById("additionRegroupingMode"),
  additionRegroupingToggleRow: document.getElementById("additionRegroupingToggleRow"),
  freeTrainingField: document.getElementById("freeTrainingField"),
  sparTimingField: document.getElementById("sparTimingField"),
  timeField: document.getElementById("timeField"),
  timeCustomField: document.getElementById("timeCustomField"),
  timeCustom: document.getElementById("timeCustom"),
  questionTargetField: document.getElementById("questionTargetField"),
  questionCustomField: document.getElementById("questionCustomField"),
  questionCustom: document.getElementById("questionCustom"),
  additionDifficultyField: document.getElementById("additionDifficultyField"),
  subtractionDifficultyField: document.getElementById("subtractionDifficultyField"),
  resetProgressButton: document.getElementById("resetProgressButton"),
  countdownNumber: document.getElementById("countdownNumber"),
  countdownCopy: document.getElementById("countdownCopy"),
  sessionBadge: document.getElementById("sessionBadge"),
  finishSessionButton: document.getElementById("finishSessionButton"),
  practicePanel: document.querySelector("#practiceScreen .practice-panel"),
  problemWrap: document.querySelector("#practiceScreen .problem-wrap"),
  progressTrack: document.querySelector("#practiceScreen .progress-track"),
  sparStrikeHud: document.getElementById("sparStrikeHud"),
  sparStrikeBoxes: Array.from(document.querySelectorAll("[data-spar-strike-box]")),
  questionTimer: document.getElementById("questionTimer"),
  sessionTimer: document.getElementById("sessionTimer"),
  practiceAttemptedCount: document.getElementById("practiceAttemptedCount"),
  progressFill: document.getElementById("progressFill"),
  progressText: document.getElementById("progressText"),
  comboIndicator: document.getElementById("comboIndicator"),
  practiceResponseRail: document.getElementById("practiceResponseRail"),
  problemText: document.getElementById("problemText"),
  answerForm: document.getElementById("answerForm"),
  answerInput: document.getElementById("answerInput"),
  answerStatusIcon: document.getElementById("answerStatusIcon"),
  checkButton: document.getElementById("checkButton"),
  skipButton: document.getElementById("skipButton"),
  practiceKeypad: document.getElementById("practiceKeypad"),
  feedback: document.getElementById("feedback"),
  resultsTitle: document.getElementById("resultsTitle"),
  resultQuestions: document.getElementById("resultQuestions"),
  resultCorrect: document.getElementById("resultCorrect"),
  resultAccuracy: document.getElementById("resultAccuracy"),
  resultPace: document.getElementById("resultPace"),
  resultBestStreak: document.getElementById("resultBestStreak"),
  resultSkipped: document.getElementById("resultSkipped"),
  repeatSessionButton: document.getElementById("repeatSessionButton"),
  resultsMonthLabel: document.getElementById("resultsMonthLabel"),
  resultsCurrentPracticeStreak: document.getElementById("resultsCurrentPracticeStreak"),
  resultsBestPracticeDayStreak: document.getElementById("resultsBestPracticeDayStreak"),
  resultsMonthSessions: document.getElementById("resultsMonthSessions"),
  resultsMonthReps: document.getElementById("resultsMonthReps"),
  resultsMonthAccuracy: document.getElementById("resultsMonthAccuracy"),
  resultsCalendarGrid: document.getElementById("resultsCalendarGrid"),
  resultsMonthPrevButton: document.getElementById("resultsMonthPrevButton"),
  resultsMonthNextButton: document.getElementById("resultsMonthNextButton"),
  resultsPrevButton: document.getElementById("resultsPrevButton"),
  resultsNextButton: document.getElementById("resultsNextButton"),
  resultsCarouselKickerLabel: document.getElementById("resultsCarouselKickerLabel"),
  resultsCarouselIndicator: document.getElementById("resultsCarouselIndicator"),
  resultsCarousel: document.querySelector(".results-carousel"),
  resultsSlides: Array.from(document.querySelectorAll(".results-slide")),
  progressPrevButton: document.getElementById("progressPrevButton"),
  progressNextButton: document.getElementById("progressNextButton"),
  progressCarouselKickerLabel: document.getElementById("progressCarouselKickerLabel"),
  progressCarouselIndicator: document.getElementById("progressCarouselIndicator"),
  progressCarousel: document.querySelector(".progress-carousel"),
  overviewOperationFilter: document.getElementById("overviewOperationFilter"),
  overviewOperationLabel: document.getElementById("overviewOperationLabel"),
  overviewOperationPrevButton: document.getElementById("overviewOperationPrevButton"),
  overviewOperationNextButton: document.getElementById("overviewOperationNextButton"),
  focusOperationFilter: document.getElementById("focusOperationFilter"),
  focusOperationLabel: document.getElementById("focusOperationLabel"),
  focusOperationPrevButton: document.getElementById("focusOperationPrevButton"),
  focusOperationNextButton: document.getElementById("focusOperationNextButton"),
  coachOperationFilter: document.getElementById("coachOperationFilter"),
  coachOperationLabel: document.getElementById("coachOperationLabel"),
  coachOperationPrevButton: document.getElementById("coachOperationPrevButton"),
  coachOperationNextButton: document.getElementById("coachOperationNextButton"),
  factOperationFilter: document.getElementById("factOperationFilter"),
  factDetailFilter: document.getElementById("factDetailFilter"),
  factRangeNav: document.getElementById("factRangeNav"),
  factRangeLabel: document.getElementById("factRangeLabel"),
  factRangePrevButton: document.getElementById("factRangePrevButton"),
  factRangeNextButton: document.getElementById("factRangeNextButton"),
  factsSelectorRow: document.getElementById("factsSelectorRow"),
  factOperationSelector: document.getElementById("factOperationSelector"),
  factDetailSelector: document.getElementById("factDetailSelector"),
  factOperationLabel: document.getElementById("factOperationLabel"),
  factOperationPrevButton: document.getElementById("factOperationPrevButton"),
  factOperationNextButton: document.getElementById("factOperationNextButton"),
  factDetailLabel: document.getElementById("factDetailLabel"),
  factDetailPrevButton: document.getElementById("factDetailPrevButton"),
  factDetailNextButton: document.getElementById("factDetailNextButton"),
  progressSlides: Array.from(document.querySelectorAll(".progress-slide")),
  masteryGrid: document.getElementById("masteryGrid"),
  masterySummary: document.getElementById("masterySummary"),
  overallAnswered: document.getElementById("overallAnswered"),
  overallAccuracy: document.getElementById("overallAccuracy"),
  overallBestStreak: document.getElementById("overallBestStreak"),
  overallBestPace: document.getElementById("overallBestPace"),
  overallWorkoutCount: document.getElementById("overallWorkoutCount"),
  overallBestDayAttempts: document.getElementById("overallBestDayAttempts"),
  currentPracticeStreak: document.getElementById("currentPracticeStreak"),
  bestPracticeDayStreak: document.getElementById("bestPracticeDayStreak"),
  progressMonthSessions: document.getElementById("progressMonthSessions"),
  progressMonthReps: document.getElementById("progressMonthReps"),
  progressMonthAccuracy: document.getElementById("progressMonthAccuracy"),
  currentMonthLabel: document.getElementById("currentMonthLabel"),
  calendarGrid: document.getElementById("calendarGrid"),
  progressMonthPrevButton: document.getElementById("progressMonthPrevButton"),
  progressMonthNextButton: document.getElementById("progressMonthNextButton"),
  coachTip: document.getElementById("coachTip"),
  resultsGrowthList: document.getElementById("resultsGrowthList"),
  resultsWinsList: document.getElementById("resultsWinsList"),
  resultsPriorityList: document.getElementById("resultsPriorityList"),
  progressGrowthList: document.getElementById("progressGrowthList"),
  progressWinsList: document.getElementById("progressWinsList"),
  progressPriorityList: document.getElementById("progressPriorityList"),
  tableGrid: document.getElementById("tableGrid"),
  trackerActionHint: document.getElementById("trackerActionHint"),
  factsSlideTitle: document.getElementById("factsSlideTitle"),
  recordsOperationSelect: document.getElementById("recordsOperationSelect"),
  recordsModeSelect: document.getElementById("recordsModeSelect"),
  recordsOperationLabel: document.getElementById("recordsOperationLabel"),
  recordsOperationPrevButton: document.getElementById("recordsOperationPrevButton"),
  recordsOperationNextButton: document.getElementById("recordsOperationNextButton"),
  recordsModeLabel: document.getElementById("recordsModeLabel"),
  recordsModePrevButton: document.getElementById("recordsModePrevButton"),
  recordsModeNextButton: document.getElementById("recordsModeNextButton"),
  recordsModeSelector: document.getElementById("recordsModeSelector"),
  personalBestsList: document.getElementById("personalBestsList"),
  recentWorkoutsList: document.getElementById("recentWorkoutsList"),
  techniqueScreenShell: document.getElementById("techniqueScreenShell"),
  techniqueExitNavButton: document.getElementById("techniqueExitNavButton"),
  progressCalendarYearLabel: document.getElementById("progressCalendarYearLabel"),
  resultsCalendarYearLabel: document.getElementById("resultsCalendarYearLabel"),
  attemptBadge: document.getElementById("attemptBadge"),
  accuracyBadge: document.getElementById("accuracyBadge"),
  attemptProgressLabel: document.getElementById("attemptProgressLabel"),
  accuracyProgressLabel: document.getElementById("accuracyProgressLabel"),
  homeWeeklyStrip: document.getElementById("homeWeeklyStrip"),
  homeDailyThought: document.getElementById("homeDailyThought"),
  homeDailyStats: document.getElementById("homeDailyStats"),
  homeDashboard: document.getElementById("homeDashboard"),
  homeNextFocusTitle: document.getElementById("homeNextFocusTitle"),
  homeNextFocusCopy: document.getElementById("homeNextFocusCopy"),
  homeSnapshotReps: document.getElementById("homeSnapshotReps"),
  homeSnapshotRank: document.getElementById("homeSnapshotRank"),
  homeSnapshotFocus: document.getElementById("homeSnapshotFocus"),
  homeRoutineAdditionCheck: document.getElementById("homeRoutineAdditionCheck"),
  homeRoutineSubtractionCheck: document.getElementById("homeRoutineSubtractionCheck"),
  homeRoutineMultiplicationCheck: document.getElementById("homeRoutineMultiplicationCheck"),
  homeRoutineDivisionCheck: document.getElementById("homeRoutineDivisionCheck"),
  homeRoutineAdditionStatus: document.getElementById("homeRoutineAdditionStatus"),
  homeRoutineSubtractionStatus: document.getElementById("homeRoutineSubtractionStatus"),
  homeRoutineMultiplicationStatus: document.getElementById("homeRoutineMultiplicationStatus"),
  homeRoutineDivisionStatus: document.getElementById("homeRoutineDivisionStatus"),
  homeCalendarMonthLabel: document.getElementById("homeCalendarMonthLabel"),
  homeCalendarGrid: document.getElementById("homeCalendarGrid"),
  homeCurrentPracticeStreak: document.getElementById("homeCurrentPracticeStreak"),
  homeMonthSessions: document.getElementById("homeMonthSessions"),
  homeMonthReps: document.getElementById("homeMonthReps"),
  homeMonthAccuracy: document.getElementById("homeMonthAccuracy"),
  homeCalendarSummary: document.getElementById("homeCalendarSummary"),
  homeCalendarEmptyState: document.getElementById("homeCalendarEmptyState"),
  streakBanner: document.getElementById("streakBanner"),
  streakBannerTitle: document.getElementById("streakBannerTitle"),
  endWorkoutDialog: document.getElementById("endWorkoutDialog"),
  endWorkoutDialogTitle: document.getElementById("endWorkoutDialogTitle"),
  endWorkoutDialogCopy: document.getElementById("endWorkoutDialogCopy"),
  endWorkoutDialogConfirmLabel: document.getElementById("endWorkoutDialogConfirmLabel"),
  cancelEndWorkoutButton: document.getElementById("cancelEndWorkoutButton"),
  confirmEndWorkoutButton: document.getElementById("confirmEndWorkoutButton"),
  exitTechniqueDialog: document.getElementById("exitTechniqueDialog"),
  cancelExitTechniqueButton: document.getElementById("cancelExitTechniqueButton"),
  confirmExitTechniqueButton: document.getElementById("confirmExitTechniqueButton"),
  themeSelect: document.getElementById("themeSelect"),
  colorModeSelect: document.getElementById("colorModeSelect"),
  keypadPreferenceSelect: document.getElementById("keypadPreferenceSelect"),
  keypadPreferenceOptionsSelect: document.getElementById("keypadPreferenceOptionsSelect"),
};

const state = {
  progress: loadProgress(),
  active: false,
  countingDown: false,
  view: "home",
  settings: null,
  currentQuestion: null,
  questionStartedAt: 0,
  sessionStartedAt: 0,
  sessionEndedAt: 0,
  lastQuestionKey: null,
  questionPool: [],
  advanceTimeoutId: null,
  techniqueAdvanceTimeoutId: null,
  countdownTimeoutId: null,
  hudIntervalId: null,
  progressSaveTimeoutId: null,
  resultsSlideIndex: 0,
  progressSlideIndex: 0,
  masterySelection: "overview",
  displayMonthKey: "",
  useTouchKeypad: false,
  theme: loadTheme(),
  colorMode: loadColorMode(),
  keypadPreference: loadKeypadPreference(),
  session: createEmptySession(),
  technique: createTechniqueState(),
  pendingTechniqueView: null,
  pendingWorkoutView: null,
  additionTrackerFlipMap: {},
  factTrackerRangeIndex: 0,
};

function createEmptySession(settings = null) {
  const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id: sessionId,
    source: getLearningSessionSource(settings),
    answered: 0,
    correct: 0,
    skipped: 0,
    sparStrikes: 0,
    streak: 0,
    bestStreak: 0,
    responseTimes: [],
    recent: [],
    feedbackHistory: [],
  };
}

function getLearningSessionSource(settings) {
  if (!settings) {
    return "practice";
  }
  if (settings.sessionType === "isolation") {
    return "focused-workout";
  }
  if (settings.freeTrainingMode === "spar") {
    return "spar";
  }
  return "practice";
}

function createTechniquePatternRows(table = TECHNIQUE_TABLE) {
  // Warm-up progression: first rows are anchored, then blanks ask for factors and answers.
  const blankAssignments =
    table === TECHNIQUE_TABLE
      ? new Map([
          [1, null],
          [2, null],
          [3, "answer-stem"],
          [4, "factor"],
          [5, "answer-stem"],
          [6, "table"],
          [7, "factor"],
          [8, "answer-full"],
          [9, "answer-full"],
          [10, "answer-full"],
          [11, "factor"],
          [12, "answer-full"],
        ])
      : new Map([
          [1, null],
          [2, null],
          [3, "answer-full"],
          [4, "factor"],
          [5, "answer-full"],
          [6, "table"],
          [7, "factor"],
          [8, "answer-full"],
          [9, "answer-full"],
          [10, "answer-full"],
          [11, "factor"],
          [12, "answer-full"],
        ]);

  return TABLE_FACTORS.map((factor) => {
    const blank = blankAssignments.get(factor) || null;
    return {
      factor,
      blank,
      value: "",
      status: "idle",
      expected:
        blank === "answer-full"
          ? `${factor * table}`
          : blank === "answer-stem"
          ? `${factor}`
          : blank === "factor"
            ? `${factor}`
            : blank === "table"
              ? `${table}`
              : "",
    };
  });
}

function createTechniqueState(table = TECHNIQUE_TABLE, mode = "menu") {
  const initialStage = TECHNIQUE_STEPS[0].id;
  return {
    selectedOperation: "",
    selectedTable: table,
    additionLessonId: "",
    mode,
    stage: initialStage,
    maxStageReachedIndex: getTechniqueStageIndex(initialStage),
    patternRows: createTechniquePatternRows(table),
    patternFeedback: { message: "", tone: "" },
    guidedQuestions: createGuidedTechniqueQuestions(table),
    guidedIndex: 0,
    guidedAnswer: "",
    guidedHintVisible: false,
    guidedFeedback: { message: "", tone: "" },
    guidedSolved: false,
    quickCheckCorrect: 0,
    quickCheckQuestion: createTechniqueQuestion(table),
    quickCheckAnswer: "",
    quickCheckHintVisible: false,
    quickCheckFeedback: { message: "", tone: "" },
    quickCheckSolved: false,
    quickCheckHintOffered: false,
    practiceQuestion: createTechniqueQuestion(table),
    practiceAnswer: "",
    practiceHintVisible: false,
    practiceFeedback: { message: "", tone: "" },
    practiceSolved: false,
    additionLesson: null,
    make10Lesson: null,
    focusFieldName: "",
  };
}

function defaultDailyRecord() {
  return {
    attempted: 0,
    correct: 0,
    skipped: 0,
    attemptGoalEarned: false,
    accuracyGoalEarned: false,
    sessionsCompleted: 0,
  };
}

function defaultProgress() {
  return {
    totalAnswered: 0,
    totalAttempted: 0, // Legacy mirror retained for old stored snapshots.
    totalSkipped: 0,
    totalCorrect: 0,
    totalMagnitudeCorrect: 0,
    totalSignCorrect: 0,
    totalSignErrors: 0,
    bestStreak: 0,
    sessionsCompleted: 0,
    bestAccuracy: 0,
    fastestAverageMs: null,
    facts: {},
    dailyRecords: {},
    bucketDaily: {},
    additionBucketExamples: {},
    answerTelemetry: [],
    operationBestRanks: {},
    workoutHistory: [],
    techniques: {},
  };
}

function defaultSettingsSnapshot() {
  return {
    operation: "multiplication",
    minFactor: 2,
    maxFactor: 12,
    focusFactor: 7,
    adaptiveMode: true,
    negativesMode: false,
    sessionType: "question-goal",
    freeTrainingMode: "zen",
    sparTiming: "untimed",
    questionPreset: "20",
    questionTarget: 20,
    timePreset: "3",
    timeLimitMinutes: 3,
    additionDifficulty: "easy",
    additionDifficulties: ["easy"],
    subtractionDifficulty: "easy",
    subtractionDifficulties: ["easy"],
    additionRegrouping: true,
  };
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(Math.max(value, min), max);
}

function getOperationStorageSymbol(operation) {
  return OPERATION_SYMBOLS[operation] || OPERATION_SYMBOLS.multiplication;
}

function getOperationDisplaySymbol(operation) {
  return OPERATION_DISPLAY_SYMBOLS[operation] || getOperationStorageSymbol(operation);
}

function inferOperationFromFactKeyRaw(key) {
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

function normaliseFactProgressEntry(key, entry) {
  const source = entry && typeof entry === "object" ? entry : {};
  const attempts = clampNumber(Number(source.attempts), 0, 999999, 0);
  const correct = clampNumber(Number(source.correct), 0, attempts, 0);
  const magnitudeCorrect = clampNumber(
    Number(source.magnitudeCorrect),
    0,
    attempts,
    correct,
  );
  const signCorrect = clampNumber(Number(source.signCorrect), 0, attempts, correct);
  const signErrors = clampNumber(Number(source.signErrors), 0, attempts, 0);
  const misses = clampNumber(Number(source.misses), 0, attempts, attempts - correct);
  const currentStreak = clampNumber(Number(source.currentStreak), 0, 999999, 0);
  const bestStreak = clampNumber(Number(source.bestStreak), currentStreak, 999999, currentStreak);
  const averageMs =
    source.averageMs === null || source.averageMs === undefined
      ? null
      : clampNumber(Number(source.averageMs), 0, Number.MAX_SAFE_INTEGER, null);
  const operation = OPERATION_OPTIONS.includes(source.operation)
    ? source.operation
    : inferOperationFromFactKeyRaw(key);
  const symbol = getOperationDisplaySymbol(operation);
  const lastSeenAt = clampNumber(Number(source.lastSeenAt), 0, Number.MAX_SAFE_INTEGER, 0);
  const firstSeenAtRaw = clampNumber(
    Number(source.firstSeenAt),
    0,
    Number.MAX_SAFE_INTEGER,
    lastSeenAt,
  );
  const firstSeenAt = lastSeenAt
    ? Math.min(firstSeenAtRaw || lastSeenAt, lastSeenAt)
    : firstSeenAtRaw;

  return {
    operation,
    symbol,
    attempts,
    correct,
    magnitudeCorrect,
    signCorrect,
    signErrors,
    misses,
    bestStreak,
    currentStreak,
    averageMs,
    firstSeenAt,
    lastSeenAt,
  };
}

function compareFactRetention(left, right) {
  if (left.progress.lastSeenAt !== right.progress.lastSeenAt) {
    return right.progress.lastSeenAt - left.progress.lastSeenAt;
  }
  if (left.progress.misses !== right.progress.misses) {
    return right.progress.misses - left.progress.misses;
  }
  if (left.progress.attempts !== right.progress.attempts) {
    return right.progress.attempts - left.progress.attempts;
  }
  if (left.progress.correct !== right.progress.correct) {
    return right.progress.correct - left.progress.correct;
  }
  return left.key.localeCompare(right.key);
}

function compactFactProgressMap(factsByKey) {
  const source = factsByKey && typeof factsByKey === "object" ? factsByKey : {};
  const allEntries = Object.entries(source).map(([key, value]) => ({
    key,
    progress: normaliseFactProgressEntry(key, value),
  }));

  if (!allEntries.length) {
    return {};
  }

  const entriesByOperation = {
    multiplication: [],
    addition: [],
    subtraction: [],
    division: [],
  };
  allEntries.forEach((entry) => {
    entriesByOperation[entry.progress.operation].push(entry);
  });

  const keptEntries = OPERATION_OPTIONS.flatMap((operation) =>
    entriesByOperation[operation]
      .sort(compareFactRetention)
      .slice(0, FACT_PROGRESS_MAX_PER_OPERATION),
  );
  const globallyTrimmed =
    keptEntries.length > FACT_PROGRESS_MAX_TOTAL
      ? keptEntries.sort(compareFactRetention).slice(0, FACT_PROGRESS_MAX_TOTAL)
      : keptEntries;

  return Object.fromEntries(globallyTrimmed.map((entry) => [entry.key, entry.progress]));
}

function syncProgressMetricAliases(progress) {
  if (!progress || typeof progress !== "object") {
    return progress;
  }

  const totalAnswered = clampNumber(
    Number(progress.totalAnswered ?? progress.totalAttempted ?? progress.totalAnswered),
    0,
    999999,
    0,
  );
  progress.totalAnswered = totalAnswered;
  progress.totalAttempted = totalAnswered;
  progress.totalSkipped = clampNumber(Number(progress.totalSkipped), 0, 999999, 0);
  return progress;
}

function parseBucketDailyStorageKey(key) {
  const [dateKey = "", operation = "multiplication", ...rest] = String(key).split("|");
  const normalisedOperation = OPERATION_OPTIONS.includes(operation)
    ? operation
    : "multiplication";
  return {
    dateKey,
    operation: normalisedOperation,
    bucketKey: rest.join("|"),
  };
}

function parseFactKeyCore(key) {
  if (typeof key !== "string") {
    return {
      operation: "multiplication",
      left: 0,
      right: 0,
    };
  }

  const modernMatch = key.match(/^(multiplication|addition|subtraction|division):(-?\d+)([x+\-\/])(-?\d+)$/i);
  if (modernMatch) {
    const operation = OPERATION_OPTIONS.includes(modernMatch[1])
      ? modernMatch[1]
      : "multiplication";
    return {
      operation,
      left: Number(modernMatch[2]),
      right: Number(modernMatch[4]),
    };
  }

  const legacyMatch = key.match(/^(-?\d+)x(-?\d+)$/i);
  return {
    operation: "multiplication",
    left: legacyMatch ? Number(legacyMatch[1]) : 0,
    right: legacyMatch ? Number(legacyMatch[2]) : 0,
  };
}

function hasAdditionRegroupingCore(left, right) {
  const sum = left + right;
  if (sum === 10) {
    return false;
  }

  let carry = 0;
  let a = Math.abs(left);
  let b = Math.abs(right);

  while (a > 0 || b > 0) {
    const column = (a % 10) + (b % 10) + carry;
    if (column >= 10) {
      return true;
    }
    carry = Math.floor(column / 10);
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }

  return false;
}

function getDigitCount(value) {
  return String(Math.abs(Math.trunc(Number(value) || 0))).length;
}

function getAdditionLearningSkillKey(left, right) {
  const low = Math.min(Math.abs(left), Math.abs(right));
  const high = Math.max(Math.abs(left), Math.abs(right));
  if (low + high === 10 && high <= 10) {
    return "make-10";
  }

  const lowDigits = getDigitCount(low);
  const highDigits = getDigitCount(high);
  const key = `${lowDigits}-${highDigits}`;
  return ADDITION_TRACKER_BUCKET_KEYS.has(key) ? key : "3-3";
}

function getSubtractionLearningSkillKey(left, right) {
  const leftDigits = getDigitCount(left);
  const rightDigits = getDigitCount(right);
  const key = `${leftDigits}-${rightDigits}`;
  return SUBTRACTION_TRACKER_BUCKET_KEYS.has(key) ? key : "3-3";
}

function getLearningSkillKey(question) {
  const operation = question?.operation || "multiplication";
  if (operation === "addition") {
    return getAdditionLearningSkillKey(question.a ?? question.left, question.b ?? question.right);
  }
  if (operation === "subtraction") {
    return getSubtractionLearningSkillKey(question.a ?? question.left, question.b ?? question.right);
  }
  if (operation === "division") {
    return `d${clampNumber(Number(question.b ?? question.right), 1, FACTOR_LIMIT, 1)}`;
  }
  const left = Math.abs(Number(question.a ?? question.left) || 0);
  const right = Math.abs(Number(question.b ?? question.right) || 0);
  const factor = clampNumber(Math.max(left, right), 1, FACTOR_LIMIT, 1);
  return `x${factor}`;
}

function getLearningSkillLabel(operation, skillKey) {
  if (operation === "addition") {
    return ADDITION_TRACKER_BUCKETS.find((bucket) => bucket.key === skillKey)?.label || "Addition Facts";
  }
  if (operation === "subtraction") {
    return SUBTRACTION_TRACKER_BUCKETS.find((bucket) => bucket.key === skillKey)?.label || "Subtraction Facts";
  }
  if (operation === "division") {
    return `Divide by ${String(skillKey).replace(/^d/, "")}`;
  }
  return `x ${String(skillKey).replace(/^x/, "")}`;
}

function normaliseDailyRecord(record) {
  const attempted = clampNumber(
    Number(record?.attempted ?? record?.answered),
    0,
    9999,
    0,
  );
  const correct = clampNumber(Number(record?.correct), 0, 9999, 0);
  const skipped = clampNumber(Number(record?.skipped), 0, 9999, 0);
  const accuracyGoalEarned = Boolean(record?.accuracyGoalEarned ?? record?.heartEarned) ||
    correct >= DAILY_TARGET;
  const attemptGoalEarned =
    Boolean(record?.attemptGoalEarned ?? record?.sliceEarned ?? record?.starEarned) ||
    attempted >= DAILY_TARGET ||
    accuracyGoalEarned;

  return {
    attempted,
    correct,
    skipped,
    attemptGoalEarned,
    accuracyGoalEarned,
    sessionsCompleted: clampNumber(Number(record?.sessionsCompleted), 0, 9999, 0),
  };
}

function normaliseWorkoutRecord(record) {
  const operation = OPERATION_OPTIONS.includes(record?.operation)
    ? record.operation
    : "multiplication";
  const modeKey =
    record?.modeKey === "timed" ||
    record?.modeKey === "question-goal" ||
    record?.modeKey === "isolation" ||
    record?.modeKey === "zen" ||
    record?.modeKey === "spar"
      ? record.modeKey
      : "question-goal";

  const additionDifficulty =
    record?.additionDifficulty === "easy" ||
    record?.additionDifficulty === "medium" ||
    record?.additionDifficulty === "hard"
      ? record.additionDifficulty
      : "easy";
  const additionDifficulties = Array.isArray(record?.additionDifficulties)
    ? record.additionDifficulties.filter((value) =>
        value === "easy" || value === "medium" || value === "hard",
      )
    : [];

  return {
    id: String(record?.id || `${record?.recordedAt || Date.now()}`),
    operation,
    modeKey,
    modeLabel: String(record?.modeLabel || ""),
    dateKey: String(record?.dateKey || getTodayDateKey()),
    recordedAt: clampNumber(Number(record?.recordedAt), 0, Number.MAX_SAFE_INTEGER, Date.now()),
    attempted: clampNumber(Number(record?.attempted ?? record?.answered), 0, 99999, 0),
    correct: clampNumber(Number(record?.correct), 0, 99999, 0),
    accuracy: clampNumber(Number(record?.accuracy), 0, 1, 0),
    skipped: clampNumber(Number(record?.skipped), 0, 99999, 0),
    bestStreak: clampNumber(Number(record?.bestStreak), 0, 99999, 0),
    averageMs:
      record?.averageMs === null || record?.averageMs === undefined
        ? null
        : clampNumber(Number(record.averageMs), 0, Number.MAX_SAFE_INTEGER, null),
    medianMs:
      record?.medianMs === null || record?.medianMs === undefined
        ? null
        : clampNumber(Number(record.medianMs), 0, Number.MAX_SAFE_INTEGER, null),
    fastCorrect: clampNumber(Number(record?.fastCorrect), 0, 99999, 0),
    sessionSource: String(record?.sessionSource || "practice"),
    reason: String(record?.reason || "goal"),
    freeTrainingMode:
      record?.freeTrainingMode === "spar" || record?.freeTrainingMode === "zen"
        ? record.freeTrainingMode
        : "zen",
    sparTiming:
      record?.sparTiming === "timed" || record?.sparTiming === "untimed"
        ? record.sparTiming
        : "untimed",
    timeLimitMinutes: clampNumber(Number(record?.timeLimitMinutes), 0, 60, 0),
    focusFactor: clampNumber(Number(record?.focusFactor), 1, FACTOR_LIMIT, 7),
    minFactor: Math.min(
      clampNumber(Number(record?.minFactor), 1, FACTOR_LIMIT, 2),
      clampNumber(Number(record?.maxFactor), 1, FACTOR_LIMIT, FACTOR_LIMIT),
    ),
    maxFactor: Math.max(
      clampNumber(Number(record?.minFactor), 1, FACTOR_LIMIT, 2),
      clampNumber(Number(record?.maxFactor), 1, FACTOR_LIMIT, FACTOR_LIMIT),
    ),
    additionDifficulty,
    additionDifficulties: additionDifficulties.length ? additionDifficulties : [additionDifficulty],
    additionRegrouping: typeof record?.additionRegrouping === "boolean" ? record.additionRegrouping : true,
  };
}

function normaliseAnswerTelemetryEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const operation = OPERATION_OPTIONS.includes(entry.operation)
    ? entry.operation
    : "multiplication";
  const timestamp = clampNumber(Number(entry.timestamp), 0, Number.MAX_SAFE_INTEGER, 0);
  const dateKey = isDateKey(entry.dateKey) ? entry.dateKey : timestamp ? formatDateKey(new Date(timestamp)) : "";
  if (!dateKey) {
    return null;
  }

  const responseTimeMs =
    entry.responseTimeMs === null || entry.responseTimeMs === undefined
      ? null
      : clampNumber(Number(entry.responseTimeMs), 0, Number.MAX_SAFE_INTEGER, null);

  return {
    id: String(entry.id || `${timestamp}-${Math.random().toString(36).slice(2, 7)}`),
    sessionId: String(entry.sessionId || ""),
    sessionSource: String(entry.sessionSource || "practice"),
    sessionPosition: clampNumber(Number(entry.sessionPosition), 0, 9999, 0),
    operation,
    factKey: String(entry.factKey || ""),
    skillKey: String(entry.skillKey || ""),
    difficultyBand: String(entry.difficultyBand || "standard"),
    correct: Boolean(entry.correct),
    skipped: Boolean(entry.skipped),
    responseTimeMs,
    timestamp,
    dateKey,
  };
}

function normaliseAnswerTelemetry(entries) {
  const source = Array.isArray(entries) ? entries : [];
  return source
    .map(normaliseAnswerTelemetryEntry)
    .filter(Boolean)
    .sort((left, right) => right.timestamp - left.timestamp)
    .slice(0, ANSWER_TELEMETRY_MAX_ENTRIES);
}

function normaliseOperationBestRanks(bestRanks) {
  const source = bestRanks && typeof bestRanks === "object" ? bestRanks : {};
  return Object.fromEntries(
    OPERATION_OPTIONS.map((operation) => {
      const entry = source[operation] && typeof source[operation] === "object"
        ? source[operation]
        : {};
      const rank = MASTERY_RANK_LABELS.includes(entry.rank) ? entry.rank : "Rookie";
      return [
        operation,
        {
          rank,
          score: clampNumber(Number(entry.score), 0, 100, 0),
          earnedAt: clampNumber(Number(entry.earnedAt), 0, Number.MAX_SAFE_INTEGER, 0),
        },
      ];
    }),
  );
}

function normaliseBucketDailyEntry(entry) {
  const attempted = clampNumber(Number(entry?.attempted), 0, 9999, 0);
  const correct = clampNumber(Number(entry?.correct), 0, attempted, 0);
  return {
    attempted,
    correct,
  };
}

function normaliseAdditionBucketExampleEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const parsed = parseFactKeyCore(String(entry.factKey || ""));
  const leftValue = Number(entry.left);
  const rightValue = Number(entry.right);
  const left = Number.isFinite(leftValue)
    ? Math.trunc(leftValue)
    : parsed.operation === "addition"
      ? parsed.left
      : NaN;
  const right = Number.isFinite(rightValue)
    ? Math.trunc(rightValue)
    : parsed.operation === "addition"
      ? parsed.right
      : NaN;

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return null;
  }

  const low = Math.min(left, right);
  const high = Math.max(left, right);
  const factKey = `addition:${low}+${high}`;
  const attempts = clampNumber(Number(entry.attempts), 0, 9999, 0);
  const correct = clampNumber(Number(entry.correct), 0, attempts, 0);
  const regrouping =
    typeof entry.regrouping === "boolean"
      ? entry.regrouping
      : hasAdditionRegroupingCore(low, high);

  return {
    factKey,
    left: low,
    right: high,
    regrouping,
    attempts,
    correct,
    lastSeenAt: clampNumber(Number(entry.lastSeenAt), 0, Number.MAX_SAFE_INTEGER, 0),
  };
}

function normaliseAdditionBucketExamples(examplesByBucket) {
  const source = examplesByBucket && typeof examplesByBucket === "object" ? examplesByBucket : {};
  const normalised = {};

  ADDITION_TRACKER_BUCKETS.forEach((bucket) => {
    const entries = Array.isArray(source[bucket.key]) ? source[bucket.key] : [];
    const mergedByFact = new Map();

    entries.forEach((entry) => {
      const clean = normaliseAdditionBucketExampleEntry(entry);
      if (!clean) {
        return;
      }

      const existing = mergedByFact.get(clean.factKey);
      if (existing) {
        const mergedAttempts = clampNumber(existing.attempts + clean.attempts, 0, 9999, 0);
        const mergedCorrect = clampNumber(existing.correct + clean.correct, 0, mergedAttempts, 0);
        mergedByFact.set(clean.factKey, {
          ...existing,
          attempts: mergedAttempts,
          correct: mergedCorrect,
          lastSeenAt: Math.max(existing.lastSeenAt, clean.lastSeenAt),
          regrouping: clean.regrouping,
        });
        return;
      }

      mergedByFact.set(clean.factKey, clean);
    });

    normalised[bucket.key] = Array.from(mergedByFact.values())
      .sort((left, right) => right.lastSeenAt - left.lastSeenAt)
      .slice(0, ADDITION_BUCKET_EXAMPLE_CAP);
  });

  return normalised;
}

function sanitiseSettingsSnapshot(settings) {
  const defaults = defaultSettingsSnapshot();
  const operation = OPERATION_CONFIG[settings?.operation] ? settings.operation : defaults.operation;
  const additionDifficulty =
    settings?.additionDifficulty === "easy" ||
    settings?.additionDifficulty === "medium" ||
    settings?.additionDifficulty === "hard"
      ? settings.additionDifficulty
      : defaults.additionDifficulty;
  const additionDifficultiesRaw = Array.isArray(settings?.additionDifficulties)
    ? settings.additionDifficulties
    : [];
  const additionDifficulties = ["easy", "medium", "hard"].filter((key) =>
    additionDifficultiesRaw.includes(key),
  );
  if (!additionDifficulties.length) {
    additionDifficulties.push(additionDifficulty);
  }
  const subtractionDifficulty =
    settings?.subtractionDifficulty === "easy" ||
    settings?.subtractionDifficulty === "medium" ||
    settings?.subtractionDifficulty === "hard"
      ? settings.subtractionDifficulty
      : defaults.subtractionDifficulty;
  const subtractionDifficultiesRaw = Array.isArray(settings?.subtractionDifficulties)
    ? settings.subtractionDifficulties
    : [];
  const subtractionDifficulties = ["easy", "medium", "hard"].filter((key) =>
    subtractionDifficultiesRaw.includes(key),
  );
  if (!subtractionDifficulties.length) {
    subtractionDifficulties.push(subtractionDifficulty);
  }
  const legacyIsolationMode = settings?.questionStyle === "focus" || settings?.mode === "focus";
  const hasLegacyQuestionStyle = typeof settings?.questionStyle === "string";
  const legacySessionLength = Number(settings?.sessionLength);
  let sessionType = defaults.sessionType;
  if (
    settings?.sessionType === "timed" ||
    settings?.sessionType === "question-goal" ||
    settings?.sessionType === "endless" ||
    settings?.sessionType === "isolation"
  ) {
    sessionType = settings.sessionType;
  } else if (legacySessionLength === 0) {
    sessionType = "endless";
  }
  if (hasLegacyQuestionStyle && legacyIsolationMode) {
    sessionType = "isolation";
  }
  if ((operation === "addition" || operation === "subtraction") && sessionType === "isolation") {
    sessionType = "question-goal";
  }
  const freeTrainingMode =
    settings?.freeTrainingMode === "spar" || settings?.freeTrainingMode === "zen"
      ? settings.freeTrainingMode
      : defaults.freeTrainingMode;
  const sparTiming =
    settings?.sparTiming === "timed" || settings?.sparTiming === "untimed"
      ? settings.sparTiming
      : defaults.sparTiming;
  const rawMinFactor = clampNumber(
    Number(settings?.minFactor),
    1,
    FACTOR_LIMIT,
    defaults.minFactor,
  );
  const rawMaxFactor = clampNumber(
    Number(settings?.maxFactor),
    1,
    FACTOR_LIMIT,
    defaults.maxFactor,
  );
  const minFactorNormalised = Math.min(rawMinFactor, rawMaxFactor);
  const maxFactorNormalised = Math.max(rawMinFactor, rawMaxFactor);
  const focusFactor = clampNumber(
    Number(settings?.focusFactor),
    1,
    FACTOR_LIMIT,
    defaults.focusFactor,
  );
  const questionTargetFallback =
    legacySessionLength > 0 ? legacySessionLength : defaults.questionTarget;
  const questionTarget = clampNumber(
    Number(settings?.questionTarget),
    5,
    200,
    questionTargetFallback,
  );
  const timeLimitMinutes = clampNumber(
    Number(settings?.timeLimitMinutes),
    1,
    60,
    defaults.timeLimitMinutes,
  );
  const questionPreset = QUESTION_PRESETS.includes(questionTarget)
    ? `${questionTarget}`
    : settings?.questionPreset === "custom"
      ? "custom"
      : QUESTION_PRESETS.includes(Number(settings?.questionPreset))
        ? `${Number(settings.questionPreset)}`
        : "custom";
  const timePreset = TIME_PRESETS.includes(timeLimitMinutes)
    ? `${timeLimitMinutes}`
    : settings?.timePreset === "custom"
      ? "custom"
      : TIME_PRESETS.includes(Number(settings?.timePreset))
        ? `${Number(settings.timePreset)}`
        : "custom";
  const useIsolationControls =
    (operation === "multiplication" || operation === "division") && sessionType === "isolation";
  const minFactor = useIsolationControls ? minFactorNormalised : defaults.minFactor;
  const maxFactor = useIsolationControls ? maxFactorNormalised : defaults.maxFactor;

  return {
    operation,
    minFactor,
    maxFactor,
    focusFactor,
    adaptiveMode:
      typeof settings?.adaptiveMode === "boolean"
        ? settings.adaptiveMode
        : defaults.adaptiveMode,
    negativesMode:
      operation === "multiplication" && typeof settings?.negativesMode === "boolean"
        ? settings.negativesMode
        : false,
    sessionType,
    freeTrainingMode,
    sparTiming,
    questionPreset,
    questionTarget,
    timePreset,
    timeLimitMinutes,
    additionDifficulty,
    additionDifficulties,
    subtractionDifficulty,
    subtractionDifficulties,
    additionRegrouping:
      typeof settings?.additionRegrouping === "boolean"
        ? settings.additionRegrouping
        : defaults.additionRegrouping,
  };
}

function getLocalStorageItemWithFallback(primaryKey, fallbackKeys = []) {
  const raw = window.localStorage.getItem(primaryKey);
  if (raw !== null) {
    return raw;
  }

  for (const fallbackKey of fallbackKeys) {
    const fallbackRaw = window.localStorage.getItem(fallbackKey);
    if (fallbackRaw !== null) {
      return fallbackRaw;
    }
  }

  return null;
}

function loadProgress() {
  try {
    const raw = getLocalStorageItemWithFallback(STORAGE_KEY, LEGACY_STORAGE_KEYS);
    if (!raw) {
      return defaultProgress();
    }

    const parsed = JSON.parse(raw);
    const dailyRecords = Object.fromEntries(
      Object.entries(parsed.dailyRecords || {}).map(([key, record]) => [
        key,
        normaliseDailyRecord(record),
      ]),
    );
    const bucketDaily = Object.fromEntries(
      Object.entries(parsed.bucketDaily || {}).map(([key, record]) => [
        key,
        normaliseBucketDailyEntry(record),
      ]),
    );
    const additionBucketExamples = normaliseAdditionBucketExamples(
      parsed.additionBucketExamples,
    );
    const workoutHistory = Array.isArray(parsed.workoutHistory)
      ? parsed.workoutHistory.map(normaliseWorkoutRecord).slice(0, 50)
      : [];
    const answerTelemetry = normaliseAnswerTelemetry(parsed.answerTelemetry);
    const operationBestRanks = normaliseOperationBestRanks(parsed.operationBestRanks);
    const totalAnswered = clampNumber(
      Number(parsed.totalAnswered ?? parsed.totalAttempted),
      0,
      999999,
      0,
    );
    const progress = {
      ...defaultProgress(),
      ...parsed,
      totalAnswered,
      totalAttempted: totalAnswered,
      totalSkipped: clampNumber(Number(parsed.totalSkipped), 0, 999999, 0),
      totalCorrect: clampNumber(Number(parsed.totalCorrect), 0, 999999, 0),
      totalMagnitudeCorrect: clampNumber(
        Number(parsed.totalMagnitudeCorrect),
        0,
        999999,
        0,
      ),
      totalSignCorrect: clampNumber(Number(parsed.totalSignCorrect), 0, 999999, 0),
      totalSignErrors: clampNumber(Number(parsed.totalSignErrors), 0, 999999, 0),
      facts: compactFactProgressMap(parsed.facts),
      dailyRecords,
      bucketDaily,
      additionBucketExamples,
      answerTelemetry,
      operationBestRanks,
      workoutHistory,
      techniques: parsed.techniques || {},
    };

    return pruneProgressForRollingWindow(syncProgressMetricAliases(progress));
  } catch (error) {
    return defaultProgress();
  }
}

function saveProgress() {
  try {
    window.clearTimeout(state.progressSaveTimeoutId);
    state.progressSaveTimeoutId = null;
    syncProgressMetricAliases(state.progress);
    pruneProgressForRollingWindow(state.progress);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  } catch (error) {
    // Ignore storage failures so the app still works in restricted contexts.
  }
}

function queueProgressSave() {
  window.clearTimeout(state.progressSaveTimeoutId);
  state.progressSaveTimeoutId = window.setTimeout(() => {
    state.progressSaveTimeoutId = null;
    saveProgress();
  }, PROGRESS_SAVE_DEBOUNCE_MS);
}

function sanitiseTheme(themeValue) {
  const value = String(themeValue || "");
  return THEME_OPTIONS.some((theme) => theme.key === value) ? value : "original";
}

function sanitiseColorMode(value) {
  const mode = String(value || "");
  return COLOR_MODE_OPTIONS.includes(mode) ? mode : "dark";
}

function loadTheme() {
  try {
    const raw = getLocalStorageItemWithFallback(THEME_STORAGE_KEY, LEGACY_THEME_STORAGE_KEYS);
    return sanitiseTheme(raw);
  } catch (error) {
    return "original";
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, sanitiseTheme(theme));
  } catch (error) {
    // Ignore storage failures so the app still works in restricted contexts.
  }
}

function loadColorMode() {
  try {
    const raw = getLocalStorageItemWithFallback(
      COLOR_MODE_STORAGE_KEY,
      LEGACY_COLOR_MODE_STORAGE_KEYS,
    );
    return sanitiseColorMode(raw);
  } catch (error) {
    return "dark";
  }
}

function saveColorMode(value) {
  try {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, sanitiseColorMode(value));
  } catch (error) {
    // Ignore storage failures so the app still works in restricted contexts.
  }
}

function applyTheme(theme) {
  const nextTheme = sanitiseTheme(theme);
  state.theme = nextTheme;
  document.body.dataset.theme = nextTheme;
  if (elements.themeSelect) {
    elements.themeSelect.value = nextTheme;
  }
}

function applyColorMode(mode) {
  const nextMode = sanitiseColorMode(mode);
  state.colorMode = nextMode;
  document.body.dataset.colorMode = nextMode;
  if (elements.colorModeSelect) {
    elements.colorModeSelect.value = nextMode;
  }
}

function sanitiseKeypadPreference(value) {
  const key = String(value || "");
  return KEYPAD_PREFERENCE_OPTIONS.includes(key) ? key : "auto";
}

function loadKeypadPreference() {
  try {
    const raw = getLocalStorageItemWithFallback(
      KEYPAD_PREFERENCE_STORAGE_KEY,
      LEGACY_KEYPAD_PREFERENCE_STORAGE_KEYS,
    );
    return sanitiseKeypadPreference(raw);
  } catch (error) {
    return "auto";
  }
}

function saveKeypadPreference(value) {
  try {
    window.localStorage.setItem(
      KEYPAD_PREFERENCE_STORAGE_KEY,
      sanitiseKeypadPreference(value),
    );
  } catch (error) {
    // Ignore storage failures so the app still works in restricted contexts.
  }
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function shiftDateKey(key, days) {
  const shifted = parseDateKey(key);
  shifted.setDate(shifted.getDate() + days);
  return formatDateKey(shifted);
}

function getTodayDateKey() {
  return formatDateKey(new Date());
}

function isDateKey(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function getRollingWindowCutoffDateKey(days = ROLLING_WINDOW_DAYS) {
  return shiftDateKey(getTodayDateKey(), -days);
}

function pruneProgressForRollingWindow(progress) {
  if (!progress || typeof progress !== "object") {
    return progress;
  }

  syncProgressMetricAliases(progress);
  const cutoffDateKey = getRollingWindowCutoffDateKey();
  progress.dailyRecords = Object.fromEntries(
    Object.entries(progress.dailyRecords || {}).filter(([dateKey]) =>
      isDateKey(dateKey) ? dateKey >= cutoffDateKey : false,
    ),
  );
  progress.bucketDaily = Object.fromEntries(
    Object.entries(progress.bucketDaily || {}).filter(([storageKey]) => {
      const { dateKey } = parseBucketDailyStorageKey(storageKey);
      return isDateKey(dateKey) ? dateKey >= cutoffDateKey : false;
    }),
  );
  progress.workoutHistory = (Array.isArray(progress.workoutHistory) ? progress.workoutHistory : [])
    .filter((record) => {
      if (isDateKey(record?.dateKey)) {
        return record.dateKey >= cutoffDateKey;
      }
      if (Number.isFinite(Number(record?.recordedAt))) {
        return formatDateKey(new Date(Number(record.recordedAt))) >= cutoffDateKey;
      }
      return true;
    })
    .slice(0, 50);
  progress.answerTelemetry = normaliseAnswerTelemetry(progress.answerTelemetry).filter((entry) =>
    isDateKey(entry.dateKey) ? entry.dateKey >= cutoffDateKey : true,
  );
  progress.operationBestRanks = normaliseOperationBestRanks(progress.operationBestRanks);
  progress.facts = compactFactProgressMap(progress.facts);

  return progress;
}

function getCurrentMonthDate() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1, 12);
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function createMonthDateFromKey(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1, 12);
}

function formatMonthLabel(date) {
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function formatRecordDateLabel(record) {
  const hasDateKey =
    typeof record?.dateKey === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.dateKey);
  const sourceDate = hasDateKey
    ? parseDateKey(record.dateKey)
    : Number.isFinite(Number(record?.recordedAt))
      ? new Date(Number(record.recordedAt))
      : null;

  if (!sourceDate || Number.isNaN(sourceDate.getTime())) {
    return String(record?.dateKey || "");
  }

  return sourceDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getCheckedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function setCheckedValue(name, value) {
  document.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = input.value === value;
  });
}

function setCheckedValues(name, values) {
  const selected = new Set(Array.isArray(values) ? values : []);
  document.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = selected.has(input.value);
  });
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(
    (input) => input.value,
  );
}

function getSelectedOperationValue() {
  const value = getCheckedValue("operation");
  return OPERATION_CONFIG[value] ? value : "";
}

function hasSelectedSessionType() {
  const sessionType = getCheckedValue("sessionType");
  return (
    sessionType === "timed" ||
    sessionType === "question-goal" ||
    sessionType === "endless" ||
    sessionType === "isolation"
  );
}

function hasSelectedAdditionDifficulty() {
  const selected = getCheckedValues("additionDifficulty");
  return selected.some((difficulty) => ["easy", "medium", "hard"].includes(difficulty));
}

function hasSelectedSubtractionDifficulty() {
  const selected = getCheckedValues("subtractionDifficulty");
  return selected.some((difficulty) => ["easy", "medium", "hard"].includes(difficulty));
}

function clearSetupFlowSelections() {
  const defaults = defaultSettingsSnapshot();
  applySettingsSnapshot(defaults);
  setCheckedValue("operation", "");
  setCheckedValue("sessionType", "");
  setCheckedValues("additionDifficulty", []);
  setCheckedValues("subtractionDifficulty", []);
}

function resetSetupForNextWorkout() {
  clearSetupFlowSelections();
  toggleSetupFields();
}

function resetSetupOperationSelection() {
  clearSetupFlowSelections();
  toggleSetupFields();
}

function handleOperationResetClick(event) {
  const trigger = event.target.closest("[data-operation-reset]");
  if (!trigger) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  resetSetupOperationSelection();
}

function getOperationLabel(operation) {
  return OPERATION_LABELS[operation] || OPERATION_LABELS.multiplication;
}

function applySettingsSnapshot(settings) {
  const snapshot = sanitiseSettingsSnapshot(settings);
  setCheckedValue("operation", snapshot.operation);
  elements.minFactor.value = `${snapshot.minFactor}`;
  elements.maxFactor.value = `${snapshot.maxFactor}`;
  elements.focusFactor.value = `${snapshot.focusFactor}`;
  elements.adaptiveMode.checked = snapshot.adaptiveMode;
  elements.negativesMode.checked = snapshot.negativesMode;
  elements.questionCustom.value = `${snapshot.questionTarget}`;
  elements.timeCustom.value = `${snapshot.timeLimitMinutes}`;
  setCheckedValues("additionDifficulty", snapshot.additionDifficulties);
  setCheckedValues("subtractionDifficulty", snapshot.subtractionDifficulties);
  if (elements.additionRegroupingMode) {
    elements.additionRegroupingMode.checked = snapshot.additionRegrouping;
  }
  setCheckedValue("sessionType", snapshot.sessionType);
  setCheckedValue("freeTrainingMode", snapshot.freeTrainingMode);
  setCheckedValue("sparTiming", snapshot.sparTiming);
  setCheckedValue("questionPreset", snapshot.questionPreset);
  setCheckedValue("timePreset", snapshot.timePreset);
  syncIsolationRangeControls();
}

function getFormSettingsSnapshot() {
  return sanitiseSettingsSnapshot({
    operation: getCheckedValue("operation"),
    minFactor: Number(elements.minFactor.value),
    maxFactor: Number(elements.maxFactor.value),
    focusFactor: Number(elements.focusFactor.value),
    adaptiveMode: elements.adaptiveMode.checked,
    negativesMode: elements.negativesMode.checked,
    sessionType: getCheckedValue("sessionType"),
    freeTrainingMode: getCheckedValue("freeTrainingMode"),
    sparTiming: getCheckedValue("sparTiming"),
    questionPreset: getCheckedValue("questionPreset"),
    questionTarget: Number(elements.questionCustom.value),
    timePreset: getCheckedValue("timePreset"),
    timeLimitMinutes: Number(elements.timeCustom.value),
    additionDifficulty: getCheckedValues("additionDifficulty")[0] || "easy",
    additionDifficulties: getCheckedValues("additionDifficulty"),
    subtractionDifficulty: getCheckedValues("subtractionDifficulty")[0] || "easy",
    subtractionDifficulties: getCheckedValues("subtractionDifficulty"),
    additionRegrouping: elements.additionRegroupingMode?.checked ?? true,
  });
}

function isSparMode(settings) {
  return settings.sessionType === "endless" && settings.freeTrainingMode === "spar";
}

function usesSessionCountdown(settings) {
  return settings.sessionType === "timed" || (isSparMode(settings) && settings.sparTiming === "timed");
}

function syncIsolationRangeControls(changedField = "") {
  const minFactor = clampNumber(
    Number(elements.minFactor.value),
    1,
    FACTOR_LIMIT,
    defaultSettingsSnapshot().minFactor,
  );
  const maxFactor = clampNumber(
    Number(elements.maxFactor.value),
    1,
    FACTOR_LIMIT,
    defaultSettingsSnapshot().maxFactor,
  );
  let nextMin = minFactor;
  let nextMax = maxFactor;

  if (nextMin > nextMax) {
    if (changedField === "min") {
      nextMax = nextMin;
    } else {
      nextMin = nextMax;
    }
  }

  elements.minFactor.value = `${nextMin}`;
  elements.maxFactor.value = `${nextMax}`;

  Array.from(elements.minFactor.options).forEach((option) => {
    option.disabled = Number(option.value) > nextMax;
  });
  Array.from(elements.maxFactor.options).forEach((option) => {
    option.disabled = Number(option.value) < nextMin;
  });
}

function toggleSetupFields() {
  const operation = getSelectedOperationValue();
  const hasOperation = Boolean(operation);
  let sessionType = getCheckedValue("sessionType");
  const freeTrainingMode = getCheckedValue("freeTrainingMode");
  const sparTiming = getCheckedValue("sparTiming");
  const questionPreset = getCheckedValue("questionPreset");
  const timePreset = getCheckedValue("timePreset");
  const defaults = defaultSettingsSnapshot();
  const additionMode = operation === "addition";
  const subtractionMode = operation === "subtraction";
  let difficultySelected = additionMode
    ? hasSelectedAdditionDifficulty()
    : subtractionMode
      ? hasSelectedSubtractionDifficulty()
      : true;
  const showAdditionDifficultyStep = additionMode && hasOperation;
  const showSubtractionDifficultyStep = subtractionMode && hasOperation;
  const showDifficultyStep = showAdditionDifficultyStep || showSubtractionDifficultyStep;
  let showWorkoutTypeStep = hasOperation && (!showDifficultyStep || difficultySelected);
  const supportsIsolation = operation === "multiplication" || operation === "division";
  const divisionMode = operation === "division";
  const selectedOperation = hasOperation ? operation : "";
  const previousPrunedOperation = elements.operationChoiceGrid?.dataset.prunedForOperation || "";
  const shouldAnimateOperationPrune =
    Boolean(selectedOperation) && previousPrunedOperation !== selectedOperation;

  if (!hasOperation) {
    setCheckedValue("sessionType", "");
    setCheckedValues("additionDifficulty", []);
    setCheckedValues("subtractionDifficulty", []);
    sessionType = "";
  }

  if (additionMode && !hasSelectedAdditionDifficulty()) {
    setCheckedValues("additionDifficulty", ["easy"]);
    difficultySelected = true;
    showWorkoutTypeStep = hasOperation;
  }
  if (subtractionMode && !hasSelectedSubtractionDifficulty()) {
    setCheckedValues("subtractionDifficulty", ["easy"]);
    difficultySelected = true;
    showWorkoutTypeStep = hasOperation;
  }

  if (additionMode && !difficultySelected && sessionType) {
    setCheckedValue("sessionType", "");
    sessionType = "";
  }
  if (subtractionMode && !difficultySelected && sessionType) {
    setCheckedValue("sessionType", "");
    sessionType = "";
  }

  if (!supportsIsolation && sessionType === "isolation") {
    setCheckedValue("sessionType", "");
    sessionType = "";
  }

  const hasSessionType = hasSelectedSessionType() && showWorkoutTypeStep;
  const showAdvancedSettings = hasOperation && hasSessionType;
  const isolationMode = supportsIsolation && sessionType === "isolation";
  const questionGoalMode = sessionType === "question-goal" || isolationMode;
  const countdownMode =
    sessionType === "timed" ||
    (sessionType === "endless" && freeTrainingMode === "spar" && sparTiming === "timed");

  if (elements.setupOperationPanel) {
    elements.setupOperationPanel.classList.toggle("has-operation-selection", hasOperation);
  }
  if (elements.operationChoiceGrid) {
    elements.operationChoiceGrid.classList.toggle("is-pruned-view", hasOperation);
    elements.operationChoiceGrid.classList.toggle(
      "is-prune-transitioning",
      hasOperation && shouldAnimateOperationPrune,
    );
    if (!hasOperation) {
      elements.operationChoiceGrid.dataset.prunedForOperation = "";
    }
  }
  if (operationPruneTimerId) {
    window.clearTimeout(operationPruneTimerId);
    operationPruneTimerId = null;
  }
  elements.operationInputs.forEach((input, index) => {
    const option = input.closest(".operation-choice");
    if (!option) {
      return;
    }
    if (!option.dataset.defaultOrder) {
      option.dataset.defaultOrder = `${index}`;
    }
    const isSelectedOption = hasOperation && input.checked;
    const shouldPrune = hasOperation && !isSelectedOption;
    option.classList.toggle("is-fading", shouldPrune && shouldAnimateOperationPrune);
    option.classList.toggle("is-pruned", shouldPrune && !shouldAnimateOperationPrune);
    option.classList.toggle("is-selected", isSelectedOption);
    option.style.order = hasOperation
      ? isSelectedOption
        ? "0"
        : `${Number(option.dataset.defaultOrder || index) + 1}`
      : option.dataset.defaultOrder || `${index}`;
    const changeButton = option.querySelector("[data-operation-reset]");
    if (changeButton instanceof HTMLButtonElement) {
      changeButton.classList.toggle("is-hidden", !isSelectedOption);
      changeButton.disabled = !isSelectedOption;
    }
  });
  if (hasOperation && shouldAnimateOperationPrune && elements.operationChoiceGrid) {
    operationPruneTimerId = window.setTimeout(() => {
      elements.operationInputs.forEach((input) => {
        const option = input.closest(".operation-choice");
        if (!option) {
          return;
        }
        const isSelectedOption = input.checked;
        option.classList.toggle("is-fading", false);
        option.classList.toggle("is-pruned", !isSelectedOption);
      });
      elements.operationChoiceGrid?.classList.remove("is-prune-transitioning");
      elements.operationChoiceGrid.dataset.prunedForOperation = selectedOperation;
      operationPruneTimerId = null;
    }, 180);
  } else if (hasOperation && elements.operationChoiceGrid) {
    elements.operationChoiceGrid.dataset.prunedForOperation = selectedOperation;
  }

  if (elements.additionDifficultyField) {
    elements.additionDifficultyField.classList.toggle("is-hidden", !showAdditionDifficultyStep);
  }
  if (elements.subtractionDifficultyField) {
    elements.subtractionDifficultyField.classList.toggle(
      "is-hidden",
      !showSubtractionDifficultyStep,
    );
  }
  elements.additionDifficultyInputs.forEach((input) => {
    input.disabled = !showAdditionDifficultyStep;
  });
  elements.subtractionDifficultyInputs.forEach((input) => {
    input.disabled = !showSubtractionDifficultyStep;
  });

  if (elements.sessionTypeField) {
    elements.sessionTypeField.classList.toggle("is-hidden", !showWorkoutTypeStep);
  }

  if (!isolationMode) {
    elements.minFactor.value = `${defaults.minFactor}`;
    elements.maxFactor.value = `${defaults.maxFactor}`;
  }

  syncIsolationRangeControls();
  if (elements.isolationSessionChoice) {
    elements.isolationSessionChoice.classList.toggle("is-hidden", !supportsIsolation);
    const isolationInput = elements.isolationSessionChoice.querySelector('input[name="sessionType"]');
    if (isolationInput instanceof HTMLInputElement) {
      isolationInput.disabled = !supportsIsolation || !showWorkoutTypeStep;
    }
  }
  elements.sessionTypeInputs.forEach((input) => {
    if (input.value === "isolation") {
      return;
    }
    input.disabled = !showWorkoutTypeStep;
  });

  if (elements.setupSettingsPanel) {
    elements.setupSettingsPanel.classList.toggle("is-ready", showAdvancedSettings);
  }
  if (elements.setupSettingsAwaiting) {
    elements.setupSettingsAwaiting.classList.toggle("is-hidden", showAdvancedSettings);
  }
  if (elements.settingsForm) {
    elements.settingsForm.classList.toggle("is-hidden", !showAdvancedSettings);
  }
  if (elements.setupStartButton) {
    elements.setupStartButton.disabled = !showAdvancedSettings;
  }

  elements.isolationField.classList.toggle("is-hidden", !showAdvancedSettings || !isolationMode);
  elements.focusFactor.disabled = !showAdvancedSettings || !isolationMode;
  elements.minFactor.disabled = !showAdvancedSettings || !isolationMode;
  elements.maxFactor.disabled = !showAdvancedSettings || !isolationMode;

  if (elements.negativesToggleRow) {
    elements.negativesToggleRow.classList.toggle(
      "is-hidden",
      additionMode || subtractionMode || divisionMode || !showAdvancedSettings,
    );
  }
  if (elements.additionRegroupingToggleRow) {
    elements.additionRegroupingToggleRow.classList.toggle(
      "is-hidden",
      !additionMode || !showAdvancedSettings,
    );
  }
  elements.negativesMode.disabled = additionMode || subtractionMode || divisionMode || !showAdvancedSettings;
  if (elements.additionRegroupingMode) {
    elements.additionRegroupingMode.disabled = !additionMode || !showAdvancedSettings;
  }
  if (additionMode || subtractionMode || divisionMode || !showAdvancedSettings) {
    elements.negativesMode.checked = false;
  }
  if (elements.countdownCopy) {
    elements.countdownCopy.textContent =
      operation === "addition"
        ? "Type the answer to each addition fact."
        : operation === "subtraction"
          ? "Type the answer to each subtraction fact."
          : operation === "division"
            ? "Type the answer to each division fact."
            : "Type the answer to the times tables.";
  }

  elements.freeTrainingField.classList.toggle(
    "is-hidden",
    !showAdvancedSettings || sessionType !== "endless",
  );
  elements.sparTimingField.classList.toggle(
    "is-hidden",
    !showAdvancedSettings || sessionType !== "endless" || freeTrainingMode !== "spar",
  );
  elements.timeField.classList.toggle("is-hidden", !showAdvancedSettings || !countdownMode);
  elements.questionTargetField.classList.toggle(
    "is-hidden",
    !showAdvancedSettings || !questionGoalMode,
  );
  elements.timeCustomField.classList.toggle(
    "is-hidden",
    !showAdvancedSettings || !countdownMode || timePreset !== "custom",
  );
  elements.questionCustomField.classList.toggle(
    "is-hidden",
    !showAdvancedSettings || !questionGoalMode || questionPreset !== "custom",
  );
}

function readSettings() {
  const operation = getSelectedOperationValue();
  const sessionType = getCheckedValue("sessionType");
  const freeTrainingMode = getCheckedValue("freeTrainingMode");
  const sparTiming = getCheckedValue("sparTiming");
  const questionPreset = getCheckedValue("questionPreset");
  const timePreset = getCheckedValue("timePreset");
  const additionDifficulties = getCheckedValues("additionDifficulty").filter((value) =>
    ["easy", "medium", "hard"].includes(value),
  );
  const additionDifficulty = additionDifficulties[0] || "easy";
  const subtractionDifficulties = getCheckedValues("subtractionDifficulty").filter((value) =>
    ["easy", "medium", "hard"].includes(value),
  );
  const subtractionDifficulty = subtractionDifficulties[0] || "easy";

  if (!operation) {
    return { error: "Choose an operation before starting." };
  }

  if (operation === "addition" && !hasSelectedAdditionDifficulty()) {
    return { error: "Choose at least one addition difficulty before selecting the workout type." };
  }
  if (operation === "subtraction" && !hasSelectedSubtractionDifficulty()) {
    return { error: "Choose at least one subtraction difficulty before selecting the workout type." };
  }

  if (
    sessionType !== "timed" &&
    sessionType !== "question-goal" &&
    sessionType !== "endless" &&
    sessionType !== "isolation"
  ) {
    return { error: "Choose a workout type before starting." };
  }

  const adaptiveMode = elements.adaptiveMode.checked;
  const negativesMode =
    operation === "addition" || operation === "subtraction" || operation === "division"
      ? false
      : elements.negativesMode.checked;
  const additionRegrouping = operation === "addition" ? elements.additionRegroupingMode.checked : true;
  const defaults = defaultSettingsSnapshot();
  const isolationMode =
    (operation === "multiplication" || operation === "division") && sessionType === "isolation";
  let minFactor = defaults.minFactor;
  let maxFactor = defaults.maxFactor;
  let focusFactor = defaults.focusFactor;

  if (isolationMode) {
    syncIsolationRangeControls();
    minFactor = Number(elements.minFactor.value);
    maxFactor = Number(elements.maxFactor.value);
    focusFactor = Number(elements.focusFactor.value);
    if (
      Number.isNaN(minFactor) ||
      Number.isNaN(maxFactor) ||
      Number.isNaN(focusFactor) ||
      minFactor < 1 ||
      maxFactor > FACTOR_LIMIT ||
      focusFactor < 1 ||
      focusFactor > FACTOR_LIMIT ||
      minFactor > maxFactor
    ) {
      return { error: "Choose a valid isolation range between 1 and 12." };
    }
  }

  const questionTarget =
    questionPreset === "custom"
      ? Number(elements.questionCustom.value)
      : Number(questionPreset);
  const timeLimitMinutes =
    timePreset === "custom" ? Number(elements.timeCustom.value) : Number(timePreset);

  if (sessionType === "question-goal" || sessionType === "isolation") {
    if (Number.isNaN(questionTarget) || questionTarget < 5 || questionTarget > 200) {
      return { error: "Choose an attempt goal between 5 and 200." };
    }
  }

  if (sessionType === "timed" || (sessionType === "endless" && freeTrainingMode === "spar" && sparTiming === "timed")) {
    if (Number.isNaN(timeLimitMinutes) || timeLimitMinutes < 1 || timeLimitMinutes > 60) {
      return { error: "Choose a workout duration between 1 and 60 minutes." };
    }
  }

  return sanitiseSettingsSnapshot({
    operation,
    minFactor,
    maxFactor,
    focusFactor,
    adaptiveMode,
    negativesMode,
    sessionType,
    freeTrainingMode,
    sparTiming,
    questionPreset,
    questionTarget,
    timePreset,
    timeLimitMinutes,
    additionDifficulty,
    additionDifficulties,
    subtractionDifficulty,
    subtractionDifficulties,
    additionRegrouping,
  });
}

function getCurrentSettingsPreview() {
  const settings = readSettings();
  return settings.error ? getFormSettingsSnapshot() : settings;
}

function average(values) {
  if (!values.length) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
  const cleanValues = values
    .filter((value) => Number.isFinite(value))
    .sort((left, right) => left - right);
  if (!cleanValues.length) {
    return null;
  }

  const middle = Math.floor(cleanValues.length / 2);
  return cleanValues.length % 2
    ? cleanValues[middle]
    : (cleanValues[middle - 1] + cleanValues[middle]) / 2;
}

function getAccuracy(correct, total) {
  if (!total) {
    return 0;
  }

  return correct / total;
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function formatQuestionDuration(milliseconds) {
  if (milliseconds === null || !Number.isFinite(milliseconds)) {
    return "-";
  }

  return `${(milliseconds / 1000).toFixed(1)}s`;
}

function formatStopwatch(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getQuestionStyleLabel(settings) {
  if (settings.operation === "addition") {
    const difficultyLabel =
      Array.isArray(settings.additionDifficulties) && settings.additionDifficulties.length
        ? settings.additionDifficulties.join(", ")
        : settings.additionDifficulty;
    return `Addition (${difficultyLabel})`;
  }

  return settings.sessionType === "isolation"
    ? `Isolation x ${settings.focusFactor} (${settings.minFactor}-${settings.maxFactor})`
    : "Full Circuit";
}

function getSessionBadgeLabel(settings) {
  const operationLabel = getOperationLabel(settings.operation || "multiplication");
  const modeLabel = settings.sessionType === "timed"
    ? `H.I.T ${settings.timeLimitMinutes}m`
    : settings.sessionType === "question-goal"
      ? `Target Reps ${settings.questionTarget}`
      : settings.sessionType === "isolation"
        ? `Isolation x ${settings.focusFactor} (${settings.questionTarget})`
        : settings.freeTrainingMode === "spar"
          ? settings.sparTiming === "timed"
            ? `Spar ${settings.timeLimitMinutes}m`
            : "Spar Mode"
          : "Zen Mode";
  const negativesLabel = settings.negativesMode ? "Negatives On" : "Negatives Off";
  return `${operationLabel} | ${modeLabel} | ${negativesLabel}`;
}

function getHeroMessage() {
  try {
    const previousMessage = window.sessionStorage.getItem(HERO_MESSAGE_KEY);
    const choices = HERO_MESSAGES.filter((message) => message !== previousMessage);
    const pool = choices.length ? choices : HERO_MESSAGES;
    const message = pool[Math.floor(Math.random() * pool.length)];
    window.sessionStorage.setItem(HERO_MESSAGE_KEY, message);
    return message;
  } catch (error) {
    return HERO_MESSAGES[Math.floor(Math.random() * HERO_MESSAGES.length)];
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatTechniqueDigits(value, highlightFactor = false) {
  return String(value)
    .split("")
    .map((digit) => {
      if (digit === "0") {
        return '<span class="technique-zero">0</span>';
      }

      const safeDigit = escapeHtml(digit);
      return highlightFactor ? `<span class="technique-factor">${safeDigit}</span>` : safeDigit;
    })
    .join("");
}

function formatTechniqueNumber(value) {
  return formatTechniqueDigits(value, false);
}

function formatTechniqueFactorValue(value) {
  return formatTechniqueDigits(value, true);
}

function formatTechniqueFactorStemValue(value) {
  return String(value)
    .split("")
    .map((digit) => `<span class="technique-factor">${escapeHtml(digit)}</span>`)
    .join("");
}

function formatTechniqueCarryValue(value, table = TECHNIQUE_TABLE) {
  return value === table ? formatTechniqueNumber(value) : formatTechniqueFactorValue(value);
}

function formatTechniqueAnswerValue(answer, carryFactor = null, table = TECHNIQUE_TABLE) {
  if (table === TECHNIQUE_TABLE && carryFactor !== null && Number(answer) === Number(carryFactor) * table) {
    return `${formatTechniqueFactorStemValue(carryFactor)}<span class="technique-zero">0</span>`;
  }

  return formatTechniqueNumber(answer);
}

function formatTechniqueEquation(leftOrQuestion, rightValue = null) {
  if (
    leftOrQuestion &&
    typeof leftOrQuestion === "object" &&
    Object.prototype.hasOwnProperty.call(leftOrQuestion, "left") &&
    Object.prototype.hasOwnProperty.call(leftOrQuestion, "right")
  ) {
    const question = leftOrQuestion;
    const left = Number(question.left);
    const right = Number(question.right);
    const leftIsCarryFactor = !question.reversed;
    const rightIsCarryFactor = Boolean(question.reversed);

    const highlightedLeft = leftIsCarryFactor
      ? formatTechniqueFactorValue(left)
      : formatTechniqueNumber(left);
    const highlightedRight = rightIsCarryFactor
      ? formatTechniqueFactorValue(right)
      : formatTechniqueNumber(right);

    return `${highlightedLeft} x ${highlightedRight}`;
  }

  const left = Number(leftOrQuestion);
  const right = Number(rightValue);
  const highlightedLeft = left === TECHNIQUE_TABLE ? formatTechniqueNumber(left) : formatTechniqueFactorValue(left);
  const highlightedRight =
    right === TECHNIQUE_TABLE ? formatTechniqueNumber(right) : formatTechniqueFactorValue(right);

  return `${highlightedLeft} x ${highlightedRight}`;
}

function createTechniqueQuestion(table = TECHNIQUE_TABLE, forceReversed = null) {
  const reversed =
    typeof forceReversed === "boolean" ? forceReversed : Math.random() > 0.5;
  const otherFactor = TABLE_FACTORS[Math.floor(Math.random() * TABLE_FACTORS.length)];

  return {
    table,
    otherFactor,
    left: reversed ? table : otherFactor,
    right: reversed ? otherFactor : table,
    reversed,
    answer: otherFactor * table,
  };
}

function createGuidedTechniqueQuestions(table = TECHNIQUE_TABLE) {
  const shuffledFactors = [...TABLE_FACTORS];
  for (let index = shuffledFactors.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledFactors[index], shuffledFactors[swapIndex]] = [
      shuffledFactors[swapIndex],
      shuffledFactors[index],
    ];
  }
  const selectedFactors = shuffledFactors.slice(0, 4);

  return [
    {
      table,
      otherFactor: selectedFactors[0],
      left: selectedFactors[0],
      right: table,
      reversed: false,
      answer: selectedFactors[0] * table,
    },
    {
      table,
      otherFactor: selectedFactors[1],
      left: selectedFactors[1],
      right: table,
      reversed: false,
      answer: selectedFactors[1] * table,
    },
    {
      table,
      otherFactor: selectedFactors[2],
      left: table,
      right: selectedFactors[2],
      reversed: true,
      answer: selectedFactors[2] * table,
    },
    {
      table,
      otherFactor: selectedFactors[3],
      left: table,
      right: selectedFactors[3],
      reversed: true,
      answer: selectedFactors[3] * table,
    },
  ];
}

function getTechniqueStageIndex(stage) {
  return TECHNIQUE_STEPS.findIndex((step) => step.id === stage);
}
