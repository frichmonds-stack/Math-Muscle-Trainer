"use strict";
// Screen sizes shared by capture.js, fit.js and sheet.js, in display order (small to large).
// The debug-mode size switcher (DEBUG_PREVIEW_SIZES in js/app-debug.js) lists the same sizes;
// tests/viewports.test.js keeps the two in step.
// touch: emulate a touch screen (coarse pointer), so the on-screen keypad shows as on a device.
const VIEWPORTS = {
  "phone-small": { width: 375, height: 667, touch: true, label: "Small phone" },
  phone: { width: 390, height: 844, touch: true, label: "Phone" },
  "phone-landscape": { width: 844, height: 390, touch: true, label: "Phone landscape" },
  "ipad-portrait": { width: 820, height: 1180, touch: true, label: "iPad portrait" },
  "ipad-landscape": { width: 1180, height: 820, touch: true, label: "iPad landscape" },
  laptop: { width: 1366, height: 768, touch: false, label: "Laptop" },
  desktop: { width: 1920, height: 1080, touch: false, label: "Desktop" },
};

// Pick viewports from a comma-separated --viewport= value; all when empty.
function selectViewports(list) {
  if (!list) return Object.keys(VIEWPORTS);
  const names = list.split(",").map((s) => s.trim()).filter(Boolean);
  const unknown = names.filter((n) => !VIEWPORTS[n]);
  if (unknown.length) throw new Error(`Unknown viewport(s): ${unknown.join(", ")}. Known: ${Object.keys(VIEWPORTS).join(", ")}`);
  return names;
}

module.exports = { VIEWPORTS, selectViewports };
