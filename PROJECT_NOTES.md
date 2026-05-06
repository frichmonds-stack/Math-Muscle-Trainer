# Project Notes

This file is the project's working memory.

Use it for:
- design decisions
- important context from chats
- open questions
- backlog ideas that are not committed roadmap items yet

## Working Preferences

- Explanations should be beginner-friendly, scaffolded, and chunked.
- Avoid large text dumps.
- Prefer small steps with one clear action at a time when learning or setting things up.

## Current Project Snapshot

- Project name in the README: `Math Muscle Trainer`
- Tech stack: plain `HTML`, `CSS`, and `JavaScript`
- Main files:
  - `index.html`
  - `styles.css`
  - `js/app-core.js`
  - `js/app-practice.js`
  - `js/app-progress.js`
  - `js/app-techniques.js`
  - `js/app-init.js`
  - `README.md`
  - `CHANGELOG.md`
- Hosting:
  - GitHub repository is set up
  - GitHub Pages is enabled from `main` and `/(root)`

## Current Design Direction

- Workout/strength-training framing for multiplication practice
- Dark, gym-inspired visual theme
- App-style shell with dedicated Setup, Practice, Results, and Progress screens
- Strong focus on motivation, repeat practice, and visible progress

## Design Decisions

### Confirmed

- Keep a `notes` file for project memory instead of using a `roadmap` file for everything.
- Treat `README.md` as the current project overview.
- Treat `CHANGELOG.md` as version history.
- Treat this file as the flexible place for context, reasoning, and backlog items.
- Prefer `workout` as the main user-facing term across the app instead of mixing `session` and `workout`.
- Treat expressive results copy and small moments of visual "pop" as experiments that should be reviewed after seeing them live.

## Open Questions

- Which parts of the current design should be kept versus redesigned?
- How much of the workout theme should remain in the next design pass?
- What should the next teaching/explainer pass cover after the HTML basics?

## Backlog Ideas

- Continue the beginner-friendly walkthrough of the codebase in small chunks.
- Review the current UX and identify what feels strong versus confusing.
- Decide on the next round of redesign goals before editing UI structure again.
- Add more important decisions here as they come up.
- Build in sound as part of the next major update (answer feedback cues, milestone chimes, and a mute toggle).
- Add a touch ergonomics pass for iPad/mobile with minimum tap targets around `44x44px` (prefer `48-56px` for primary controls).
- iPad optimization plan for next major update:
  - Add a dedicated tablet breakpoint band (target `768-1180px`) and avoid collapsing to single-column too early.
  - Keep two-column layouts on iPad where useful (`header`, `setup`, `progress`, `records`) instead of using phone rules.
  - Preserve compact right-rail sizing/anchoring for top nav + Workout Tracker so it aligns with lower panels in both portrait and landscape.
  - Ensure touch ergonomics: minimum tap targets around `44x44px` (prefer `48-56px` for primary controls) with spacing between adjacent controls.
  - Add orientation-aware tweaks for grids (e.g., techniques cards and warm-up pattern rows) so density stays readable on iPad portrait.
  - Add iPad Safari polish: use dynamic viewport units where needed and support safe-area insets (`env(safe-area-inset-*)`).
  - Add a lightweight visual/performance pass for tablet devices (reduce heavy blur/shadow where needed without changing theme direction).
  - Add a focused QA pass on iPad resolutions before release (portrait + landscape, touch hit testing, carousel controls, keyboard/input flow).
- Add a competitive mode called `Flex`.
- Possible `Flex` directions:
  - points-based scoring for highest score
  - a short pressure timer that resets after each correct answer
  - timer expiry ends the run immediately
  - focus on speed, streaks, and competitive chaining
- After the current structural refinement settles, do a dedicated motion pass for screen transitions, lesson-step transitions, carousel movement, and subtle reveal/feedback animations.
- Add a theme/color mode changer so learners can switch visual style (not only dark red gym theme), based on user testing preference feedback.
- Post-`v0.10.0` single-shell stabilization backlog:
  - Replace full vertical stacking in Results/Progress with controlled section switching (tabs or scoped carousel behavior).
  - Re-introduce iPad swipe interactions only in intended content regions, with safe horizontal thresholds.
  - Continue light mode contrast cleanup across progress cards, coach notes, and utility controls.
  - Run a dedicated responsive spacing/alignment pass for tablet-first layouts.
  - Execute a structured regression QA pass before the next snapshot publish.

## Session Notes

### 2026-04-21

- Confirmed that chat history in VS Code should be treated as transient.
- Added this file so key project context survives across sessions.
- Started a larger polish pass focused on refinement rather than full redesign.
- Temporary hero tagline to try: `Grow your brain, begin your reign.`
- Results heading should feel more alive and can rotate based on workout outcome.
- Future settings direction, not yet built: full manual controls with preset buttons that snap the controls into recommended combinations.
- Snapshot polish pass focused on heading hierarchy, tracker alignment, split-panel dividers, carousel controls, and terminology consistency.
- Updated hero tagline to `Grow your brain & begin your reign.`
- Techniques mode now needs to scale as a reusable teaching system, so the lesson labels were generalized to `Idea #1` and `Idea #2`.
- `Guided` was renamed to `Assisted Reps` and `Check` was renamed to `Solo Reps` to keep the workout language consistent.
- Warm Up in techniques should feel active and teacher-like, so blanks can auto-check and vary slightly from run to run.
- Lesson completion should lead into a celebration moment, with optional further practice rather than forcing the learner straight on.

### 2026-04-22

- New major feature direction: add a teaching mode for single-table tricks.
- Current naming direction: `Learn / Techniques`.
- First lesson to build and refine: `10x`.
- Core teaching rule for `10x`: place the `0`.
- Lesson flow decision:
  - rule screen
  - flip-order screen showing the answer stays the same
  - pattern screen
  - guided practice
  - quick check
  - continue practicing
- Pattern screen notes:
  - show `1 x 10` through `12 x 10`
  - some rows complete
  - some answer stems blank
  - some factors blank
  - keep the `0` color-linked throughout
- Guided practice notes:
  - no timers or pressure
  - use wording like `place the 0`
  - include both `n x 10` and `10 x n`
- Quick check notes:
  - wrong answers should stay on the same fact
  - clear the typed answer
  - offer hint/help
  - finish after 5 correct total
- Continue practice notes:
  - keep practicing the same table lesson
  - generate questions in either direction
- Other tables should appear in the UI but stay greyed out with `Coming Soon` until their lessons exist.

### 2026-04-23

- Started the next refinement pass with accessibility and interaction polish rather than layout restructuring.
- Added keyboard support for carousel navigation (`Left`/`Right`) and faster escape routes (`Escape`) for dialogs and lesson exit flow.
- Added active/hidden accessibility state syncing (`aria-current`, `aria-hidden`) for screens and carousel slides.
- Added subtle motion polish with reduced-motion support to keep the app feeling lively without forcing animation-heavy behavior.
- Removed duplicate `app.js` definitions that could drift over time (results title overrides and technique stage metadata).
- Captured a note for the next major update: add optional sound design with a mute control.

### 2026-04-24

- Keep the rewards mechanic unchanged for the current feature pass.
- User testing feedback: the current reward mechanic (heart/star) was unclear and should be revisited in a dedicated rewards update.
- User testing feedback: negatives in multiplication did not feel evenly randomized across sign combinations (`- x -`, `- x +`, `+ x +`) and should be rebalanced.
- User testing feedback: current colors/theme did not resonate for some learners; add a color mode/theme switcher in a future UI pass.
- Addition negatives are planned for a future release, but implementation is intentionally deferred until the rules/UX are finalized.
- Major build pass shipped:
  - setup now includes an operation selector (Addition + Multiplication active; Subtraction/Division marked coming soon)
  - setup preview panel was removed and replaced with operation-aware settings flow
  - Addition supports timed/target/endless modes, with difficulty presets (`easy`, `medium`, `hard`) and no isolation mode yet
  - progress now supports operation filtering, records dual filters, and fact tracker operation switching
  - addition fact tracker buckets added with regrouping / non-regrouping splits and an overall view
  - techniques menu now starts with an operation selector and loads operation-specific lesson cards
  - iPad-first answer flow now includes an on-screen number pad with Enter to reduce virtual keyboard intrusion

### 2026-04-25

- Began a bundled polish pass with implementation deferred to a single release merge.
- Decided that Progress filters should be contextual per slide, not a single persistent global filter.
- Confirmed Workout Tracker should not show an operation filter.
- Confirmed Workout Records keeps both operation and workout-type filters together in the top-right heading area.
- Addition Fact Tracker polish direction:
  - move to clearer digit-based labels
  - use a 4-column layout on larger screens
  - reduce info density with tap-to-reveal card details
  - show status language as `Need Reps`, `Building`, `Strong`, and clean no-data states
- Positive Progress and Growth Opportunities should use bucket/table level signals instead of individual fact cards.
- Addition techniques menu polish direction:
  - `Make 10` stays selectable and marked `Under Construction`
  - non-built lessons are marked `Coming Soon`
  - lesson order now includes adding-by-place-value cards (`1s`, `10s`, `100s`, `1000s`) immediately after `Make 10`.
- Deferred items captured from the extended refinement session (discussed but not shipped in `v0.7.2`):
  - Addition techniques content pass:
    - Full reorder target:
      - `Make 10`
      - `Counting On (Easy)`
      - `Counting On (Medium)`
      - `Adding by 10`
      - `Adding by 100`
      - `Adding by 1000`
      - then `Bridging` ladder from easy to expert
    - Add split-technique cards:
      - `Split Technique (Easy)` (2-digit + 2-digit place-value split)
      - `Split Technique (Medium)` (2-digit + 3-digit place-value split)
      - `Split Technique (Hard)` (3-digit + 3-digit place-value split)
    - Add a dedicated addition `Skip Counting` section with cards for skip counting by `2` through `12`.
  - Techniques operation expansion:
    - Add `Subtraction` and `Division` to the Techniques operation selector and show their lesson frames as `Coming Soon`.
  - Practice feedback clarity:
    - Replace text-first right/wrong feedback with tick/cross-first signaling in Practice.
    - Add broader, easier-to-notice correctness feedback (not only subtle color + small text under input).
    - Continue a streak/combo polish pass to make momentum states more obvious at a glance.
  - iPad/input consistency follow-ups:
    - Add mitigation for iPad double-tap zoom while entering repeated digits (for example `22`) in Practice.
    - Review consistency between Learn and Practice for number-pad/input behavior.
  - Question generation polish:
    - Add a guard to avoid serving the exact same question twice in a row.
  - Progress/statistics review:
    - Run a focused usefulness review of tracker/statistics panels to confirm they provide actionable value.
  - Reflection/journaling:
    - Keep post-session reflection response as deferred (`not now`) until reliable user data collection/analysis path exists.
  - Major architecture note:
    - Plan a major revision to make the page feel like a self-contained webapp shell (not header + app), to reduce vertical scrolling and prepare for fuller app implementation.
  - Copy/content note:
    - Add motivation quote candidate in rotation:
      - `Attitudes determine your actions. Actions determine your destiny.`
  - Deploy workflow note:
    - Current patch was intentionally `build only`; docs sync + GitHub/web publish remains a separate explicit step when requested.

### 2026-04-27

- Confirmed end-goal layout direction: move to a single-display app shell so the full page behaves like an app surface, not a webpage with a persistent header band.
- Current persistent header + Workout Tracker rail is now treated as a transitional structure because it distorts sizing/space allocation; future layout pass should fold this into a unified app viewport architecture.

### 2026-04-28

- Published `v0.9.0` refinement state to GitHub Pages first, then shipped `v0.10.0` as `docs/v6` with a single-shell navigation model.
- Captured immediate follow-up risk: Results/Progress currently render all sections in a long vertical flow and need controlled section switching in the next stabilization pass.

### 2026-05-06

- Progress filters now use carousel-style left/right selectors (with hidden native selects retained for state compatibility).
- Fact Tracker selector visibility is operation-aware:
  - Addition: operation + detail
  - Subtraction: operation only
  - Division: operation + range
  - Multiplication: operation + detail + range
- Fact Tracker selector width is stabilized to a fixed single-line target based on `Without regrouping`.
- Version badge parsing now resolves the highest semantic release from `CHANGELOG.md` instead of relying on one strict heading match.
