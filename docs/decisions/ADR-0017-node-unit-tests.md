# ADR-0017: Node Unit Tests Against The Real App Files

Date: 2026-10-18
Status: Accepted

## Context

The app's logic (question pools, saved-data normalisation, mastery scoring) had no automated tests, and a JS file split was planned. The owner chose Node's built-in test runner over a browser test page.

## Decision

- Tests live in `tests/` and run with `node --test tests/` using only `node:test` and `node:assert`; no npm packages.
- `tests/harness.js` loads the real, unmodified `js/` files in `index.html` script order into a fresh `vm` context with a fake DOM parsed from `index.html`, fake storage, a fixed clock and seeded randomness, and exposes the app's top-level globals.
- Tests are characterisation tests: they describe current behaviour. Suspected bugs are pinned with a `CURRENT BEHAVIOUR (possible bug)` comment and fixed deliberately, updating the test in the same change.

## Consequences

- Because the harness reads the script list from `index.html`, splitting or renaming JS files needs no test changes.
- Running tests needs Node; the PowerShell repo check remains the guard where Node is unavailable.
- The fake DOM has no layout and does not parse `innerHTML`, so rendering details are covered by `tools/visual-check` (ADR-0016) rather than unit tests.
