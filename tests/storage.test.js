"use strict";

// Characterisation tests for saved-data loading and normalisation (js/app-core.js).
// These pin down CURRENT behaviour; see tests/README.md.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { loadApp } = require("./harness");

const FIXTURE = require(path.join(__dirname, "..", "tools", "visual-check", "fixtures", "populated-progress.json"));

const KEY = "math-muscle-trainer-progress-v2";
const LEGACY_V2 = "multiplication-trainer-progress-v2";
const LEGACY_V1 = "multiplication-trainer-progress-v1";
const NOW = "2026-01-15T12:00:00.000Z"; // harness default; rolling cutoff is 2025-12-15
const DAY_MS = 24 * 60 * 60 * 1000;

const ROOKIE = { rank: "Rookie", score: 0, earnedAt: 0 };
const ALL_ROOKIE = { addition: ROOKIE, subtraction: ROOKIE, multiplication: ROOKIE, division: ROOKIE };
const EMPTY_BUCKET_EXAMPLES = { "make-10": [], "1-1": [], "1-2": [], "2-2": [], "1-3": [], "2-3": [], "3-3": [] };

function plain(app, value) {
  return app.harness.plain(value);
}

// ---------------------------------------------------------------- storage keys

test("storage key constants are stable", () => {
  const app = loadApp();
  const keys = {
    STORAGE_KEY: app.STORAGE_KEY,
    LEGACY_STORAGE_KEYS: plain(app, app.LEGACY_STORAGE_KEYS),
    HERO_MESSAGE_KEY: app.HERO_MESSAGE_KEY,
    RESULTS_MESSAGE_KEY_PREFIX: app.RESULTS_MESSAGE_KEY_PREFIX,
    THEME_STORAGE_KEY: app.THEME_STORAGE_KEY,
    LEGACY_THEME_STORAGE_KEYS: plain(app, app.LEGACY_THEME_STORAGE_KEYS),
    COLOR_MODE_STORAGE_KEY: app.COLOR_MODE_STORAGE_KEY,
    LEGACY_COLOR_MODE_STORAGE_KEYS: plain(app, app.LEGACY_COLOR_MODE_STORAGE_KEYS),
    KEYPAD_PREFERENCE_STORAGE_KEY: app.KEYPAD_PREFERENCE_STORAGE_KEY,
    LEGACY_KEYPAD_PREFERENCE_STORAGE_KEYS: plain(app, app.LEGACY_KEYPAD_PREFERENCE_STORAGE_KEYS),
  };
  assert.deepStrictEqual(keys, {
    STORAGE_KEY: KEY,
    LEGACY_STORAGE_KEYS: [LEGACY_V2, LEGACY_V1],
    HERO_MESSAGE_KEY: "math-muscle-trainer-hero-message-v1",
    RESULTS_MESSAGE_KEY_PREFIX: "math-muscle-trainer-results-message-v1",
    THEME_STORAGE_KEY: "math-muscle-trainer-theme-v1",
    LEGACY_THEME_STORAGE_KEYS: ["multiplication-trainer-theme-v1"],
    COLOR_MODE_STORAGE_KEY: "math-muscle-trainer-color-mode-v1",
    LEGACY_COLOR_MODE_STORAGE_KEYS: ["multiplication-trainer-color-mode-v1"],
    KEYPAD_PREFERENCE_STORAGE_KEY: "math-muscle-trainer-keypad-preference-v1",
    LEGACY_KEYPAD_PREFERENCE_STORAGE_KEYS: ["multiplication-trainer-keypad-preference-v1"],
  });
});

test("getLocalStorageItemWithFallback: primary, fallbacks in order, null when absent", () => {
  const cases = [
    { stored: {}, expected: null },
    { stored: { p: "primary" }, expected: "primary" },
    { stored: { p: "", a: "a" }, expected: "" }, // empty string is not null, so primary wins
    { stored: { a: "a" }, expected: "a" },
    { stored: { b: "b" }, expected: "b" },
    { stored: { a: "a", b: "b" }, expected: "a" },
    { stored: { p: "primary", a: "a", b: "b" }, expected: "primary" },
  ];
  for (const { stored, expected } of cases) {
    const app = loadApp({ localStorage: stored });
    assert.equal(app.getLocalStorageItemWithFallback("p", ["a", "b"]), expected, JSON.stringify(stored));
  }
  const app = loadApp({ localStorage: { p: "x" } });
  assert.equal(app.getLocalStorageItemWithFallback("missing"), null);
});

test("loadProgress reads each legacy key when only it exists", () => {
  for (const legacyKey of [LEGACY_V2, LEGACY_V1]) {
    const app = loadApp({ localStorage: { [legacyKey]: { totalAnswered: 7, totalCorrect: 5 } } });
    assert.equal(app.state.progress.totalAnswered, 7, legacyKey);
    assert.equal(app.state.progress.totalCorrect, 5, legacyKey);
  }
});

test("loadProgress: current key wins over legacy keys; legacy v2 wins over v1", () => {
  let app = loadApp({
    localStorage: {
      [KEY]: { totalAnswered: 1 },
      [LEGACY_V2]: { totalAnswered: 2 },
      [LEGACY_V1]: { totalAnswered: 3 },
    },
  });
  assert.equal(app.state.progress.totalAnswered, 1);

  app = loadApp({ localStorage: { [LEGACY_V2]: { totalAnswered: 2 }, [LEGACY_V1]: { totalAnswered: 3 } } });
  assert.equal(app.state.progress.totalAnswered, 2);
});

test("loadProgress: corrupt current key does NOT fall back to valid legacy data", () => {
  // The fallback is chosen by presence (non-null), not by validity.
  const app = loadApp({ localStorage: { [KEY]: "{not json", [LEGACY_V2]: { totalAnswered: 9 } } });
  assert.deepStrictEqual(plain(app, app.state.progress), plain(app, app.defaultProgress()));
});

test("theme / colour mode / keypad preference: legacy fallback and current-key priority", () => {
  const table = [
    { prop: "theme", key: "math-muscle-trainer-theme-v1", legacy: "multiplication-trainer-theme-v1", a: "jungle", b: "mudkip", def: "original" },
    { prop: "colorMode", key: "math-muscle-trainer-color-mode-v1", legacy: "multiplication-trainer-color-mode-v1", a: "light", b: "dark", def: "dark" },
    { prop: "keypadPreference", key: "math-muscle-trainer-keypad-preference-v1", legacy: "multiplication-trainer-keypad-preference-v1", a: "always-on", b: "always-off", def: "auto" },
  ];
  for (const row of table) {
    assert.equal(loadApp().state[row.prop], row.def, `${row.prop} default`);
    assert.equal(loadApp({ localStorage: { [row.legacy]: row.a } }).state[row.prop], row.a, `${row.prop} legacy only`);
    assert.equal(
      loadApp({ localStorage: { [row.key]: row.b, [row.legacy]: row.a } }).state[row.prop],
      row.b,
      `${row.prop} current wins`,
    );
    assert.equal(loadApp({ localStorage: { [row.key]: "bogus" } }).state[row.prop], row.def, `${row.prop} junk`);
    // A junk current value still shadows a valid legacy value.
    assert.equal(
      loadApp({ localStorage: { [row.key]: "bogus", [row.legacy]: row.a } }).state[row.prop],
      row.def,
      `${row.prop} junk current shadows legacy`,
    );
  }
});

test("saveTheme / saveColorMode / saveKeypadPreference write sanitised values to current keys only", () => {
  const app = loadApp();
  app.saveTheme("aang");
  app.saveColorMode("purple");
  app.saveKeypadPreference("always-off");
  assert.deepStrictEqual(app.harness.localStorage.toJSON(), {
    "math-muscle-trainer-theme-v1": "aang",
    "math-muscle-trainer-color-mode-v1": "dark",
    "math-muscle-trainer-keypad-preference-v1": "always-off",
  });
});

// ---------------------------------------------------------------- sanitisers

test("sanitiseTheme / sanitiseColorMode / sanitiseKeypadPreference", () => {
  const app = loadApp();
  const table = [
    ["sanitiseTheme", "original", "original"],
    ["sanitiseTheme", "sunny-beach-day", "sunny-beach-day"],
    ["sanitiseTheme", "solo-leveling", "solo-leveling"],
    ["sanitiseTheme", "Jungle", "original"],
    ["sanitiseTheme", "", "original"],
    ["sanitiseTheme", null, "original"],
    ["sanitiseTheme", undefined, "original"],
    ["sanitiseTheme", 42, "original"],
    ["sanitiseColorMode", "light", "light"],
    ["sanitiseColorMode", "dark", "dark"],
    ["sanitiseColorMode", "LIGHT", "dark"],
    ["sanitiseColorMode", null, "dark"],
    ["sanitiseColorMode", {}, "dark"],
    ["sanitiseKeypadPreference", "auto", "auto"],
    ["sanitiseKeypadPreference", "always-on", "always-on"],
    ["sanitiseKeypadPreference", "always-off", "always-off"],
    ["sanitiseKeypadPreference", "on", "auto"],
    ["sanitiseKeypadPreference", undefined, "auto"],
  ];
  for (const [fn, input, expected] of table) {
    assert.equal(app[fn](input), expected, `${fn}(${JSON.stringify(input)})`);
  }
});

test("sanitiseSettingsSnapshot: nothing / junk returns the defaults", () => {
  const app = loadApp();
  const defaults = plain(app, app.defaultSettingsSnapshot());
  for (const input of [undefined, null, {}, "x", 5, { operation: "modulo", minFactor: "a", sessionType: "zzz" }]) {
    assert.deepStrictEqual(plain(app, app.sanitiseSettingsSnapshot(input)), defaults, JSON.stringify(input));
  }
});

test("sanitiseSettingsSnapshot: valid snapshot passes through unchanged", () => {
  const app = loadApp();
  const valid = {
    operation: "division",
    minFactor: 3,
    maxFactor: 9,
    focusFactor: 6,
    adaptiveMode: false,
    negativesMode: false,
    sessionType: "timed",
    freeTrainingMode: "spar",
    sparTiming: "timed",
    questionPreset: "30",
    questionTarget: 30,
    timePreset: "5",
    timeLimitMinutes: 5,
    additionDifficulty: "hard",
    additionDifficulties: ["medium", "hard"],
    subtractionDifficulty: "medium",
    subtractionDifficulties: ["easy", "medium"],
    additionRegrouping: false,
  };
  assert.deepStrictEqual(plain(app, app.sanitiseSettingsSnapshot(valid)), valid);
});

test("sanitiseSettingsSnapshot: clamps, reorders and migrates legacy fields", () => {
  const app = loadApp();
  const cases = [
    {
      name: "min/max swapped, focus clamped, custom target, time clamped to 1",
      input: { minFactor: 9, maxFactor: 3, focusFactor: 40, questionTarget: 15, timeLimitMinutes: 0 },
      expect: { minFactor: 3, maxFactor: 9, focusFactor: 12, questionTarget: 15, questionPreset: "custom", timeLimitMinutes: 1, timePreset: "1" },
    },
    {
      name: "questionTarget clamped to [5, 200]",
      input: { questionTarget: 1000, timeLimitMinutes: 99 },
      expect: { questionTarget: 200, questionPreset: "custom", timeLimitMinutes: 60, timePreset: "custom" },
    },
    {
      name: "legacy sessionLength 0 means endless",
      input: { sessionLength: 0 },
      expect: { sessionType: "endless", questionTarget: 20 },
    },
    {
      name: "legacy sessionLength > 0 becomes the question target",
      input: { sessionLength: 15 },
      expect: { sessionType: "question-goal", questionTarget: 15, questionPreset: "custom" },
    },
    {
      name: "legacy questionStyle focus becomes isolation",
      input: { questionStyle: "focus", sessionType: "timed" },
      expect: { sessionType: "isolation" },
    },
    {
      name: "legacy mode focus only counts when questionStyle is a string",
      input: { mode: "focus" },
      expect: { sessionType: "question-goal" },
    },
    {
      name: "isolation is not allowed for addition",
      input: { operation: "addition", sessionType: "isolation", minFactor: 5, negativesMode: true },
      expect: { operation: "addition", sessionType: "question-goal", minFactor: 2, maxFactor: 12, negativesMode: false },
    },
    {
      name: "negatives only kept for multiplication",
      input: { operation: "multiplication", negativesMode: true },
      expect: { negativesMode: true },
    },
    {
      name: "difficulty lists are filtered and ordered easy, medium, hard",
      input: { additionDifficulties: ["hard", "bogus", "easy"], subtractionDifficulties: [], subtractionDifficulty: "hard" },
      expect: { additionDifficulties: ["easy", "hard"], subtractionDifficulties: ["hard"], subtractionDifficulty: "hard" },
    },
    {
      name: "preset string kept when target is not a preset but preset is",
      input: { questionTarget: 25, questionPreset: "10", timeLimitMinutes: 4, timePreset: "custom" },
      expect: { questionTarget: 25, questionPreset: "10", timeLimitMinutes: 4, timePreset: "custom" },
    },
  ];
  for (const { name, input, expect } of cases) {
    const result = plain(app, app.sanitiseSettingsSnapshot(input));
    for (const [field, value] of Object.entries(expect)) {
      assert.deepStrictEqual(result[field], value, `${name}: ${field}`);
    }
  }
});

// ---------------------------------------------------------------- per-record normalisers

test("normaliseFactProgressEntry: valid entry passes through", () => {
  const app = loadApp();
  const entry = {
    operation: "multiplication",
    symbol: "x",
    attempts: 10,
    correct: 8,
    magnitudeCorrect: 9,
    signCorrect: 7,
    signErrors: 1,
    misses: 2,
    bestStreak: 5,
    currentStreak: 3,
    averageMs: 2500,
    firstSeenAt: 1000,
    lastSeenAt: 2000,
  };
  assert.deepStrictEqual(plain(app, app.normaliseFactProgressEntry("multiplication:3x4", entry)), entry);
});

test("normaliseFactProgressEntry: junk is clamped / defaulted", () => {
  const app = loadApp();
  const cases = [
    {
      name: "null entry on a legacy multiplication key",
      key: "3x4",
      entry: null,
      expected: { operation: "multiplication", symbol: "x", attempts: 0, correct: 0, magnitudeCorrect: 0, signCorrect: 0, signErrors: 0, misses: 0, bestStreak: 0, currentStreak: 0, averageMs: null, firstSeenAt: 0, lastSeenAt: 0 },
    },
    {
      name: "operation inferred from key prefix; division uses the display symbol",
      key: "division:12/3",
      entry: { attempts: 4, correct: 3 },
      expected: { operation: "division", symbol: "÷", attempts: 4, correct: 3, magnitudeCorrect: 3, signCorrect: 3, signErrors: 0, misses: 1, bestStreak: 0, currentStreak: 0, averageMs: null, firstSeenAt: 0, lastSeenAt: 0 },
    },
    {
      name: "correct > attempts, bestStreak < currentStreak, negative averageMs, firstSeenAt 0",
      key: "addition:2+3",
      entry: { attempts: 5, correct: 9, currentStreak: 4, bestStreak: 2, averageMs: -5, firstSeenAt: 0, lastSeenAt: 100 },
      expected: { operation: "addition", symbol: "+", attempts: 5, correct: 5, magnitudeCorrect: 5, signCorrect: 5, signErrors: 0, misses: 0, bestStreak: 4, currentStreak: 4, averageMs: 0, firstSeenAt: 100, lastSeenAt: 100 },
    },
    {
      name: "firstSeenAt after lastSeenAt is pulled back; string numbers coerced; NaN averageMs -> null",
      key: "subtraction:9-4",
      entry: { operation: "subtraction", attempts: "3", correct: "2", averageMs: "fast", firstSeenAt: 900, lastSeenAt: 500, misses: 99 },
      expected: { operation: "subtraction", symbol: "-", attempts: 3, correct: 2, magnitudeCorrect: 2, signCorrect: 2, signErrors: 0, misses: 3, bestStreak: 0, currentStreak: 0, averageMs: null, firstSeenAt: 500, lastSeenAt: 500 },
    },
    {
      name: "explicit operation in entry beats the key prefix; bogus operation falls back to key",
      key: "addition:1+1",
      entry: { operation: "division" },
      expected: { operation: "division", symbol: "÷", attempts: 0, correct: 0, magnitudeCorrect: 0, signCorrect: 0, signErrors: 0, misses: 0, bestStreak: 0, currentStreak: 0, averageMs: null, firstSeenAt: 0, lastSeenAt: 0 },
    },
    {
      name: "negative / huge counts clamp to [0, 999999]",
      key: "multiplication:2x2",
      entry: { operation: "modulo", attempts: 5e6, correct: -3 },
      expected: { operation: "multiplication", symbol: "x", attempts: 999999, correct: 0, magnitudeCorrect: 0, signCorrect: 0, signErrors: 0, misses: 999999, bestStreak: 0, currentStreak: 0, averageMs: null, firstSeenAt: 0, lastSeenAt: 0 },
    },
  ];
  for (const { name, key, entry, expected } of cases) {
    assert.deepStrictEqual(plain(app, app.normaliseFactProgressEntry(key, entry)), expected, name);
  }
});

test("normaliseDailyRecord: valid record passes; aliases and goal inference", () => {
  const app = loadApp();
  const cases = [
    [{ attempted: 12, correct: 11, skipped: 1, attemptGoalEarned: true, accuracyGoalEarned: true, sessionsCompleted: 2 },
      { attempted: 12, correct: 11, skipped: 1, attemptGoalEarned: true, accuracyGoalEarned: true, sessionsCompleted: 2 }],
    [undefined, { attempted: 0, correct: 0, skipped: 0, attemptGoalEarned: false, accuracyGoalEarned: false, sessionsCompleted: 0 }],
    [null, { attempted: 0, correct: 0, skipped: 0, attemptGoalEarned: false, accuracyGoalEarned: false, sessionsCompleted: 0 }],
    // legacy aliases: answered -> attempted, heartEarned -> accuracyGoalEarned, slice/starEarned -> attemptGoalEarned
    [{ answered: 4, correct: 3, heartEarned: true }, { attempted: 4, correct: 3, skipped: 0, attemptGoalEarned: true, accuracyGoalEarned: true, sessionsCompleted: 0 }],
    [{ attempted: 4, starEarned: true }, { attempted: 4, correct: 0, skipped: 0, attemptGoalEarned: true, accuracyGoalEarned: false, sessionsCompleted: 0 }],
    [{ attempted: 4, sliceEarned: 1 }, { attempted: 4, correct: 0, skipped: 0, attemptGoalEarned: true, accuracyGoalEarned: false, sessionsCompleted: 0 }],
    // goals inferred from DAILY_TARGET (10)
    [{ attempted: 9, correct: 9 }, { attempted: 9, correct: 9, skipped: 0, attemptGoalEarned: false, accuracyGoalEarned: false, sessionsCompleted: 0 }],
    [{ attempted: 10, correct: 9 }, { attempted: 10, correct: 9, skipped: 0, attemptGoalEarned: true, accuracyGoalEarned: false, sessionsCompleted: 0 }],
    [{ attempted: 0, correct: 10 }, { attempted: 0, correct: 10, skipped: 0, attemptGoalEarned: true, accuracyGoalEarned: true, sessionsCompleted: 0 }],
    // clamped to [0, 9999]; note correct is NOT clamped to attempted
    [{ attempted: -5, correct: 20000, skipped: "x", sessionsCompleted: 1e9 }, { attempted: 0, correct: 9999, skipped: 0, attemptGoalEarned: true, accuracyGoalEarned: true, sessionsCompleted: 9999 }],
  ];
  for (const [input, expected] of cases) {
    assert.deepStrictEqual(plain(app, app.normaliseDailyRecord(input)), expected, JSON.stringify(input));
  }
});

test("normaliseWorkoutRecord: valid record passes through", () => {
  const app = loadApp();
  const record = plain(app, FIXTURE.progress.workoutHistory[0]);
  assert.deepStrictEqual(plain(app, app.normaliseWorkoutRecord(record)), record);
});

test("normaliseWorkoutRecord: empty input gets defaults from the fixed clock", () => {
  const app = loadApp({ now: NOW });
  const nowMs = Date.parse(NOW);
  const expected = {
    id: String(nowMs),
    operation: "multiplication",
    modeKey: "question-goal",
    modeLabel: "",
    dateKey: "2026-01-15",
    recordedAt: nowMs,
    attempted: 0,
    correct: 0,
    accuracy: 0,
    skipped: 0,
    bestStreak: 0,
    averageMs: null,
    medianMs: null,
    fastCorrect: 0,
    sessionSource: "practice",
    reason: "goal",
    freeTrainingMode: "zen",
    sparTiming: "untimed",
    timeLimitMinutes: 0,
    focusFactor: 7,
    minFactor: 2,
    maxFactor: 12,
    additionDifficulty: "easy",
    additionDifficulties: ["easy"],
    additionRegrouping: true,
  };
  for (const input of [null, undefined, {}]) {
    assert.deepStrictEqual(plain(app, app.normaliseWorkoutRecord(input)), expected, JSON.stringify(input));
  }
});

test("normaliseWorkoutRecord: junk fields clamped / defaulted; legacy answered alias", () => {
  const app = loadApp();
  const result = plain(app, app.normaliseWorkoutRecord({
    recordedAt: 5000,
    operation: "modulo",
    modeKey: "endless",
    answered: 14,
    accuracy: 1.7,
    averageMs: -1,
    medianMs: "slow",
    freeTrainingMode: "boxing",
    sparTiming: "fast",
    timeLimitMinutes: 120,
    focusFactor: 0,
    minFactor: 11,
    maxFactor: 4,
    additionDifficulty: "insane",
    additionDifficulties: ["hard", "insane", "easy"],
    additionRegrouping: "yes",
    dateKey: "not-a-date",
  }));
  assert.deepStrictEqual(
    {
      id: result.id,
      operation: result.operation,
      modeKey: result.modeKey,
      attempted: result.attempted,
      accuracy: result.accuracy,
      averageMs: result.averageMs,
      medianMs: result.medianMs,
      freeTrainingMode: result.freeTrainingMode,
      sparTiming: result.sparTiming,
      timeLimitMinutes: result.timeLimitMinutes,
      focusFactor: result.focusFactor,
      minFactor: result.minFactor,
      maxFactor: result.maxFactor,
      additionDifficulty: result.additionDifficulty,
      additionDifficulties: result.additionDifficulties,
      additionRegrouping: result.additionRegrouping,
      dateKey: result.dateKey,
      recordedAt: result.recordedAt,
    },
    {
      id: "5000", // id falls back to recordedAt
      operation: "multiplication",
      modeKey: "question-goal",
      attempted: 14,
      accuracy: 1,
      averageMs: 0,
      medianMs: null,
      freeTrainingMode: "zen",
      sparTiming: "untimed",
      timeLimitMinutes: 60,
      focusFactor: 1,
      minFactor: 4,
      maxFactor: 11,
      additionDifficulty: "easy",
      additionDifficulties: ["hard", "easy"], // filtered but NOT re-ordered (unlike sanitiseSettingsSnapshot)
      additionRegrouping: true,
      dateKey: "not-a-date", // CURRENT BEHAVIOUR: dateKey is not validated, only stringified
      recordedAt: 5000,
    },
  );
});

test("normaliseAnswerTelemetryEntry: valid entry passes through", () => {
  const app = loadApp();
  const entry = plain(app, FIXTURE.progress.answerTelemetry[0]);
  assert.deepStrictEqual(plain(app, app.normaliseAnswerTelemetryEntry(entry)), entry);
});

test("normaliseAnswerTelemetryEntry: rejects non-objects and undatable entries", () => {
  const app = loadApp();
  for (const input of [null, undefined, 5, "x", {}, { timestamp: 0 }, { dateKey: "2026/01/01" }, { timestamp: -10 }]) {
    assert.equal(app.normaliseAnswerTelemetryEntry(input), null, JSON.stringify(input));
  }
});

test("normaliseAnswerTelemetryEntry: derives dateKey from timestamp and fills defaults", () => {
  const app = loadApp();
  const timestamp = Date.parse("2026-01-10T05:00:00Z");
  const result = plain(app, app.normaliseAnswerTelemetryEntry({
    timestamp,
    correct: 1,
    skipped: 0,
    operation: "modulo",
    responseTimeMs: -50,
    sessionPosition: 20000,
  }));
  assert.match(result.id, new RegExp(`^${timestamp}-[a-z0-9]{1,5}$`)); // random suffix (seeded)
  delete result.id;
  assert.deepStrictEqual(result, {
    sessionId: "",
    sessionSource: "practice",
    sessionPosition: 9999,
    operation: "multiplication",
    factKey: "",
    skillKey: "",
    difficultyBand: "standard",
    correct: true,
    skipped: false,
    responseTimeMs: 0,
    timestamp,
    dateKey: "2026-01-10",
  });

  // A valid dateKey is kept even with no timestamp.
  const dated = plain(app, app.normaliseAnswerTelemetryEntry({ id: "a", dateKey: "2025-12-31" }));
  assert.equal(dated.dateKey, "2025-12-31");
  assert.equal(dated.timestamp, 0);
  assert.equal(dated.responseTimeMs, null);
});

test("normaliseAnswerTelemetry: drops junk, sorts newest first, caps at ANSWER_TELEMETRY_MAX_ENTRIES", () => {
  const app = loadApp();
  assert.equal(app.ANSWER_TELEMETRY_MAX_ENTRIES, 500);
  for (const input of [undefined, null, "x", {}, 7]) {
    assert.deepStrictEqual(plain(app, app.normaliseAnswerTelemetry(input)), [], JSON.stringify(input));
  }

  const base = Date.parse("2026-01-10T00:00:00Z");
  const entries = [];
  for (let index = 0; index < 520; index += 1) {
    entries.push({ id: `e${index}`, timestamp: base + index * 1000 });
  }
  entries.push(null, { nothing: true });
  const result = app.normaliseAnswerTelemetry(entries);
  assert.equal(result.length, 500);
  assert.equal(result[0].id, "e519");
  assert.equal(result[499].id, "e20");
  for (let index = 1; index < result.length; index += 1) {
    assert.ok(result[index - 1].timestamp >= result[index].timestamp);
  }
});

test("normaliseOperationBestRanks: always all four operations; junk reset to Rookie", () => {
  const app = loadApp();
  for (const input of [undefined, null, "x", {}, { addition: "Legend" }]) {
    assert.deepStrictEqual(plain(app, app.normaliseOperationBestRanks(input)), ALL_ROOKIE, JSON.stringify(input));
  }
  const result = plain(app, app.normaliseOperationBestRanks({
    addition: { rank: "Legend", score: 99, earnedAt: 123 },
    subtraction: { rank: "legend", score: 150, earnedAt: -1 },
    multiplication: { rank: "Elite", score: "55" },
    division: { score: 40 },
    modulo: { rank: "Master" },
  }));
  assert.deepStrictEqual(result, {
    addition: { rank: "Legend", score: 99, earnedAt: 123 },
    subtraction: { rank: "Rookie", score: 100, earnedAt: 0 },
    multiplication: { rank: "Elite", score: 55, earnedAt: 0 },
    division: { rank: "Rookie", score: 40, earnedAt: 0 },
  });
  assert.deepStrictEqual(Object.keys(result), ["addition", "subtraction", "multiplication", "division"]);
});

test("normaliseBucketDailyEntry", () => {
  const app = loadApp();
  const cases = [
    [{ attempted: 5, correct: 4 }, { attempted: 5, correct: 4 }],
    [undefined, { attempted: 0, correct: 0 }],
    [{ attempted: 5, correct: 9 }, { attempted: 5, correct: 5 }],
    [{ attempted: -1, correct: 2 }, { attempted: 0, correct: 0 }],
    [{ attempted: 50000, correct: "7" }, { attempted: 9999, correct: 7 }],
    [{ attempted: "x" }, { attempted: 0, correct: 0 }],
  ];
  for (const [input, expected] of cases) {
    assert.deepStrictEqual(plain(app, app.normaliseBucketDailyEntry(input)), expected, JSON.stringify(input));
  }
});

test("normaliseAdditionBucketExampleEntry", () => {
  const app = loadApp();
  const cases = [
    {
      name: "valid entry passes through",
      input: { factKey: "addition:3+8", left: 3, right: 8, regrouping: true, attempts: 4, correct: 3, lastSeenAt: 10 },
      expected: { factKey: "addition:3+8", left: 3, right: 8, regrouping: true, attempts: 4, correct: 3, lastSeenAt: 10 },
    },
    {
      name: "operands ordered low/high and factKey rebuilt; regrouping inferred",
      input: { left: 8, right: 3, attempts: 2, correct: 5 },
      expected: { factKey: "addition:3+8", left: 3, right: 8, regrouping: true, attempts: 2, correct: 2, lastSeenAt: 0 },
    },
    {
      name: "operands parsed from factKey when missing; make-10 is not regrouping",
      input: { factKey: "addition:4+6" },
      expected: { factKey: "addition:4+6", left: 4, right: 6, regrouping: false, attempts: 0, correct: 0, lastSeenAt: 0 },
    },
    {
      name: "fractional operands are truncated",
      input: { left: 12.9, right: 3.2 },
      expected: { factKey: "addition:3+12", left: 3, right: 12, regrouping: false, attempts: 0, correct: 0, lastSeenAt: 0 },
    },
  ];
  for (const { name, input, expected } of cases) {
    assert.deepStrictEqual(plain(app, app.normaliseAdditionBucketExampleEntry(input)), expected, name);
  }
  for (const junk of [null, undefined, "addition:1+2", 5, {}, { factKey: "multiplication:3x4" }, { left: 1 }]) {
    assert.equal(app.normaliseAdditionBucketExampleEntry(junk), null, JSON.stringify(junk));
  }
});

test("normaliseAdditionBucketExamples: every bucket present, merges duplicates, newest first, capped", () => {
  const app = loadApp();
  assert.equal(app.ADDITION_BUCKET_EXAMPLE_CAP, 5);
  for (const input of [undefined, null, "x", {}, { "1-1": "nope" }]) {
    assert.deepStrictEqual(plain(app, app.normaliseAdditionBucketExamples(input)), EMPTY_BUCKET_EXAMPLES, JSON.stringify(input));
  }

  const result = plain(app, app.normaliseAdditionBucketExamples({
    "1-1": [
      { left: 3, right: 8, attempts: 2, correct: 1, lastSeenAt: 100, regrouping: true },
      { left: 8, right: 3, attempts: 3, correct: 3, lastSeenAt: 50, regrouping: false },
      null,
      { left: 2, right: 2, attempts: 1, correct: 1, lastSeenAt: 200 },
    ],
    "2-2": Array.from({ length: 7 }, (_, index) => ({ left: 10 + index, right: 20, attempts: 1, correct: 1, lastSeenAt: index })),
    "not-a-bucket": [{ left: 1, right: 1 }],
  }));
  assert.deepStrictEqual(Object.keys(result), Object.keys(EMPTY_BUCKET_EXAMPLES));
  assert.deepStrictEqual(result["1-1"], [
    { factKey: "addition:2+2", left: 2, right: 2, regrouping: false, attempts: 1, correct: 1, lastSeenAt: 200 },
    // merged: attempts/correct summed, latest lastSeenAt, regrouping from the LATER array entry
    { factKey: "addition:3+8", left: 3, right: 8, regrouping: false, attempts: 5, correct: 4, lastSeenAt: 100 },
  ]);
  assert.deepStrictEqual(result["2-2"].map((entry) => entry.lastSeenAt), [6, 5, 4, 3, 2]);
});

// ---------------------------------------------------------------- pruning / capping

function makeFacts(operation, count, symbol, startSeen = 1) {
  const facts = {};
  for (let index = 0; index < count; index += 1) {
    facts[`${operation}:${index}${symbol}1`] = { operation, attempts: 1, correct: 1, lastSeenAt: startSeen + index };
  }
  return facts;
}

test("compactFactProgressMap: junk input, normalisation, no-op under caps", () => {
  const app = loadApp();
  assert.equal(app.FACT_PROGRESS_MAX_PER_OPERATION, 1200);
  assert.equal(app.FACT_PROGRESS_MAX_TOTAL, 2000);
  for (const input of [undefined, null, "x", 5, {}]) {
    assert.deepStrictEqual(plain(app, app.compactFactProgressMap(input)), {}, JSON.stringify(input));
  }
  const result = plain(app, app.compactFactProgressMap({ "3x4": { attempts: 2, correct: 1 } }));
  assert.deepStrictEqual(result, { "3x4": plain(app, app.normaliseFactProgressEntry("3x4", { attempts: 2, correct: 1 })) });
});

test("compactFactProgressMap: caps each operation at FACT_PROGRESS_MAX_PER_OPERATION keeping most recent", () => {
  const app = loadApp();
  const result = app.compactFactProgressMap({ ...makeFacts("multiplication", 1300, "x"), ...makeFacts("addition", 10, "+") });
  const keys = Object.keys(result);
  const multiplication = keys.filter((key) => key.startsWith("multiplication:"));
  assert.equal(multiplication.length, 1200);
  assert.equal(keys.length, 1210);
  // The 100 oldest (lastSeenAt 1..100 -> indexes 0..99) were dropped.
  assert.equal(result["multiplication:99x1"], undefined);
  assert.ok(result["multiplication:100x1"]);
  assert.ok(result["multiplication:1299x1"]);
});

test("compactFactProgressMap: trims to FACT_PROGRESS_MAX_TOTAL across operations by recency", () => {
  const app = loadApp();
  // Addition facts are all newer than multiplication facts.
  const result = app.compactFactProgressMap({
    ...makeFacts("multiplication", 1200, "x", 1),
    ...makeFacts("addition", 1200, "+", 10000),
  });
  const keys = Object.keys(result);
  assert.equal(keys.length, 2000);
  assert.equal(keys.filter((key) => key.startsWith("addition:")).length, 1200);
  assert.equal(keys.filter((key) => key.startsWith("multiplication:")).length, 800);
  assert.equal(result["multiplication:399x1"], undefined);
  assert.ok(result["multiplication:400x1"]);
});

test("compactFactProgressMap: retention tie-breaks are misses, attempts, correct, then key", () => {
  const app = loadApp();
  const facts = {};
  // 1201 multiplication facts with the same lastSeenAt; the one to drop is decided by tie-breaks.
  for (let index = 0; index < 1201; index += 1) {
    facts[`multiplication:${index}x1`] = { attempts: 5, correct: 5, misses: 0, lastSeenAt: 50 };
  }
  facts["multiplication:0x1"] = { attempts: 5, correct: 5, misses: 0, lastSeenAt: 50 };
  facts["multiplication:999x1"] = { attempts: 6, correct: 6, misses: 0, lastSeenAt: 50 };
  const result = app.compactFactProgressMap(facts);
  assert.equal(Object.keys(result).length, 1200);
  // All tied except 999x1 (more attempts, so kept first); the alphabetically last key is dropped.
  const sortedKeys = Object.keys(facts).filter((key) => key !== "multiplication:999x1").sort();
  assert.equal(result[sortedKeys[sortedKeys.length - 1]], undefined);
  assert.ok(result["multiplication:999x1"]);
});

test("syncProgressMetricAliases: totalAttempted alias feeds totalAnswered", () => {
  const app = loadApp();
  const cases = [
    [{ totalAttempted: 12 }, { totalAnswered: 12, totalAttempted: 12, totalSkipped: 0 }],
    [{ totalAnswered: 5, totalAttempted: 99, totalSkipped: 2 }, { totalAnswered: 5, totalAttempted: 5, totalSkipped: 2 }],
    [{ totalAnswered: -4, totalSkipped: "x" }, { totalAnswered: 0, totalAttempted: 0, totalSkipped: 0 }],
    [{ totalAnswered: 2e6 }, { totalAnswered: 999999, totalAttempted: 999999, totalSkipped: 0 }],
  ];
  for (const [input, expected] of cases) {
    assert.deepStrictEqual(plain(app, app.syncProgressMetricAliases(input)), expected, JSON.stringify(input));
  }
  assert.equal(app.syncProgressMetricAliases(null), null);
  assert.equal(app.syncProgressMetricAliases("x"), "x");
});

test("pruneProgressForRollingWindow: keeps ROLLING_WINDOW_DAYS from the fixed now (cutoff inclusive)", () => {
  const app = loadApp({ now: NOW });
  assert.equal(app.ROLLING_WINDOW_DAYS, 31);
  assert.equal(app.getRollingWindowCutoffDateKey(), "2025-12-15");
  const at = (dateKey) => Date.parse(`${dateKey}T12:00:00Z`);
  const progress = {
    dailyRecords: { "2026-01-15": {}, "2025-12-15": {}, "2025-12-14": {}, "garbage": {} },
    bucketDaily: {
      "2025-12-15|addition|1-1": { attempted: 1 },
      "2025-12-14|addition|1-1": { attempted: 1 },
      "nodate|multiplication|x3": { attempted: 1 },
    },
    workoutHistory: [
      { id: "keep-date", dateKey: "2025-12-15" },
      { id: "drop-date", dateKey: "2025-12-14" },
      { id: "keep-ts", dateKey: "junk", recordedAt: at("2026-01-01") },
      { id: "drop-ts", recordedAt: at("2025-11-01") },
      { id: "keep-undatable" },
      null,
    ],
    answerTelemetry: [
      { id: "t-keep", dateKey: "2025-12-15" },
      { id: "t-drop", dateKey: "2025-12-14" },
      { id: "t-ts", timestamp: at("2026-01-14") },
    ],
    facts: { "3x4": { attempts: 1, correct: 1, lastSeenAt: 1 } }, // facts are never pruned by date
  };
  const result = plain(app, app.pruneProgressForRollingWindow(progress));
  assert.deepStrictEqual(Object.keys(result.dailyRecords), ["2026-01-15", "2025-12-15"]);
  assert.deepStrictEqual(Object.keys(result.bucketDaily), ["2025-12-15|addition|1-1"]);
  // Latent only: a null workout record has no dateKey and a NaN recordedAt, so it is kept (not
  // normalised here); loadProgress normalises workoutHistory records before pruning.
  assert.deepStrictEqual(result.workoutHistory.map((record) => record?.id ?? null), ["keep-date", "keep-ts", "keep-undatable", null]);
  assert.deepStrictEqual(result.answerTelemetry.map((entry) => entry.id), ["t-ts", "t-keep"]);
  assert.deepStrictEqual(result.operationBestRanks, ALL_ROOKIE);
  assert.deepStrictEqual(Object.keys(result.facts), ["3x4"]);
  assert.deepStrictEqual([result.totalAnswered, result.totalAttempted, result.totalSkipped], [0, 0, 0]);
});

test("pruneProgressForRollingWindow: caps workoutHistory at 50 and passes non-objects through", () => {
  const app = loadApp({ now: NOW });
  const progress = { workoutHistory: Array.from({ length: 60 }, (_, index) => ({ id: `w${index}`, dateKey: "2026-01-10" })) };
  const result = app.pruneProgressForRollingWindow(progress);
  assert.equal(result, progress); // mutates and returns the same object
  assert.equal(result.workoutHistory.length, 50);
  assert.equal(result.workoutHistory[49].id, "w49");
  assert.equal(app.pruneProgressForRollingWindow(null), null);
  assert.equal(app.pruneProgressForRollingWindow(7), 7);
});

// ---------------------------------------------------------------- loadProgress

test("loadProgress: nothing stored returns defaultProgress()", () => {
  const app = loadApp();
  const expected = {
    totalAnswered: 0,
    totalAttempted: 0,
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
  assert.deepStrictEqual(plain(app, app.defaultProgress()), expected);
  assert.deepStrictEqual(plain(app, app.state.progress), expected);
  assert.deepStrictEqual(plain(app, app.loadProgress()), expected);
});

test("loadProgress: empty or unparseable storage returns defaultProgress()", () => {
  // These short-circuit (empty string) or throw inside the try and hit the catch.
  for (const raw of ["", "{not json", "undefined", "{\"facts\":"]) {
    const app = loadApp({ localStorage: { [KEY]: raw } });
    assert.deepStrictEqual(plain(app, app.state.progress), plain(app, app.defaultProgress()), JSON.stringify(raw));
  }
});

test("loadProgress: non-object JSON is normalised (not defaulted) to an empty progress", () => {
  const normalisedEmpty = (app) => ({
    ...plain(app, app.defaultProgress()),
    additionBucketExamples: EMPTY_BUCKET_EXAMPLES,
    operationBestRanks: ALL_ROOKIE,
  });
  // Non-object JSON values (null, strings, arrays) are treated as an empty stored object.
  for (const raw of ["null", "[]", "[1,2]", "5", "true", "{}", "\"ab\""]) {
    const app = loadApp({ localStorage: { [KEY]: raw } });
    assert.deepStrictEqual(plain(app, app.state.progress), normalisedEmpty(app), raw);
  }
});

test("loadProgress: wrong-typed collections are replaced; personal-best scalars are clamped; unknown fields pass through", () => {
  const app = loadApp({
    localStorage: {
      [KEY]: {
        bestStreak: "17",
        bestAccuracy: "high",
        sessionsCompleted: -3,
        fastestAverageMs: "fast",
        totalCorrect: "12",
        facts: "x",
        dailyRecords: "ab",
        bucketDaily: 7,
        workoutHistory: {},
        answerTelemetry: "no",
        operationBestRanks: [],
        techniques: null,
        extra: 1,
      },
    },
  });
  const progress = plain(app, app.state.progress);
  assert.deepStrictEqual(
    {
      facts: progress.facts,
      dailyRecords: progress.dailyRecords, // "ab" -> {"0":"a","1":"b"} -> dropped by rolling-window prune
      bucketDaily: progress.bucketDaily,
      workoutHistory: progress.workoutHistory,
      answerTelemetry: progress.answerTelemetry,
      operationBestRanks: progress.operationBestRanks,
      techniques: progress.techniques,
      totalCorrect: progress.totalCorrect,
    },
    { facts: {}, dailyRecords: {}, bucketDaily: {}, workoutHistory: [], answerTelemetry: [], operationBestRanks: ALL_ROOKIE, techniques: {}, totalCorrect: 12 },
  );
  // Personal-best scalars are coerced and clamped like the totals; unknown fields pass through.
  assert.equal(progress.bestStreak, 17);
  assert.equal(progress.bestAccuracy, 0);
  assert.equal(progress.sessionsCompleted, 0);
  assert.equal(progress.fastestAverageMs, null);
  assert.equal(progress.extra, 1);

  const valid = { bestStreak: 23, bestAccuracy: 0.95, sessionsCompleted: 41, fastestAverageMs: 1834.5 };
  const validApp = loadApp({ localStorage: { [KEY]: valid } });
  const validProgress = plain(validApp, validApp.state.progress);
  for (const [field, value] of Object.entries(valid)) {
    assert.equal(validProgress[field], value, field);
  }
});

test("loadProgress: partially missing fields are filled from defaults", () => {
  const app = loadApp({ localStorage: { [KEY]: { totalAnswered: 30, totalCorrect: 25, bestStreak: 8 } } });
  assert.deepStrictEqual(plain(app, app.state.progress), {
    ...plain(app, app.defaultProgress()),
    totalAnswered: 30,
    totalAttempted: 30,
    totalCorrect: 25,
    bestStreak: 8,
    additionBucketExamples: EMPTY_BUCKET_EXAMPLES,
    operationBestRanks: ALL_ROOKIE,
  });
});

test("loadProgress: older-era shape (legacy v1 key, totalAttempted, legacy keys/aliases)", () => {
  const app = loadApp({
    now: NOW,
    localStorage: {
      [LEGACY_V1]: {
        totalAttempted: 40,
        totalCorrect: 33,
        bestStreak: 9,
        sessionsCompleted: 4,
        facts: {
          "3x4": { attempts: 6, correct: 5, averageMs: 3100, lastSeenAt: 1000 },
          "7x8": { attempts: 3, correct: 1 },
        },
        dailyRecords: {
          "2026-01-14": { answered: 25, correct: 22, heartEarned: true, sliceEarned: true },
          "2026-01-10": { answered: 4, correct: 3, starEarned: true },
          "2025-06-01": { answered: 10, correct: 10 },
        },
        workoutHistory: [
          { recordedAt: Date.parse("2026-01-14T09:00:00Z"), answered: 25, correct: 22, accuracy: 0.88 },
        ],
      },
    },
  });
  const progress = plain(app, app.state.progress);
  assert.equal(progress.totalAnswered, 40);
  assert.equal(progress.totalAttempted, 40);
  assert.equal(progress.totalCorrect, 33);
  assert.deepStrictEqual(progress.facts["3x4"], {
    operation: "multiplication", symbol: "x", attempts: 6, correct: 5, magnitudeCorrect: 5, signCorrect: 5,
    signErrors: 0, misses: 1, bestStreak: 0, currentStreak: 0, averageMs: 3100, firstSeenAt: 1000, lastSeenAt: 1000,
  });
  assert.equal(progress.facts["7x8"].misses, 2);
  assert.deepStrictEqual(progress.dailyRecords, {
    "2026-01-14": { attempted: 25, correct: 22, skipped: 0, attemptGoalEarned: true, accuracyGoalEarned: true, sessionsCompleted: 0 },
    "2026-01-10": { attempted: 4, correct: 3, skipped: 0, attemptGoalEarned: true, accuracyGoalEarned: false, sessionsCompleted: 0 },
  });
  assert.equal(progress.workoutHistory.length, 1);
  assert.deepStrictEqual(
    {
      id: progress.workoutHistory[0].id,
      dateKey: progress.workoutHistory[0].dateKey,
      attempted: progress.workoutHistory[0].attempted,
      operation: progress.workoutHistory[0].operation,
    },
    {
      id: String(Date.parse("2026-01-14T09:00:00Z")),
      // CURRENT BEHAVIOUR: a missing dateKey is filled with TODAY, not derived from recordedAt.
      dateKey: "2026-01-15",
      attempted: 25,
      operation: "multiplication",
    },
  );
});

test("loadProgress: caps workoutHistory at 50 and answerTelemetry at 500", () => {
  const dateKey = "2026-01-14";
  const app = loadApp({
    localStorage: {
      [KEY]: {
        workoutHistory: Array.from({ length: 70 }, (_, index) => ({ id: `w${index}`, dateKey, recordedAt: 1 })),
        answerTelemetry: Array.from({ length: 600 }, (_, index) => ({ id: `t${index}`, dateKey, timestamp: index + 1 })),
      },
    },
  });
  assert.equal(app.state.progress.workoutHistory.length, 50);
  assert.equal(app.state.progress.workoutHistory[0].id, "w0");
  assert.equal(app.state.progress.answerTelemetry.length, 500);
  assert.equal(app.state.progress.answerTelemetry[0].id, "t599");
});

test("loadProgress: populated fixture loads with counts intact at its fixed time", () => {
  const app = loadApp({ now: FIXTURE.fixedNow, localStorage: { [KEY]: FIXTURE.progress } });
  const progress = plain(app, app.state.progress);
  assert.deepStrictEqual(Object.keys(progress), Object.keys(plain(app, app.defaultProgress())));
  assert.deepStrictEqual(
    {
      totalAnswered: progress.totalAnswered,
      totalCorrect: progress.totalCorrect,
      bestStreak: progress.bestStreak,
      sessionsCompleted: progress.sessionsCompleted,
      facts: Object.keys(progress.facts).length,
      dailyRecords: Object.keys(progress.dailyRecords).length,
      answerTelemetry: progress.answerTelemetry.length,
      workoutHistory: progress.workoutHistory.length,
      techniques: Object.keys(progress.techniques).length,
    },
    { totalAnswered: 500, totalCorrect: 449, bestStreak: 17, sessionsCompleted: 40, facts: 91, dailyRecords: 15, answerTelemetry: 500, workoutHistory: 36, techniques: 5 },
  );
  assert.deepStrictEqual(progress.operationBestRanks, FIXTURE.progress.operationBestRanks);
  assert.deepStrictEqual(progress.facts["addition:3+7"], FIXTURE.progress.facts["addition:3+7"]);
  assert.deepStrictEqual(progress.workoutHistory, FIXTURE.progress.workoutHistory);
  assert.deepStrictEqual(progress.additionBucketExamples, EMPTY_BUCKET_EXAMPLES);
});

test("loadProgress: the populated fixture loses old data when loaded much later", () => {
  // 40 days after the fixture's fixed time, everything date-keyed falls outside the window.
  const later = new Date(Date.parse(FIXTURE.fixedNow) + 40 * DAY_MS);
  const app = loadApp({ now: later, localStorage: { [KEY]: FIXTURE.progress } });
  const progress = app.state.progress;
  assert.equal(Object.keys(progress.dailyRecords).length, 0);
  assert.equal(progress.workoutHistory.length, 0);
  assert.equal(progress.answerTelemetry.length, 0);
  assert.equal(Object.keys(progress.facts).length, 91); // facts are kept
  assert.equal(progress.totalAnswered, 500);
});

// ---------------------------------------------------------------- saveProgress

test("saveProgress round trip: fixture saved then reloaded is equivalent", () => {
  const first = loadApp({ now: FIXTURE.fixedNow, localStorage: { [KEY]: FIXTURE.progress } });
  first.saveProgress();
  const stored = first.harness.localStorage.toJSON();
  assert.deepStrictEqual(Object.keys(stored), [KEY]);

  const second = loadApp({ now: FIXTURE.fixedNow, localStorage: stored });
  assert.deepStrictEqual(second.harness.plain(second.state.progress), first.harness.plain(first.state.progress));
  assert.deepStrictEqual(JSON.parse(stored[KEY]), first.harness.plain(first.state.progress));
});

test("saveProgress round trip: legacy-only data is migrated to the current key", () => {
  const first = loadApp({ localStorage: { [LEGACY_V2]: { totalAttempted: 3, facts: { "2x5": { attempts: 3, correct: 3 } } } } });
  first.saveProgress();
  const stored = first.harness.localStorage.toJSON();
  assert.ok(stored[KEY]);
  assert.ok(stored[LEGACY_V2]); // legacy key is left in place, not deleted
  const second = loadApp({ localStorage: { [KEY]: stored[KEY] } });
  assert.deepStrictEqual(second.harness.plain(second.state.progress), first.harness.plain(first.state.progress));
  assert.equal(second.state.progress.totalAnswered, 3);
});

test("saveProgress syncs aliases and prunes before writing; queueProgressSave debounces", () => {
  const app = loadApp({ now: NOW });
  app.state.progress.totalAnswered = 9;
  app.state.progress.totalAttempted = 1;
  app.state.progress.dailyRecords["2020-01-01"] = app.defaultDailyRecord();
  app.queueProgressSave();
  app.queueProgressSave();
  assert.equal(app.harness.localStorage.getItem(KEY), null);
  assert.equal(app.harness.clock.pendingTimers(), 1);
  app.harness.clock.advance(app.PROGRESS_SAVE_DEBOUNCE_MS);
  const saved = JSON.parse(app.harness.localStorage.getItem(KEY));
  assert.equal(saved.totalAnswered, 9);
  assert.equal(saved.totalAttempted, 9);
  assert.deepStrictEqual(saved.dailyRecords, {});
  assert.equal(app.state.progressSaveTimeoutId, null);
});
