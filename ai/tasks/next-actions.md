# Next Actions

Last updated: 2026-05-18

Use this file for concrete next work. Broader undecided questions belong in `ai/open-threads.md`; speculative ideas belong in `PROJECT_NOTES.md`.

## Priority Order

1. Finish near-term manual QA for the current rolling live build so the active classroom build stays trustworthy.
2. Continue the visual reference system: capture Setup, Practice, Learn, Progress, and Options screenshots, then add notes to `docs/design/reference/screenshot-audit-v0.20.5.md`.
3. Create a Lesson Experience System design brief before major lesson expansion: reusable patterns for explanation blocks, worked examples, visual/diagram blocks, hints, guided practice, final practice, completion, locked stages, media controls, and lesson navigation.
4. Prioritize the Learning Experience System, Learning Interaction System, Learning Feedback, zero states, and theme/visual system work because these affect pedagogy, usability, classroom experience, and eventual product positioning.
5. Extend debug mode / developer review tools after the first slice: state saving/loading, import/export for reproducible bugs, lesson-lock bypass when normal locks return, richer persona controls, and direct lesson-stage jumps.
6. Continue teacher-authored lesson content and addition progression planning using the Lesson Experience System as the visual/structural guide.
7. Plan deeper Operation Mastery communication and Progress IA after the lesson direction is clearer.

## Best Next Batch

1. Manually review the published `v0.20.6` visual reference/UI polish build on iPad landscape, iPad portrait, narrow resized desktop windows, mobile widths, light mode, Jungle, and Solo Leveling: dock Options gear, compact About/Give Feedback flow, Weekly Reps chart labels/line, setup density/centering, debug badge/dimming, combo placement, theme status badge contrast, and light-mode outline strength.
2. Manually retest Practice with the built-in keypad on keyboardless student devices, especially iPad/tablet landscape and portrait, to confirm the larger answer input, answer icon, and in-card dot rail do not crowd the keypad layout.
3. Add the remaining visual reference screenshots: Setup dark, Practice dark combo, Practice light, Learn menu/task state, Progress Fact Tracker light, Progress Operation Mastery, and Options light.
4. Draft the next design briefs in this order unless product needs change: Surface/Card UI, Learning Interaction UI, Progress/Evidence UI, App Shell/Nav.
5. Draft the Lesson Experience System design brief so future lessons have consistent structure, visual roles, media placement, motion rules, and stage/progression behavior instead of one-off screen design.
6. Manually test hidden adaptive Home quick starts with new-user/no-data state and with existing progress data for each operation.
7. Decide whether the 50 reps/day goal should stay fixed, become adaptive, or become a learner-facing training preference, and how it should be explained outside the calendar header.
8. Plan the deeper Operation Mastery communication/IA pass, including whether Fact Tracker becomes the detail/evidence layer inside Operation Mastery.
9. Confirm the Daily Routine checklist should stay as four separate 5-correct operation routines until multi-operation workouts exist.
10. Manually test Learn correct counters and the new feedback delay/reveal across Make 10, an addition final practice, multiplication assisted reps, and multiplication solo reps.
11. Move `Exit Lesson` out of the global top-right utility rail into the lesson-local header/content area.
12. Do a dedicated stale Home CSS prune for old launcher-era selectors (`home-launcher`, `home-menu-row`, `daily-widget`, and related legacy classes) after checking they are not used by any archived/current root UI paths.
13. Add intentional zero-state displays for new-user/empty-data surfaces so Home, Progress, Mastery, Fact Tracker, Records, and Learn completion states do not feel blank or broken before evidence exists.
14. Audit text-heavy surfaces and add consistent math-strength/status visuals where they improve scanning, touchability, or app-like interaction without stuffing icons into every button.

## Design Systems

1. Lesson Experience System: define reusable lesson blocks and interaction rules for explanations, examples, diagrams/images, hints, guided practice, final practice, completion, locked/unlocked stages, media controls, and learner navigation.
2. Debug/review mode follow-up: first pass exists with password-gated screen jumps, personas, quick workouts, local clearing, and classroom feedback messaging. Next define state save/load, import/export, richer personas, lesson-lock bypass, and direct lesson-stage jumps.
3. Progress/Mastery System: define reusable patterns for rank cards, improvement signals, next-focus states, fact evidence, calendar meaning, and long-term growth displays.
4. Feedback/Motion System: define when to use animation or transitions for correct/incorrect answers, lesson progress, stage completion, streak continuation, mastery changes, and empty states.
5. Home/Training System: define daily routine, quick workout, continue-learning, streak/momentum, and training snapshot roles so Home stays useful without becoming cluttered.
6. Zero-State System: define reusable empty/new-user states for no progress, no workouts, no mastery evidence, no fact data, no records, and lessons not started.
7. Theme Token / Color Role System: review palettes by semantic roles so each theme keeps readable contrast for surfaces, status chips, progress bars, selected states, and small text.
8. Learning Interaction System: define the shared learner task loop for prompts, inputs, scaffolds, feedback, answer reveal, anti-spam lockout, retry/advance timing, and progress gates across Workout Practice and Learn.

## Lesson Content

1. Create lessons: expand the Learn / Techniques content backlog into teacher-authored lesson specs before adding more app systems around it.
2. Have the teacher fill `learn/specs/make-10.md` with the intended Make 10 pedagogy.
3. Continue writing or refining addition lesson specs before expanding homepage/dashboard systems.
4. Decide how negative-number data should be represented across the app, including fact-key formats, storage normalization, answer telemetry, progress buckets, mastery scoring, reports, and migrations.
5. Plan whether negative integer addition/subtraction should be a dedicated lesson pathway, an advanced practice mode, or a later extension after positive-number fluency.
6. Convert reviewed lesson specs into structured lesson JSON without changing teacher-authored wording.
7. Decide when to migrate current hardcoded lesson text into structured lesson data.
8. Design the Addition lesson progression/pathway system.
9. Decide whether addition focused-workout handoffs need lesson-specific question pools.
10. Decide whether multiplication lessons should eventually use the same atomic lesson-plan model as addition lessons.

## Manual QA

1. Manually test addition lessons end-to-end: Make 10, Adding by 10s, Bridging Advanced, and Bridging Expert.
2. Manually test addition lesson completion, completed menu state, restart, stage-pill jumping, keypad entry, and `Start Focused Workout`.
3. Manually test multiplication lessons for `x1`, `x7`, `x10`, and `x12`, including unlocked stage-pill jumps, warm-up blanks, hints, solo reps, completion, and Practice More.
4. Manually test Progress carousel previous/next controls in the top red label row and local month/mastery selector arrows in light and dark mode.
5. Manually test Operation Mastery after completing workouts in each operation and confirm the `?` explainer, `/100` score, signal labels, and training-focus copy are understandable enough for the temporary pass.
6. Manually test the Operation Mastery selector cycle (`Overview -> Addition -> Subtraction -> Multiplication -> Division`) in dark and light mode.
7. Manually test Practice micro feedback rail visibility and pace impact across timed, target reps, isolation, zen, and spar sessions.
8. Manually test division tracker cards, especially `\u00f7 7`, and confirm they generate varied divisor facts.
9. Manually confirm existing browser progress loads through the legacy storage fallback after the project rename.
10. Continue reviewing iPad/touch behavior for number pad, swipe regions, and double-tap zoom risk.

## Process And Release

1. Add a tiny browser smoke-test workflow for Home -> Setup -> Practice and Learn -> lesson -> focused workout.
2. Plan snapshot pruning now that `docs/live` is the rolling current build. Keep meaningful milestones such as `v17`, lesson expansion, and major UI direction snapshots; remove low-value iterative snapshots only after confirming no shared links are needed.
3. Explore the long-term app data shape/structure explicitly for native-readiness: progress, lessons, telemetry, personas/debug states, accounts, sync, reports, migrations, and versioning.
4. Review any remaining GitHub UI metadata and decide whether to add the live Pages URL to `README.md`.
5. Review the AI continuity infrastructure for duplication, startup friction, and whether each file still has a clear job.
6. Decide and document a versioning policy for pre-`1.0.0` releases, including when to bump minor versus patch.
7. Audit current UI controls against `docs/design/component-system.md` before the first CSS alignment batch.
8. Keep using `scripts/check-repo.ps1` before publishing.
9. For routine live updates, bump patch version, update `CHANGELOG.md`, run `scripts/publish-live.ps1`, run checks, commit/push, then verify GitHub Pages `/live/` before claiming the site is live.
10. For preserved milestone snapshots, use `scripts/publish-snapshot.ps1` only when a numbered archive is explicitly wanted.
