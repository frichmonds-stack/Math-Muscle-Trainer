# Current State

Last updated: 2026-05-09

## Implementation

- Project/product naming is standardized as `Math Muscle Trainer`.
- Root app is at `v0.13.0`.
- Latest docs snapshot is `docs/v10`, marked latest in `docs/index.html`.
- Current publish-close batch pushed the lesson expansion, `docs/v10`, lesson content workflow, docs, ADRs, and AI continuity updates to GitHub.
- `AGENTS.md`, `ai/`, and `docs/decisions/` are now explicitly Codex-managed continuity files.
- `ai/task-map.md` routes future AI sessions from work type to relevant files, pre-reads, docs, and risks.
- Session close protocol now requires affected docs, GitHub push status, and live internet verification status to be addressed explicitly.
- Browser storage now uses `math-muscle-trainer-*` keys with fallback reads for legacy saved progress and preferences.
- Make 10's `Start Focused Workout` action now routes through `applySettingsSnapshot`.
- Addition Techniques now has a reusable atomic lesson runner and linked lessons for Make 10, adding by 1s/10s/100s/1000s, Counting On Easy/Medium, and Bridging Easy/Medium/Advanced/Expert.
- Addition lesson completion uses `addition:<lesson-id>` technique progress keys and complete screens route to addition focused workout setup using available difficulty presets.
- Multiplication Techniques now has selectable `x1` through `x12` lessons with table-specific strategy copy, examples, hints, warm-ups, assisted reps, solo reps, and completion states.
- Multiplication and addition lesson stage pills are unlocked so learners can jump directly to any section.
- The Progress screen's top red carousel label has inline previous/next controls again after being aligned with the header buttons.
- Lesson content workflow scaffolding exists under `learn/` for teacher specs, structured lesson data, scaffolds, mental models, and review notes. This workflow is documentation/content-only and does not change visible lesson behavior by itself.
- Division tracker cards now start divisor isolation workouts across the full quotient range.
- Operation display symbols are centralized; division stores `/` in fact keys and displays `\u00f7`.
- Version checks now compare `APP_VERSION` with the latest released `CHANGELOG.md` heading.
- Repo-native release helpers exist in `scripts/`.

## Product Direction

- Highest priority is to finish the lesson content, then build a progression system through the lessons.
- Four-operation mastery visibility is a high-priority product direction so learners can see progress toward full arithmetic mastery across Addition, Subtraction, Multiplication, and Division.
- Mastery indicators should motivate improvement through meaningful metrics such as speed, precision, consistency, coverage, and lesson progress.
- A stronger new-user flow is high priority so first-time learners are guided into a useful starting path instead of needing to understand the full app immediately.
- Product philosophy is iPad-first and eventual Apple App Store oriented.
- Gamification is not a goal by itself. Regular usage should come from useful skill-building, good learning habits, visible growth, and mastery rather than attention-hacking loops.
- The app should be usable from primary students through adults; the theme should stay universal around mental/arithmetic strength.
- Branding can remain strength-oriented, but mastery should not feel age-locked, overly childish, or narrowly targeted.
- Speculative feature suggestions should be treated as an idea bank unless the user explicitly promotes them to roadmap.

## Verification

- Latest known check:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repo.ps1
```

- Result on 2026-05-08: `All repo checks passed.`
- GitHub Pages verified live on 2026-05-08:
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/`
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v10/index.html`
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v10/js/app-core.js` served `APP_VERSION = "v0.13.0"`.
- 2026-05-09 session changed AI continuity docs only. No app checks, push, or live verification were run from this chat environment.

## Working Tree Note

- Always inspect `git status --short` before editing. Publish-close sessions should also confirm `git remote -v` and live GitHub Pages status when pushing.
