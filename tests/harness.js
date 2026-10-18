"use strict";

// Dependency-free harness that loads the app's REAL classic scripts (unmodified)
// into an isolated Node `vm` context with a fake browser environment, so that
// `node --test tests/` can call the app's global functions directly.
//
//   const { loadApp } = require("./harness");
//   const app = loadApp({ now: "2026-03-15T12:00:00Z", localStorage: { ... } });
//   app.getTodayDateKey(); // "2026-03-15"
//
// See tests/README.md for the full option list and the known limits.

// Make local-time date maths deterministic. node:test runs each test file in its
// own process, so this only affects the test process. An explicit TZ wins.
if (!process.env.TZ) {
  process.env.TZ = "UTC";
}

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const dom = require("./fake-dom");

const DEFAULT_APP_ROOT = path.resolve(__dirname, "..");
const DEFAULT_NOW = "2026-01-15T12:00:00.000Z";
const DEFAULT_SEED = 1;
const INIT_SCRIPT_PATTERN = /(^|\/)app-init\.js$/;
const DEBUG_SCRIPT_PATTERN = /(^|\/)app-debug\.js$/;

function resolveAppRoot(appRoot) {
  return path.resolve(appRoot || process.env.APP_ROOT || DEFAULT_APP_ROOT);
}

/** Ordered local script paths (relative to app root) from index.html <script src> tags. */
function discoverScripts(html) {
  const scripts = [];
  const pattern = /<script\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)')[^>]*>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const src = (match[1] || match[2]).split(/[?#]/)[0];
    if (/^([a-z]+:)?\/\//i.test(src)) {
      continue; // external CDN etc. - not part of the app source
    }
    scripts.push(src.replace(/^\.\//, ""));
  }
  return scripts;
}

/**
 * Names declared at column 0 of a classic script: `function NAME`, `async function NAME`,
 * `const NAME`, `let NAME`, `var NAME`, `class NAME`. Destructuring declarations are not scanned.
 */
function scanTopLevelNames(source) {
  const names = [];
  const pattern = /^(?:(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)|(const|let|var|class)\s+([A-Za-z_$][\w$]*))/gm;
  let match;
  while ((match = pattern.exec(source))) {
    if (match[1]) names.push({ name: match[1], kind: "function" });
    else names.push({ name: match[3], kind: match[2] });
  }
  return names;
}

// Deterministic PRNG (mulberry32) so seeded Math.random is reproducible.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toRandom(random) {
  if (typeof random === "function") return random;
  if (random === undefined || random === null) return mulberry32(DEFAULT_SEED);
  if (typeof random === "number" && Number.isFinite(random)) return mulberry32(random);
  throw new TypeError("loadApp: `random` must be a numeric seed or a function returning [0, 1)");
}

function toMs(now) {
  if (now === undefined || now === null) return Date.parse(DEFAULT_NOW);
  if (now instanceof Date) return now.getTime();
  if (typeof now === "number") return now;
  if (typeof now === "string") {
    const ms = Date.parse(now);
    if (Number.isNaN(ms)) throw new TypeError(`loadApp: cannot parse now="${now}"`);
    return ms;
  }
  // Date from another realm (e.g. created inside an app context)
  if (now && typeof now.getTime === "function") return now.getTime();
  throw new TypeError("loadApp: `now` must be a Date, epoch ms number or date string");
}

/** Fake clock + timer queue. Timers never fire on their own; advance the clock. */
function createClock(startMs) {
  let nowMs = startMs;
  let nextId = 1;
  const timers = new Map(); // id -> { due, fn, args, interval }

  function schedule(fn, delay, args, interval) {
    const id = nextId++;
    const ms = Math.max(0, Number(delay) || 0);
    timers.set(id, { id, due: nowMs + ms, fn, args, interval: interval ? Math.max(1, ms) : null });
    return id;
  }

  function nextDue(limitMs) {
    let best = null;
    for (const timer of timers.values()) {
      if (timer.due <= limitMs && (!best || timer.due < best.due || (timer.due === best.due && timer.id < best.id))) {
        best = timer;
      }
    }
    return best;
  }

  function fire(timer) {
    nowMs = Math.max(nowMs, timer.due);
    if (timer.interval) timer.due += timer.interval;
    else timers.delete(timer.id);
    if (typeof timer.fn === "function") timer.fn(...timer.args);
  }

  const clock = {
    now: () => nowMs,
    set(value) {
      nowMs = toMs(value);
    },
    /** Move time forward, firing due timers in order. */
    advance(ms) {
      const target = nowMs + Math.max(0, Number(ms) || 0);
      let guard = 0;
      for (let timer = nextDue(target); timer; timer = nextDue(target)) {
        if (++guard > 100000) throw new Error("harness clock: too many timer firings (runaway interval?)");
        fire(timer);
      }
      nowMs = target;
    },
    /** Fire every pending timeout (intervals included) until none remain, up to `limit` firings. */
    runAll(limit = 1000) {
      for (let count = 0; timers.size; count += 1) {
        if (count >= limit) throw new Error(`harness clock: runAll exceeded ${limit} firings`);
        fire(nextDue(Infinity));
      }
    },
    pendingTimers: () => timers.size,
    clearAllTimers: () => timers.clear(),
    setTimeout: (fn, delay, ...args) => schedule(fn, delay, args, false),
    setInterval: (fn, delay, ...args) => schedule(fn, delay, args, true),
    clearTimeout: (id) => {
      timers.delete(id);
    },
    // rAF fires after ~one frame (16ms) with a performance.now()-style timestamp.
    requestAnimationFrame: (fn) => schedule(() => fn(nowMs - startMs), 16, [], false),
  };
  clock.clearInterval = clock.clearTimeout;
  clock.cancelAnimationFrame = clock.clearTimeout;
  return clock;
}

function createMatchMedia(option) {
  return function matchMedia(query) {
    let matches = false;
    if (typeof option === "function") matches = Boolean(option(query));
    else if (option && typeof option === "object") matches = Boolean(option[query]);
    else if (typeof option === "boolean") matches = option;
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent() {
        return true;
      },
    };
  };
}

function createLocation(url) {
  const parsed = new URL(url);
  const location = {
    get href() { return parsed.href; },
    set href(value) { parsed.href = new URL(value, parsed.href).href; },
    get origin() { return parsed.origin; },
    get protocol() { return parsed.protocol; },
    get host() { return parsed.host; },
    get hostname() { return parsed.hostname; },
    get port() { return parsed.port; },
    get pathname() { return parsed.pathname; },
    get search() { return parsed.search; },
    set search(value) { parsed.search = value; },
    get hash() { return parsed.hash; },
    set hash(value) { parsed.hash = value; },
    assign(value) { location.href = value; },
    replace(value) { location.href = value; },
    reload() {},
    toString() { return parsed.href; },
  };
  return location;
}

// Runs inside the vm context before any app script: installs the fake Date and
// seeded Math.random using the context's own intrinsics.
const PRELUDE = `
(function installHarnessPrelude(H) {
  const RealDate = Date;
  function HarnessDate(...args) {
    if (!new.target) {
      return new RealDate(H.now()).toString();
    }
    return args.length === 0
      ? Reflect.construct(RealDate, [H.now()], new.target)
      : Reflect.construct(RealDate, args, new.target);
  }
  HarnessDate.prototype = RealDate.prototype;
  Object.defineProperty(RealDate.prototype, "constructor", { value: HarnessDate, writable: true, configurable: true });
  HarnessDate.now = () => H.now();
  HarnessDate.parse = RealDate.parse;
  HarnessDate.UTC = RealDate.UTC;
  globalThis.Date = HarnessDate;
  Math.random = () => H.random();
  globalThis.window = globalThis;
  globalThis.self = globalThis;
})(__harnessBridge);
`;

/**
 * Load the app into a fresh, isolated context.
 *
 * @param {object} [options]
 * @param {object} [options.localStorage]   initial entries; non-string values are JSON.stringify'd
 * @param {object} [options.sessionStorage] initial entries, same rules
 * @param {Date|number|string} [options.now] fixed clock start (default 2026-01-15T12:00:00Z)
 * @param {number|function} [options.random] seed for Math.random (default 1) or a () => [0,1) function
 * @param {boolean} [options.includeInit=false]  also run app-init.js (binds events, calls initialise())
 * @param {boolean} [options.includeDebug=false] also run app-debug.js
 * @param {string[]} [options.scripts]  explicit script list (relative to app root); overrides discovery
 * @param {string} [options.appRoot]    repo root to load from (default: env APP_ROOT, else this repo)
 * @param {string} [options.html]       HTML for the fake DOM (default: the app's index.html)
 * @param {string} [options.url]        location.href (default http://localhost/index.html)
 * @param {boolean|object|function} [options.matchMedia] media query results (default: nothing matches)
 * @param {boolean} [options.confirm=false] value returned by window.confirm()
 * @param {object} [options.window]     extra properties merged onto the fake window before loading
 */
function loadApp(options = {}) {
  const appRoot = resolveAppRoot(options.appRoot);
  const indexPath = path.join(appRoot, "index.html");
  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const html = options.html ?? indexHtml;

  let scripts = options.scripts ? [...options.scripts] : discoverScripts(indexHtml);
  if (!options.scripts) {
    scripts = scripts.filter((src) => {
      if (!options.includeInit && INIT_SCRIPT_PATTERN.test(src)) return false;
      if (!options.includeDebug && DEBUG_SCRIPT_PATTERN.test(src)) return false;
      return true;
    });
  }
  if (!scripts.length) {
    throw new Error(`loadApp: no <script src> tags found in ${indexPath}`);
  }

  const startMs = toMs(options.now);
  const clock = createClock(startMs);
  let random = toRandom(options.random);
  const document = dom.createDocument(html);
  const localStorage = new dom.FakeStorage(options.localStorage);
  const sessionStorage = new dom.FakeStorage(options.sessionStorage);
  const dialogs = [];
  const windowListeners = new dom.FakeEventTarget();

  const sandbox = {
    __harnessBridge: { now: () => clock.now(), random: () => random() },
    document,
    localStorage,
    sessionStorage,
    navigator: { userAgent: "math-muscle-trainer-test-harness", language: "en", languages: ["en"], maxTouchPoints: 0, onLine: true },
    location: createLocation(options.url || "http://localhost/index.html"),
    history: {
      length: 1,
      state: null,
      pushState(state, title, url) { this.state = state; if (url) sandbox.location.href = url; },
      replaceState(state, title, url) { this.state = state; if (url) sandbox.location.href = url; },
      back() {},
      forward() {},
      go() {},
    },
    screen: { width: 1024, height: 768, availWidth: 1024, availHeight: 768 },
    innerWidth: 1024,
    innerHeight: 768,
    outerWidth: 1024,
    outerHeight: 768,
    devicePixelRatio: 1,
    scrollX: 0,
    scrollY: 0,
    pageXOffset: 0,
    pageYOffset: 0,
    matchMedia: createMatchMedia(options.matchMedia),
    getComputedStyle: (element) => element?.style || {},
    scrollTo() {},
    scrollBy() {},
    focus() {},
    blur() {},
    addEventListener: (type, listener) => windowListeners.addEventListener(type, listener),
    removeEventListener: (type, listener) => windowListeners.removeEventListener(type, listener),
    dispatchEvent: (event) => windowListeners.dispatchEvent(event),
    alert: (message) => {
      dialogs.push({ type: "alert", message: String(message) });
    },
    confirm: (message) => {
      dialogs.push({ type: "confirm", message: String(message) });
      return Boolean(options.confirm);
    },
    prompt: (message, defaultValue) => {
      dialogs.push({ type: "prompt", message: String(message) });
      return options.prompt ?? defaultValue ?? null;
    },
    setTimeout: clock.setTimeout,
    clearTimeout: clock.clearTimeout,
    setInterval: clock.setInterval,
    clearInterval: clock.clearInterval,
    requestAnimationFrame: clock.requestAnimationFrame,
    cancelAnimationFrame: clock.cancelAnimationFrame,
    requestIdleCallback: (fn) => clock.setTimeout(() => fn({ didTimeout: false, timeRemaining: () => 50 }), 1),
    cancelIdleCallback: clock.clearTimeout,
    queueMicrotask,
    performance: { now: () => clock.now() - startMs, mark() {}, measure() {}, getEntriesByName: () => [] },
    console,
    URL,
    URLSearchParams,
    TextEncoder,
    TextDecoder,
    structuredClone,
    Event: dom.FakeEvent,
    CustomEvent: dom.FakeCustomEvent,
    EventTarget: dom.FakeEventTarget,
    Node: dom.FakeNode,
    Text: dom.FakeText,
    Element: dom.FakeElement,
    HTMLElement: dom.FakeHTMLElement,
    HTMLInputElement: dom.FakeHTMLInputElement,
    HTMLTextAreaElement: dom.FakeHTMLTextAreaElement,
    HTMLButtonElement: dom.FakeHTMLButtonElement,
    HTMLSelectElement: dom.FakeHTMLSelectElement,
    HTMLOptionElement: dom.FakeHTMLOptionElement,
    HTMLDialogElement: dom.FakeHTMLDialogElement,
    HTMLCanvasElement: dom.FakeHTMLCanvasElement,
    HTMLFormElement: dom.FakeHTMLFormElement,
    HTMLTemplateElement: dom.FakeTemplateElement,
    DocumentFragment: dom.FakeDocumentFragment,
    Document: dom.FakeDocument,
    Storage: dom.FakeStorage,
    ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
    IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } },
    MutationObserver: class { observe() {} disconnect() {} takeRecords() { return []; } },
    ...(options.window || {}),
  };

  const context = vm.createContext(sandbox, { name: "math-muscle-trainer" });
  vm.runInContext(PRELUDE, context, { filename: "tests/harness.js#prelude" });

  const declared = [];
  for (const src of scripts) {
    const filename = path.join(appRoot, src);
    const source = fs.readFileSync(filename, "utf8");
    declared.push(...scanTopLevelNames(source));
    try {
      vm.runInContext(source, context, { filename });
    } catch (error) {
      error.message = `loadApp: ${src} threw while loading: ${error.message}`;
      throw error;
    }
  }

  // Top-level const/let/class live in the shared global lexical scope of the
  // context, not on the global object. A final trailer script (which shares that
  // scope) exposes live getters (and setters for let/var) for every scanned name.
  const unique = new Map();
  for (const entry of declared) unique.set(entry.name, entry.kind);
  const accessors = [...unique]
    .map(([name, kind]) => {
      const setter = kind === "let" || kind === "var" ? `, set: (v) => { ${name} = v; }` : "";
      return `  ${JSON.stringify(name)}: { get: () => ${name}${setter}, enumerable: true }`;
    })
    .join(",\n");
  const descriptors = vm.runInContext(`({\n${accessors}\n})`, context, {
    filename: "tests/harness.js#export-trailer",
  });

  const harness = {
    appRoot,
    scripts,
    context,
    document,
    window: context,
    localStorage,
    sessionStorage,
    clock,
    dialogs,
    windowListeners,
    names: [...unique.keys()],
    /** Re-seed (number) or replace (function) Math.random for subsequent calls. */
    setRandom(value) {
      random = toRandom(value);
    },
    /** Evaluate code inside the app context (can read/write top-level const/let). */
    evaluate(code) {
      return vm.runInContext(String(code), context, { filename: "tests/harness.js#evaluate" });
    },
    /** Deep-copy an app value into this realm so assert.deepStrictEqual works against literals. */
    plain(value) {
      return value === undefined ? undefined : structuredClone(value);
    },
  };

  const app = {};
  for (const [name, descriptor] of Object.entries(descriptors)) {
    Object.defineProperty(app, name, { ...descriptor, configurable: false });
  }
  if (Object.prototype.hasOwnProperty.call(app, "harness")) {
    throw new Error("loadApp: the app declares a global named `harness`, which collides with the harness API");
  }
  Object.defineProperty(app, "harness", { value: harness, enumerable: false });
  return app;
}

module.exports = {
  loadApp,
  discoverScripts,
  scanTopLevelNames,
  mulberry32,
  DEFAULT_APP_ROOT,
  DEFAULT_NOW,
};
