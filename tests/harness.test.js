"use strict";

// Smoke tests for the test harness itself. They prove the real app scripts load in
// Node and that time, randomness, storage and isolation are controllable.

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadApp, discoverScripts, scanTopLevelNames } = require("./harness");

test("app scripts load without throwing (default: init and debug excluded)", () => {
  const app = loadApp();
  const indexHtml = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "index.html"), "utf8");
  const expected = discoverScripts(indexHtml).filter((src) => !/app-(init|debug)\.js$/.test(src));
  assert.deepEqual(app.harness.scripts, expected);
  assert.equal(expected[0], "js/app-core.js");
  assert.equal(typeof app.initialise, "undefined", "app-init.js should not be loaded by default");
});

test("script list is discovered from index.html <script src> tags in order", () => {
  const html = `
    <script src="https://cdn.example.com/x.js"></script>
    <script src="js/a.js"></script>
    <script defer src='./js/b.js?v=2'></script>`;
  assert.deepEqual(discoverScripts(html), ["js/a.js", "js/b.js"]);
});

test("top-level name scan finds column-0 function/const/let declarations only", () => {
  const names = scanTopLevelNames(
    "const A = 1;\nlet b = 2;\nfunction c() {\n  const nested = 3;\n}\nasync function d() {}\n",
  );
  assert.deepEqual(
    names.map((entry) => `${entry.kind}:${entry.name}`),
    ["const:A", "let:b", "function:c", "function:d"],
  );
});

test("core globals are exposed as functions", () => {
  const app = loadApp();
  for (const name of [
    "buildAdditionPool",
    "parseFactKeyCore",
    "normaliseWorkoutRecord",
    "loadProgress",
    "calculateCurrentPracticeStreak",
    "getTodayDateKey",
  ]) {
    assert.equal(typeof app[name], "function", `${name} should be a function`);
  }
});

test("top-level const values such as state, elements and constants are reachable", () => {
  const app = loadApp();
  assert.equal(typeof app.state, "object");
  assert.equal(app.state, app.state, "getter returns the live state object");
  assert.equal(app.state.view, "home");
  assert.equal(typeof app.APP_VERSION, "string");
  assert.equal(app.STORAGE_KEY, "math-muscle-trainer-progress-v2");
  assert.ok(app.elements.appShell, "elements built from the real index.html");
  assert.equal(app.elements.appShell, app.harness.document.querySelector(".app-shell"));
});

test("localStorage seeding is visible to loadProgress and the initial state", () => {
  const app = loadApp({
    now: "2026-03-15T12:00:00Z",
    localStorage: {
      "math-muscle-trainer-progress-v2": {
        totalAnswered: 42,
        totalCorrect: 40,
        dailyRecords: { "2026-03-15": { attempted: 12, correct: 11 } },
      },
    },
  });
  assert.equal(app.state.progress.totalAnswered, 42);
  assert.equal(app.state.progress.dailyRecords["2026-03-15"].attempted, 12);

  app.harness.localStorage.setItem(app.STORAGE_KEY, JSON.stringify({ totalAnswered: 7 }));
  assert.equal(app.loadProgress().totalAnswered, 7);
});

test("fixed time is respected by getTodayDateKey and can be advanced", () => {
  const app = loadApp({ now: "2026-03-05T12:00:00Z" });
  assert.equal(app.getTodayDateKey(), "2026-03-05");
  assert.equal(app.harness.evaluate("Date.now()"), Date.parse("2026-03-05T12:00:00Z"));

  app.harness.clock.advance(24 * 60 * 60 * 1000);
  assert.equal(app.getTodayDateKey(), "2026-03-06");

  app.harness.clock.set(new Date("2026-12-31T12:00:00Z"));
  assert.equal(app.getTodayDateKey(), "2026-12-31");
});

test("calculateCurrentPracticeStreak uses the fixed clock", () => {
  const app = loadApp({ now: "2026-03-15T12:00:00Z" });
  assert.equal(app.calculateCurrentPracticeStreak(["2026-03-13", "2026-03-14", "2026-03-15"]), 3);
  assert.equal(app.calculateCurrentPracticeStreak(["2026-03-13", "2026-03-14"]), 2);
  assert.equal(app.calculateCurrentPracticeStreak(["2026-03-12"]), 0);
});

test("Math.random is seeded: same seed repeats, different seed differs", () => {
  const sample = (seed) => {
    const app = loadApp({ random: seed });
    return Array.from({ length: 5 }, () => app.harness.evaluate("Math.random()"));
  };
  assert.deepEqual(sample(7), sample(7));
  assert.notDeepEqual(sample(7), sample(8));

  const fixed = loadApp({ random: () => 0.5 });
  assert.equal(fixed.harness.evaluate("Math.random()"), 0.5);
});

test("each loadApp() call is an isolated context", () => {
  const first = loadApp();
  const second = loadApp();
  first.state.view = "progress";
  first.harness.localStorage.setItem("x", "1");
  assert.equal(second.state.view, "home");
  assert.equal(second.harness.localStorage.getItem("x"), null);
  assert.notEqual(first.buildAdditionPool, second.buildAdditionPool);
});

test("fake timers only fire when the clock advances", () => {
  const app = loadApp();
  app.state.progress.totalAnswered = 3;
  app.queueProgressSave();
  assert.equal(app.harness.localStorage.getItem(app.STORAGE_KEY), null);
  assert.equal(app.harness.clock.pendingTimers(), 1);
  app.harness.clock.runAll();
  assert.equal(JSON.parse(app.harness.localStorage.getItem(app.STORAGE_KEY)).totalAnswered, 3);
});

test("plain() copies app values into this realm for deepStrictEqual", () => {
  const app = loadApp();
  const parsed = app.parseFactKeyCore("addition:3+4");
  assert.deepStrictEqual(app.harness.plain(parsed), { operation: "addition", left: 3, right: 4 });
});

test("includeInit runs app-init.js startup against the fake DOM", () => {
  const app = loadApp({ includeInit: true, includeDebug: true });
  assert.equal(typeof app.initialise, "function");
  assert.equal(app.elements.appVersion.textContent, app.APP_VERSION);
});
