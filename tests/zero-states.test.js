"use strict";

// Tests for the new-user zero states (hasTrainingHistory / renderZeroStates, TASK-UI-001).

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { loadApp } = require("./harness");

const FIXTURE = require(path.join(__dirname, "..", "tools", "visual-check", "fixtures", "populated-progress.json"));
const KEY = "math-muscle-trainer-progress-v2";

function zeroStateSections(app) {
  return Array.from(app.harness.document.querySelectorAll("[data-zero-state]"));
}

test("hasTrainingHistory is false for a fresh profile", () => {
  const app = loadApp();
  assert.equal(app.hasTrainingHistory(), false);
});

test("hasTrainingHistory is true once a fact has an attempt, even without a saved workout", () => {
  const app = loadApp();
  const progress = app.defaultProgress();
  progress.facts["addition:3+4"] = { attempts: 1, correct: 1 };
  assert.equal(app.hasTrainingHistory(progress), true);
});

test("hasTrainingHistory is true for saved populated progress", () => {
  const app = loadApp({ now: FIXTURE.fixedNow, localStorage: { [KEY]: FIXTURE.progress } });
  assert.equal(app.hasTrainingHistory(), true);
});

test("renderZeroStates marks every zero-state section for a new user", () => {
  const app = loadApp();
  const sections = zeroStateSections(app);
  assert.equal(sections.length, 5);
  app.renderZeroStates();
  assert.ok(sections.every((section) => section.classList.contains("is-zero-state")));
});

test("renderZeroStates clears the zero state once history exists", () => {
  const app = loadApp({ now: FIXTURE.fixedNow, localStorage: { [KEY]: FIXTURE.progress } });
  app.renderZeroStates();
  assert.ok(zeroStateSections(app).every((section) => !section.classList.contains("is-zero-state")));
});
