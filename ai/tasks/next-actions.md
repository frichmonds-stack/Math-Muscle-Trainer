# Next Actions

Last updated: 2026-05-08

Safest next tasks:

1. Have the teacher fill `learn/specs/make-10.md` with the intended Make 10 pedagogy.
2. Convert the reviewed Make 10 spec into `learn/lessons/addition/make-10.lesson.json` without changing wording.
3. Decide when to migrate current hardcoded lesson text into structured lesson data.
4. Manually test several addition lessons end-to-end in a browser, including Make 10, Adding by 10s, Bridging Advanced, and Bridging Expert.
5. Manually test multiplication lessons for `x1`, `x7`, `x10`, and `x12`, including unlocked stage-pill jumps, warm-up blanks, hints, solo reps, completion, and Practice More.
6. Manually test Progress carousel previous/next controls in the top red label row.
7. Manually test addition lesson completion, completed menu state, restart, stage-pill jumping, keypad entry, and `Start Focused Workout`.
8. Decide whether addition focused workout handoffs need lesson-specific question pools beyond the existing difficulty presets.
9. Decide whether multiplication lessons should eventually use the same atomic lesson-plan model as addition lessons.
10. Manually test division tracker cards, especially `\u00f7 7`, and confirm they generate varied divisor facts.
11. Manually confirm existing browser progress loads through the legacy storage fallback after the project rename.
12. Review any remaining GitHub UI metadata and decide whether to add the live Pages URL to `README.md`.
13. Add a tiny browser smoke-test workflow for Home -> Setup -> Practice and Learn -> lesson -> focused workout.
14. Review iPad/touch behavior for number pad, swipe regions, and double-tap zoom risk.
15. Clarify Hearts/Stars reward copy in the UI.
16. Keep using `scripts/check-repo.ps1` before snapshot publishing.
