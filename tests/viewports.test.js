"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { VIEWPORTS } = require("../tools/visual-check/lib/viewports");

// The debug-mode size switcher and the visual-check tools must offer the same screen sizes,
// so what the owner previews is what the fit checker and screenshots test.
test("debug preview sizes match the visual-check viewports", () => {
  const appRoot = path.resolve(process.env.APP_ROOT || path.join(__dirname, ".."));
  const source = fs.readFileSync(path.join(appRoot, "js", "app-debug.js"), "utf8");
  const block = source.match(/const DEBUG_PREVIEW_SIZES = \[([\s\S]*?)\];/);
  assert.ok(block, "DEBUG_PREVIEW_SIZES not found in js/app-debug.js");
  const pattern = /\{ key: "([^"]+)", label: "([^"]+)", width: (\d+), height: (\d+), touch: (true|false) \}/g;
  const sizes = [...block[1].matchAll(pattern)].map(([, key, label, width, height, touch]) => ({
    key, label, width: Number(width), height: Number(height), touch: touch === "true",
  }));
  const expected = Object.entries(VIEWPORTS).map(([key, vp]) => ({
    key, label: vp.label, width: vp.width, height: vp.height, touch: vp.touch,
  }));
  assert.deepEqual(sizes, expected);
});
