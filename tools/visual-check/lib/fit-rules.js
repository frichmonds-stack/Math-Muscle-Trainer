"use strict";
// Fit rules for fit.js. measureFit runs inside the page (via page.evaluate), so it must be
// self-contained: no closures over this module.

const RULES = {
  "page-scroll": "The page itself scrolls: content does not fit the screen.",
  "inner-scroll": "A panel inside the page scrolls: its content does not fit.",
  "off-screen": "Content sits partly or fully outside the screen.",
  "cut-off": "Content is cut off by its container (hidden overflow or truncated text).",
  "small-target": "A touch target is too small for a finger (fail below 24px, WCAG 2.2 AA; warn below 44px).",
  "small-text": "Text is too small to read comfortably (fail below 10px; warn below 12px).",
};

// Each limit has a hard minimum (fail) and a comfortable size (warn). Touch targets are only
// checked on touch viewports.
const DEFAULT_LIMITS = { failTarget: 24, warnTarget: 44, failFont: 10, warnFont: 12 };

function measureFit({ touch, scope, failTarget, warnTarget, failFont, warnFont }) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const doc = document.documentElement;
  const issues = [];
  const add = (rule, el, detail, severity = "fail") =>
    issues.push({ rule, severity, element: el ? describe(el) : "page", detail });

  function describe(el) {
    let name = el.tagName.toLowerCase();
    if (el.id) name += `#${el.id}`;
    const classes = [...el.classList].slice(0, 2);
    if (classes.length) name += `.${classes.join(".")}`;
    const text = (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim();
    return text ? `${name} "${text.slice(0, 40)}${text.length > 40 ? "..." : ""}"` : name;
  }

  function isShown(el) {
    if (el.closest(".debug-panel, .debug-toggle, .debug-preview, [data-visual-check]")) return false;
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    const r = el.getBoundingClientRect();
    // Visually hidden helpers (sr-only and similar) are 1px boxes, and so are wrappers that hide a
    // control while keeping it in the accessibility tree.
    if (r.width <= 1 || r.height <= 1) return false;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const pr = p.getBoundingClientRect();
      if ((pr.width <= 1 || pr.height <= 1) && /(hidden|clip)/.test(getComputedStyle(p).overflow)) return false;
    }
    return true;
  }

  function hasOwnText(el) {
    return [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  }

  const TARGET_SELECTOR = [
    "button", "a[href]", "select", "textarea", "summary", "[role=button]", "[role=tab]",
    "input:not([type=hidden]):not([type=radio]):not([type=checkbox])",
    "label:has(input[type=radio])", "label:has(input[type=checkbox])",
  ].join(",");

  const pageScrolls = doc.scrollHeight > vh + 1;
  if (pageScrolls) add("page-scroll", null, `page is ${doc.scrollHeight}px tall on a ${vh}px screen`);
  if (doc.scrollWidth > vw + 1) add("page-scroll", null, `page is ${doc.scrollWidth}px wide on a ${vw}px screen`);

  const root = (scope && document.querySelector(scope)) || document.body;
  for (const el of root.querySelectorAll("*")) {
    if (!isShown(el)) continue;
    const style = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const isTarget = el.matches(TARGET_SELECTOR);
    const isContent = isTarget || hasOwnText(el);

    const scrollY = /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1;
    const scrollX = /(auto|scroll)/.test(style.overflowX) && el.scrollWidth > el.clientWidth + 1;
    if ((scrollY || scrollX) && el !== doc && el !== document.body) {
      add("inner-scroll", el, scrollY
        ? `content ${el.scrollHeight}px tall in a ${el.clientHeight}px panel`
        : `content ${el.scrollWidth}px wide in a ${el.clientWidth}px panel`);
    }

    if (!isContent) continue;

    // Below-the-fold content is already reported by page-scroll, so only check it when the page fits.
    const outX = r.left < -1 || r.right > vw + 1;
    const outY = !pageScrolls && (r.top < -1 || r.bottom > vh + 1);
    if (outX || outY) {
      add("off-screen", el, `box ${Math.round(r.left)},${Math.round(r.top)} to ${Math.round(r.right)},${Math.round(r.bottom)} on a ${vw}x${vh} screen`);
    }

    // Partly hidden by the nearest ancestor that hides overflow. Fully hidden content is treated
    // as intentionally parked (e.g. off-slide carousel content) and not reported.
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (!/(hidden|clip)/.test(ps.overflowX + ps.overflowY)) continue;
      const pr = p.getBoundingClientRect();
      const overlaps = r.right > pr.left && r.left < pr.right && r.bottom > pr.top && r.top < pr.bottom;
      const inside = r.left >= pr.left - 1 && r.right <= pr.right + 1 && r.top >= pr.top - 1 && r.bottom <= pr.bottom + 1;
      if (overlaps && !inside) add("cut-off", el, `extends past ${describe(p).split(" ")[0]}`);
      break;
    }
    if (hasOwnText(el) && /(hidden|clip)/.test(style.overflowX) && el.scrollWidth > el.clientWidth + 1) {
      add("cut-off", el, `text needs ${el.scrollWidth}px but has ${el.clientWidth}px`);
    }

    if (touch && isTarget) {
      const side = Math.min(r.width, r.height);
      const size = `${Math.round(r.width)}x${Math.round(r.height)}px`;
      if (side < failTarget - 0.5) add("small-target", el, `${size}, minimum ${failTarget}px`);
      else if (side < warnTarget - 0.5) add("small-target", el, `${size}, comfortable ${warnTarget}px`, "warn");
    }

    if (hasOwnText(el)) {
      const size = parseFloat(style.fontSize);
      if (size < failFont - 0.05) add("small-text", el, `${size.toFixed(1)}px, minimum ${failFont}px`);
      else if (size < warnFont - 0.05) add("small-text", el, `${size.toFixed(1)}px, comfortable ${warnFont}px`, "warn");
    }
  }
  return issues;
}

module.exports = { RULES, DEFAULT_LIMITS, measureFit };
