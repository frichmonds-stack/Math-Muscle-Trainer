"use strict";
// Shared helpers: static server, browser launch, deterministic init script.
const http = require("http");
const fs = require("fs");
const path = require("path");

if (!process.env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync("/opt/pw-browsers")) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = "/opt/pw-browsers";
}
const { chromium } = require("playwright-core");

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".webp": "image/webp", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain; charset=utf-8",
};

function startServer(rootDir) {
  const root = path.resolve(rootDir);
  if (!fs.existsSync(path.join(root, "index.html"))) {
    throw new Error(`No index.html in app dir: ${root}`);
  }
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (urlPath.endsWith("/")) urlPath += "index.html";
    const filePath = path.join(root, path.normalize(urlPath));
    if (!filePath.startsWith(root)) { res.writeHead(403); return res.end("forbidden"); }
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404, { "content-type": "text/plain" }); return res.end("not found"); }
      res.writeHead(200, {
        "content-type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        "cache-control": "no-store",
      });
      res.end(data);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, origin: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(r)) });
    });
  });
}

function findChromium() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
  const candidates = [];
  try {
    for (const d of fs.readdirSync(base)) {
      // Older Playwright builds unpack to chrome-linux, newer ones to chrome-linux64.
      if (/^chromium-\d+$/.test(d)) {
        candidates.push(path.join(base, d, "chrome-linux", "chrome"), path.join(base, d, "chrome-linux64", "chrome"));
      }
    }
  } catch (e) { /* ignore */ }
  return candidates.sort().reverse().find((p) => fs.existsSync(p));
}

// Browser lookup order: CHROME_PATH, Playwright's bundled Chromium, a Chromium under
// PLAYWRIGHT_BROWSERS_PATH, then an installed Chrome or Edge (e.g. on Windows).
async function launchBrowser() {
  if (process.env.CHROME_PATH) {
    return chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH });
  }
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    const executablePath = findChromium();
    if (executablePath) return chromium.launch({ headless: true, executablePath });
    for (const channel of ["chrome", "msedge"]) {
      try {
        return await chromium.launch({ headless: true, channel });
      } catch (channelError) { /* try the next one */ }
    }
    throw error;
  }
}

// Fixed "now": Wednesday 2026-04-15 10:00 local time (TZ forced to UTC by contexts).
const FIXED_NOW = Date.UTC(2026, 3, 15, 10, 0, 0);

// Seeded Math.random (mulberry32). Seed resets on each navigation.
const SEEDED_RANDOM_SCRIPT = `(() => {
  let seed = 0x9e3779b9 >>> 0;
  Math.random = function () {
    seed = (seed + 0x6D2B79F5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();`;

const NO_MOTION_CSS = "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}";

module.exports = { startServer, launchBrowser, FIXED_NOW, SEEDED_RANDOM_SCRIPT, NO_MOTION_CSS };
