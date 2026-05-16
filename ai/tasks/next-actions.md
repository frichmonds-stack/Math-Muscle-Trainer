# Next Actions

Last updated: 2026-05-16

Use this file for concrete next work. Broader undecided questions belong in `ai/open-threads.md`; speculative ideas belong in `PROJECT_NOTES.md`.

## Best Next Batch

1. Manually review the published `v0.20.2` polish batch on iPad landscape, iPad portrait, narrow resized desktop windows, mobile widths, and light mode: Home header spacing, centered dashboard rhythm, rolling weekly metrics, Practice answer/status layout, Progress selectors, Operation Mastery help, Learn correct counters, Workout Tracker calendar goal colors, and setup operation choices.
2. Manually retest Practice with the built-in keypad on keyboardless student devices, especially iPad/tablet landscape and portrait, to confirm the larger answer input, answer icon, and in-card dot rail do not crowd the keypad layout.
3. Manually test hidden adaptive Home quick starts with new-user/no-data state and with existing progress data for each operation.
4. Decide whether the 50 reps/day goal should stay fixed, become adaptive, or become a learner-facing training preference, and how it should be explained outside the calendar header.
5. Plan the deeper Operation Mastery communication/IA pass, including whether Fact Tracker becomes the detail/evidence layer inside Operation Mastery.
6. Confirm the Daily Routine checklist should stay as four separate 5-correct operation routines until multi-operation workouts exist.
7. Manually test Learn correct counters across Make 10, an addition final practice, multiplication assisted reps, and multiplication solo reps; confirm wrong answers do not fill ticks and correct reps advance as expected.
8. Move `Exit Lesson` out of the global top-right utility rail into the lesson-local header/content area.
9. Do a dedicated stale Home CSS prune for old launcher-era selectors (`home-launcher`, `home-menu-row`, `daily-widget`, and related legacy classes) after checking they are not used by any archived/current root UI paths.
10. Audit text-heavy surfaces and add consistent math-strength/status visuals where they improve scanning, touchability, or app-like interaction without stuffing icons into every button.

## Lesson Content

1. Have the teacher fill `learn/specs/make-10.md` with the intended Make 10 pedagogy.
2. Continue writing or refining addition lesson specs before expanding homepage/dashboard systems.
3. Convert reviewed lesson specs into structured lesson JSON without changing teacher-authored wording.
4. Decide when to migrate current hardcoded lesson text into structured lesson data.
5. Design the Addition lesson progression/pathway system.
6. Decide whether addition focused-workout handoffs need lesson-specific question pools.
7. Decide whether multiplication lessons should eventually use the same atomic lesson-plan model as addition lessons.

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
3. Review any remaining GitHub UI metadata and decide whether to add the live Pages URL to `README.md`.
4. Review the AI continuity infrastructure for duplication, startup friction, and whether each file still has a clear job.
5. Decide and document a versioning policy for pre-`1.0.0` releases, including when to bump minor versus patch.
6. Audit current UI controls against `docs/design/component-system.md` before the first CSS alignment batch.
7. Keep using `scripts/check-repo.ps1` before publishing.
8. For routine live updates, bump patch version, update `CHANGELOG.md`, run `scripts/publish-live.ps1`, run checks, commit/push, then verify GitHub Pages `/live/` before claiming the site is live.
9. For preserved milestone snapshots, use `scripts/publish-snapshot.ps1` only when a numbered archive is explicitly wanted.
