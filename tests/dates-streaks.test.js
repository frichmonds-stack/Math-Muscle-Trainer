"use strict";

// Characterisation tests for date-key helpers (js/app-core.js) and practice streaks
// (js/app-practice.js). The harness pins TZ=UTC and the clock (default 2026-01-15T12:00Z).

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { loadApp } = require("./harness");

describe("formatDateKey / parseDateKey", () => {
  test("formatDateKey zero-pads local year-month-day", () => {
    const app = loadApp();
    const make = (y, m, d) => app.harness.evaluate(`new Date(${y}, ${m}, ${d}, 23, 59)`);
    assert.equal(app.formatDateKey(make(2026, 0, 5)), "2026-01-05");
    assert.equal(app.formatDateKey(make(2026, 11, 31)), "2026-12-31");
    assert.equal(app.formatDateKey(make(2028, 1, 29)), "2028-02-29");
    assert.equal(app.formatDateKey(new Date(Date.UTC(999, 0, 1, 12))), "999-01-01", "year is not padded");
  });

  test("parseDateKey builds a local date at 12:00", () => {
    const app = loadApp();
    const date = app.parseDateKey("2028-02-29");
    assert.deepStrictEqual(
      [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()],
      [2028, 1, 29, 12, 0],
    );
  });

  test("round trip and out-of-range rollover", () => {
    const app = loadApp();
    for (const key of ["2026-01-01", "2026-12-31", "2028-02-29", "2027-07-04"]) {
      assert.equal(app.formatDateKey(app.parseDateKey(key)), key);
    }
    // Invalid calendar dates roll over via the Date constructor.
    assert.equal(app.formatDateKey(app.parseDateKey("2026-02-30")), "2026-03-02");
    assert.equal(app.formatDateKey(app.parseDateKey("2027-02-29")), "2027-03-01");
    assert.equal(app.formatDateKey(app.parseDateKey("2026-13-01")), "2027-01-01");
  });
});

describe("shiftDateKey", () => {
  const cases = [
    ["2026-01-15", 0, "2026-01-15"],
    ["2026-01-15", 1, "2026-01-16"],
    ["2026-01-31", 1, "2026-02-01"],
    ["2026-03-01", -1, "2026-02-28"],
    ["2026-12-31", 1, "2027-01-01"],
    ["2027-01-01", -1, "2026-12-31"],
    ["2027-02-28", 1, "2027-03-01"],
    ["2028-02-28", 1, "2028-02-29"],
    ["2028-02-29", 1, "2028-03-01"],
    ["2028-03-01", -1, "2028-02-29"],
    ["2028-02-29", 365, "2029-02-28"],
    ["2028-02-29", -366, "2027-02-28"],
    ["2026-01-15", -31, "2025-12-15"],
    ["2026-03-29", 1, "2026-03-30"], // EU DST change day (irrelevant under UTC, kept as a guard)
    ["2026-11-01", 1, "2026-11-02"], // US DST change day
  ];
  for (const [key, days, expected] of cases) {
    test(`${key} ${days >= 0 ? "+" : ""}${days} -> ${expected}`, () => {
      const app = loadApp();
      assert.equal(app.shiftDateKey(key, days), expected);
    });
  }
});

describe("getTodayDateKey / getRollingWindowCutoffDateKey", () => {
  const cases = [
    ["2026-01-15T12:00:00.000Z", "2026-01-15", "2025-12-15"],
    ["2026-01-15T00:00:00.000Z", "2026-01-15", "2025-12-15"],
    ["2026-01-15T23:59:59.999Z", "2026-01-15", "2025-12-15"],
    ["2028-02-29T08:00:00.000Z", "2028-02-29", "2028-01-29"],
    ["2028-03-31T08:00:00.000Z", "2028-03-31", "2028-02-29"],
    ["2027-01-01T08:00:00.000Z", "2027-01-01", "2026-12-01"],
  ];
  for (const [now, today, cutoff] of cases) {
    test(`now=${now}`, () => {
      const app = loadApp({ now });
      assert.equal(app.getTodayDateKey(), today);
      assert.equal(app.ROLLING_WINDOW_DAYS, 31);
      assert.equal(app.getRollingWindowCutoffDateKey(), cutoff);
    });
  }

  test("custom window sizes and a moving clock", () => {
    const app = loadApp({ now: "2026-01-15T12:00:00Z" });
    assert.equal(app.getRollingWindowCutoffDateKey(0), "2026-01-15");
    assert.equal(app.getRollingWindowCutoffDateKey(7), "2026-01-08");
    assert.equal(app.getRollingWindowCutoffDateKey(-1), "2026-01-16");
    app.harness.clock.advance(12 * 60 * 60 * 1000); // midnight UTC
    assert.equal(app.getTodayDateKey(), "2026-01-16");
  });
});

describe("isDateKey", () => {
  const cases = [
    ["2026-01-15", true],
    ["2026-02-30", true], // format check only, not calendar validity
    ["0000-00-00", true],
    ["2026-1-15", false],
    ["2026-01-15T00:00", false],
    [" 2026-01-15", false],
    ["20260115", false],
    ["", false],
    [null, false],
    [20260115, false],
  ];
  for (const [value, expected] of cases) {
    test(`${JSON.stringify(value)} -> ${expected}`, () => {
      const app = loadApp();
      assert.equal(app.isDateKey(value), expected);
    });
  }
});

describe("calculateBestPracticeStreak", () => {
  const cases = [
    { name: "empty", keys: [], best: 0 },
    { name: "single day", keys: ["2026-01-10"], best: 1 },
    { name: "three consecutive", keys: ["2026-01-10", "2026-01-11", "2026-01-12"], best: 3 },
    { name: "gap resets", keys: ["2026-01-01", "2026-01-02", "2026-01-04", "2026-01-05", "2026-01-06"], best: 3 },
    { name: "longest run first", keys: ["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-09"], best: 3 },
    { name: "across month end", keys: ["2026-01-30", "2026-01-31", "2026-02-01"], best: 3 },
    { name: "across year end", keys: ["2026-12-30", "2026-12-31", "2027-01-01"], best: 3 },
    { name: "across leap day", keys: ["2028-02-28", "2028-02-29", "2028-03-01"], best: 3 },
    { name: "non-leap Feb 28 -> Mar 1", keys: ["2027-02-28", "2027-03-01"], best: 2 },
    { name: "duplicate inside a run start", keys: ["2026-01-01", "2026-01-01", "2026-01-02"], best: 2 },
    // Assumes sorted, de-duplicated keys, which getWorkoutDayKeys() guarantees (object keys +
    // sort()), so these unsorted/duplicate cases are latent only.
    { name: "duplicate mid-run splits the run", keys: ["2026-01-01", "2026-01-02", "2026-01-02", "2026-01-03"], best: 2 },
    { name: "descending order", keys: ["2026-01-03", "2026-01-02", "2026-01-01"], best: 1 },
    { name: "shuffled order", keys: ["2026-01-03", "2026-01-01", "2026-01-02"], best: 2 },
  ];
  for (const { name, keys, best } of cases) {
    test(name, () => {
      const app = loadApp();
      assert.equal(app.calculateBestPracticeStreak(keys), best);
    });
  }
});

describe("calculateCurrentPracticeStreak (today = 2026-01-15)", () => {
  const cases = [
    { name: "empty", keys: [], current: 0 },
    { name: "today only", keys: ["2026-01-15"], current: 1 },
    { name: "yesterday only still counts", keys: ["2026-01-14"], current: 1 },
    { name: "two days ago breaks the streak", keys: ["2026-01-13"], current: 0 },
    { name: "run ending today", keys: ["2026-01-12", "2026-01-13", "2026-01-14", "2026-01-15"], current: 4 },
    { name: "run ending yesterday", keys: ["2026-01-12", "2026-01-13", "2026-01-14"], current: 3 },
    { name: "gap before today", keys: ["2026-01-10", "2026-01-11", "2026-01-13", "2026-01-14", "2026-01-15"], current: 3 },
    { name: "older long run does not count", keys: ["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-15"], current: 1 },
    { name: "unsorted input", keys: ["2026-01-15", "2026-01-13", "2026-01-14"], current: 3 },
    { name: "duplicates", keys: ["2026-01-14", "2026-01-15", "2026-01-15", "2026-01-14"], current: 2 },
    { name: "future dates are ignored for the anchor", keys: ["2026-01-16", "2026-01-17"], current: 0 },
    { name: "run crossing year end", keys: ["2025-12-30", "2025-12-31", "2026-01-01"], current: 0 },
  ];
  for (const { name, keys, current } of cases) {
    test(name, () => {
      const app = loadApp();
      assert.equal(app.calculateCurrentPracticeStreak(keys), current);
    });
  }

  test("run across the leap day ending today", () => {
    const app = loadApp({ now: "2028-03-01T09:00:00Z" });
    assert.equal(app.calculateCurrentPracticeStreak(["2028-02-27", "2028-02-28", "2028-02-29", "2028-03-01"]), 4);
  });

  test("run across the year end ending yesterday", () => {
    const app = loadApp({ now: "2027-01-02T09:00:00Z" });
    assert.equal(app.calculateCurrentPracticeStreak(["2026-12-30", "2026-12-31", "2027-01-01"]), 3);
  });
});

describe("getPracticeStreakSummary", () => {
  function withDailyRecords(records, now) {
    const app = loadApp(now ? { now } : {});
    app.state.progress.dailyRecords = records;
    return app;
  }

  test("no records", () => {
    const app = withDailyRecords({});
    assert.deepStrictEqual(app.harness.plain(app.getPracticeStreakSummary()), { current: 0, best: 0 });
  });

  test("only days whose attempt goal is earned count as workout days", () => {
    const app = withDailyRecords({
      "2026-01-10": { attempted: 10 }, // DAILY_TARGET reached -> counts
      "2026-01-11": { attempted: 3, attemptGoalEarned: true }, // explicit flag -> counts
      "2026-01-12": { correct: 10 }, // accuracy goal implies attempt goal -> counts
      "2026-01-13": { attempted: 9, correct: 9 }, // below target -> breaks run
      "2026-01-14": { sliceEarned: true }, // legacy flag -> counts
      "2026-01-15": { attempted: 12 },
    });
    assert.deepStrictEqual(app.harness.plain(app.getPracticeStreakSummary()), { current: 2, best: 3 });
  });

  test("unsorted object insertion order is sorted before computing best", () => {
    const app = withDailyRecords({
      "2026-01-15": { attempted: 10 },
      "2026-01-02": { attempted: 10 },
      "2026-01-14": { attempted: 10 },
      "2026-01-01": { attempted: 10 },
      "2026-01-03": { attempted: 10 },
      "2026-01-13": { attempted: 10 },
      "2026-01-12": { attempted: 10 },
    });
    assert.deepStrictEqual(app.harness.plain(app.getPracticeStreakSummary()), { current: 4, best: 4 });
  });

  test("a streak that ended two days ago keeps best but resets current", () => {
    const app = withDailyRecords(
      {
        "2026-01-10": { attempted: 10 },
        "2026-01-11": { attempted: 10 },
        "2026-01-12": { attempted: 10 },
      },
      "2026-01-14T12:00:00Z",
    );
    assert.deepStrictEqual(app.harness.plain(app.getPracticeStreakSummary()), { current: 0, best: 3 });
  });
});
