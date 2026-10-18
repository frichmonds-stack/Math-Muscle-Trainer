"use strict";

// Entry point for `node --test tests/`.
// Node 22 treats a directory argument to --test as a module path and resolves it
// to this index.js, so this file loads every *.test.js file in this folder.
// (`node --test tests/*.test.js` also works and runs each file in its own process.)

const fs = require("node:fs");
const path = require("node:path");

for (const file of fs.readdirSync(__dirname).filter((name) => name.endsWith(".test.js")).sort()) {
  require(path.join(__dirname, file));
}
