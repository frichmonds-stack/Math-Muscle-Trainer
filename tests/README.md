# Unit tests

Dependency-free unit tests for the app's logic. They load the **real, unmodified**
`js/*.js` classic scripts into an isolated Node `vm` context with a small fake
browser, so tests can call the app's global functions directly.

Requires Node 22+. No npm install, no packages: only `node:test`, `node:assert`
and `node:vm`.

## Run

From the repo root:

```sh
node --test tests/
```

`tests/index.js` is the entry point for that command (Node 22 resolves a directory
argument to its `index.js`) and loads every `tests/*.test.js` file in one process.
To run each file in its own process, or a single file:

```sh
node --test tests/*.test.js
node --test tests/harness.test.js
```

Load a different checkout (for example a temp copy) with `APP_ROOT`:

```sh
APP_ROOT=/path/to/other/copy node --test tests/
```

## Write a test

Create `tests/<area>.test.js`:

```js
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadApp } = require("./harness");

test("parseFactKeyCore reads modern addition keys", () => {
  const app = loadApp();
  const parsed = app.parseFactKeyCore("addition:3+4");
  assert.deepEqual(app.harness.plain(parsed), { operation: "addition", left: 3, right: 4 });
});
```

Call `loadApp()` inside each test (or a `beforeEach`) so tests never share state.
Loading takes roughly 50-150 ms.

### Tests describe CURRENT behaviour

These are characterisation tests: they pin down what the app does **today**, so a
refactor that changes behaviour is caught. If a test reveals something surprising
or apparently wrong, assert the current behaviour, add a comment, and report it to
the owner. Do not "fix" the expectation to what you think it should be, and do not
change app code from a test task.

## `loadApp(options)`

Returns an `app` object. Every name declared at column 0 of a loaded script
(`function`, `async function`, `const`, `let`, `var`, `class`) is a property of
`app`, e.g. `app.loadProgress`, `app.state`, `app.elements`, `app.STORAGE_KEY`.
These are live getters (and setters for `let`/`var`), so `app.state` is the same
object the app's own functions mutate.

| Option | Default | Meaning |
|---|---|---|
| `now` | `"2026-01-15T12:00:00.000Z"` | Fixed clock start: `Date`, epoch ms, or date string. `new Date()`, `Date.now()` and `performance.now()` follow the fake clock. |
| `random` | seed `1` | Numeric seed for a deterministic `Math.random`, or a `() => number` function. |
| `localStorage` | `{}` | Initial entries. Non-string values are `JSON.stringify`'d, so you can pass objects. |
| `sessionStorage` | `{}` | Same rules as `localStorage`. |
| `includeInit` | `false` | Also run `js/app-init.js` (binds events and calls `initialise()`, which renders everything into the fake DOM). |
| `includeDebug` | `false` | Also run `js/app-debug.js`. |
| `scripts` | from `index.html` | Explicit list of script paths relative to the app root (skips discovery and the init/debug filters). |
| `appRoot` | `$APP_ROOT` or this repo | Checkout to load `index.html` and scripts from. |
| `html` | the app's `index.html` | HTML used to build the fake DOM. |
| `url` | `http://localhost/index.html` | `location.href` (e.g. `"...?debug=1"`). |
| `matchMedia` | nothing matches | `true`/`false`, an object `{ "(pointer: coarse)": true }`, or `(query) => boolean`. |
| `confirm` | `false` | Return value of `window.confirm()`. |
| `window` | `{}` | Extra properties put on the global/window before the scripts run. |

Scripts are discovered from the `<script src="...">` tags in `index.html`, in
order, so splitting a JS file later needs no harness change. `app-init.js` and
`app-debug.js` are excluded by default (matched by file name).

### `app.harness`

| Member | Use |
|---|---|
| `clock.now()`, `clock.set(when)`, `clock.advance(ms)` | Read or move the fake clock. `advance` fires due timers in order. |
| `clock.runAll()`, `clock.pendingTimers()`, `clock.clearAllTimers()` | `setTimeout`/`setInterval`/`requestAnimationFrame` never fire on their own. |
| `setRandom(seedOrFn)` | Re-seed or replace `Math.random`. |
| `localStorage`, `sessionStorage` | The fake stores (`getItem`, `setItem`, `toJSON()` snapshot, ...). |
| `document`, `window`, `context` | The fake DOM document and the vm global. |
| `evaluate(code)` | Run code inside the app context, e.g. `evaluate("Math.random()")`. |
| `plain(value)` | Deep-copy an app value into the test realm (see below). |
| `dialogs` | Calls to `alert`/`confirm`/`prompt`, as `{ type, message }`. |
| `windowListeners` | `window.addEventListener` registrations (`listenerCount(type)`). |
| `scripts`, `names`, `appRoot` | What was loaded and exposed. |

### Cross-realm values: use `plain()`

The app runs in its own `vm` realm, so its arrays and objects have different
prototypes from the test file's literals. `assert.deepStrictEqual(appValue, {...})`
fails with "same structure but not reference-equal". Wrap the app value:
`assert.deepStrictEqual(app.harness.plain(appValue), {...})`. `plain()` uses
`structuredClone`, so values containing functions cannot be copied. Primitive
comparisons and `Array.isArray` are unaffected.

### Time zone

`tests/harness.js` sets `process.env.TZ = "UTC"` when `TZ` is not already set, so
local-date helpers (`getTodayDateKey`, `formatDateKey`) are stable on any machine.
Set `TZ` yourself to test another zone (it applies to the whole test process).

## The fake DOM (`tests/fake-dom.js`)

Built by parsing the app's `index.html` into a real tree, so `getElementById`,
`querySelector(All)`, `closest` and `matches` return the elements that actually
exist (and `null` where the browser would also return `null`).

Supports: element classes per tag (`HTMLInputElement`, `HTMLSelectElement`,
`HTMLButtonElement`, `HTMLDialogElement`, ...) so `instanceof` checks behave;
`classList`, `dataset`, `style` (`setProperty`/`removeProperty`), attributes,
`textContent`, `value`/`checked`/`disabled`/`hidden`, tree editing (`append`,
`appendChild`, `replaceChildren`, `remove`, ...), event listeners with bubbling,
`click()`, `focus()`, `showModal()`/`close()`; selectors with tag, `#id`,
`.class`, attribute operators, `:checked`, `:disabled`, `:not(...)`, descendant
and `>` combinators, and comma lists. Unsupported selectors throw.

Known limits:

- `innerHTML` is stored as a string and **not parsed**: elements rendered via
  `innerHTML` cannot be queried. Assert on the string, or on state, instead.
- No layout or CSS: sizes and rects are `0`, `getComputedStyle` returns the
  inline style object, `matchMedia` returns the configured answer.
- `<select>.value` is an explicit value once set; it does not validate against options.
- Timers are fake and manual; `queueMicrotask`/promises are real.
- Only column-0 declarations are exposed; destructuring declarations
  (`const { a } = ...`) are not scanned. Use `harness.evaluate("a")` for those.
- With `includeInit: false`, functions declared in `app-init.js` (e.g.
  `initialise`, `openOptionsDialog`) do not exist; they are currently not called
  from the other files.
