# Current State

Last updated: 2026-05-08

## Implementation

- Project/product naming is standardized as `Math Muscle Trainer`.
- Root app is at `v0.13.0`.
- Latest docs snapshot is `docs/v10`, marked latest in `docs/index.html`.
- Current publish-close batch prepares the lesson expansion, `docs/v10`, lesson content workflow, docs, ADRs, and AI continuity updates for GitHub.
- Previous `v0.12.0` publish-close verified the live GitHub Pages site.
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

## Verification

- Latest known check:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repo.ps1
```

- Result on 2026-05-08: `All repo checks passed.`
- GitHub Pages last verified live on 2026-05-07 before the `v0.13.0` publish:
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/`
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v9/`
- Verify the version index and `docs/v10` app after pushing `v0.13.0`.

## Working Tree Note

- Always inspect `git status --short` before editing. Publish-close sessions should also confirm `git remote -v` and live GitHub Pages status when pushing.
