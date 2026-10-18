# Next Actions

Last updated: 2026-10-18

Use this file as a small priority queue. Broader unresolved decisions belong in `ai/open-threads.md`. Long-range concepts belong in `docs/product/roadmap.md` or `docs/product/idea-bank.md`.

## Now

- `TASK-BUG-004` Focus-area trends for subtraction and division list the 7 addition buckets: `getBucketTrendItems` (`js/app-progress-focus.js`) falls through to addition for any non-multiplication operation.
- `TASK-BUG-005` Review possible bugs pinned by `CURRENT BEHAVIOUR (possible bug)` comments in `tests/`: sums of exactly 10 counted as non-regrouping (may be intended "make 10"), division difficulty band taken from the dividend, exact 0.08 trend deltas missed through floating-point, `parseBucketDailyKey` reading subtraction rows as multiplication, unchecked top-level progress fields and a JSON-string progress value loading as an object. Fix individually with the owner; update the pinned tests when behaviour changes.
- `TASK-CONTENT-002` `renderMake10LessonScreen` (`js/app-techniques-make10.js`) and its helpers are never called but hold teacher-authored Make 10 lesson text; owner to decide whether to wire it up, archive the text to `learn/`, or delete.
- `TASK-DESIGN-001` Draft the Lesson Experience System brief so future lessons share one structure for explanations, examples, hints, guided practice, final practice, completion, and navigation.
- `TASK-LEARN-001` Define the detailed Learning Interaction System task loop across Workout and Learn: prompts, inputs, scaffolds, feedback, answer reveal, lockout, retry timing, and progress gates.
- `TASK-QA-001` Continue manual iPad/tablet QA for Practice keypad fit, portrait behavior, light-mode contrast, and key Learn/Progress touch interactions.

## Next

- `TASK-PROGRESS-001` Plan the next Progress/Evidence UI pass after lesson direction is clearer, especially mastery explanation and evidence hierarchy.
- `TASK-UI-001` Add intentional zero states for new-user and empty-data Home, Progress, Mastery, Fact Tracker, Records, and Learn surfaces.
- `TASK-LEARN-002` Move `Exit Lesson` into lesson-local UI instead of global utility space.
- `TASK-CONTENT-001` Continue teacher-authored addition lesson specs and decide the first full addition progression pathway.
- `TASK-PROCESS-001` Use and refine `docs/testing/smoke-checklist.md` during routine publish closes and UI validation passes.

## Blocked / Awaiting Owner Decision

- `TASK-DATA-001` Expand negative-number support only after `THREAD-DATA-001` defines the data model and learner-facing scope.
- `TASK-HOME-001` Rework Home's daily routine and adaptive behavior only after `THREAD-HOME-001` decides how ambitious the dashboard should become.
- `TASK-PROGRESS-002` Deep mastery communication changes depend on `THREAD-PROGRESS-001`.
