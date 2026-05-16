# Session Log

This log records durable session milestones and active handoff notes. Keep detailed release history in `CHANGELOG.md`, implementation state in `ai/current-state.md`, active questions in `ai/open-threads.md`, and executable next work in `ai/tasks/next-actions.md`.

## 2026-05-07 - AI Continuity And Rename Foundation

- Added repo-native AI continuity under `ai/`, root `AGENTS.md`, session start/close prompts, and ADR-0001.
- Clarified continuity ownership: `AGENTS.md`, `ai/`, and `docs/decisions/` are Codex-managed; `README.md`, `CHANGELOG.md`, and `PROJECT_NOTES.md` remain regular project docs.
- Standardized product/site naming as `Math Muscle Trainer`, renamed browser storage namespaces to `math-muscle-trainer-*` with legacy fallback reads, bumped the app to `v0.12.0`, and prepared `docs/v9`.
- Added `ai/task-map.md` and expanded session-close protocol so future sessions explicitly report docs updates, push status, and live verification status.
- Published and verified the rename/continuity batch on GitHub Pages.

## 2026-05-08 - Lesson Expansion And Content Workflow

- Added reusable addition lessons for Make 10, adding by 1s/10s/100s/1000s, Counting On Easy/Medium, and Bridging Easy/Medium/Advanced/Expert.
- Added addition completion tracking with `addition:<lesson-id>` keys and focused workout handoffs.
- Added table-specific multiplication lessons for `x1` through `x12`.
- Unlocked addition and multiplication lesson stage pills so learners can inspect any section.
- Recorded ADR-0003 for the reusable addition lesson loop and ADR-0004 for unlocked lesson sections.
- Initialized `learn/` teacher-authored content workflow and recorded ADR-0005.
- Published the lesson expansion as `v0.13.0` in `docs/v10`; repo checks passed and GitHub Pages was verified live.

## 2026-05-09 - Product Direction And Mastery Branch

- Clarified product direction: finish lesson content first, then lesson progression, four-operation mastery visibility, and onboarding/new-user flow.
- Confirmed iPad-first and eventual Apple App Store direction.
- Confirmed gamification is not the core goal; retention should come from skill-building, habit formation, visible growth, and mastery.
- Confirmed the app should stay usable from primary students through adults with a universal arithmetic-strength/mastery identity.
- Started `feature/learning-telemetry-mastery`.
- Added capped browser-local answer telemetry and the first Operation Mastery Progress slide.
- Implemented the rank chain `Rookie -> Novice -> Adept -> Expert -> Elite -> Master -> Legend`.
- Bumped root app to `v0.14.0`, generated `docs/v11`, and recorded ADR-0006.

## 2026-05-10 - Operation Mastery And Hybrid UI Pass

- Added `operationBestRanks` so current rank can move up/down while best-earned rank only rises.
- Reworked Operation Mastery from dense all-in-one cards to overview/detail, then to a single selector cycle: `Overview -> Addition -> Subtraction -> Multiplication -> Division`.
- Polished Progress layouts for iPad/tablet widths and hardened dynamic Progress markup by escaping labels before insertion.
- Executed a hybrid UI consistency pass: Learn placeholders, practice micro-feedback rail, light-mode fixes, Progress spacing, selector fit, and bottom-nav color consistency.
- Published the hybrid pass as `v0.15.0` in `docs/v12`; repo checks passed after snapshot publish.

## 2026-05-11 - App-Shell Contract And v0.16.0 Release

- User pushed for a more app-native, iPad-oriented visual direction rather than web-style stacked CTAs and nested panels.
- Established the shared app-shell UI contract in ADR-0007:
  - top-right global utility rail is Home/settings only,
  - carousel/kicker rows use fixed label tracks,
  - content headers own local selectors/actions,
  - static metrics do not hover/lift,
  - actionable tiles keep interactive affordances,
  - avoid large nested website-style section cards.
- Applied the UI system batch across Home, Results, Progress, Learn, and multiplication Practice More.
- Made Practice More auto-advance after correct answers and aligned its copy/feedback with the speed-first practice direction.
- Published, merged, pushed, and verified `v0.16.0` in `docs/v13`; repo checks and root JS syntax checks passed.

## 2026-05-11 - v0.17.0 App Viewport Frame

- User confirmed the app end-goal makes a preserved app viewport frame appropriate.
- Changed desktop/tablet-landscape rendering so `.page-shell` fits a centered `1194 x 834` iPad-landscape canvas rather than stretching to arbitrary desktop browser dimensions.
- Kept narrow/mobile behavior scroll-friendly below `700px`.
- Updated ADR-0007, bumped the app to `v0.17.0`, published `docs/v14`, pushed `main`, and verified GitHub Pages live.
- Checks passed: `scripts/check-repo.ps1` and `node --check` on all root JS modules.

## 2026-05-11 - Active UI Intake For Next Batch

- Practice screen still has an obvious large "box within the shell"; remove or soften the container while preserving HUD, progress bar, problem card, input, and keypad as functional units.
- `Exit Lesson` is local to lesson mode and should move out of the global utility rail into the lesson header/content area.
- Progress and Results kicker/header spacing still need a joint pass so labels are centered in their reserved tracks and headers get enough breathing room.
- Workout Tracker summary stats still look highlightable; remove hover/highlight affordances from display-only metrics.
- Home menu was tactically centered with `Learn`, `Start Workout`, and `Progress`; fuller Home composition remains deferred.

## 2026-05-12 - Project Memory And Roadmap Pruning

- User chose backlog/roadmap cleanup as the best use of available Codex time.
- Reworked `PROJECT_NOTES.md` into durable project memory with current snapshot, design direction, decisions, idea bank, adaptive learning ideas, and short recent-session memory.
- Reorganized `ai/open-threads.md` into decision categories.
- Reorganized `ai/tasks/next-actions.md` into concrete groups.
- Compressed `ai/session-log.md` into milestone entries plus active handoff notes to reduce duplicate history already covered by `CHANGELOG.md`, ADRs, and `ai/current-state.md`.
- Added roadmap/process attention for reviewing the AI continuity infrastructure and deciding an explicit versioning policy.
- Added toggle ideas to the backlog and recorded that adaptive learning should not be a simple user-facing on/off setting.
- Captured the design target as minimalist, friendly native iPad controls for all ages: clear and low-clutter without becoming cold, boxy, or childish.
- Created `docs/design/ui-direction.md` as the stable design direction document and linked it from `ai/task-map.md` and ADR-0007.
- Created `docs/design/component-system.md` as the reusable role/class contract so future UI work can share one button/control/content system while visual exploration continues.
- Implemented the first CSS alignment pass for shared controls: softer tactile buttons, toggles, selectors, metrics, lesson cards, and fact/action cards using the existing theme/color system.
- Captured the need for small visual anchors/icons/math-strength marks so the app evolves from mostly text-based surfaces into a more interactive native-app feel.
- Applied the first visual-anchor implementation to Home, Setup, and Practice: Home destination marks, operation symbols, workout-type cues, and Practice status/HUD icons.
- Added `docs/design/current-button-ui.md` to document the current implemented button/control baseline for screenshot comparison.
- Clarified that the visual upgrade should not mean putting icons inside every button; future visual richness should live more at the app/screen/card/lesson/progress/status level.
- Added a compact centered rounded training dock for `Train`, `Learn`, and `Progress`.
- Changed app startup to open directly to the Train/setup surface instead of the launcher-style Home surface.
- Removed decorative visual anchors from Home destination buttons and Setup workout-type choices; operation symbols and Practice status/HUD cues remain where they carry direct math/status meaning.
- Ran `node --check` on all root JS modules; syntax checks passed.
- Ran a CSS brace sanity check; braces are balanced.
- Reran `scripts/check-repo.ps1`; expected snapshot-drift failures remain because root `index.html`, `styles.css`, `js/app-core.js`, `js/app-init.js`, and `js/app-practice.js` now differ from latest `docs/v14`.

## 2026-05-13 - v0.18.0 GitHub Sync

- Bumped the runtime app version to `v0.18.0`.
- Moved the UI direction changelog notes into the `0.18.0` release heading.
- Published `docs/v15` from the root app and updated `docs/index.html` to mark it latest.
- Ran `scripts/check-repo.ps1`; result: `All repo checks passed.`
- Ran `node --check` on all root JS modules; syntax checks passed.
- Pushed `main` to GitHub and verified GitHub Pages serving `docs/v15` with `APP_VERSION = "v0.18.0"`.

## 2026-05-13 - First-Pass Home / Today Dashboard

- Replaced the old launcher-style active Home with a native-app-style `Today's Training` dashboard.
- Restored Home as the startup view while keeping the compact bottom dock for `Train`, `Learn`, and `Progress`.
- Added a screen-level math-strength mark, one primary `Start Today's Training` CTA, Customize/setup handoff, quick operation tiles, Learn and Progress handoffs, Next Focus fallback copy, and a static training snapshot strip.
- Wired `Start Today's Training` to a safe existing 5-question multiplication warm-up through the normal setup/session helpers.
- Wired quick operation tiles to preselect the operation and route into the existing Train/setup flow.
- Archived the previous Home direction in `docs/design/home-screen-archive-v0.18.0.md`, pointing to the exact `docs/v15` implementation.
- Ran `node --check` on all root JS modules; syntax checks passed.
- Ran a CSS brace sanity check; braces are balanced.
- Ran `scripts/check-repo.ps1`; expected snapshot-drift failures remain because root app files differ from latest `docs/v15` and no new snapshot was published.
- Executed the Home follow-up batch: no `Start Today's Training` button, Daily Routine rows now launch 5-correct operation routines, Quick Workout tiles launch direct 20-rep workouts, Home uses the standalone strong-arm mark with old banner copy, and the dock is now `Home / Workout / Learn / Progress`.
- Removed the Home Next Focus card, changed snapshot metrics to day streak with 7-day flame strip, total reps, accuracy, and average pace, and rebound the Results/Progress red kicker-row carousel arrows.

## 2026-05-13 - v0.19.0 Home Dashboard Publish Batch

- Finished the Home dashboard follow-up polish: larger Novare/banner treatment, tighter Home composition, redesigned Home metric cards, daily-thought tagline rotation, white Daily Routine row text, direct Make 10 lesson handoff, and direct 20-rep Quick Workout starts.
- Removed the Results `New Workout` action because the persistent dock owns the Workout destination.
- Removed decorative Practice HUD label icons and the bottom page-position indicator.
- Changed Results/Progress tracker month summaries from Hearts/Stars to reps and accuracy, removed the reward icons from calendar days, and removed hover affordances from display-only tracker summary cards.
- Published `docs/v16` as the `v0.19.0` Home dashboard snapshot.
- Ran `node --check` on all root JS modules; syntax checks passed.
- Ran `scripts/check-repo.ps1`; result: `All repo checks passed.`

## 2026-05-14 - Touch Keypad Reachability Fix

- Student testing found keyboardless devices could not use Practice when the built-in number pad extended below the fixed app frame and could not be scrolled into view.
- Changed the touch keypad into a compact, capped-width control cluster instead of letting it dominate the Practice screen.
- Added coarse-pointer tablet scaling for Practice spacing, problem card height, answer input height, and keypad button height so the keypad has a better chance of fitting inside the fixed app frame.
- Updated `ai/current-state.md` to correct the actual latest root/docs state to `v0.19.0` and `docs/v16`.
- Ran `node --check` on all root JS modules; syntax checks passed.
- Ran a CSS brace sanity check; braces are balanced.
- Ran `scripts/check-repo.ps1`; expected snapshot-drift failures reported because no new docs snapshot was published.

## 2026-05-14 - Home, Practice, And Tracker UI Polish

- Updated Home card copy: `Quick 5 Warmup`, `1 Minute Workout`, and `Keep Learning` with `Pick up a new technique.` and a `Learn` button.
- Added hidden adaptive Home quick-start settings based on local progress data. New users start easy; Quick 5 uses 5-correct routines and 1 Minute Workout starts timed one-minute operation workouts.
- Reworked the Home snapshot into Workout Streak with a 7-day strip, Total Reps with a 7-day line graph, and Accuracy with an intensity-based visual. Average Pace was removed from Home.
- Made Quick 5 completed rows show `Complete` with a full-row completed state, and made streak banners dismiss on click/tap.
- Softened Practice containment by removing the outer practice panel surface and quieting HUD/keypad styling.
- Reworked Workout Tracker summary stats into static metric rows and stretched the left summary column to the calendar height.
- Ran `node --check` on all root JS modules; syntax checks passed.
- Ran a CSS brace sanity check; braces are balanced.
- Ran `scripts/check-repo.ps1`; expected snapshot-drift failures reported because the user requested no publish.
- Browser screenshot review was not run because the required in-app browser Node REPL tool was not exposed in this session.
- Follow-up Home polish italicized the daily thought, changed the Quick 5 mark to a CSS-drawn sunrise, replaced the emoji lightbulb with a style-matched CSS mark, tightened the Quick 5 card gap, added breathing room to the 1 Minute Workout card header, and nudged Home content to use more vertical space above the dock.

## 2026-05-14 - v0.20.0 UI Polish Publish Close

- Removed Home card header icons after visual review; Keep Learning now places a compact `Learn` button inline beside `Pick up a new technique.`
- Changed the Home snapshot Total Reps visual from a line graph to rectangular columns and changed Accuracy to a simpler horizontal fill meter.
- Bumped `APP_VERSION` to `v0.20.0`, moved UI polish notes from `Unreleased` into the `0.20.0` changelog heading, and updated README feature/publish notes.
- Published `docs/v17` as the `v0.20.0 UI polish snapshot`.
- Ran `node --check` on all root JS modules; syntax checks passed.
- Ran a CSS brace sanity check; braces are balanced.
- Ran `scripts/check-repo.ps1`; result: `All repo checks passed.`
- Pushed `main` to GitHub and verified GitHub Pages serving `Live - v0.20.1 live cleanup`, including `/live/` and `/live/js/app-core.js`.
- Pushed `main` to GitHub and verified GitHub Pages serving Version 17 / `v0.20.0`, including `v17/` and `v17/js/app-core.js`.

## 2026-05-14 - Post-Release Optimization Pass

- Removed stale Home element references and render branches for old Home calendar/stat widgets that no longer exist in `index.html`.
- Pulled hidden Home adaptive quick-start thresholds, recent-answer limits, difficulty bands, and factor ranges into named constants in `js/app-init.js`.
- Removed unused CSS for the discarded Home header icon mark classes.
- Ran `node --check` on all root JS modules; syntax checks passed.
- Ran a CSS brace sanity check; braces are balanced.
- Ran `scripts/check-repo.ps1`; expected snapshot-drift failures reported because the cleanup has not been published to a new `docs/v*` snapshot.

## 2026-05-14 - v0.20.1 Rolling Live Publishing Flow

- User chose a rolling live build workflow with patch versions for routine internet updates and preserved numbered `docs/v*` snapshots only for significant milestones or explicit archive requests.
- Added ADR-0008 for the rolling `docs/live` publishing channel.
- Added `scripts/publish-live.ps1` to copy root app files into `docs/live` and mark the live build latest in `docs/index.html`.
- Updated `scripts/check-repo.ps1` so the latest marker can point to `docs/live`; when live is latest, checks compare root app files against `docs/live`.
- Updated AGENTS, README, `PROJECT_NOTES.md`, `ai/task-map.md`, `ai/current-state.md`, and `ai/tasks/next-actions.md` for the new live-vs-snapshot release flow and logged future snapshot pruning.
- Bumped runtime version to `v0.20.1`, released the cleanup notes in `CHANGELOG.md`, and published `docs/live` with label `v0.20.1 live cleanup`.
- Ran `node --check` on all root JS modules; syntax checks passed.
- Ran a CSS brace sanity check; braces are balanced.
- Ran `scripts/check-repo.ps1`; result: `All repo checks passed.`

## 2026-05-15 - UI Clarity Polish Batch

- Changed Home `Total Reps` and `Accuracy` into weekly metrics based on the same visible last-7-days window as the Home chart.
- Changed Home routine copy to `Daily Warmup Routine` / `Quick 5`.
- Kept all Workout setup operation choices visible after selection, centered operation choice text, and hid the old `Change` micro-button in preparation for future multi-operation selection.
- Moved Practice answer feedback icons inside the answer field and moved the recent-answer dot rail inside the question card.
- Removed raw rep counts from Workout Tracker calendar tiles and replaced them with daily goal progress tiers using an initial 50 reps/day internal goal plus a compact legend.
- Added monthly reps-by-operation breakdowns to Results/Progress Workout Tracker summaries.
- Added a partial Operation Mastery clarity pass: `?` explainer dialog, `/100` score context, no overview/detail `Best` or `Next` labels, and no empty `Strongest` line.
- Softened light-mode page indicators, Results contextual action styling, tracker separators, and static metric hover affordances.
- Investigated responsive screenshots with local headless Chrome. Changed the scroll-friendly layout breakpoint from `700px` to `900px` so iPad portrait and narrow tablet/resized windows no longer clip inside the fixed landscape frame; iPad landscape remains fixed-frame.
- Session-close review logged follow-up changes for the next pass: calendar month nav should return to its previous position, the calendar legend should be removed, daily goal communication should move elsewhere, reps by operation should become a sublist instead of a bar graph, Operation Mastery should avoid duplicate title wording and improve selector arrow spacing, Home Workout Streak should become a rolling 7-day metric, Weekly Reps needs clearer scale/tighter columns, and Weekly Accuracy needs a better graphic.
- Ran `node --check` on all root JS modules; syntax checks passed.
- Ran a CSS brace sanity check; braces are balanced.

## 2026-05-16 - Home Rhythm And Tracker Follow-Up

- Rebalanced Home dashboard vertical rhythm after screenshot review: the header has more breathing room, and the dashboard content stack sits more evenly above the dock without adding filler content.
- Changed Home Workout Streak to a rolling last-7-days workout-day count, tightened Weekly Reps columns, and changed Weekly Accuracy from a single fill block to a per-day strip.
- Removed visible Workout Tracker calendar legends while keeping daily-goal color tiers, and changed monthly reps by operation from a stacked bar into a simple sublist.
- Changed Operation Mastery's slide heading to `Your operation ranks` so it no longer duplicates the carousel kicker, and gave the mastery selector arrows more spacing.
- Follow-up execution tightened shared selector pills across Progress/Learn so arrows stay inside and labels remain centered in light mode.
- Softened light-mode setup option rows, Learn panels, Exit Lesson, and Operation Mastery cards away from stark white blocks.
- Increased Practice answer input text size and tightened the gap between the HUD and question card.
- Added cumulative correct-only green-tick counters inside Learn question cards for correct-rep-gated stages; wrong answers do not fill or reset ticks.
- Changed gated addition and Make 10 practice progression to advance by cumulative correct reps rather than attempts.
- Ran `node --check` on all root JS modules; syntax checks passed.
- Ran a CSS brace sanity check; braces are balanced.
- Captured local Chrome screenshots for Home, Progress overview, Progress tracker/focus, Learn menu, Learn practice, and Workout setup in light mode.
- Ran focused 390px mobile screenshots after the optimization pass and fixed the Progress page-dot overlap by making the carousel position indicator flow in the mobile layout.
- Bumped runtime version to `v0.20.2`, moved the polish notes into the `0.20.2` changelog heading, and published `docs/live` with label `v0.20.2 UI polish`.
- Ran `scripts/check-repo.ps1`; result: `All repo checks passed.`
- Prepared release commit `Release v0.20.2 UI polish` for GitHub sync.
