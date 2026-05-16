# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by Keep a Changelog and uses a simple project-friendly version history.

## [Unreleased]

## [0.20.3] - 2026-05-16

### Changed
- Changed Home's `Workout Streak` headline to show the current consecutive-day streak while the strip still shows the last-7-days activity pattern.
- Tightened Home vertical spacing for shorter desktop windows, moved Home utility buttons higher, and improved Weekly Reps label layering/spacing so tall bars do not obscure values.

## [0.20.2] - 2026-05-16

### Added
- Added a partial Operation Mastery explainer dialog and clearer `score /100` context for mastery cards.
- Added daily goal progress coloring to Workout Tracker calendar days using a first default goal of 50 reps per day.
- Added a monthly reps-by-operation breakdown to Workout Tracker summary panels.
- Added in-card cumulative correct-rep tick counters for Learn stages that require correct reps before moving on.

### Changed
- Changed Home snapshot `Total Reps` and `Accuracy` into weekly metrics based on the visible last-7-days window.
- Changed Home layout spacing so the header has more breathing room and the dashboard stack sits more evenly above the dock.
- Changed Home `Workout Streak` into a rolling last-7-days count, tightened Weekly Reps columns, and changed Weekly Accuracy into a per-day strip.
- Changed Home's rotating daily thought to sit smaller and closer to the product title.
- Changed Home Daily Routine copy to `Daily Warmup Routine` / `Quick 5`.
- Changed Workout setup operation choices to keep all operations visible after selection and use the selected state as the highlight.
- Changed light-mode setup option rows, Learn lesson panels, Exit Lesson, and Operation Mastery cards to use softer shared surfaces instead of stark white blocks.
- Moved Practice recent-answer dots inside the question card and kept answer feedback icons inside the answer field.
- Increased Practice answer input text size and tightened the gap between the Practice HUD and question card.
- Removed raw rep counts from Workout Tracker calendar tiles.
- Removed the visible Workout Tracker calendar legend and changed monthly reps by operation from a stacked bar into a simple sublist under the Reps stat.
- Softened light-mode page indicators, contextual Results actions, calendar navigation, selectors, and tracker separators.
- Removed `Best` and `Next` rank labels from Operation Mastery overview/detail surfaces for now, and changed the slide heading to avoid repeating the carousel title.
- Changed Learn practice stages to advance from cumulative correct reps rather than attempts where a correct-rep minimum is shown.
- Changed narrow tablet and iPad portrait widths to use the scroll-friendly responsive layout instead of the fixed landscape app frame.

## [0.20.1] - 2026-05-14

### Added
- Added a rolling `docs/live` publishing workflow for routine internet updates without creating a new numbered snapshot.

### Changed
- Changed repo checks to accept `docs/live` as the latest live build while keeping numbered `docs/v*` folders as preserved snapshots.
- Refactored hidden Home quick-start tuning values into named constants for easier future adjustment.

### Removed
- Removed stale Home render paths and element hooks for old Home calendar/stat widgets that are no longer present.
- Removed unused Home header icon CSS after the Home card icons were dropped.

## [0.20.0] - 2026-05-14

### Added
- Added hidden adaptive Home quick-start settings so Quick 5 Warmup and 1 Minute Workout start easy for new users and quietly build from saved performance data.
- Added a 7-day Total Reps line graph and a visual Accuracy meter to the Home training snapshot.

### Changed
- Refined Home copy and spacing: Daily Routine now presents `Quick 5 Warmup`, Quick Workout now presents `1 Minute Workout`, and the learning card now says `Keep Learning`, `Pick up a new technique.`, and `Learn`.
- Italicized the Home daily thought and adjusted Home card spacing/icons for a calmer dashboard fit.
- Changed Home snapshot metrics to remove Average Pace and show Workout Streak, Total Reps, and Accuracy with richer visuals.
- Softened Practice visual containment so the problem/input remain primary while HUD and keypad controls read quieter.
- Changed Workout Tracker summary stats from card-like panels to static metric rows and stretched the left column to match the calendar height.

### Fixed
- Fixed Practice layout on touch-keypad devices by making the built-in number pad a compact control cluster that fits the app frame more reliably.
- Completed Quick 5 Warmup rows now show `Complete` and use a full-row completed state instead of only changing the tick icon.
- Dismissible streak banners can now be dismissed by clicking or tapping the banner.

## [0.19.0] - 2026-05-13

### Added
- Added a first-pass Home / Today's Training dashboard with the strong-arm brand mark, Daily Routine checklist, direct Quick Workout tiles, Continue Learning handoff, and Home snapshot metrics.
- Added a four-item bottom dock for Home, Workout, Learn, and Progress.
- Added direct-start Home routines: Daily Routine items start 5-correct operation workouts and Quick Workout tiles start 20-rep operation workouts.

### Changed
- Restored Home as the startup surface and moved About/Settings utilities into the Home banner area.
- Changed Home snapshot metrics to show day streak with a 7-day flame strip, total reps, accuracy, and average pace.
- Changed the Home banner tagline into a rotating daily thought set seeded with `Grow your brain & begin your reign.`
- Changed Continue Learning on Home to open the Make 10 lesson directly.
- Changed Workout Tracker month summaries from Hearts/Stars to reps and accuracy, and removed reward icons from the calendar.
- Removed decorative Practice HUD label icons and the bottom page-position indicator.
- Removed the Results `New Workout` action now that the dock owns the Workout destination.
- Rebound Results and Progress kicker-row carousel arrows so their controls work again.

## [0.18.0] - 2026-05-13

### Changed
- Softened the shared button, selector, toggle, metric-panel, lesson-card, and fact-card styling toward the minimalist all-ages iPad component direction while preserving the existing theme/color token system.
- Added a compact rounded training dock for primary app navigation and made Train the default entry surface.
- Reduced decorative icons inside destination/workout buttons so visuals can move toward app-level, lesson-level, progress/status, and math-context cues instead of cluttering every control.

## [0.17.0] - 2026-05-11

### Changed
- Changed the desktop/tablet-landscape app shell to preserve a fitted `1194 x 834` iPad-landscape canvas instead of stretching to arbitrary browser window shapes.
- Updated ADR-0007 to record the app viewport frame rule and clarify that extra desktop browser space is ambient frame, not app content to fill.

## [0.16.0] - 2026-05-11

### Added
- Added ADR-0007 to define the shared app-shell UI contract for headers, selectors, content roles, and interaction affordances.

### Changed
- Changed Home primary navigation from stacked CTA bars to compact app-style destination modules.
- Changed Results and Progress carousel headers to use a fixed kicker label track so navigation arrows stay static between slides.
- Moved Results workout actions into the Workout Summary content header.
- Changed Practice More lesson mode to auto-advance after correct answers and behave like a lesson-scoped workout.
- Updated multiplication lesson completion copy and CTAs toward clearer learn/practice/workout choices.

### Fixed
- Removed hover/lift affordances from display-only metric panels.
- Aligned Progress/Results operation selectors with slide content headers instead of global utility controls.
- Removed the visible nested Learn screen background so Techniques sits on the app canvas.
- Improved Workout Tracker calendar alignment, year heading emphasis, and centered weekday labels.
- Removed persistent success feedback text from lesson answer flows where field/icon feedback already confirms correctness.

## [0.15.0] - 2026-05-10

### Added
- Added a rolling 5-answer micro feedback rail in Practice to improve correctness visibility without slowing pacing.
- Added Learn operation slots for Subtraction and Division with visible `Coming Soon` placeholders.

### Changed
- Changed Operation Mastery controls to a single cyclic selector: `Overview -> Addition -> Subtraction -> Multiplication -> Division`.
- Changed Operation Mastery overview to a larger 2x2 snapshot grid for faster cross-operation scanning.
- Changed workout mode display labels to compact control-friendly names: `H.I.T`, `Target Reps`, `Isolation`, `Zen Mode`, `Spar Mode`.
- Changed the Practice session context pill to a compact status label with operation/mode/negatives context.
- Changed Workout Records heading copy to `Workout history at a glance`.
- Changed fact-detail carousel behavior to wrap cyclically instead of stopping at the end.

### Fixed
- Improved light-mode visibility of info tooltip dots.
- Fixed light-mode bottom page indicator active-dot accent so Solo Leveling light mode no longer shows a stray purple accent.
- Smoothed Learn screen light-mode background tinting for better consistency.

## [0.14.0] - 2026-05-09

### Added
- Added browser-local answer telemetry for mastery evidence, including operation, fact key, skill bucket, difficulty band, response time, session source, and session position.
- Added an Operation Mastery Progress panel with `Rookie -> Novice -> Adept -> Expert -> Elite -> Master -> Legend` ranks for Addition, Subtraction, Multiplication, and Division.
- Added mastery scoring based on accuracy, fluency, coverage, retention, consistency, and difficulty evidence.
- Added best-earned operation ranks so the app can show current form separately from the highest rank proven.

### Changed
- Changed Operation Mastery into a four-operation overview with focused detail for the selected operation.
- Changed Operation Mastery to use an explicit view selector: `Overview` for the 4-card snapshot and `Operation Detail` for a deeper single-operation panel.
- Aligned the Progress-screen kicker/header row so carousel labels such as `Fact Tracker`, `Next Focus`, `Coach Notes`, and `Workout Log` stay centered.
- Added iPad (768-1366px) spacing and selector polish for Progress slides, including mastery controls and focus columns.
- Hardened Progress rendering by escaping dynamic labels in priority/growth/progress cards and coach-tip fact labels before `innerHTML` output.

## [0.13.0] - 2026-05-08

### Added
- Added a reusable addition lesson runner for atomic `Idea -> Practice` components plus final mixed practice.
- Added linked addition lessons for Make 10, adding by 1s/10s/100s/1000s, Counting On Easy/Medium, and the Bridging ladder from Easy through Expert.
- Added linked multiplication lessons for every table from `x1` through `x12`, with table-specific strategy copy, examples, hints, warm-ups, assisted reps, solo reps, and completion states.
- Added addition lesson completion tracking in the Techniques menu and focused workout handoffs for completed lessons.
- Published `docs/v10` as the latest lesson expansion snapshot.

### Changed
- Unlocked all multiplication and addition lesson stage pills so learners can jump directly to any section without completing previous sections first.

### Fixed
- Restored Progress panel previous/next controls around the top red panel label after aligning it with the header buttons.

## [0.12.0] - 2026-05-07

### Changed
- Renamed project/product references to `Math Muscle Trainer` across app metadata, docs pages, snapshots, release helpers, and continuity files.
- Updated app descriptions to frame the product as a general arithmetic trainer for addition, subtraction, multiplication, and division.
- Renamed browser storage namespaces to `math-muscle-trainer-*` while keeping fallback reads for legacy saved progress and preferences.
- Published `docs/v9` as the latest Math Muscle Trainer snapshot.

## [0.11.0] - 2026-05-07

### Added
- Added carousel-style left/right operation selectors for Progress panels (`Workout Log`, `Next Focus`, `Coach Notes`) and Workout Records filters while keeping native `select` controls hidden for compatibility.
- Added lightweight PowerShell repo checks for duplicate IDs, missing script files, version drift, stale release labels, docs sync, and removed-helper regressions.
- Added a snapshot publishing helper to copy the current app into a new `docs/v*` folder and keep the docs index's latest marker singular.

### Changed
- Updated Fact Tracker selector behavior to operation-aware visibility:
  - Addition: operation + detail
  - Subtraction: operation only
  - Division: operation + range
  - Multiplication: operation + detail + range
- Stabilized Fact Tracker selector widths to a fixed single-line cap using `Without regrouping` as the maximum display target.
- Switched Fact Tracker selector arrows to shared white/neutral defaults with accent hover.
- Updated in-app version resolution to use the greater of the runtime fallback version and the latest released changelog version.

### Fixed
- Fixed the Make 10 lesson's `Start Focused Workout` action by routing it through the existing setup snapshot helper.
- Fixed division tracker training so a `division by n` card starts a full divisor isolation workout instead of narrowing to one fact.
- Centralized operation display symbols so division renders correctly while storage keys continue using `/`.
- Fixed stale docs version index copy that marked both v6 and v7 as latest.

## [0.10.0] - 2026-04-28

### Added
- Added a dedicated `Home` view as the default entry frame with quick-action cards for `Work Out`, `Learn`, and `My Progress`.
- Added explicit `Back to Menu` actions to focused non-home views (`Work Out` setup, `Learn`, `Results`, and `My Progress`) for app-like navigation.

### Changed
- Shifted the app to a single-shell navigation model where global hero/nav/tracker framing is shown only on `Home`.
- Removed visible cross-screen Results/Progress carousel controls and converted those areas to inline stacked sections.
- Updated Results/Progress section rendering logic to keep all content sections visible in one continuous view.
- Increased shell stability by moving the main stage to viewport-aware minimum height (`100dvh`) with natural scrolling.
- Bumped in-app version from `v0.9.0` to `v0.10.0`.

## [0.9.0] - 2026-04-28

### Added
- Added navigation-aware end-workout confirmation copy so leaving an active workout can route directly to `My Progress` or `Learn Techniques` after save.
- Added click/keyboard flip interactions for addition tracker cards so summary and recent-example views can be toggled in place.
- Added helper text under the daily rewards strip clarifying goal semantics: `Heart = 10 attempts` and `Star = 10 correct`.

### Changed
- Updated Learn `10x` assisted reps, solo reps, and practice stage layouts to use a shared practice-style question shell for visual consistency.
- Extended technique answer colour splitting to support factor-aware overlays for full-answer fields so entries like `40` and `100` render with clearer factor/zero separation.
- Improved question selection to avoid immediate fact repeats when alternative questions exist.
- Refined practice feedback copy to include explicit correct-answer guidance on misses/skips.
- Updated active workout navigation UX to use a confirm-before-leave workflow rather than disabling top-level navigation controls.
- Repositioned carousel indicators to top-centre and increased arrow prominence/size while pushing nav buttons further outside the carousel frame.
- Increased Options form spacing around stacked fields (including `Color Mode`) and improved touch ergonomics for answer entry/keypad controls.
- Enhanced focus/records information hierarchy to reduce same-weight text walls and better emphasize key metrics.
- Expanded light-mode contrast handling across workout/session chips, streak visuals, calendar cells, and technique completion/locked states.
- Bumped in-app version from `v0.8.0` to `v0.9.0`.

## [0.8.0] - 2026-04-27

### Added
- Added app-wide `Dark` / `Light` mode in Options (separate from color palette selection).
- Added touch swipe navigation for Results and Progress carousels.
- Added top-center carousel position indicators (`current / total` + dots) for Results and Progress.

### Changed
- Fixed multiplication fact-tracker table status chips so attempt-driven status labels render correctly.
- Switched question selection to use a session-stable question pool (rebuilt at workout start instead of every prompt).
- Added rolling-window pruning for dated progress stores (`dailyRecords`, `bucketDaily`, `workoutHistory`) to keep browser storage bounded.
- Added capped addition example memory by bucket (5 recent examples per bucket) and surfaced recent examples directly on addition tracker cards.
- Split monolithic runtime logic from `app.js` into focused files under `js/` (`app-core`, `app-techniques`, `app-practice`, `app-progress`, `app-init`) to reduce maintenance drag before feature expansion.
- Updated skip semantics so skipping no longer advances question-goal completion, while still counting as a missed fact signal for tracker difficulty stats.
- Added fact-progress compaction caps (per operation + global) with retention based on recency and difficulty signals to keep `facts` storage bounded.
- Renamed session/progress internals toward `answered` semantics while retaining legacy `attempted` mirrors for backward compatibility.
- Reworked Setup operation cards so selected operation exposes a `Change` reset action (no confirmation) and cleanly returns setup to the starting state.
- Removed forced keypad lockout so keyboard input remains available even when number pad is visible.
- Replaced keypad minus entry with a sign-toggle control to reduce delete/retype friction.
- Removed duplicate submit pathway in keypad mode by dropping the extra keypad `Enter` row.
- Tightened practice vertical spacing (HUD, problem area, keypad, and feedback) for better tablet fit.
- Restyled floating carousel arrows with stronger contrast and moved them to overlap frame boundaries for clearer affordance.
- Added soft carousel height governance with bounded min/max behavior (no hard fixed height).
- Upgraded Learn stage pills to explicit states (`current`, `unlocked`, `locked`) with lock icon treatment for inaccessible steps.
- Added stage-pill click navigation for unlocked Learn steps.
- Added color-coded technique input rendering so typed answers visually match factor/zero example color language.
- Improved Frozen palette contrast where factor and zero highlight colors were colliding.
- Widened Options dialog and added internal scroll containment for longer settings/update content.

## [0.7.2] - 2026-04-25

### Added
- App appearance palettes in Options with five selectable themes: `Original`, `Sunny Beach Day`, `Jungle`, `Frozen`, and `Aang`.
- Number-pad preference control in Options with `Auto`, `Always On`, and `Always Off`.
- Fact Tracker secondary selector:
  - Addition: `Overall`, `With regrouping`, `Without regrouping`
  - Multiplication: `Overall`, `Positive Integers`, `All Integers`

### Changed
- Setup now starts in split layout and keeps the right panel visible from the beginning.
- Removed setup backtrack buttons and moved backtracking to inline editing of earlier choices.
- Setup settings panel now unlocks after workout type selection, with a guided waiting message beforehand.
- Addition fact tracker cards now use the same static card style as multiplication cards (selector-driven detail view instead of tap-flip).
- Migrated accent-hardcoded UI reds to theme-aware accent tokens so palette changes apply consistently across the app shell.

## [0.7.1] - 2026-04-25

### Changed
- Reworked Setup into a progressive flow: choose operation first, then (for addition) difficulty, then workout type before advanced options appear.
- Added setup backtracking controls so operation and workout type can be changed without leaving the screen.
- Stopped persisting setup choices between workouts so each new workout begins from a fresh setup state.
- Moved addition difficulty ahead of workout type selection to better match the decision flow.
- Replaced Spar/Knockout strike progress bars with a 3-box strike HUD that marks each miss with an `X`.
- Boosted streak feedback with stronger tier visuals and a visible in-workout combo counter.
- Updated Techniques menu layout with the operation selector in the header, streamlined intro copy, and removed redundant prompt/callout text.
- Updated Fact Tracker title copy to operation-aware wording: `Track the development of your {operation} skills.`

## [0.7.0] - 2026-04-25

### Added
- Per-slide operation filters for Workout Log, Next Focus, and Coach Notes so filtering is contextual instead of globally persistent.
- Bucket-level trend cards for Positive Progress and Growth Opportunities (multiplication tables + addition buckets) using rolling 7-day comparisons.
- Addition tracker tap-to-reveal cards with a front summary and back regrouping split.
- New staged addition lesson cards:
  - Adding by 1s
  - Adding by 10s
  - Adding by 100s
  - Adding by 1000s

### Changed
- Updated Workout Records controls so operation + workout-type filters sit together in the top-right heading.
- Refined addition bucket labels to explicit digit language (for example `1-digit + 2-digit`).
- Changed lesson availability messaging so `Make 10` is `Under Construction` (selectable) and remaining addition lessons are `Coming Soon`.
- Improved calendar readability and touch ergonomics with stronger weekday/day contrast and larger month-nav targets.
- Rebalanced tracker column spacing and compact stat sizing for iPad presentation.

## [0.6.0] - 2026-04-24

### Added
- Operation-first setup flow with a dedicated arithmetic selector (Addition + Multiplication active, Subtraction/Division marked coming soon).
- Addition workout support for High Intensity Training, Target Reps, Zen Mode, and Spar Mode (Isolation intentionally excluded for this release).
- Addition difficulty presets (`easy`, `medium`, `hard`) with equal-weighted category sampling.
- iPad-friendly on-screen number pad with Enter support to reduce virtual keyboard intrusion during practice.
- Operation-aware filters in My Progress (`All`, `Multiplication`, `Addition`) that drive overview, focus, and coach views.
- Fact Tracker operation switching with a new addition tracker view:
  - Make 10
  - Single + Single
  - Single + Double
  - Double + Double
  - Triple + Single
  - Triple + Double
  - Triple + Triple
- Addition bucket analytics split into overall, with regrouping, and without regrouping.
- Workout Records dual-filtering by operation and workout type, with operation-conditional mode options.
- Technique menu operation selector that loads multiplication or addition lesson sets.

### Changed
- Replaced the Setup workout preview panel with a two-column operation + settings layout.
- Added streak intensity visuals (`smoke`, `spark`, `flame`) around the progress bar and practice area.
- Updated browser storage keys for this release (`v2`) to simplify migration while operations are expanding.
- Updated options modal update notes to reflect the operation-layer release.

### Notes
- Rewards mechanic was intentionally left unchanged in this pass.
- User testing note captured: rewards icon meaning (heart/star) needs a dedicated clarity pass.
- User testing note captured: multiplication negatives randomization needs rebalancing across sign combinations in a future update.

## [0.5.1] - 2026-04-23

### Added
- Keyboard shortcuts for Results and Progress carousels (`Left`/`Right` arrows) plus `Escape` handling to close open dialogs and quickly exit an in-progress lesson.
- A close button on the lesson-exit confirmation dialog for consistency with the other app dialogs.

### Changed
- Added stronger accessibility semantics for hidden/active screens and carousel slides, plus active nav `aria-current` state updates.
- Added subtle transition polish for carousel slides and techniques screens with a `prefers-reduced-motion` fallback.
- Removed duplicate stage metadata and duplicate results-title overrides in `app.js` to simplify maintenance.

## [0.5.0] - 2026-04-22

### Added
- A full-screen two-step Learn / Techniques flow so table selection and lesson content no longer compete side by side.
- A completion state for finished technique lessons so completed tables show differently on the Techniques menu.
- A post-lesson celebration screen with routes back to Techniques, into optional extra practice, or back to Work Out.
- A new Positive Progress section ahead of corrective focus cards in Results and My Progress.

### Changed
- Reworked the `10x` lesson into `Idea #1`, `Idea #2`, `Warm Up`, `Assisted Reps`, and `Solo Reps`.
- Made pattern blanks semi-random with auto-checking feedback, including occasional blank `10` factors.
- Changed assisted reps to auto-advance after correct answers instead of requiring a separate next button.
- Preserved typed lesson answers when opening hints, while still clearing wrong solo-rep answers as intended.
- Made extra post-lesson practice voluntary instead of an automatic final stage.
- Disabled carousel arrows at the ends, strengthened their floating treatment, and anchored them more consistently so they stop shifting with panel height.
- Rebalanced the header with a larger hero/title presence, a wider workout tracker card, a more elongated cog button, and a unified Learn Techniques nav treatment.
- Updated the hero tagline to `Grow your brain & begin your reign.`

## [0.4.0] - 2026-04-22

### Added
- Version 3 app shell with dedicated Setup, Practice, Results, and Progress screens.
- Learn / Techniques mode with a first-pass `10x` lesson flow.
- A mini lesson sequence for the `10x` table covering the rule, flipped order, pattern building, guided practice, quick check, and open-ended follow-up practice.
- A compact cog-style options control in the main nav.
- Timed, question-goal, and endless workout types with preset and custom limits.
- Countdown start flow before every workout begins.
- Shared month-view workout tracker calendar with disabled month navigation when no earlier data exists.
- Phase 1 browser-local streak tracking and current-month practice calendar.
- Negatives mode for signed integer multiplication while keeping the setup range magnitude-based.
- Workout-themed header branding with rotating strength-building quotes.
- Zen Mode and Spar Mode variants under Free Training.
- Personal best and recent workout tracking for completed workouts.
- Options dialog with version info and recent updates.
- Daily stat tracking for most attempts in a day.

### Changed
- Refocused practice into a minimalist timed-answer interface with brief right/wrong feedback only.
- Expanded the main nav so learning sits alongside workouts and progress as a first-class destination.
- Reworked daily rewards into star and heart cards that shade as progress builds and complete with stronger states.
- Moved deeper insights like trouble spots, history, and fact tracking into Results and Progress instead of showing everything during practice.
- Shifted the header into a slimmer intro band with compact daily progress and `Progress` / `Work Out` navigation.
- Swapped the palette to a darker strength-focused workout theme.
- Renamed the setup, preview, tracker, and log copy to match the workout framing.
- Converted both Results and Progress into carousel-style panels to cut down on scrolling.
- Reworked Results and Progress to use synced tracker layouts, split focus panels, and a dedicated records slide.
- Replaced the browser end-workout confirmation with a custom in-app modal.
- Changed timed workout HUDs to count down remaining workout time instead of counting up.
- Polished the setup alignment, hero sizing, carousel controls, tracker/calendar spacing, and split-panel balance for the next snapshot.

### Planned
- Additional table techniques beyond `10x`.
- Additional arithmetic operations beyond multiplication.
- Richer celebration artwork and milestone visuals.
- Leaderboard support.
- Deeper per-table fact drilldowns.

## [0.2.0] - 2026-04-19

### Added
- Live question timer in the practice area.
- Session goal messaging and a post-session recap card.
- Table radar view for seeing progress by multiplication table.
- Saved practice settings so the trainer remembers the last-used setup.
- Documentation entry for the new learning and persistence features.

### Changed
- Expanded focus mode so the `1s` table can be selected.
- Refined trouble-spot weighting so weaker facts stand out more clearly.
- Polished the practice layout with additional responsive UI sections.

## [0.1.0] - 2026-04-19

### Added
- Initial Math Muscle Trainer build with plain HTML, CSS, and JavaScript.
- Mixed-table and focus-table practice modes.
- Adaptive question weighting based on progress.
- Session stats, saved progress, trouble spots, and recent answers.
