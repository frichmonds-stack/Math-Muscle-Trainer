# Next Actions

Last updated: 2026-05-13

Use this file for concrete next work. Broader undecided questions belong in `ai/open-threads.md`; speculative ideas belong in `PROJECT_NOTES.md`.

## Best Next Batch

1. Manually review the new root Home / Today's Training dashboard on desktop, iPad-landscape size, narrow/mobile widths, and light mode, especially no-scroll fit and dock clearance.
2. Confirm the Daily Routine checklist should stay as four separate 5-correct operation routines until multi-operation workouts exist.
3. Confirm Quick Workout direct-start defaults should stay at 20 reps per operation.
4. Decide the long-term learner-facing reward model now that Hearts/Stars are no longer visible tracker metrics.
5. Remove or soften the large nested Practice panel background while preserving the problem card, input, HUD, progress bar, and keypad as distinct functional units.
6. Move `Exit Lesson` out of the global top-right utility rail into the lesson-local header/content area.
7. Audit text-heavy surfaces and add consistent math-strength/status visuals where they improve scanning, touchability, or app-like interaction without stuffing icons into every button.

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
4. Manually test Progress carousel previous/next controls in the top red label row.
5. Manually test Operation Mastery after completing workouts in each operation and confirm current ranks, best-earned ranks, and next-goal copy feel fair.
6. Manually test the Operation Mastery selector cycle (`Overview -> Addition -> Subtraction -> Multiplication -> Division`) in dark and light mode.
7. Manually test Practice micro feedback rail visibility and pace impact across timed, target reps, isolation, zen, and spar sessions.
8. Manually test division tracker cards, especially `\u00f7 7`, and confirm they generate varied divisor facts.
9. Manually confirm existing browser progress loads through the legacy storage fallback after the project rename.
10. Continue reviewing iPad/touch behavior for number pad, swipe regions, and double-tap zoom risk.

## Process And Release

1. Add a tiny browser smoke-test workflow for Home -> Setup -> Practice and Learn -> lesson -> focused workout.
2. Review any remaining GitHub UI metadata and decide whether to add the live Pages URL to `README.md`.
3. Review the AI continuity infrastructure for duplication, startup friction, and whether each file still has a clear job.
4. Decide and document a versioning policy for pre-`1.0.0` releases, including when to bump minor versus patch.
5. Audit current UI controls against `docs/design/component-system.md` before the first CSS alignment batch.
6. Keep using `scripts/check-repo.ps1` before snapshot publishing.
7. When publishing root app changes, use `scripts/publish-snapshot.ps1`, update `CHANGELOG.md`, bump `APP_VERSION`, run checks, then verify GitHub Pages before claiming the site is live.
