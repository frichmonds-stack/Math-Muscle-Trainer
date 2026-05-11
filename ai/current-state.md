# Current State

Last updated: 2026-05-11

## Implementation

- Project/product naming is standardized as `Math Muscle Trainer`.
- Root app is at `v0.17.0` on `main`.
- Latest docs snapshot is `docs/v14`, marked latest in `docs/index.html`.
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
- Browser-local progress now includes capped answer-level telemetry (`answerTelemetry`) with operation, fact key, skill bucket, difficulty band, correctness/skipped state, response time, timestamp/date, session id, session source, and session position.
- Progress now has an Operation Mastery slide showing Addition, Subtraction, Multiplication, and Division ranks using `Rookie -> Novice -> Adept -> Expert -> Elite -> Master -> Legend`.
- Initial mastery scoring combines accuracy, fluency, coverage, retention, consistency, and difficulty evidence.
- Current mastery ranks are derived from recent/lifetime evidence and can move up or down; best-earned ranks are stored in `operationBestRanks` and only rise.
- Operation Mastery now uses an overview-to-detail layout: compact cards compare all four operations, and the selected operation opens a deeper evidence panel.
- Operation Mastery now uses an explicit mode selector (`Overview` / `Operation Detail`) so the first state is snapshot-only, and detail view is opt-in.
- Progress header kicker rows are centered consistently across slides while utility buttons remain right-aligned.
- Progress layouts include an iPad polish pass for selector width/spacing and focus-column density in the `768-1366px` range.
- Progress dynamic renderers now escape dynamic labels before inserting HTML in priority, growth, positive-progress, and coach-tip views.
- Operation Mastery now uses a single cyclic selector (`Overview -> Addition -> Subtraction -> Multiplication -> Division`) instead of separate mode and operation selectors.
- Operation Mastery overview cards are now a larger 2x2 grid to emphasize snapshot readability before detail drill-down.
- Records mode selector labels now use compact naming (`H.I.T`, `Target Reps`, `Isolation`, `Zen Mode`, `Spar Mode`) to fit controls more cleanly.
- Practice now uses speed-first micro feedback: persistent `Correct.` text was removed, answer status still flashes on the field/icon, and a rolling 5-answer dot rail shows recent correctness without slowing question advance.
- Practice top-left status pill now shows operation/mode/negatives context as a non-primary status label (not a CTA-style button).
- Learn/Techniques now includes subtraction and division operation slots with visible `Coming Soon` placeholders.
- Light-mode polish pass includes stronger tooltip/info-icon default contrast and a non-purple active bottom-nav indicator to keep solo-leveling light mode consistent.
- Progress/Techniques header kicker alignment now anchors to the same left content track instead of appearing centered off-grid.
- ADR-0006 records the learning telemetry and operation mastery decision.
- 2026-05-10 execution batch moved Results actions to top header, renamed `Adjust Workout` to `New Workout`, renamed lesson workout CTA to `Start Workout`, removed lesson-stage Back buttons, removed lesson-complete restart/back actions, added top-nav lesson exit visibility, changed Results/Progress month labels to month-only with year side labels, and upgraded practice response feedback badges/glow while hiding bottom feedback text.
- 2026-05-11 UI system patch added ADR-0007 for the app-shell UI contract, converted Home primary navigation into compact app-style modules, moved Results actions into the summary content header, fixed Progress/Results carousel kicker labels to a stable width, moved local selectors into content headers, removed hover affordances from static metric panels, aligned tracker calendar headings/weekdays, removed Learn's nested background panel, and made multiplication Practice More auto-advance after correct answers.
- 2026-05-11 publish close bumped runtime version to `v0.16.0`, added `CHANGELOG.md` release notes, published `docs/v13`, and updated README publish instructions.
- 2026-05-11 app viewport frame release bumped runtime version to `v0.17.0`, updated ADR-0007, and published `docs/v14`.
- Desktop/tablet-landscape rendering now fits the app into a centered `1194 x 834` iPad-landscape canvas instead of stretching to arbitrary browser dimensions; narrow/mobile layouts still switch to scroll-friendly responsive rules.

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

- Latest known check before this feature branch:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repo.ps1
```

- Result on 2026-05-08: `All repo checks passed.`
- GitHub Pages verified live on 2026-05-08:
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/`
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v10/index.html`
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v10/js/app-core.js` served `APP_VERSION = "v0.13.0"`.
- 2026-05-09 session changed AI continuity docs only. No app checks, push, or live verification were run from this chat environment.
- 2026-05-10 feature branch work refreshed `docs/v12` and ran `scripts/check-repo.ps1`; result: `All repo checks passed.`
- 2026-05-10 follow-up execution batch changed root app files and reran `scripts/check-repo.ps1`; expected failures reported until a new docs snapshot is published.
- 2026-05-11 UI system patch reran `scripts/check-repo.ps1`; expected snapshot-drift failures remain for root app files until a new docs snapshot is published.
- 2026-05-11 UI system patch ran `node --check` for all root JS modules; all syntax checks passed.
- 2026-05-11 publish close ran `scripts/check-repo.ps1` after `docs/v13`; result: `All repo checks passed.`
- GitHub Pages verified live on 2026-05-11:
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/` lists `docs/v13` as latest.
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v13/index.html` returned HTTP 200.
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v13/js/app-core.js` served `APP_VERSION = "v0.16.0"`.
- 2026-05-11 app viewport frame release ran `scripts/check-repo.ps1` after `docs/v14`; result: `All repo checks passed.`
- 2026-05-11 app viewport frame release ran `node --check` for all root JS modules; all syntax checks passed.

## Working Tree Note

- Always inspect `git status --short` before editing. Publish-close sessions should also confirm `git remote -v` and live GitHub Pages status when pushing.
