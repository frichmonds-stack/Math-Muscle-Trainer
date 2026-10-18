"use strict";

// Characterisation tests for question pools and fact-key logic
// (js/app-practice.js and js/app-core.js). They describe CURRENT behaviour.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { loadApp } = require("./harness");

const STORAGE_SYMBOLS = { addition: "+", subtraction: "-", multiplication: "x", division: "/" };

function settingsFor(app, overrides) {
  return { ...app.defaultSettingsSnapshot(), ...overrides };
}

function expectedAnswer(operation, a, b) {
  if (operation === "addition") return a + b;
  if (operation === "subtraction") return a - b;
  if (operation === "division") return a / b;
  return a * b;
}

function digitPair(a, b) {
  const digits = (n) => String(Math.abs(n)).length;
  return [digits(a), digits(b)];
}

/** Invariants shared by every pool. Returns the pool as plain objects. */
function assertPoolInvariants(app, rawPool, operation) {
  const pool = app.harness.plain(rawPool);
  assert.ok(Array.isArray(pool) && pool.length > 0, "pool is non-empty");
  const keys = new Set();
  for (const fact of pool) {
    assert.equal(fact.operation, operation);
    assert.equal(fact.key, `${operation}:${fact.a}${STORAGE_SYMBOLS[operation]}${fact.b}`);
    assert.ok(!keys.has(fact.key), `duplicate key ${fact.key}`);
    keys.add(fact.key);
    assert.ok(Number.isInteger(fact.a) && Number.isInteger(fact.b), `integer operands ${fact.key}`);
    assert.equal(fact.answer, expectedAnswer(operation, fact.a, fact.b), `answer for ${fact.key}`);
    assert.equal(fact.answer, app.evaluateFactAnswer(operation, fact.a, fact.b));
    if (operation === "addition" || operation === "multiplication") {
      assert.ok(fact.a <= fact.b, `commutative facts are stored low-first: ${fact.key}`);
    }
    if (operation === "subtraction") {
      assert.ok(fact.answer >= 0, `subtraction never negative: ${fact.key}`);
    }
    if (operation === "division") {
      assert.notEqual(fact.b, 0, `no division by zero: ${fact.key}`);
      assert.ok(Number.isInteger(fact.answer), `integer quotient: ${fact.key}`);
    }
  }
  return pool;
}

describe("evaluateFactAnswer / createFact", () => {
  const cases = [
    ["addition", 3, 4, { a: 3, b: 4, key: "addition:3+4", answer: 7, symbol: "+" }],
    ["addition", 9, 2, { a: 2, b: 9, key: "addition:2+9", answer: 11, symbol: "+" }],
    ["subtraction", 9, 2, { a: 9, b: 2, key: "subtraction:9-2", answer: 7, symbol: "-" }],
    ["subtraction", 2, 9, { a: 2, b: 9, key: "subtraction:2-9", answer: -7, symbol: "-" }],
    ["multiplication", 8, 3, { a: 3, b: 8, key: "multiplication:3x8", answer: 24, symbol: "x" }],
    ["multiplication", 9, -3, { a: -3, b: 9, key: "multiplication:-3x9", answer: -27, symbol: "x" }],
    ["multiplication", -4, -6, { a: -6, b: -4, key: "multiplication:-6x-4", answer: 24, symbol: "x" }],
    ["division", 56, 7, { a: 56, b: 7, key: "division:56/7", answer: 8, symbol: "÷" }],
  ];
  for (const [operation, left, right, expected] of cases) {
    test(`createFact(${operation}, ${left}, ${right})`, () => {
      const app = loadApp();
      assert.deepStrictEqual(app.harness.plain(app.createFact(operation, left, right)), {
        operation,
        ...expected,
      });
    });
  }

  test("evaluateFactAnswer table, including division by zero and unknown operation", () => {
    const app = loadApp();
    assert.equal(app.evaluateFactAnswer("addition", 5, 6), 11);
    assert.equal(app.evaluateFactAnswer("subtraction", 5, 6), -1);
    assert.equal(app.evaluateFactAnswer("division", 12, 4), 3);
    assert.equal(app.evaluateFactAnswer("division", 7, 2), 3.5);
    assert.equal(app.evaluateFactAnswer("division", 12, 0), 0, "division by zero returns 0");
    assert.equal(app.evaluateFactAnswer("multiplication", 6, 7), 42);
    assert.equal(app.evaluateFactAnswer("anything-else", 6, 7), 42, "unknown falls back to multiply");
  });
});

describe("multiplication pools", () => {
  const cases = [
    { name: "mixed 2-12", overrides: {}, size: 66 },
    { name: "mixed 2-12 with negatives", overrides: { negativesMode: true }, size: 253 },
    { name: "mixed 3-5", overrides: { minFactor: 3, maxFactor: 5 }, size: 6 },
    { name: "isolation x7 over 2-12", overrides: { sessionType: "isolation" }, size: 11 },
    {
      name: "isolation x7 over 2-12 with negatives",
      overrides: { sessionType: "isolation", negativesMode: true },
      size: 43, // 10 other factors x 4 sign variants + 7x7 with 3 distinct sign variants
    },
  ];
  for (const { name, overrides, size } of cases) {
    test(name, () => {
      const app = loadApp();
      const settings = settingsFor(app, { operation: "multiplication", ...overrides });
      const pool = assertPoolInvariants(app, app.buildPool(settings), "multiplication");
      assert.equal(pool.length, size);
      assert.deepStrictEqual(
        app.harness.plain(app.buildMultiplicationPool(settings)).map((f) => f.key),
        pool.map((f) => f.key),
        "buildPool delegates to buildMultiplicationPool",
      );
      for (const fact of pool) {
        for (const operand of [fact.a, fact.b]) {
          const magnitude = Math.abs(operand);
          assert.ok(
            magnitude >= settings.minFactor && magnitude <= settings.maxFactor ||
              (settings.sessionType === "isolation" && magnitude === settings.focusFactor),
            `operand ${operand} in range for ${fact.key}`,
          );
          if (!settings.negativesMode) assert.ok(operand > 0, `no negatives: ${fact.key}`);
        }
        if (settings.sessionType === "isolation") {
          assert.ok(
            Math.abs(fact.a) === settings.focusFactor || Math.abs(fact.b) === settings.focusFactor,
            `isolation fact contains focus factor: ${fact.key}`,
          );
        }
      }
      if (settings.negativesMode) {
        assert.ok(pool.some((f) => f.a < 0 && f.b < 0), "includes negative x negative");
        assert.ok(pool.some((f) => f.answer < 0), "includes negative answers");
      }
    });
  }
});

describe("division pools", () => {
  test("mixed 2-12: every divisor x quotient pair, integer answers", () => {
    const app = loadApp();
    const settings = settingsFor(app, { operation: "division" });
    const pool = assertPoolInvariants(app, app.buildDivisionPool(settings), "division");
    assert.equal(pool.length, 121);
    for (const fact of pool) {
      assert.ok(fact.b >= 2 && fact.b <= 12, `divisor in range: ${fact.key}`);
      assert.ok(fact.answer >= 2 && fact.answer <= 12, `quotient in range: ${fact.key}`);
    }
  });

  test("isolation uses focusFactor as divisor and quotients minFactor..maxFactor", () => {
    const app = loadApp();
    const settings = settingsFor(app, { operation: "division", sessionType: "isolation", focusFactor: 7 });
    const pool = assertPoolInvariants(app, app.buildPool(settings), "division");
    assert.deepStrictEqual(
      pool.map((f) => f.key),
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((q) => `division:${q * 7}/7`),
    );
  });

  test("isolation with non-numeric focusFactor clamps the divisor to 1", () => {
    const app = loadApp();
    const settings = settingsFor(app, {
      operation: "division",
      sessionType: "isolation",
      focusFactor: "abc",
      minFactor: 2,
      maxFactor: 3,
    });
    const pool = assertPoolInvariants(app, app.buildPool(settings), "division");
    assert.deepStrictEqual(pool.map((f) => f.key), ["division:2/1", "division:3/1"]);
  });

  test("empty factor range falls back to 12 / 3", () => {
    const app = loadApp();
    const settings = settingsFor(app, { operation: "division", minFactor: 5, maxFactor: 4 });
    assert.deepStrictEqual(app.harness.plain(app.buildPool(settings)).map((f) => f.key), ["division:12/3"]);
  });
});

describe("addition pools", () => {
  const BUCKETS = {
    easy: [[1, 1]],
    medium: [[1, 2], [2, 2]],
    hard: [[1, 3], [2, 3], [3, 3]],
  };
  const cases = [
    { difficulties: ["easy"], regrouping: true, size: 55 }, // every unordered 0..9 pair
    { difficulties: ["easy"], regrouping: false, size: 35 }, // 30 no-carry pairs + 5 sums of exactly 10
    { difficulties: ["medium"], regrouping: true, size: 120 },
    { difficulties: ["medium"], regrouping: false, size: 120 },
    { difficulties: ["hard"], regrouping: true, size: 120 },
    { difficulties: ["hard"], regrouping: false, size: 120 },
    { difficulties: ["easy", "medium", "hard"], regrouping: true, size: 144 }, // 6 buckets x 24
  ];
  for (const { difficulties, regrouping, size } of cases) {
    test(`${difficulties.join("+")} regrouping=${regrouping}`, () => {
      const app = loadApp();
      const settings = settingsFor(app, {
        operation: "addition",
        additionDifficulties: difficulties,
        additionRegrouping: regrouping,
      });
      const pool = assertPoolInvariants(app, app.buildAdditionPool(settings), "addition");
      assert.equal(pool.length, size);
      const allowed = difficulties.flatMap((d) => BUCKETS[d]).map((pair) => pair.join("-"));
      for (const fact of pool) {
        assert.ok(fact.a >= 0 && fact.b <= 999, `operands within 0..999: ${fact.key}`);
        assert.ok(allowed.includes(digitPair(fact.a, fact.b).join("-")), `digit bucket for ${fact.key}`);
        if (!regrouping) {
          assert.equal(app.hasAdditionRegroupingCore(fact.a, fact.b), false, `no regrouping: ${fact.key}`);
        }
      }
    });
  }

  test("regrouping off still admits sums of exactly 10 (e.g. 5+5)", () => {
    const app = loadApp();
    const settings = settingsFor(app, {
      operation: "addition",
      additionDifficulties: ["easy"],
      additionRegrouping: false,
    });
    const keys = app.harness.plain(app.buildPool(settings)).map((f) => f.key);
    // CURRENT BEHAVIOUR (possible bug): hasAdditionRegroupingCore treats any sum of 10 as
    // non-regrouping, so "no regrouping" easy pools include 1+9 .. 5+5 even though 5+5 carries.
    for (const key of ["addition:1+9", "addition:2+8", "addition:3+7", "addition:4+6", "addition:5+5"]) {
      assert.ok(keys.includes(key), key);
    }
    assert.ok(!keys.includes("addition:6+5"));
  });

  test("invalid difficulty list falls back to additionDifficulty, then easy", () => {
    const app = loadApp();
    const medium = app.buildPool(
      settingsFor(app, { operation: "addition", additionDifficulties: ["bogus"], additionDifficulty: "medium" }),
    );
    assert.ok(app.harness.plain(medium).some((f) => f.b >= 10));
    const fallback = app.buildPool(
      settingsFor(app, { operation: "addition", additionDifficulties: null, additionDifficulty: "nope" }),
    );
    assert.ok(app.harness.plain(fallback).every((f) => f.a <= 9 && f.b <= 9));
  });

  test("same seed produces the same pool", () => {
    const settingsOf = (app) => settingsFor(app, { operation: "addition", additionDifficulties: ["hard"] });
    const first = loadApp({ random: 42 });
    const second = loadApp({ random: 42 });
    assert.deepStrictEqual(
      first.harness.plain(first.buildPool(settingsOf(first))),
      second.harness.plain(second.buildPool(settingsOf(second))),
    );
  });
});

describe("subtraction pools", () => {
  const BUCKETS = { easy: [[1, 1]], medium: [[2, 1], [2, 2]], hard: [[3, 1], [3, 2], [3, 3]] };
  const cases = [
    { difficulties: ["easy"], size: 55 }, // every left >= right pair over 0..9
    { difficulties: ["medium"], size: 120 },
    { difficulties: ["hard"], size: 120 },
    { difficulties: ["easy", "hard"], size: 120 },
  ];
  for (const { difficulties, size } of cases) {
    test(difficulties.join("+"), () => {
      const app = loadApp();
      const settings = settingsFor(app, { operation: "subtraction", subtractionDifficulties: difficulties });
      const pool = assertPoolInvariants(app, app.buildSubtractionPool(settings), "subtraction");
      assert.equal(pool.length, size);
      const allowed = difficulties.flatMap((d) => BUCKETS[d]).map((pair) => pair.join("-"));
      for (const fact of pool) {
        assert.ok(fact.a >= fact.b, `minuend >= subtrahend: ${fact.key}`);
        assert.ok(allowed.includes(digitPair(fact.a, fact.b).join("-")), `digit bucket for ${fact.key}`);
      }
    });
  }
});

describe("buildPool dispatch", () => {
  test("unknown operation returns an empty pool", () => {
    const app = loadApp();
    assert.equal(app.buildPool(settingsFor(app, { operation: "exponent" })).length, 0);
  });
});

describe("fact-key round trips", () => {
  const cases = [
    ["addition", 7, 25],
    ["subtraction", 45, 7],
    ["multiplication", 12, 3],
    ["multiplication", -4, 6],
    ["multiplication", -4, -6],
    ["division", 132, 12],
  ];
  for (const [operation, left, right] of cases) {
    test(`${operation} ${left},${right}`, () => {
      const app = loadApp();
      const fact = app.harness.plain(app.createFact(operation, left, right));
      assert.deepStrictEqual(app.harness.plain(app.parseFactKeyCore(fact.key)), {
        operation,
        left: fact.a,
        right: fact.b,
      });
      assert.equal(app.inferOperationFromFactKey(fact.key), operation);
      assert.equal(app.inferOperationFromFactKeyRaw(fact.key), operation);
      assert.equal(app.inferSymbolFromFactKey(fact.key), fact.symbol);
    });
  }

  test("parseFactKeyCore handles legacy, malformed and non-string keys", () => {
    const app = loadApp();
    const parse = (key) => app.harness.plain(app.parseFactKeyCore(key));
    assert.deepStrictEqual(parse("3x4"), { operation: "multiplication", left: 3, right: 4 });
    assert.deepStrictEqual(parse("-3x4"), { operation: "multiplication", left: -3, right: 4 });
    assert.deepStrictEqual(parse("nonsense"), { operation: "multiplication", left: 0, right: 0 });
    assert.deepStrictEqual(parse(undefined), { operation: "multiplication", left: 0, right: 0 });
    // The symbol is not checked against the operation name.
    assert.deepStrictEqual(parse("addition:3x4"), { operation: "addition", left: 3, right: 4 });
    // Upper-case operation names match the /i regex but are not in OPERATION_OPTIONS.
    assert.deepStrictEqual(parse("ADDITION:3+4"), { operation: "multiplication", left: 3, right: 4 });
  });

  test("operation inference defaults to multiplication", () => {
    const app = loadApp();
    for (const key of ["3x4", "multiplication:3x4", "", null, 12, "Addition:1+2"]) {
      assert.equal(app.inferOperationFromFactKey(key), "multiplication", String(key));
      assert.equal(app.inferOperationFromFactKeyRaw(key), "multiplication", String(key));
    }
    assert.equal(app.inferSymbolFromFactKey("division:12/3"), "÷");
    assert.equal(app.inferSymbolFromFactKey("3x4"), "x");
  });
});

describe("addition / subtraction skill helpers", () => {
  test("hasAdditionRegroupingCore", () => {
    const app = loadApp();
    const cases = [
      [0, 0, false],
      [2, 3, false],
      [6, 5, true],
      [12, 34, false],
      [15, 25, true],
      [95, 5, true],
      [45, 55, true],
      [120, 305, false],
      [190, 10, true],
      [-5, -7, true], // magnitudes are used column-wise
      // CURRENT BEHAVIOUR (possible bug): any pair summing to exactly 10 reports no regrouping,
      // although 5+5, 3+7 and 1+9 do carry into the tens column.
      [5, 5, false],
      [3, 7, false],
      [1, 9, false],
    ];
    for (const [left, right, expected] of cases) {
      assert.equal(app.hasAdditionRegroupingCore(left, right), expected, `${left}+${right}`);
    }
  });

  test("getDigitCount", () => {
    const app = loadApp();
    const cases = [[0, 1], [7, 1], [10, 2], [99, 2], [100, 3], [-45, 2], [12.9, 2], ["305", 3], ["abc", 1], [null, 1]];
    for (const [value, expected] of cases) {
      assert.equal(app.getDigitCount(value), expected, String(value));
    }
  });

  test("getAdditionLearningSkillKey", () => {
    const app = loadApp();
    const cases = [
      [3, 7, "make-10"],
      [10, 0, "make-10"],
      [5, 5, "make-10"],
      [4, 5, "1-1"],
      [7, 25, "1-2"],
      [25, 7, "1-2"],
      [30, 45, "2-2"],
      [5, 123, "1-3"],
      [45, 123, "2-3"],
      [123, 456, "3-3"],
      [1000, 1, "3-3"], // unknown "1-4" bucket falls back to 3-3
    ];
    for (const [left, right, expected] of cases) {
      assert.equal(app.getAdditionLearningSkillKey(left, right), expected, `${left}+${right}`);
    }
  });

  test("getSubtractionLearningSkillKey", () => {
    const app = loadApp();
    const cases = [
      [8, 3, "1-1"],
      [45, 7, "2-1"],
      [45, 23, "2-2"],
      [345, 7, "3-1"],
      [345, 23, "3-2"],
      [345, 123, "3-3"],
      [1000, 5, "3-3"],
      // CURRENT BEHAVIOUR (possible bug): a smaller-digit minuend ("1-2") is not a known bucket
      // and is lumped into "3-3". Pools never generate this (left >= right), so it is latent.
      [7, 45, "3-3"],
    ];
    for (const [left, right, expected] of cases) {
      assert.equal(app.getSubtractionLearningSkillKey(left, right), expected, `${left}-${right}`);
    }
  });

  test("getLearningSkillKey per operation", () => {
    const app = loadApp();
    const cases = [
      [{ operation: "addition", a: 3, b: 7 }, "make-10"],
      [{ operation: "addition", left: 25, right: 7 }, "1-2"],
      [{ operation: "subtraction", a: 45, b: 7 }, "2-1"],
      [{ operation: "division", a: 56, b: 7 }, "d7"],
      [{ operation: "division", a: 5, b: 0 }, "d1"],
      [{ operation: "division", a: 300, b: 20 }, "d12"],
      [{ operation: "multiplication", a: -3, b: 8 }, "x8"],
      [{ operation: "multiplication", a: 3, b: 15 }, "x12"],
      [{ operation: "multiplication", a: 0, b: 0 }, "x1"],
      [{ a: 4, b: 6 }, "x6"],
      [{ left: 9, right: 2 }, "x9"],
    ];
    for (const [question, expected] of cases) {
      assert.equal(app.getLearningSkillKey(question), expected, JSON.stringify(question));
    }
  });
});

describe("getDifficultyBandForQuestion", () => {
  test("multiplication bands by the larger magnitude", () => {
    const app = loadApp();
    const cases = [
      [{ operation: "multiplication", a: 3, b: 5 }, "easy"],
      [{ operation: "multiplication", a: 2, b: 6 }, "medium"],
      [{ operation: "multiplication", a: 10, b: 10 }, "medium"],
      [{ operation: "multiplication", a: 2, b: 11 }, "hard"],
      [{ operation: "multiplication", a: -12, b: 2 }, "hard"],
      [{ operation: "multiplication", left: 4, right: 4 }, "easy"],
    ];
    for (const [question, expected] of cases) {
      assert.equal(app.getDifficultyBandForQuestion(question), expected, JSON.stringify(question));
    }
  });

  test("division bands by max(dividend, divisor)", () => {
    const app = loadApp();
    // CURRENT BEHAVIOUR (possible bug): for division `a` is the dividend, so the band is driven
    // by the dividend rather than the divisor/quotient. 12 / 2 (a 2-times-table fact) is "hard".
    assert.equal(app.getDifficultyBandForQuestion({ operation: "division", a: 4, b: 2 }), "easy");
    assert.equal(app.getDifficultyBandForQuestion({ operation: "division", a: 10, b: 2 }), "medium");
    assert.equal(app.getDifficultyBandForQuestion({ operation: "division", a: 12, b: 2 }), "hard");
    assert.equal(app.getDifficultyBandForQuestion({ operation: "division", a: 132, b: 12 }), "hard");
  });

  test("addition / subtraction read the current settings, not the question", () => {
    const app = loadApp();
    assert.equal(app.state.settings, null);
    assert.equal(app.getDifficultyBandForQuestion({ operation: "addition", a: 500, b: 400 }), "easy");
    app.state.settings = settingsFor(app, { additionDifficulty: "hard", subtractionDifficulty: "medium" });
    assert.equal(app.getDifficultyBandForQuestion({ operation: "addition", a: 1, b: 1 }), "hard");
    assert.equal(app.getDifficultyBandForQuestion({ operation: "subtraction", a: 1, b: 1 }), "medium");
  });

  test("missing question uses settings operation; unknown operation is standard", () => {
    const app = loadApp();
    assert.equal(app.getDifficultyBandForQuestion(null), "easy");
    app.state.settings = settingsFor(app, { operation: "addition", additionDifficulty: "medium" });
    assert.equal(app.getDifficultyBandForQuestion(undefined), "medium");
    assert.equal(app.getDifficultyBandForQuestion({ operation: "exponent", a: 2, b: 3 }), "standard");
  });
});

describe("randomiseDisplay", () => {
  test("subtraction and division keep a/b order", () => {
    const app = loadApp();
    for (const fact of [app.createFact("subtraction", 9, 4), app.createFact("division", 56, 7)]) {
      for (let i = 0; i < 10; i += 1) {
        const shown = app.harness.plain(app.randomiseDisplay(fact));
        assert.equal(shown.left, fact.a);
        assert.equal(shown.right, fact.b);
      }
    }
  });

  test("commutative facts swap by Math.random > 0.5 and keep the same answer", () => {
    const app = loadApp();
    const fact = app.harness.plain(app.createFact("multiplication", 3, 8));
    app.harness.setRandom(() => 0.4);
    assert.deepStrictEqual(app.harness.plain(app.randomiseDisplay(fact)), { ...fact, left: 3, right: 8 });
    app.harness.setRandom(() => 0.5);
    assert.deepStrictEqual(app.harness.plain(app.randomiseDisplay(fact)), { ...fact, left: 3, right: 8 });
    app.harness.setRandom(() => 0.51);
    assert.deepStrictEqual(app.harness.plain(app.randomiseDisplay(fact)), { ...fact, left: 8, right: 3 });
  });

  test("seeded display: both orders occur and displayed operands still give the answer", () => {
    const app = loadApp({ random: 7 });
    const orders = new Set();
    for (const fact of [app.createFact("addition", 4, 9), app.createFact("multiplication", -3, 7)]) {
      for (let i = 0; i < 20; i += 1) {
        const shown = app.harness.plain(app.randomiseDisplay(fact));
        assert.equal(app.evaluateFactAnswer(shown.operation, shown.left, shown.right), shown.answer);
        assert.equal(shown.key, fact.key);
        orders.add(`${fact.operation}:${shown.left}`);
      }
    }
    assert.equal(orders.size, 4, "each fact was shown in both orders");
  });
});

describe("pickQuestion", () => {
  function setup(seed, overrides = {}) {
    const app = loadApp({ random: seed });
    app.state.settings = settingsFor(app, { operation: "multiplication", minFactor: 2, maxFactor: 4, ...overrides });
    return app;
  }

  test("returns null when the pool is empty", () => {
    const app = setup(1, { operation: "exponent" });
    assert.equal(app.pickQuestion(), null);
  });

  test("builds from settings when questionPool is empty; deterministic for a seed", () => {
    const pick = (seed) => {
      const app = setup(seed);
      return Array.from({ length: 5 }, () => app.harness.plain(app.pickQuestion()).key);
    };
    assert.deepStrictEqual(pick(3), pick(3));
    const app = setup(3);
    const keys = new Set(app.harness.plain(app.buildPool(app.state.settings)).map((f) => f.key));
    for (const key of pick(3)) assert.ok(keys.has(key), key);
  });

  test("never repeats lastQuestionKey when the pool has more than one fact", () => {
    const app = setup(11);
    app.state.questionPool = app.buildPool(app.state.settings);
    for (let i = 0; i < 50; i += 1) {
      const question = app.pickQuestion();
      assert.notEqual(question.key, app.state.lastQuestionKey);
      assert.equal(question.left * question.right, question.answer);
      app.state.lastQuestionKey = question.key;
    }
  });

  test("a single-fact pool is returned even if it was the last question", () => {
    const app = setup(1);
    app.state.questionPool = [app.createFact("multiplication", 6, 7)];
    app.state.lastQuestionKey = "multiplication:6x7";
    assert.equal(app.pickQuestion().key, "multiplication:6x7");
  });

  test("adaptive weighting favours missed facts; non-adaptive is uniform", () => {
    // Pool: 2x2 (missed 5 times) and 3x3 (mastered). Random 0.5 lands in the heavier fact.
    const run = (adaptiveMode) => {
      const app = setup(1, { adaptiveMode });
      app.state.questionPool = [app.createFact("multiplication", 3, 3), app.createFact("multiplication", 2, 2)];
      app.state.progress.facts["multiplication:3x3"] = { attempts: 10, correct: 10, misses: 0, currentStreak: 10 };
      app.state.progress.facts["multiplication:2x2"] = { attempts: 10, correct: 5, misses: 5, currentStreak: 0 };
      app.harness.setRandom(() => 0.4);
      return app.pickQuestion().key;
    };
    // adaptive weights: 3x3 = 1, 2x2 = 1 + 15 + 0 + 3 + 2 = 21 -> target 0.4*22 = 8.8 picks 2x2
    assert.equal(run(true), "multiplication:2x2");
    // uniform weights: target 0.4*2 = 0.8 -> first fact
    assert.equal(run(false), "multiplication:3x3");
  });
});
