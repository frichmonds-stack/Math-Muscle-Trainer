# Current State

Last updated: 2026-05-14

## Implementation

- Project/product naming is standardized as `Math Muscle Trainer`.
- Root app is at `v0.20.0` on `main`.
- Latest docs snapshot is `docs/v17`, marked latest in `docs/index.html`.
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
- 2026-05-12 project memory cleanup pruned `PROJECT_NOTES.md` into durable context/idea-bank material, reorganized `ai/open-threads.md` into decision categories, and grouped `ai/tasks/next-actions.md` into concrete next batches.
- 2026-05-12 follow-up compressed `ai/session-log.md` into milestone entries plus active handoff notes, added near-term roadmap shape (`v0.18.0` UI cleanup, `v0.19.0` lesson content foundation, `v0.20.0` onboarding/mastery clarity), and queued AI continuity/versioning reviews.
- `docs/design/ui-direction.md` now holds the stable UI direction for future design work, including the all-ages minimalist iPad-app north star, button/control roles, toggle rules, content-role rules, and icon/brand guidance.
- `docs/design/component-system.md` now defines the reusable UI role/class contract for future CSS alignment: buttons, icon utilities, toggles, segmented controls, content headers, metrics, action tiles, insight boards, dialogs, and carousel/kicker controls.
- `docs/design/current-button-ui.md` now documents the current implemented button/control baseline and screenshot-review checklist.
- First CSS alignment pass softened existing shared controls toward the chosen direction: Concept 3 tactile control feel governed by Concept 1 hierarchy, while preserving existing theme/color variables.
- Root app now opens to the Train/setup surface by default and includes a compact centered rounded training dock for `Train`, `Learn`, and `Progress` instead of relying on a launcher-style home menu as the main navigation.
- Visual anchors were pulled back from destination/workout buttons; operation symbols and Practice status/HUD cues remain where they carry math/status meaning, while future visual richness should happen at the app, lesson, progress/status, and math-context level.
- 2026-05-13 publish close bumped runtime version to `v0.18.0`, moved the UI direction notes from `Unreleased` into `CHANGELOG.md`, published `docs/v15`, and prepared the branch for GitHub sync.
- Root app now has a first-pass Home / Today's Training dashboard and startup lands on Home again. The dashboard has app identity with the standalone strong-arm mark and `Novare Co. presents`, a clickable Daily Routine checklist, direct-start Quick Workout operation tiles, Learn handoff, and a static training snapshot strip.
- Daily Routine checklist items start 5-correct operation routines and tick off after 5 correct answers for that operation today. Quick Workout operation tiles start direct 20-rep workouts.
- The bottom dock now reads `Home`, `Workout`, `Learn`, `Progress`; focused-screen top Home/settings buttons are hidden so navigation lives in the dock and Home owns About/Settings.
- The Home `Next Focus` card was removed. The snapshot now shows day streak with a 7-day animated flame strip, total reps, accuracy, and average pace.
- Home banner copy now rotates through daily thoughts, including `Grow your brain & begin your reign.`, and Continue Learning opens the Make 10 lesson directly.
- Results/Progress Workout Tracker month summaries now show workouts, reps, and accuracy; the older Hearts/Stars calendar reward icons were removed from the visible UI.
- Practice HUD labels no longer carry decorative icons, display-only tracker stats no longer use hover affordances, and the bottom page-position indicator was removed now that the dock owns primary navigation.
- Results/Progress red kicker-row carousel arrows have direct event bindings again.
- The previous brand/launcher-style Home is archived by reference in `docs/design/home-screen-archive-v0.18.0.md`; the exact implementation remains in `docs/v15`.
- Practice now uses a compact capped-width touch keypad and tighter coarse-pointer tablet spacing so keyboardless learners can reach the built-in number pad without changing the fixed app-frame model.
- Home Daily Routine is now framed as `Quick 5 Warmup`, has no header icon, keeps routine labels on one line, and completed rows show `Complete` with a full-row completed state.
- Home Quick Workout is now presented as `1 Minute Workout`; both Quick 5 Warmup and 1 Minute Workout use hidden adaptive settings based on saved local performance data, with easy defaults for new users.
- Home Keep Learning now uses `Keep Learning`, `Pick up a new technique.`, a compact inline `Learn` button, no header icon, and no lesson-specific supporting sentence until lesson content is more complete.
- Home daily thought is italicized.
- Home snapshot now removes Average Pace and shows Workout Streak, Total Reps with a 7-day rectangular column graph, and Accuracy with a simplified horizontal fill meter.
- Practice visual containment is softened so the outer panel, HUD cards, and keypad controls read quieter while the problem card and answer input remain the main focus.
- Workout Tracker summary stats now use static metric rows instead of highlightable card-like panels, and the left summary column stretches to the calendar height.
- Streak banners can be dismissed by clicking or tapping the banner.

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
- Adaptive learning should not be exposed as a simple learner-facing on/off setting. Future adaptive controls should be framed as friendly training preferences such as Gentle/Balanced/Challenge, session length, focus mode, hints, or mistake review.
- Visual direction should preserve a minimalist thread: restrained, clear, low-clutter, tactile iPad-app UI for all ages. Avoid both over-decorated game styling and cold/boxy admin-dashboard styling.
- Visual direction should also move the app away from mostly text-only surfaces by adding consistent math-strength marks, status symbols, and simple pictorial cues where they improve scanning and interaction clarity, but not by putting icons inside every button.

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
- GitHub Pages verified live for `v0.17.0` on 2026-05-11:
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/` lists `docs/v14` as latest.
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v14/index.html` returned HTTP 200.
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v14/js/app-core.js` served `APP_VERSION = "v0.17.0"`.
- 2026-05-12 project memory cleanup changed documentation/continuity only; `scripts/check-repo.ps1` passed afterward. No push or live verification was run.
- 2026-05-12 UI direction implementation ran `node --check` on all root JS modules and a CSS brace sanity check successfully. `scripts/check-repo.ps1` reported expected snapshot drift because root app files differed from latest `docs/v14` until the next snapshot publish.
- 2026-05-13 publish close ran `scripts/check-repo.ps1` after `docs/v15`; result: `All repo checks passed.`
- 2026-05-13 publish close ran `node --check` for all root JS modules; all syntax checks passed.
- GitHub Pages verified live for `v0.18.0` on 2026-05-13:
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/` lists `docs/v15` as latest.
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v15/index.html` returned HTTP 200.
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v15/js/app-core.js` served `APP_VERSION = "v0.18.0"`.
- 2026-05-13 Home dashboard pass ran `node --check` for all root JS modules; all syntax checks passed.
- 2026-05-13 Home dashboard pass ran a CSS brace sanity check; braces are balanced.
- 2026-05-13 Home dashboard pass ran `scripts/check-repo.ps1`; expected snapshot-drift failures reported for root app files because no new docs snapshot was published.
- 2026-05-13 Home execution batch reran `node --check` for all root JS modules; all syntax checks passed.
- 2026-05-13 Home execution batch reran `scripts/check-repo.ps1`; expected snapshot-drift failures reported for root app files because no new docs snapshot was published.
- 2026-05-14 touch-keypad fix ran `node --check` for all root JS modules; all syntax checks passed.
- 2026-05-14 touch-keypad fix ran a CSS brace sanity check; braces are balanced.
- 2026-05-14 touch-keypad fix ran `scripts/check-repo.ps1`; expected snapshot-drift failures reported because no new docs snapshot was published.
- 2026-05-14 UI polish batch ran `node --check` for all root JS modules; all syntax checks passed.
- 2026-05-14 UI polish batch ran a CSS brace sanity check; braces are balanced.
- 2026-05-14 UI polish batch ran `scripts/check-repo.ps1`; expected snapshot-drift failures reported for `index.html`, `styles.css`, `js/app-core.js`, `js/app-init.js`, and `js/app-progress.js` because the user requested no publish.
- 2026-05-14 UI polish batch could not use the in-app browser screenshot workflow because the required Node REPL browser tool was not exposed in this session; manual iPad/browser review remains needed.
- 2026-05-14 publish close bumped runtime version to `v0.20.0`, moved UI polish notes into `CHANGELOG.md`, published `docs/v17`, updated README, and ran `scripts/check-repo.ps1`; result: `All repo checks passed.`

## Working Tree Note

- Always inspect `git status --short` before editing. Publish-close sessions should also confirm `git remote -v` and live GitHub Pages status when pushing.
