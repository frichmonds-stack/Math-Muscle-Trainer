# Manual Smoke Checklist

Last updated: 2026-05-19

Use this lightweight checklist before routine publish closes and after UI changes that touch navigation, setup, practice, Learn, Progress, or dialogs.

## Core App Flow

1. Open `index.html` directly or from a local server.
2. Confirm Home loads with:
   - Daily Warmup Routine.
   - 1 Minute Workout operation tiles.
   - Keep Learning card.
   - Training snapshot metrics.
   - Bottom dock.
3. Open Options from the dock gear and close it.
4. Open About and Give Feedback from Options, then close all dialogs.

## Workout Flow

1. Go to Workout.
2. Choose each visible operation at least once and confirm the selected state is clear.
3. Start a short Target Reps or H.I.T workout.
4. Confirm countdown appears.
5. Answer one question correctly.
6. Skip or answer one question incorrectly where the mode allows it.
7. Confirm answer feedback, recent-answer dots, timer/HUD, and keypad still fit.
8. End the workout with the in-app confirmation dialog.
9. Confirm Results appears and offers sensible next actions.

## Learn Flow

1. Go to Learn.
2. Open Make 10 or another available lesson.
3. Jump between lesson stages.
4. Complete at least one gated practice task.
5. Confirm hints/feedback and correct-rep gates behave as expected.
6. Use Exit Lesson and confirm the dialog flow.
7. From a completed lesson, start the focused workout handoff when available.

## Progress Flow

1. Go to Progress.
2. Cycle the main Progress carousel.
3. Check Workout Log, Operation Mastery, Workout Tracker, Fact Tracker, and Records surfaces.
4. Use local selectors/arrows where present.
5. Confirm static metrics do not look tappable unless they actually start/open something.

## Appearance And Layout

1. Check dark and light mode.
2. Check at least Original, Jungle, Solo Leveling, and Aang palettes when relevant.
3. Resize to iPad landscape, iPad portrait/narrow tablet, and mobile widths.
4. Confirm Home, Setup, and Practice keep their primary workflows readable and usable.
5. Confirm compact controls do not wrap awkwardly.

## Debug Mode

1. Open `index.html?debug=1`.
2. Confirm the debug unlock appears.
3. Unlock with the classroom password.
4. Confirm debug badge/panel appears without dimming the whole app excessively.
5. Load one persona and confirm Progress/Home update.

## Pass Criteria

- No duplicate IDs or script-reference failures in `scripts/check-repo.ps1`.
- Core Home -> Workout -> Practice -> Results flow works.
- Learn lesson entry and exit work.
- Progress carousel and selectors work.
- Options/About/Feedback dialogs open and close.
- No obvious text overlap, tiny controls, broken selected states, or unreadable light-mode status badges.
