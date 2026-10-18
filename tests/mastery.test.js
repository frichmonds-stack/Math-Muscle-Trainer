"use strict";

// Characterisation tests for mastery scoring, ranks, coverage, bucket status and trends
// (js/app-progress-mastery.js and js/app-progress-focus.js, with helpers from app-core.js / app-practice.js).
// These pin down CURRENT behaviour; see tests/README.md.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { loadApp } = require("./harness");

const FIXTURE = require(path.join(__dirname, "..", "tools", "visual-check", "fixtures", "populated-progress.json"));

const KEY = "math-muscle-trainer-progress-v2";
const NOW = "2026-01-15T12:00:00.000Z"; // harness default
const RANKS = [
  { label: "Rookie", minScore: 0, minAttempts: 0, minCoverage: 0 },
  { label: "Novice", minScore: 15, minAttempts: 20, minCoverage: 0.08 },
  { label: "Adept", minScore: 32, minAttempts: 60, minCoverage: 0.22 },
  { label: "Expert", minScore: 50, minAttempts: 120, minCoverage: 0.4 },
  { label: "Elite", minScore: 68, minAttempts: 220, minCoverage: 0.58 },
  { label: "Master", minScore: 82, minAttempts: 360, minCoverage: 0.75 },
  { label: "Legend", minScore: 92, minAttempts: 520, minCoverage: 0.9 },
];

// ---------------------------------------------------------------- data builders

const TELEMETRY_DATES = ["2026-01-11", "2026-01-12", "2026-01-13", "2026-01-14", "2026-01-15"];

function factKey(operation, a, b) {
  if (operation === "division") return `division:${a * b}/${b}`;
  if (operation === "addition") return `addition:${a}+${b}`;
  if (operation === "subtraction") return `subtraction:${a}-${b}`;
  return `multiplication:${a}x${b}`;
}

/**
 * Progress for an operation where every 1..12 x 1..12 fact is answered perfectly and quickly.
 * `totalAttempts` is spread over the 144 facts (each gets floor or ceil of the share).
 */
function perfectProgress(operation, totalAttempts = 576) {
  const facts = {};
  const keys = [];
  for (let a = 1; a <= 12; a += 1) {
    for (let b = 1; b <= 12; b += 1) keys.push(factKey(operation, a, b));
  }
  keys.forEach((key, index) => {
    const attempts = Math.floor(totalAttempts / keys.length) + (index < totalAttempts % keys.length ? 1 : 0);
    facts[key] = { operation, attempts, correct: attempts, lastSeenAt: 1000 + index };
  });
  const answerTelemetry = Array.from({ length: 80 }, (_, index) => {
    const dateKey = TELEMETRY_DATES[index % TELEMETRY_DATES.length];
    return {
      id: `t${index}`,
      operation,
      correct: true,
      skipped: false,
      responseTimeMs: 1500,
      difficultyBand: "hard",
      dateKey,
      timestamp: Date.parse(`${dateKey}T10:00:00Z`) + index,
    };
  });
  const workoutHistory = ["2026-01-13", "2026-01-14", "2026-01-15"].map((dateKey, index) => ({
    id: `w${index}`,
    operation,
    dateKey,
    attempted: 20,
    correct: 20,
    accuracy: 1,
  }));
  return { facts, answerTelemetry, workoutHistory };
}

function load(progress, options = {}) {
  return loadApp({ now: NOW, ...options, localStorage: progress ? { [KEY]: progress } : {} });
}

// ---------------------------------------------------------------- rank table

test("MASTERY_RANKS thresholds and labels match MASTERY_RANK_LABELS", () => {
  const app = loadApp();
  assert.deepStrictEqual(app.harness.plain(app.MASTERY_RANKS), RANKS);
  assert.deepStrictEqual(app.harness.plain(app.MASTERY_RANK_LABELS), RANKS.map((rank) => rank.label));
  RANKS.forEach((rank, index) => assert.equal(app.getMasteryRankIndex(rank.label), index));
  assert.equal(app.getMasteryRankIndex("Champion"), -1);
});

test("getMasteryRank: exactly at each threshold gives that rank", () => {
  const app = loadApp();
  for (const rank of RANKS) {
    assert.equal(app.getMasteryRank(rank.minScore, rank.minAttempts, rank.minCoverage).label, rank.label, rank.label);
  }
});

test("getMasteryRank: one step below any single threshold drops exactly one rank", () => {
  const app = loadApp();
  RANKS.slice(1).forEach((rank, offset) => {
    const previous = RANKS[offset].label;
    const { minScore: s, minAttempts: a, minCoverage: c } = rank;
    const rows = [
      ["score - 1", s - 1, a, c],
      ["attempts - 1", s, a - 1, c],
      ["coverage - 0.001", s, a, c - 0.001],
    ];
    for (const [name, score, attempts, coverage] of rows) {
      assert.equal(app.getMasteryRank(score, attempts, coverage).label, previous, `${rank.label}: ${name}`);
    }
    // Just above all thresholds keeps the rank.
    assert.equal(app.getMasteryRank(s + 1, a + 1, c + 0.001).label, rank.label, `${rank.label}: above`);
  });
});

test("getMasteryRank: limited by the weakest dimension; extremes", () => {
  const app = loadApp();
  const cases = [
    [0, 0, 0, "Rookie"],
    [-5, -1, -1, "Rookie"], // nothing qualifies, falls back to the first rank
    [100, 0, 1, "Rookie"],
    [100, 10000, 0.07, "Rookie"],
    [14, 10000, 1, "Rookie"],
    [100, 10000, 1, "Legend"],
    [100, 519, 1, "Master"],
    [91, 10000, 1, "Master"],
    [100, 10000, 0.89, "Master"],
    [60, 1000, 1, "Expert"],
    [100, 100, 1, "Adept"],
    [100, 1000, 0.3, "Adept"],
    [NaN, 1000, 1, "Rookie"],
  ];
  for (const [score, attempts, coverage, expected] of cases) {
    assert.equal(app.getMasteryRank(score, attempts, coverage).label, expected, JSON.stringify([score, attempts, coverage]));
  }
});

test("getNextMasteryRank: next rank, Legend stays Legend", () => {
  const app = loadApp();
  RANKS.forEach((rank, index) => {
    const next = app.getNextMasteryRank(app.MASTERY_RANKS[index]);
    assert.equal(next.label, RANKS[Math.min(index + 1, RANKS.length - 1)].label);
  });
});

test("getMasterySignalScore", () => {
  const app = loadApp();
  const cases = [
    [[0], 0], [[0.5], 50], [[1], 100], [[0.655], 66], [[2], 100], [[-1], 0], [[NaN], 0], [[5, 10], 50], [[15, 10], 100],
  ];
  for (const [args, expected] of cases) {
    assert.equal(app.getMasterySignalScore(...args), expected, JSON.stringify(args));
  }
});

test("getOperationMasteryGoal: branch order", () => {
  const app = loadApp();
  const [rookie, novice, , , , master, legend] = app.MASTERY_RANKS;
  const base = { rank: rookie, nextRank: novice, attempts: 20, coverageRatio: 1, accuracy: 0.9, recentAccuracy: 0.9, fluency: 0.9, retention: 0.9, consistency: 0.9 };
  const cases = [
    [{ rank: legend, nextRank: legend, attempts: 0 }, "Keep the rank warm with spaced review across the full operation."],
    [{ attempts: 19 }, "Reach 20 total attempts with steady practice."],
    [{ coverageRatio: 0.079 }, "Build more skill areas so the rank reflects broad coverage."],
    [{ accuracy: 0.849 }, "Raise recent accuracy toward 85% before pushing speed."],
    [{ recentAccuracy: 0.849 }, "Raise recent accuracy toward 85% before pushing speed."],
    [{ fluency: 0.649 }, "Turn correct answers into quicker, easier recall."],
    [{ retention: 0.599 }, "Return across multiple days so the app can confirm retention."],
    [{ consistency: 0.649 }, "Keep performance steady across the next few workouts."],
    [{ accuracy: 0.85, recentAccuracy: 0.85, fluency: 0.65, retention: 0.6, consistency: 0.65 }, "Push the full evidence score toward Novice."],
    [{ rank: master, nextRank: legend, attempts: 600 }, "Push the full evidence score toward Legend."],
  ];
  for (const [overrides, expected] of cases) {
    assert.equal(app.getOperationMasteryGoal({ ...base, ...overrides }), expected, JSON.stringify(Object.keys(overrides)));
  }
});

// ---------------------------------------------------------------- bucket status

test("bucket status thresholds are stable", () => {
  const app = loadApp();
  assert.deepStrictEqual(
    [app.BUCKET_STATUS_MIN_ATTEMPTS, app.BUCKET_STATUS_STRONG_MIN_ATTEMPTS, app.BUCKET_STATUS_BUILDING_MIN_ACCURACY, app.BUCKET_STATUS_STRONG_MIN_ACCURACY],
    [6, 10, 0.7, 0.9],
  );
  assert.deepStrictEqual(
    [app.BUCKET_TREND_WINDOW_DAYS, app.BUCKET_TREND_MIN_TOTAL_ATTEMPTS, app.BUCKET_TREND_MIN_RECENT_ATTEMPTS, app.BUCKET_TREND_DELTA_THRESHOLD],
    [7, 6, 3, 0.08],
  );
});

test("getBucketStatus: boundaries at and around each threshold", () => {
  const app = loadApp();
  const unseen = { tone: "unseen", label: "No reps yet" };
  const strong = { tone: "strong", label: "Strong" };
  const steady = { tone: "steady", label: "Building" };
  const needs = { tone: "needs", label: "Need Reps" };
  const cases = [
    [0, 0, unseen],
    [0, 1, unseen],
    [null, 1, unseen],
    [NaN, 1, unseen],
    [1, 1, needs],
    [5, 1, needs],
    [6, 0.7, steady],
    [6, 0.69, needs],
    [6, 1, steady], // too few attempts for strong
    [9, 1, steady],
    [10, 0.9, strong],
    [10, 0.89, steady],
    [10, 0.69, needs],
    [10, 9 / 10, strong],
    [10, 7 / 10, steady],
    [1000, 1, strong],
  ];
  for (const [attempts, accuracy, expected] of cases) {
    assert.deepStrictEqual(app.harness.plain(app.getBucketStatus(attempts, accuracy)), expected, JSON.stringify([attempts, accuracy]));
  }
});

// ---------------------------------------------------------------- getOperationMastery

test("getOperationMastery: empty data is Rookie with zero score for every operation", () => {
  const app = load(null);
  const universeSizes = { addition: 7, subtraction: 6, multiplication: 12, division: 12 };
  for (const operation of app.OPERATION_OPTIONS) {
    const summary = app.getOperationMastery(operation);
    assert.deepStrictEqual(
      {
        score: summary.score,
        rank: summary.rank.label,
        nextRank: summary.nextRank.label,
        attempts: summary.attempts,
        accuracy: summary.accuracy,
        recentAccuracy: summary.recentAccuracy,
        fluency: summary.fluency,
        coverageRatio: summary.coverageRatio,
        retention: summary.retention,
        consistency: summary.consistency,
        covered: summary.coveredSkills.length,
        strong: summary.strongSkills.length,
        universe: summary.skillUniverse.length,
        bestRank: app.harness.plain(summary.bestRank),
        nextGoal: summary.nextGoal,
        label: summary.label,
      },
      {
        score: 0,
        rank: "Rookie",
        nextRank: "Novice",
        attempts: 0,
        accuracy: 0,
        recentAccuracy: 0,
        fluency: 0,
        coverageRatio: 0,
        retention: 0,
        consistency: 0,
        covered: 0,
        strong: 0,
        universe: universeSizes[operation],
        bestRank: { rank: "Rookie", score: 0, earnedAt: 0 },
        nextGoal: "Reach 20 total attempts with steady practice.",
        label: app.OPERATION_LABELS[operation],
      },
      operation,
    );
  }
});

test("getOperationSkillUniverse", () => {
  const app = loadApp();
  const plain = (op) => app.harness.plain(app.getOperationSkillUniverse(op));
  assert.deepStrictEqual(plain("addition"), ["make-10", "1-1", "1-2", "2-2", "1-3", "2-3", "3-3"]);
  assert.deepStrictEqual(plain("subtraction"), ["1-1", "2-1", "2-2", "3-1", "3-2", "3-3"]);
  assert.deepStrictEqual(plain("division"), Array.from({ length: 12 }, (_, i) => `d${i + 1}`));
  assert.deepStrictEqual(plain("multiplication"), Array.from({ length: 12 }, (_, i) => `x${i + 1}`));
  assert.deepStrictEqual(plain("unknown"), plain("multiplication"));
});

test("getOperationMastery: a perfect learner scores 100 and reaches Legend", () => {
  for (const operation of ["multiplication", "division"]) {
    const app = load(perfectProgress(operation));
    const summary = app.getOperationMastery(operation);
    assert.deepStrictEqual(
      {
        score: summary.score,
        rank: summary.rank.label,
        nextRank: summary.nextRank.label,
        attempts: summary.attempts,
        accuracy: summary.accuracy,
        recentAccuracy: summary.recentAccuracy,
        fluency: summary.fluency,
        coverageRatio: summary.coverageRatio,
        retention: summary.retention,
        consistency: summary.consistency,
        covered: summary.coveredSkills.length,
        strong: summary.strongSkills.length,
        nextGoal: summary.nextGoal,
      },
      {
        score: 100,
        rank: "Legend",
        nextRank: "Legend",
        attempts: 576,
        accuracy: 1,
        recentAccuracy: 1,
        fluency: 1,
        coverageRatio: 1,
        retention: 1,
        consistency: 1,
        covered: 12,
        strong: 12,
        nextGoal: "Keep the rank warm with spaced review across the full operation.",
      },
      operation,
    );
    // Other operations are untouched by this data.
    const other = operation === "division" ? "multiplication" : "division";
    assert.equal(app.getOperationMastery(other).score, 0);
  }
});

test("getOperationMastery: perfect learner one attempt short of Legend is Master", () => {
  const atThreshold = load(perfectProgress("multiplication", 520)).getOperationMastery("multiplication");
  assert.deepStrictEqual([atThreshold.attempts, atThreshold.score, atThreshold.rank.label], [520, 100, "Legend"]);

  const below = load(perfectProgress("multiplication", 519)).getOperationMastery("multiplication");
  assert.deepStrictEqual([below.attempts, below.score, below.rank.label], [519, 100, "Master"]);
  assert.equal(below.nextGoal, "Reach 520 total attempts with steady practice.");
});

test("getOperationMastery: score component weights (accuracy 30, fluency 20, coverage 20, retention 15, consistency 10, difficulty 5)", () => {
  const cases = [
    {
      name: "perfect facts only (no telemetry, no workouts)",
      mutate: (p) => { p.answerTelemetry = []; p.workoutHistory = []; },
      // accuracy 1 (30) + fluency 0 + coverage 1 (20) + retention 0 + consistency 0.5 (5) + difficulty 1 (5)
      expected: { score: 60, fluency: 0, retention: 0, consistency: 0.5 },
    },
    {
      name: "slow answers (over the 4000ms multiplication threshold) lose fluency",
      mutate: (p) => p.answerTelemetry.forEach((entry) => { entry.responseTimeMs = 4001; }),
      expected: { score: 80, fluency: 0, retention: 1, consistency: 1 },
    },
    {
      name: "answers exactly at the 4000ms threshold count as fluent",
      mutate: (p) => p.answerTelemetry.forEach((entry) => { entry.responseTimeMs = 4000; }),
      expected: { score: 100, fluency: 1, retention: 1, consistency: 1 },
    },
    {
      name: "telemetry on only 2 days halves retention",
      mutate: (p) => p.answerTelemetry.forEach((entry, index) => { entry.dateKey = index % 2 ? "2026-01-14" : "2026-01-15"; }),
      expected: { score: 93, fluency: 1, retention: 0.5, consistency: 1 },
    },
    {
      name: "a single workout uses accuracy * 0.5 for consistency",
      mutate: (p) => { p.workoutHistory = p.workoutHistory.slice(0, 1); },
      expected: { score: 95, fluency: 1, retention: 1, consistency: 0.5 },
    },
    {
      name: "uneven workouts (1.0 and 0.6) cost consistency: 1 - mean |dev| * 2.5",
      mutate: (p) => { p.workoutHistory = p.workoutHistory.slice(0, 2); p.workoutHistory[1].accuracy = 0.6; },
      expected: { score: 95, fluency: 1, retention: 1, consistency: 0.5 },
    },
  ];
  for (const { name, mutate, expected } of cases) {
    const progress = perfectProgress("multiplication");
    mutate(progress);
    const summary = load(progress).getOperationMastery("multiplication");
    assert.deepStrictEqual(
      { score: summary.score, fluency: summary.fluency, retention: summary.retention, consistency: summary.consistency },
      expected,
      name,
    );
  }
});

test("getFluencyThresholdMs: 4000 for addition/multiplication, 5000 otherwise", () => {
  const app = loadApp();
  assert.deepStrictEqual(
    ["addition", "multiplication", "subtraction", "division", "other"].map(app.getFluencyThresholdMs),
    [4000, 4000, 5000, 5000, 5000],
  );
});

test("getOperationMastery: coverage and strong-skill thresholds per skill bucket", () => {
  // One addition fact in the 1-1 bucket ("2+3"); universe is 7 buckets.
  const cases = [
    { attempts: 5, correct: 5, covered: 0, strong: 0 },
    { attempts: 6, correct: 5, covered: 1, strong: 0 },
    { attempts: 10, correct: 7, covered: 1, strong: 0 },
    { attempts: 10, correct: 6, covered: 0, strong: 0 },
    { attempts: 9, correct: 9, covered: 1, strong: 0 },
    { attempts: 10, correct: 9, covered: 1, strong: 1 },
    { attempts: 10, correct: 8, covered: 1, strong: 0 },
  ];
  for (const { attempts, correct, covered, strong } of cases) {
    const app = load({ facts: { "addition:2+3": { attempts, correct } } });
    const summary = app.getOperationMastery("addition");
    assert.equal(summary.coveredSkills.length, covered, `${correct}/${attempts} covered`);
    assert.equal(summary.strongSkills.length, strong, `${correct}/${attempts} strong`);
    assert.equal(summary.coverageRatio, covered / 7);
    if (covered) assert.equal(summary.coveredSkills[0][0], "1-1");
  }
});

test("getOperationMastery: multiplication facts count toward both factors' skills", () => {
  const cases = [
    { key: "multiplication:3x4", skills: ["x3", "x4"] },
    { key: "multiplication:5x5", skills: ["x5"] },
    { key: "multiplication:-3x4", skills: ["x3", "x4"] },
    { key: "multiplication:0x7", skills: ["x7"] }, // factor 0 is outside 1..12
    { key: "6x2", skills: ["x2", "x6"] }, // legacy key
  ];
  for (const { key, skills } of cases) {
    const app = load({ facts: { [key]: { attempts: 6, correct: 6 } } });
    const summary = app.getOperationMastery("multiplication");
    assert.deepStrictEqual(Array.from(summary.coveredSkills, ([skill]) => skill).sort(), skills.sort(), key);
    // CURRENT BEHAVIOUR: attempts are counted once per fact even though they feed two skills.
    assert.equal(summary.attempts, 6, key);
  }
});

test("getOperationMastery: skipped telemetry is excluded from recent accuracy; only the latest 60 count", () => {
  const progress = perfectProgress("multiplication");
  // 70 newest entries: 10 skipped (ignored), then 60 wrong (recent window), then the older 80 correct.
  const base = Date.parse("2026-01-15T11:00:00Z");
  for (let index = 0; index < 70; index += 1) {
    progress.answerTelemetry.push({
      id: `n${index}`, operation: "multiplication", correct: false, skipped: index < 10,
      responseTimeMs: 1000, dateKey: "2026-01-15", timestamp: base + 1000 - index,
    });
  }
  const summary = load(progress).getOperationMastery("multiplication");
  assert.equal(summary.recentAccuracy, 0);
  assert.equal(summary.fluency, 0);
  // retention uses max(recent, overall facts accuracy) once there are >= 10 recent answers.
  assert.equal(summary.retention, 1);
});

test("getOperationMastery: populated fixture", () => {
  const app = loadApp({ now: FIXTURE.fixedNow, localStorage: { [KEY]: FIXTURE.progress } });
  const expected = {
    addition: { score: 77, rank: "Adept", attempts: 217, covered: 2, strong: 0, universe: 7, next: "Expert", goal: "Build more skill areas so the rank reflects broad coverage." },
    subtraction: { score: 78, rank: "Adept", attempts: 228, covered: 2, strong: 0, universe: 6, next: "Expert", goal: "Build more skill areas so the rank reflects broad coverage." },
    multiplication: { score: 92, rank: "Adept", attempts: 94, covered: 12, strong: 0, universe: 12, next: "Expert", goal: "Reach 120 total attempts with steady practice." },
    division: { score: 90, rank: "Expert", attempts: 139, covered: 10, strong: 2, universe: 12, next: "Elite", goal: "Reach 220 total attempts with steady practice." },
  };
  for (const operation of app.OPERATION_OPTIONS) {
    const summary = app.getOperationMastery(operation);
    assert.deepStrictEqual(
      {
        score: summary.score,
        rank: summary.rank.label,
        attempts: summary.attempts,
        covered: summary.coveredSkills.length,
        strong: summary.strongSkills.length,
        universe: summary.skillUniverse.length,
        next: summary.nextRank.label,
        goal: summary.nextGoal,
      },
      expected[operation],
      operation,
    );
    assert.deepStrictEqual(app.harness.plain(summary.bestRank), FIXTURE.progress.operationBestRanks[operation]);
    assert.equal(summary.fluency, 1);
    assert.equal(summary.consistency, 1);
  }
  const multiplication = app.getOperationMastery("multiplication");
  assert.equal(multiplication.accuracy.toFixed(4), "0.7766");
  assert.equal(multiplication.recentAccuracy, 0.9);
  assert.equal(multiplication.retention, 0.9);
  assert.equal(multiplication.coverageRatio, 1);
});

// ---------------------------------------------------------------- best rank

function summaryFor(app, operation, rankLabel, score) {
  return { operation, rank: app.MASTERY_RANKS[app.getMasteryRankIndex(rankLabel)], score };
}

test("updateOperationBestRank: upgrades on higher rank or same rank with higher score; never downgrades", () => {
  const app = load({ operationBestRanks: { addition: { rank: "Adept", score: 40, earnedAt: 111 } } });
  const nowMs = Date.parse(NOW);
  const cases = [
    ["lower rank, higher score", "Novice", 90, { rank: "Adept", score: 40, earnedAt: 111 }, false],
    ["same rank, same score", "Adept", 40, { rank: "Adept", score: 40, earnedAt: 111 }, false],
    ["same rank, lower score", "Adept", 39, { rank: "Adept", score: 40, earnedAt: 111 }, false],
    ["same rank, higher score", "Adept", 41, { rank: "Adept", score: 41, earnedAt: nowMs }, true],
    ["higher rank, lower score", "Expert", 10, { rank: "Expert", score: 10, earnedAt: nowMs }, true],
  ];
  for (const [name, rank, score, expected, saves] of cases) {
    app.harness.clock.clearAllTimers();
    const result = app.updateOperationBestRank(summaryFor(app, "addition", rank, score));
    assert.deepStrictEqual(app.harness.plain(result), expected, name);
    assert.deepStrictEqual(app.harness.plain(app.state.progress.operationBestRanks.addition), expected, name);
    assert.equal(app.harness.clock.pendingTimers(), saves ? 1 : 0, `${name}: queued save`);
  }
  // Other operations were not touched.
  assert.deepStrictEqual(app.harness.plain(app.getOperationBestRankRecord("division")), { rank: "Rookie", score: 0, earnedAt: 0 });
});

test("updateOperationBestRank: queued save persists the new best rank", () => {
  const app = load(null);
  app.updateOperationBestRank(summaryFor(app, "division", "Elite", 70));
  app.harness.clock.advance(app.PROGRESS_SAVE_DEBOUNCE_MS);
  const saved = JSON.parse(app.harness.localStorage.getItem(KEY));
  assert.deepStrictEqual(saved.operationBestRanks.division, { rank: "Elite", score: 70, earnedAt: Date.parse(NOW) });
});

test("renderMasterySystem records best ranks from current mastery (fixture: none higher than stored)", () => {
  const app = loadApp({ now: FIXTURE.fixedNow, localStorage: { [KEY]: FIXTURE.progress } });
  app.renderMasterySystem();
  assert.deepStrictEqual(app.harness.plain(app.state.progress.operationBestRanks), FIXTURE.progress.operationBestRanks);
  assert.match(app.elements.masteryGrid.innerHTML, /Division leads|mastery-overview-grid/);

  const perfect = load(perfectProgress("multiplication"));
  perfect.renderMasterySystem();
  assert.deepStrictEqual(
    perfect.harness.plain(perfect.state.progress.operationBestRanks.multiplication),
    { rank: "Legend", score: 100, earnedAt: Date.parse(NOW) },
  );
  assert.equal(perfect.state.progress.operationBestRanks.addition.rank, "Rookie");
});

test("getMasterySummaryCopy", () => {
  const app = loadApp();
  assert.equal(app.getMasterySummaryCopy(null), "Complete a few workouts to start building operation ranks.");
  assert.equal(
    app.getMasterySummaryCopy({ label: "Division", rank: { label: "Expert" }, score: 90 }),
    "Division leads at Expert with 90 mastery points.",
  );
});

// ---------------------------------------------------------------- trends

// now = 2026-01-15: last window is 2026-01-09..15, previous window is 2026-01-02..08.
function trendApp(operation, bucketKey, last, previous, extra = {}) {
  const app = load(null);
  const bucketDaily = { ...extra };
  if (last) bucketDaily[`2026-01-15|${operation}|${bucketKey}`] = { attempted: last[1], correct: last[0] };
  if (previous) bucketDaily[`2026-01-05|${operation}|${bucketKey}`] = { attempted: previous[1], correct: previous[0] };
  app.state.progress.bucketDaily = bucketDaily;
  return app;
}

test("buildBucketTrendItem: windows, totals and status", () => {
  const app = trendApp("multiplication", "x3", [9, 10], [3, 4], {
    "2026-01-09|multiplication|x3": { attempted: 2, correct: 2 }, // oldest day of the last window
    "2026-01-08|multiplication|x3": { attempted: 1, correct: 0 }, // newest day of the previous window
    "2026-01-02|multiplication|x3": { attempted: 1, correct: 1 }, // oldest day of the previous window
    "2026-01-01|multiplication|x3": { attempted: 5, correct: 0 }, // outside both windows, total only
    "2026-01-15|multiplication|x4": { attempted: 50, correct: 50 }, // other bucket
  });
  const item = app.harness.plain(app.buildBucketTrendItem("multiplication", "x3"));
  assert.deepStrictEqual(item, {
    operation: "multiplication",
    bucketKey: "x3",
    label: "x 3",
    totalAttempted: 23,
    totalCorrect: 15,
    totalAccuracy: 15 / 23,
    lastAttempted: 12,
    lastCorrect: 11,
    lastAccuracy: 11 / 12,
    previousAttempted: 6,
    previousCorrect: 4,
    previousAccuracy: 4 / 6,
    delta: 11 / 12 - 4 / 6,
    status: { tone: "needs", label: "Need Reps" },
  });
});

test("getPositiveProgressItems: thresholds on total, recent attempts and delta", () => {
  const cases = [
    { name: "clear improvement", last: [3, 3], previous: [3, 4], positive: true },
    { name: "too few recent attempts", last: [2, 2], previous: [1, 4], positive: false },
    { name: "total 5 < 6", last: [3, 3], previous: [1, 2], positive: false },
    { name: "total exactly 6", last: [3, 3], previous: [2, 3], positive: true },
    { name: "no previous data counts as 0% previous", last: [6, 6], previous: null, positive: true },
    { name: "delta 0.92 - 0.84 (fp 0.08000000000000007)", last: [23, 25], previous: [21, 25], positive: true },
    // CURRENT BEHAVIOUR (possible bug): a nominal delta of exactly 0.08 (100% vs 92%) is
    // 0.07999999999999996 in floating point, so it misses the >= 0.08 threshold.
    { name: "delta 1.00 - 0.92 (fp 0.07999999999999996)", last: [25, 25], previous: [23, 25], positive: false },
    { name: "flat", last: [8, 10], previous: [8, 10], positive: false },
  ];
  for (const { name, last, previous, positive } of cases) {
    const app = trendApp("multiplication", "x7", last, previous);
    const items = app.getPositiveProgressItems(3, "multiplication");
    assert.equal(items.length, positive ? 1 : 0, name);
    if (positive) assert.equal(items[0].bucketKey, "x7", name);
  }
});

test("getGrowthOpportunityItems: drop of >= 0.08 or recent accuracy below 0.7", () => {
  const cases = [
    { name: "low recent accuracy, flat", last: [6, 10], previous: [6, 10], growth: true },
    { name: "recent accuracy exactly 0.7, flat", last: [7, 10], previous: [7, 10], growth: false },
    { name: "drop 0.84 vs 0.92 (fp -0.08000000000000007)", last: [21, 25], previous: [23, 25], growth: true },
    // CURRENT BEHAVIOUR (possible bug): nominal -0.08 (92% vs 100%) is -0.07999999999999996 in fp.
    { name: "drop 0.92 vs 1.00 (fp -0.07999999999999996)", last: [23, 25], previous: [25, 25], growth: false },
    { name: "low accuracy but only 2 recent attempts", last: [0, 2], previous: [4, 4], growth: false },
    { name: "low accuracy but total 5", last: [0, 3], previous: [2, 2], growth: false },
  ];
  for (const { name, last, previous, growth } of cases) {
    const app = trendApp("addition", "1-1", last, previous);
    const items = app.getGrowthOpportunityItems(4, "addition");
    assert.equal(items.length, growth ? 1 : 0, name);
  }
});

test("positive / growth lists: sort order and limit", () => {
  const app = load(null);
  const bucketDaily = {};
  const set = (bucket, last, previous) => {
    bucketDaily[`2026-01-15|multiplication|${bucket}`] = { attempted: last[1], correct: last[0] };
    bucketDaily[`2026-01-05|multiplication|${bucket}`] = { attempted: previous[1], correct: previous[0] };
  };
  set("x2", [10, 10], [5, 10]); // +0.5
  set("x3", [10, 10], [8, 10]); // +0.2
  set("x4", [9, 10], [5, 10]); // +0.4
  set("x5", [10, 10], [9, 10]); // +0.1
  set("x6", [2, 10], [9, 10]); // -0.7
  set("x7", [5, 10], [9, 10]); // -0.4
  set("x8", [6, 10], [6, 10]); // 0, but low accuracy
  app.state.progress.bucketDaily = bucketDaily;
  assert.deepStrictEqual(Array.from(app.getPositiveProgressItems(3, "multiplication"), (item) => item.bucketKey), ["x2", "x4", "x3"]);
  assert.deepStrictEqual(Array.from(app.getPositiveProgressItems(10, "all"), (item) => item.bucketKey), ["x2", "x4", "x3", "x5"]);
  assert.deepStrictEqual(Array.from(app.getGrowthOpportunityItems(4, "multiplication"), (item) => item.bucketKey), ["x6", "x7", "x8"]);
  assert.deepStrictEqual(Array.from(app.getGrowthOpportunityItems(1, "all"), (item) => item.bucketKey), ["x6"]);
});

test("getBucketTrendItems: operation coverage per filter", () => {
  const app = load(null);
  const summarise = (filter) => {
    const items = app.getBucketTrendItems(filter);
    return { count: items.length, operations: [...new Set(items.map((item) => item.operation))] };
  };
  assert.deepStrictEqual(summarise("all"), { count: 19, operations: ["multiplication", "addition"] });
  assert.deepStrictEqual(summarise("multiplication"), { count: 12, operations: ["multiplication"] });
  assert.deepStrictEqual(summarise("addition"), { count: 7, operations: ["addition"] });
  // CURRENT BEHAVIOUR (possible bug): any other filter falls into the addition branch, so the
  // subtraction / division focus views list ADDITION buckets.
  assert.deepStrictEqual(summarise("subtraction"), { count: 7, operations: ["addition"] });
  assert.deepStrictEqual(summarise("division"), { count: 7, operations: ["addition"] });
});

test("parseBucketDailyKey (progress) maps every non-addition operation to multiplication", () => {
  const app = loadApp();
  const cases = [
    ["2026-01-15|addition|1-1", { dateKey: "2026-01-15", operation: "addition", bucketKey: "1-1" }],
    ["2026-01-15|multiplication|x3", { dateKey: "2026-01-15", operation: "multiplication", bucketKey: "x3" }],
    // CURRENT BEHAVIOUR (possible bug): unlike parseBucketDailyStorageKey in app-core.js, subtraction
    // and division keys are reported as multiplication, so such rows would be counted in x-buckets.
    ["2026-01-15|subtraction|x3", { dateKey: "2026-01-15", operation: "multiplication", bucketKey: "x3" }],
    ["2026-01-15|division|a|b", { dateKey: "2026-01-15", operation: "multiplication", bucketKey: "a|b" }],
    ["junk", { dateKey: "junk", operation: "multiplication", bucketKey: "" }],
  ];
  for (const [key, expected] of cases) {
    assert.deepStrictEqual(app.harness.plain(app.parseBucketDailyKey(key)), expected, key);
  }
  assert.deepStrictEqual(
    app.harness.plain(app.parseBucketDailyStorageKey("2026-01-15|subtraction|x3")),
    { dateKey: "2026-01-15", operation: "subtraction", bucketKey: "x3" },
  );

  // Effect on trends: a subtraction row with an x-bucket name is counted as multiplication.
  const trend = trendApp("subtraction", "x3", [5, 5], null);
  assert.equal(trend.buildBucketTrendItem("multiplication", "x3").totalAttempted, 5);
});

test("trend items for the populated fixture are all empty (fixture has no bucketDaily)", () => {
  const app = loadApp({ now: FIXTURE.fixedNow, localStorage: { [KEY]: FIXTURE.progress } });
  assert.equal(app.getBucketTrendItems("all").filter((item) => item.totalAttempted).length, 0);
  assert.deepStrictEqual(app.harness.plain(app.getPositiveProgressItems(3, "all")), []);
  assert.deepStrictEqual(app.harness.plain(app.getGrowthOpportunityItems(4, "all")), []);
});
