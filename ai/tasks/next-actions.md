# Next Actions

Last updated: 2026-05-11

Future roadmap additions:

1. Infer developmental profile automatically from reading speed, response latency, accuracy stability, session duration, and interaction patterns; adapt quietly in the background.
2. Design adaptive difficulty behavior by learner profile:
3. Younger learners: increase success frequency, use gentler difficulty ramps, and avoid rapid demotions after mistakes.
4. Older learners: allow more aggressive adaptation, faster progression, and higher challenge ceilings.
5. Use `Rookie -> Novice -> Adept -> Expert -> Elite -> Master -> Legend` as the operation mastery achievement rank chain.

Safest next tasks:

1. Have the teacher fill `learn/specs/make-10.md` with the intended Make 10 pedagogy.
2. Continue writing/refining addition lesson specs before expanding the homepage/dashboard systems.
3. Convert reviewed lesson specs into structured lesson JSON without changing teacher-authored wording.
4. Decide when to migrate current hardcoded lesson text into structured lesson data.
5. Design the lesson progression/pathway system for Addition.
6. Review the first operation mastery scoring model after manual workouts create telemetry across all four operations, including current rank versus best-earned rank.
7. Design the first-time onboarding/placement flow.
8. Manually test several addition lessons end-to-end in a browser, including Make 10, Adding by 10s, Bridging Advanced, and Bridging Expert.
9. Manually test multiplication lessons for `x1`, `x7`, `x10`, and `x12`, including unlocked stage-pill jumps, warm-up blanks, hints, solo reps, completion, and Practice More.
10. Manually test Progress carousel previous/next controls in the top red label row.
11. Manually test addition lesson completion, completed menu state, restart, stage-pill jumping, keypad entry, and `Start Focused Workout`.
12. Decide whether addition focused workout handoffs need lesson-specific question pools beyond the existing difficulty presets.
13. Decide whether multiplication lessons should eventually use the same atomic lesson-plan model as addition lessons.
14. Continue reviewing iPad/touch behavior for number pad, swipe regions, and double-tap zoom risk.
15. Clarify Hearts/Stars reward copy in the UI.
16. Add a tiny browser smoke-test workflow for Home -> Setup -> Practice and Learn -> lesson -> focused workout.
17. Manually test Operation Mastery after completing workouts in each operation and confirm current ranks, best-earned ranks, and next-goal copy feel fair.
18. Manually test division tracker cards, especially `\u00f7 7`, and confirm they generate varied divisor facts.
19. Manually confirm existing browser progress loads through the legacy storage fallback after the project rename.
20. Review any remaining GitHub UI metadata and decide whether to add the live Pages URL to `README.md`.
21. Keep using `scripts/check-repo.ps1` before snapshot publishing.
22. Manually test the new Operation Mastery single-selector cycle (`Overview -> Addition -> Subtraction -> Multiplication -> Division`) in both dark and light mode.
23. Manually test Practice micro feedback rail visibility and pace impact across timed, target reps, isolation, zen, and spar sessions.
24. Manually review Learn selector transitions for subtraction/division `Coming Soon` placeholders and check layout consistency on desktop + iPad widths.
25. Manually review the live `docs/v14` app viewport frame on Windows desktop and iPad-sized viewports.
26. Manually review the 2026-05-11 UI system patch on Windows desktop and iPad-width viewports: Home menu modules, Progress/Results kicker/header stability, selector placement, static metric hover behavior, Workout Tracker calendar alignment, Learn canvas, lesson completion copy, and Practice More auto-advance.
27. Track any follow-up polish from live `v0.17.0` app viewport frame review as a new batch before the next release snapshot.
28. Manually review the app viewport frame on desktop browser sizes larger than iPad landscape and confirm the centered `1194 x 834` canvas feels right.
