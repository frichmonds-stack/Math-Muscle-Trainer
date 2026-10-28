# Next Actions

Last updated: 2026-10-28

Use this file as a small priority queue. Broader unresolved decisions belong in `ai/open-threads.md`. Long-range concepts belong in `docs/product/roadmap.md` or `docs/product/idea-bank.md`.

## Now

- `TASK-UI-002` Responsive layout: fill any screen without scrolling, swipeable pages on phones. Batches 0-1 are done; Batches 2-4 are in `ai/active-task.md`.
- `TASK-DESIGN-001` Draft the Lesson Experience System brief so future lessons share one structure for explanations, examples, hints, guided practice, final practice, completion, and navigation.
- `TASK-LEARN-001` Define the detailed Learning Interaction System task loop across Workout and Learn: prompts, inputs, scaffolds, feedback, answer reveal, lockout, retry timing, and progress gates.
- `TASK-QA-001` Continue manual iPad/tablet QA for Practice keypad fit, portrait behavior, light-mode contrast, and key Learn/Progress touch interactions (the debug Screen size preview covers other devices from a desktop).

## Next

- `TASK-PROGRESS-001` Plan the next Progress/Evidence UI pass after lesson direction is clearer, especially mastery explanation and evidence hierarchy.
- `TASK-LEARN-002` Move `Exit Lesson` into lesson-local UI instead of global utility space.
- `TASK-CONTENT-001` Continue teacher-authored addition lesson specs and decide the first full addition progression pathway.
- `TASK-PROCESS-001` Use and refine `docs/testing/smoke-checklist.md` during routine publish closes and UI validation passes.

## Blocked / Awaiting Owner Decision

- `TASK-DEPLOY-001` The ADR-0018 fix is still not in place as of 2026-10-28: the PR #4 and PR #5 merges both auto-deployed (Deployments shows source Build). Owner: set the Cloudflare production Deploy command to `npx wrangler versions upload` (Worker > Settings > Build), verify with a test push that Deployments still shows the previous version active, then record the date in `ai/current-state.md` and lift the interim rule.
- `TASK-DATA-001` Expand negative-number support only after `THREAD-DATA-001` defines the data model and learner-facing scope.
- `TASK-HOME-001` Rework Home's daily routine and adaptive behavior only after `THREAD-HOME-001` decides how ambitious the dashboard should become.
- `TASK-PROGRESS-002` Deep mastery communication changes depend on `THREAD-PROGRESS-001`.
