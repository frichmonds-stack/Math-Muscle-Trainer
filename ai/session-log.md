# Session Log

## 2026-05-07 - AI Continuity Setup

- Added repo-native AI continuity structure under `ai/`.
- Added root `AGENTS.md` so future Codex sessions have project guidance.
- Added start and close prompts for future AI sessions.
- Added ADR-0001 to document the decision to keep continuity files in the repo.
- Captured current app state, open threads, and safest next actions.
- No app runtime behavior was intentionally changed by this setup.

## 2026-05-07 - Continuity Ownership Clarified

- Clarified that `AGENTS.md`, `ai/`, and `docs/decisions/` are Codex-managed continuity files.
- Recorded that the user should not need to maintain those files manually.
- Kept `README.md`, `CHANGELOG.md`, and `PROJECT_NOTES.md` as regular project documentation with distinct roles.

## 2026-05-07 - Project Rename Standardized

- Standardized product/site naming as `Math Muscle Trainer` across app metadata, docs pages, scripts, and snapshots.
- Updated descriptions to frame the app as a general arithmetic trainer covering addition, subtraction, multiplication, and division.
- Renamed browser storage namespaces to `math-muscle-trainer-*` with fallback reads for legacy saved progress and preferences.
- Bumped the root app to `v0.12.0` and prepared `docs/v9` as the latest snapshot.

## 2026-05-07 - AI Task Map Added

- Added `ai/task-map.md` to route future AI sessions by work type.
- Updated `AGENTS.md` and `ai/prompts/session-start.md` so session startup includes the task map.
- Recorded task-map ownership inside the AI continuity system.

## 2026-05-07 - Session Close Protocol Expanded

- Expanded `AGENTS.md` and `ai/prompts/session-close.md` so session close includes affected documentation updates.
- Added explicit release/publish close steps for snapshot publishing, Git status/remote checks, requested pushes, and live GitHub Pages verification.
- Added a rule that future sessions must not claim GitHub or the live site are updated unless actually pushed and verified.

## 2026-05-07 - Publish Close Prepared

- Ran the publish-close protocol for the rename/versioning/docs/AI-continuity batch.
- Confirmed `scripts/check-repo.ps1` passes and the Git remote points at `Math-Muscle-Trainer.git`.
- Kept `docs/v9` as the latest published app snapshot because no newer root app snapshot was needed for AI-documentation-only changes.
- Recorded that GitHub Pages deployment and live-site verification must be reported after push.

## 2026-05-07 - Publish Close Verified

- Committed and pushed the prepared batch to `origin/main`.
- Verified the pushed `main` branch matches the local commit before live-site checks.
- Verified the GitHub Pages version index and `docs/v9` app are live at the `Math-Muscle-Trainer` Pages URL.

## 2026-05-08 - Addition Lessons Linked

- Added a reusable addition lesson runner based on atomic `Idea -> Practice` components and final mixed practice.
- Linked all current addition lesson cards into real lessons: Make 10, adding by 1s/10s/100s/1000s, Counting On Easy/Medium, and Bridging Easy/Medium/Advanced/Expert.
- Added addition lesson completion tracking with `addition:<lesson-id>` technique progress keys and focused workout handoffs.
- Recorded ADR-0003 for the reusable addition lesson loop.
- Restored Progress carousel previous/next controls in the top red kicker row after the label/header alignment.
- Added table-specific multiplication lessons for `x1` through `x12` using the existing five-section lesson flow.
- Unlocked multiplication and addition lesson stage pills so content can be inspected without completing earlier sections.
- Recorded ADR-0004 for unlocked lesson sections.

## 2026-05-08 - Lesson Content Workflow Initialized

- Added `AGENTS.md` rules for teacher-authored lesson content.
- Created the `learn/` workflow structure for specs, structured lesson data, scaffolds, mental models, and review notes.
- Added an empty Make 10 teacher spec and placeholder structured lesson data without changing app behavior.
- Recorded ADR-0005 for the lesson content workflow.

## 2026-05-08 - v0.13.0 Publish Close Prepared

- Prepared the `v0.13.0` lesson expansion batch for publish close.
- Confirmed `docs/v10` is marked latest in `docs/index.html`.
- Confirmed the Git remote points at `https://github.com/frichmonds-stack/Math-Muscle-Trainer.git`.
- Ran `scripts/check-repo.ps1`; all repo checks passed.
- Committed and pushed the batch to `origin/main`.
- Verified the pushed `main` branch matches local commit `50197ed79f3e25e1fab5c289cc6cfd9448240f3d`.
- Verified the GitHub Pages version index, `docs/v10` app, and live `v10/js/app-core.js` are reachable; app core serves `APP_VERSION = "v0.13.0"`.

## 2026-05-09 - Learning Telemetry and Mastery Branch

- Created feature branch `feature/learning-telemetry-mastery` from `main`.
- Added capped browser-local answer telemetry for operation, fact key, skill bucket, difficulty band, correctness/skips, response time, session id/source, session position, and date.
- Added an Operation Mastery Progress slide for Addition, Subtraction, Multiplication, and Division.
- Implemented the selected rank chain: `Rookie -> Novice -> Adept -> Expert -> Elite -> Master -> Legend`.
- Added initial mastery scoring from accuracy, fluency, coverage, retention, consistency, and difficulty evidence.
- Bumped root app to `v0.14.0`, added `CHANGELOG.md` and `README.md` updates, generated `docs/v11`, and recorded ADR-0006.

## 2026-05-10 - Best-Earned Mastery Rank Added

- Added `operationBestRanks` to saved progress so current operation rank can move up or down while best-earned rank is preserved.
- Updated the Operation Mastery cards to show `Current form` and `Best earned` separately.
- Refreshed `docs/v11` with the latest root app files.
- Ran `scripts/check-repo.ps1`; all repo checks passed.

## 2026-05-10 - Operation Mastery Overview Detail Pass

- Changed Operation Mastery from four dense all-in-one cards into compact four-operation overview cards plus a selected-operation detail panel.
- Kept the existing mastery scoring and best-earned rank model unchanged.
- Added click/tap selection for Addition, Subtraction, Multiplication, and Division detail views.

## 2026-05-10 - Mastery Mode Selector and Header Alignment

- Removed the explanatory line under `Operation mastery` and moved to a selector-led flow:
  - `Overview` mode shows only the four-operation snapshot cards.
  - `Operation Detail` mode shows one selected operation with deeper evidence and rank guidance.
- Added mastery mode and operation selectors to the mastery slide controls.
- Center-aligned Progress kicker labels across slides (including Fact Tracker, Next Focus, Coach Notes, and Workout Log) while keeping utility buttons anchored right.

## 2026-05-10 - iPad Polish and Security Pass

- Polished Progress layouts for iPad/tablet widths (`768-1366px`), including tighter selector widths, improved carousel panel padding, and clearer focus-column spacing.
- Hardened dynamic Progress rendering by escaping dynamic labels before writing markup in priority, growth, positive-progress, and coach-tip sections.

## 2026-05-10 - Batch Patch Intake

- Logged UI issue for next batch patch: Results screen home button is misplaced/out of alignment (per user screenshot).
- Logged UI issue for next batch patch: Progress/Results purple carousel kicker row should align with top nav button track.

## 2026-05-10 - Batch Patch Applied (Header/Kicker Alignment)

- Aligned Results/Progress top nav row and carousel content to a shared side gutter so the purple kicker row, Home button, Settings button, and slide content sit on the same horizontal track.

## 2026-05-10 - Batch Patch Intake (Planning Only, No Execution)

- Logged design-system concern: hover effects are inconsistent across unit types; define interaction states by role (`action unit`, `display unit`, `status chip`) before broad styling changes.
- Logged product-direction concern: UI currently mixes card-like website patterns with app-style patterns; plan a unified visual system pass for aesthetics, effectiveness, and productivity.
- Logged navigation/system concern: keep planning-only until explicit go-ahead; do not execute code or layout changes from this note.
- Logged layout idea: consider adding compact trend graphs/sparklines to reduce monotony of text-and-number-only progress blocks.
- Logged spacing request: increase vertical spacing between section heading (`Your progress so far`) and the metric content below.
- Logged mastery layout request: increase vertical spacing between Operation Mastery sections; evaluate 2x2 overview layout with larger cards; decide card usage under universal design system.
- Logged mastery control simplification: replace dual selectors in Operation Mastery with one selector that rotates through `Overview -> Addition -> Subtraction -> Multiplication -> Division`.
- Logged Fact Tracker visual concern (hover screenshot was intentional): current grid reads as mixed card/list language; choose one model (`card matrix` or `structured list`) and unify hover behavior, spacing rhythm, and emphasis hierarchy across all tiles.
- Logged Records/Workout History view polish requests:
  - Increase spacing between the section heading and content below.
  - Rework/shorten heading copy so it fits on one line (candidate: `Workout History`).
  - Update workout-type selector labels to fit button UI cleanly:
    - `H.I.T`
    - `Target Reps`
    - `Isolation`
    - `Zen Mode`
    - `Spar Mode`
- Future-session note: run a full interrogation pass on all stats/progress screens to validate that each metric is useful, understandable, and encourages the right learning behaviors (not vanity metrics or misleading incentives).
- Logged selector alignment issue (Coach Notes view): operation selector text is not centered within the control, and the selector block itself appears misaligned against the page/header content track.
- Strategic note: explore Coach Notes as an adaptive behavior-nudge and information-sharing system; this may be a key differentiator between a generic practice app and a personal training app.
- Logged theme consistency bug: in `solo-leveling` + `light` mode, page correctly shows no purple accents but bottom navigation bubble/dots still show purple.
- Logged fix direction: treat as theme-token consistency update (remove hardcoded purple fallback from bottom nav indicator, map indicator accents to theme+mode tokens, and keep contrast-safe surface tokens).
- Logged hover-direction decision: keep hover effects for desktop/trackpad as enhancement only; calibrate light-mode hover to be subtler and theme-consistent, and ensure tap/default/focus states fully communicate interactivity without relying on hover.
- Logged light-mode accessibility issue: info (`i`) button/icon can be effectively invisible until hover on some cards (e.g., Make 10 Facts); needs default-state contrast/visibility fix.
- Logged light-mode visual bug: right-side color/gradient artifact appears on Learn/Techniques screen background; investigate ambient/background layers and theme-specific overrides causing uneven tinting.
- Logged practice-feedback direction: improve correct-answer salience with faster visual cues (without slowing question advance), remove persistent bottom `Correct.` text, and skip haptics for now.

## 2026-05-09 - Product Direction Clarified

- Clarified that finishing lesson content is the highest-priority product direction before major dashboard expansion.
- Clarified that lesson progression systems, four-operation mastery visibility, and stronger onboarding/new-user flow are the next major roadmap priorities.
- Clarified that the product should remain iPad-first and oriented toward eventual Apple App Store deployment.
- Clarified that gamification is not a core goal; long-term retention should come from meaningful skill-building, habit formation, visible growth, and mastery.
- Clarified that the app should remain usable from primary students through adults while keeping a universal arithmetic-strength/mastery identity.
- Clarified that speculative suggestions from brainstorming sessions should remain an idea bank unless explicitly promoted to roadmap status by the user.
- Clarified that lesson specs act as the human-authored pedagogy source while structured lesson JSON acts as permanent stored app content.
- No app runtime behavior, lesson content, renderer logic, or GitHub Pages deployment changed during this session.

## 2026-05-10 - Batch Execution (Hybrid UI + Consistency Pass)

- Executed the queued batch patch across Progress, Practice, Learn, and shared styling.
- Operation Mastery:
  - Replaced dual-selector flow with one cyclic selector: `Overview -> Addition -> Subtraction -> Multiplication -> Division`.
  - Kept Overview as default and detail as operation-selected states.
  - Switched overview cards to a larger 2x2 layout for clearer snapshot reading.
- Progress/Records:
  - Updated white heading copy to `Workout history at a glance`.
  - Updated workout mode labels for selector fit: `H.I.T`, `Target Reps`, `Isolation`, `Zen Mode`, `Spar Mode`.
  - Made fact-detail selector navigation wrap cyclically.
- Learn/Techniques:
  - Added subtraction/division operation options in the Learn operation selector.
  - Added visible `Coming Soon` placeholders for subtraction/division techniques.
- Practice:
  - Updated top-left session status pill to richer context: operation, mode, negatives on/off.
  - Implemented speed-first micro feedback rail (rolling 5-dot recent answer history).
  - Removed persistent `Correct.` bottom text while keeping incorrect feedback text.
- UI system/hybrid pass:
  - Unified hover polish for desktop/trackpad on additional unit types.
  - Shifted mixed list-style tracker units toward softer-card presentation.
  - Increased section heading-to-content spacing rhythm for progress slides.
  - Fixed top kicker alignment to left content track (instead of off-center).
- Light mode fixes:
  - Improved tooltip/info-dot default visibility.
  - Set active bottom nav/page-indicator dot to non-purple in light mode.
  - Added a dedicated light background override for Learn screen to reduce right-side tint artifact.
- Checks:
  - Ran `scripts/check-repo.ps1`; expected failures reported because root app files changed without publishing a new docs snapshot.
  - Attempted `node --check` syntax checks, but `node` is not available in the current shell environment.

## 2026-05-10 - v0.15.0 Publish Close

- Bumped runtime app version to `v0.15.0` in `js/app-core.js`.
- Added `0.15.0` release notes to `CHANGELOG.md` for mastery selector flow, Learn placeholders, practice micro-feedback, and light-mode fixes.
- Updated `README.md` feature summary and snapshot publish command for `docs/v12`.
- Updated `PROJECT_NOTES.md` session notes with the hybrid consistency pass outcomes.
- Published `docs/v12` via `scripts/publish-snapshot.ps1` and marked it latest in `docs/index.html`.
- Ran `scripts/check-repo.ps1` after snapshot publish; result: `All repo checks passed.`

## 2026-05-10 - Header/Nav + Lesson Controls Execution Batch

- Executed queued UI contract updates from planning-only intake:
  - Moved Home-screen `Progress`, `Learn`, and `Start Workout` actions into a dedicated menu row below the hero banner.
  - Kept top-right utility area focused on persistent utility controls.
  - Moved Results `Repeat Workout` and `New Workout` actions into top header nav and removed duplicate lower action row.
- Updated copy and lesson completion controls:
  - `Adjust Workout` -> `New Workout`.
  - `Start Focused Workout` -> `Start Workout`.
  - Removed `Restart Lesson` and lower `Back to Lessons` buttons from lesson-complete blocks.
  - Added explicit completion guidance: `If you want to practice more, press Start Workout.`
- Learn lesson navigation updates:
  - Removed stage-level `Back` buttons so stage pills remain the lesson navigation mechanism.
  - Added top-nav `Exit Lesson` control visibility for lesson modes.
- Calendar heading updates:
  - Month navigation now shows month-only labels in Results/Progress trackers.
  - Tracker header side label now shows dynamic year.
- Practice feedback updates:
  - Bottom feedback text is hidden.
  - Right-edge answer status icon now uses circular, high-contrast success/error/sign badges.
  - Question panel now flashes glow feedback for correct/error results.
- Header consistency pass:
  - Updated focused-view header and kicker alignment toward a shared-width contract to reduce cross-view control drift.
- Checks:
  - Ran `scripts/check-repo.ps1`; expected snapshot-drift failures reported because root files changed and docs snapshot has not been republished yet.

## 2026-05-11 - UI Polish Batch Intake

- User requested that UI polish issues be logged for a batched update, specifically because prior model attempts were not getting the visual polish right.
- Current screenshots/review are from a Windows desktop view; this should not override the product's iPad-app direction, but desktop layouts still need to look intentional and polished.
- User hopes the desktop version will eventually look like the app, not like a separate desktop website adaptation.
- Treat upcoming work as a careful visual/design-system pass rather than isolated copy tweaks.
- Work from the current dirty root app state; do not revert existing uncommitted changes in `index.html`, `styles.css`, or `js/` files.
- Before executing the batch, gather concrete polish targets by screen/screenshot and summarize the intended change before editing.
- After executing the batch, run the best available checks and remember that a new docs snapshot is needed before repo checks can pass cleanly if root app files changed.

## 2026-05-11 - Home Menu Visual Direction Intake

- User flagged the new Home menu buttons (`Progress`, `Learn`, `Start Workout`) as ugly and not iPad-app-like enough.
- Current issue visible in screenshot: the three wide horizontal pills sit under the hero as plain web buttons; the two dark pills feel low-energy/empty, and the gradient workout button feels disconnected from a cohesive app navigation system.
- User does not yet know the desired interaction model, so future work should explore patterns rather than assume a final answer immediately.
- User clarified that the screenshots are not a mandate to copy current mobile UI trends or "meta" ideas; they are inspiration because the current direction feels stuck.
- Reference direction from screenshots:
  - Mobile/tablet app home screens often use compact content modules, category chips, bottom navigation, and prominent task cards instead of stacked web CTA bars.
  - iPad/app feel should come from clear navigation affordances, spatial grouping, icon-led controls, and polished touch targets.
  - Dark app references suggest rounded panels, compact icon+label rows, strong hierarchy, and a more native-app rhythm.
  - Light/dark paired references suggest the design should remain theme-capable and not depend on one mode only.
  - The task-list reference suggests a possible model: a central app panel with tab/chip filters and action rows/cards, not full-width web buttons.
- Constraints for the batch:
  - Preserve the strength/mastery identity and existing hero branding.
  - Avoid making the Home screen feel like a marketing landing page.
  - Prefer a usable first-screen app dashboard/menu pattern.
  - Treat `Start Workout` as the primary action, but make `Progress` and `Learn` feel like real destinations rather than secondary afterthought buttons.
  - Consider icons, segmented/tab-like navigation, compact tiles, or a bottom/app-nav pattern; do not simply restyle the current three bars unless that solves the app-feel problem.
  - Check desktop and iPad widths, especially the current hero/menu composition.

## 2026-05-11 - Progress Header/Layout Polish Intake

- User flagged the top Home and settings/cog buttons on the Progress screen as visually out of place.
- In the Progress screenshot, the Workout Log carousel/kicker row appears centered in the overall page area instead of left-aligned with its content column/track.
- The visible `WORKOUT LOG` text should be centered within its own reserved label space.
- The left and right carousel nav buttons should stay static across all Progress screens/slides; reserve enough label width for the largest screen title so arrows do not shift when text length changes.
- Workout Log label text sizing should be consistent across screens/slides.
- Future batch should treat this as a header/navigation layout contract issue, not just a one-off alignment tweak.

## 2026-05-11 - Progress Tile Interaction Intake

- User flagged that static Progress metric tiles have hover animation/highlight states even though they do not currently link anywhere.
- Example: `Facts Attempted`, `Accuracy`, `Best Fact Streak`, `Fastest Avg`, `Workouts Completed`, and `Most Attempts in a Day` appear to animate/highlight on hover.
- Future batch should decide whether these tiles become real interactive drill-down links or have hover/click affordances removed.
- If no destination exists, display-only metric tiles should read as static information units, not buttons/cards with actionable hover states.

## 2026-05-11 - Progress Operation Selector Placement Intake

- User flagged that the operation selector placement is inconsistent between Progress slides.
- In the Workout Log / overall progress screenshot, `All Operations` sits high on the right beneath Home/settings controls.
- In the Operation Mastery screenshot, the operation selector sits below the section heading on the left.
- User wants universal placement across Progress screens/slides.
- Recommendation for future batch: place the operation selector in the slide content header area directly below or beside the section title, aligned to the left content track, instead of under the top-right utility controls.
- Rationale: the selector filters the slide content, so it should live with the slide title/content region; the top-right area should remain reserved for global utilities such as Home/settings.
- For desktop/wide layouts, consider a title row where the heading is left-aligned and the selector sits either directly underneath on the same left track or at the right edge of the content header row. For iPad/tablet consistency, the safest first pass is below the title on the left track.

## 2026-05-11 - Workout Tracker Calendar Alignment Intake

- User flagged that the right-side calendar drops below the left-side tracker/stats column on the Workout Tracker screen.
- Screenshot shows the left column heading/stats beginning higher while the calendar/year/month area appears lower, making the two-column layout feel misaligned.
- Future batch should align the calendar panel's top edge/header baseline with the left tracker column in a deliberate two-column composition.
- Check desktop and iPad widths so calendar grid height/row wrapping does not create accidental vertical drift.
- User flagged that the year heading looks underexposed and does not match the strength/visibility of other headings.
- Day-of-week titles may have the same issue; review their weight, contrast, and spacing.
- Recommendation: center day titles over their calendar columns because they label grid columns/cells, while keeping the year/month header aligned within the calendar header system.

## 2026-05-11 - Universal Section Style Direction Intake

- User flagged ongoing uncertainty about section style direction after repeated card-vs-list/back-and-forth passes.
- Prior model suggested a hybrid style, but the user does not feel that a clear hybrid direction actually appeared.
- Current examples show two competing section treatments:
  - Fact Tracker uses repeated rounded cards with status pills, progress bars, and card borders.
  - Next Focus uses open columns with vertical dividers, list rows, subtle horizontal separators, and less card containment.
- User wants a universal design direction rather than each Progress section feeling independently styled.
- Recommendation to carry into batch: use an app-native hybrid based on information role, not arbitrary mixture.
- Proposed universal rule:
  - Use compact cards/tiles for actionable items, selectable drill-down targets, or repeated objects that can be tapped to train/open detail.
  - Use open list/column layouts for summaries, ranked insights, logs, and coaching text where the primary job is scanning/comparison rather than tapping every block.
  - Use static metric panels without hover states for display-only numbers.
  - Avoid large nested website-style cards; let the app shell and section rhythm provide structure.
- For the two screenshots specifically: Fact Tracker can keep tappable cards because categories are trainable, but Next Focus should either remain an open insight board or use smaller row units if items become actionable. Both should share the same header, selector, spacing, typography scale, badge language, and interaction-state rules.
- User asked how to implement the unification; recommended adding a lightweight UI/design contract plus shared CSS roles, then refactoring one Progress surface at a time.
- Implementation direction for current batch:
  - Create/update a lasting design note or ADR for the Progress/app UI system if the batch formalizes these rules.
  - Define the shared Progress page skeleton: global utility row, carousel/kicker title row, content header with title/subtitle/local selectors, then body content.
  - Add or consolidate shared CSS role classes for metric panels, action tiles, insight boards/rows, selector chips, and status badges.
  - Restrict hover/lift/focus affordances to truly interactive roles; remove them from display-only metric panels.
  - Move operation selectors into the content header area and standardize placement.
  - Fix carousel label sizing so arrows stay static across slides and label text sizing remains consistent.
  - Align Workout Tracker calendar and left stats column; strengthen year/day heading hierarchy and center day titles over grid columns.
  - Keep Fact Tracker as interactive action tiles if they train/open details.
  - Keep Next Focus closer to an open insight board, but align its typography, badges, spacing, and selectors with the same system.

## 2026-05-11 - Learn Screen App-Shell Intake

- User flagged that the Learn screen is also not positioned where it should be.
- Screenshot shows the Learn/Techniques content sitting inside a visibly darker rectangular background, creating a "box within a box" effect.
- This conflicts with the intended iPad-app feel and the broader universal app-shell direction.
- Future batch should remove or soften the nested page-section background so Learn feels like part of the same app canvas rather than a framed web section.
- Align Learn's top title, selector, content grid, and Home/settings utilities to the same app-shell/header rules being defined for Progress.
- Keep lesson tiles as actionable cards because they open lessons, but make their containment, spacing, and hover behavior follow the shared action-tile rules.

## 2026-05-11 - Lesson Feedback Text Intake

- User flagged that bottom feedback text in lesson/practice UI should be removed.
- Screenshot shows `Correct. Solo reps complete.` appearing below the keypad after a correct assisted/lesson answer.
- Future batch should remove this bottom feedback line when field/icon/question-panel feedback already communicates the result.
- Keep necessary incorrect/error guidance only if it is still needed for learning clarity, but avoid persistent success text that crowds the keypad and slows the speed-first feel.

## 2026-05-11 - Lesson Complete Copy Intake

- User flagged the current lesson-complete copy as weird.
- Screenshot example: `10x technique complete.` plus `You finished the 10x lesson and can review any section whenever you want. You locked in 5 solo reps.`
- Teacher/user suggested direction: use warmer, clearer achievement copy such as `Congratulations on learning how to multiply by 10!`
- Future batch should pair the completion message with clear CTAs to either practice more or learn more.
- Review CTA wording for consistency; screenshot currently shows `Back to Techniques`, `Practice More`, and `Go to Work Out`, while prior intent was to simplify lesson-complete controls and use `Start Workout`.
- Preserve user/teacher-authored wording direction and avoid inventing a large new lesson-complete pedagogy voice unless explicitly requested.

## 2026-05-11 - Practice More Flow Stale UI Intake

- User flagged that choosing `Practice More` from a completed lesson reverts to an older-looking UI.
- Screenshot shows a Practice More lesson mode with `PRACTICE MORE`, `Keep the 10x table feeling easy.`, `Questions can flip either way now.`, `Back to Techniques`, `Hint`, and `Next Practice Question`.
- User noted that entering an answer stops the learner in place instead of advancing to the next question, which feels wrong compared with the speed-first practice direction.
- Bottom `Correct.` text is still visible in this flow, reinforcing that this mode may not have been updated with recent feedback changes.
- Copy at the top feels weird/stale and should be reviewed.
- Future batch should inspect the `Practice More` lesson path separately from normal lesson stages and focused workouts; update behavior so correct answers advance appropriately unless there is a clear pedagogical reason not to.
- Align Practice More UI with the current lesson/practice shell, button naming, feedback behavior, and app-system styling.

## 2026-05-11 - Results Summary/Tracker Layout Intake

- User flagged that Workout Summary buttons are not in place on the Results screen.
- Screenshot shows `Repeat Workout` and `New Workout` floating near the top center while Home/settings sit top-right; this feels disconnected from the app header contract.
- User flagged that the `WORKOUT SUMMARY` title/kicker is out of place.
- Results screen should follow the same global utility/header/carousel title/content header rules as Progress and Learn where applicable.
- User flagged that the embedded Workout Tracker on Results is "all over the place."
- Screenshot shows tracker calendar overlapping or drifting into the left stats column; year/month/day grid alignment is broken and the two-column layout collapses visually.
- Future batch should inspect Results-specific tracker rendering/layout separately from the Progress tracker because the same component may be embedded under different constraints.
- Ensure Results actions, title/kicker, summary metric panels, and tracker section use the shared app-shell width/gutter contract.

## 2026-05-11 - UI Batch Execution Decisions

- User confirmed the proposed header contract:
  - Top-right global area should be Home/settings only.
  - Kicker/carousel row should use fixed-width title space with static arrows.
  - Content header should contain H1/subtitle/local selectors/actions.
  - Body should use role-based content layouts.
- User asked Codex to decide action placement in the next patch and then review the result.
- User agreed with the interaction rules:
  - Static metrics should not hover/lift.
  - Actionable lesson/fact tiles may use hover/focus/press states.
  - Insight rows should only show interactive affordances if clickable.
  - Selectors should use a consistent chip style.
- Chip style explanation for future work: a compact rounded control used for filters/segmented choices, with consistent height, border, padding, centered label, optional left/right chevrons, and clear selected/focus states.
- User decided Practice More should auto-advance after correct answers and behave like a normal workout constrained to the specific lesson parameters.
- User agreed to keep the next patch focused on structure first: shared header/layout rules, selector placement, hover affordances, Results/Progress tracker alignment, Learn nested-background issue, and stale Practice More behavior/copy.
- Open release-flow question: whether to merge to `main` and align snapshots/versioning before or after the next patch.

## 2026-05-11 - UI System Patch Executed

- Added ADR-0007 to record the shared app-shell UI contract.
- Changed Home primary actions from wide stacked CTA bars into compact app-style destination modules with small icon blocks, label, and supporting text.
- Added a fixed-width Results carousel/kicker header matching the Progress header pattern so title arrows stay static across slides.
- Moved Results `Repeat Workout` and `New Workout` actions into the Workout Summary content header instead of the global top rail.
- Removed per-slide Results inline kicker rows so Results and Progress share the same header contract.
- Adjusted Progress/Results content selectors to sit below/with content headings, not beneath global Home/settings utilities.
- Removed hover/lift affordances from display-only metric panels while preserving interactive styling for actionable tiles.
- Tightened Workout Tracker calendar alignment by removing extra top offset, strengthening year heading exposure, and centering weekday labels over grid columns.
- Removed the visible nested Learn/Techniques panel background so Learn sits on the app canvas.
- Updated multiplication lesson complete copy toward `Congratulations on learning how to multiply by n!`, with `Learn More`, `Practice More`, and `Start Workout` CTAs.
- Updated Practice More copy and behavior: it now auto-advances after correct answers and hides success feedback text, while keeping error feedback visible.
- Updated `CHANGELOG.md`, `PROJECT_NOTES.md`, `ai/current-state.md`, and `ai/tasks/next-actions.md`.
- Ran `scripts/check-repo.ps1`; expected snapshot-drift failures remain because root app files differ from the latest docs snapshot.
- Ran `node --check` on `js/app-core.js`, `js/app-init.js`, `js/app-practice.js`, `js/app-progress.js`, and `js/app-techniques.js`; all syntax checks passed.

## 2026-05-11 - Results Next-Step Footer Adjustment

- User asked to try bottom-right placement for Results summary actions because `Repeat Workout` and `New Workout` are next steps after reviewing the summary.
- Moved the two Results summary actions out of the title row and into a bottom-right footer action row within the summary slide.
- Made `Repeat Workout` and `New Workout` equal visual weight by using the same ghost-button treatment and consistent minimum widths.
- Retained the global header rule: Home/settings stay in the top-right utility rail, while Results actions stay inside the content surface.
- Ran `node --check js/app-techniques.js`; syntax check passed.
- Reran `scripts/check-repo.ps1`; expected docs snapshot drift remains.

## 2026-05-11 - Results Footer Placement Correction

- User flagged that the bottom-right Results action row went far too low, effectively to the bottom edge of the iPad/app viewport.
- Clarified that the Results screen is currently a landscape/tablet-style app shell that fills the available viewport height, so a grid footer can land at the bottom of the whole screen.
- Corrected the layout so Results summary actions sit just below the stat grid, right-aligned, instead of being pushed to the bottom of the viewport.
- Reran `scripts/check-repo.ps1`; expected docs snapshot drift remains.

## 2026-05-11 - Results Header Follow-Up Intake

- User requested logging only for a later batch update.
- Results carousel left/right arrows do not work from the current `WORKOUT SUMMARY` header.
- `WORKOUT SUMMARY` is not centered within its own reserved label space; the label appears shifted relative to the arrows.
- The summary title/text starts too close to the top header/nav area and needs more breathing room.
- Consider making the `WORKOUT SUMMARY` kicker/label larger or more visually established so it reads as intentional app navigation rather than tiny metadata.
- The equal-weight `Repeat Workout` and `New Workout` buttons look okay in their current style, but need better vertical centering/alignment in their action row.
- Current Results composition should be reviewed as a landscape/tablet app screen, not a web page; avoid pushing actions to the viewport bottom.

## 2026-05-11 - Practice Shell Box Intake

- User flagged an obvious "box within the shell" on the Practice screen.
- Screenshot shows the practice panel/background visibly framed inside the app shell, creating the same nested-section problem previously noted on Learn.
- Future batch should remove or soften the practice panel container so the HUD, progress bar, problem card, answer row, and keypad feel like they live on one app canvas.
- Preserve the problem card/input/keypad as distinct functional units, but avoid a large rectangular page panel behind them.
- Review dark/light mode after removing the nested practice panel background to ensure contrast remains strong.

## 2026-05-11 - Lesson Exit Placement Intake

- User asked whether `Exit Lesson` is in the wrong spot.
- By the new app-shell contract, yes: `Exit Lesson` currently sits beside Home/settings in the top-right global utility rail.
- Future batch should move `Exit Lesson` out of the global utility rail and into the lesson content/header area, because it is local to lesson mode rather than a global utility.
- Possible placement: right side of the lesson content header near the lesson title/stage pills, or a quieter local action under/near the lesson heading.
- Keep top-right global area reserved for Home and Settings only.

## 2026-05-11 - Progress Kicker Spacing Follow-Up Intake

- User flagged that Progress header spacing is still off.
- `WORKOUT LOG` may need to be larger/more visually intentional, similar to the Results `WORKOUT SUMMARY` follow-up.
- `WORKOUT LOG` should be centered within its reserved label space; current screenshot makes it appear shifted between the left/right arrows.
- There should be more intentional spacing between the top carousel/kicker row, the page title (`Your progress so far`), selector chip, and metric grid.
- Future batch should treat Results and Progress kicker rows together so the fixed-label-space contract actually centers text and gives the header enough breathing room.

## 2026-05-11 - Tracker Static Info Highlight Intake

- User flagged that the left-side Workout Tracker info/stats are highlightable even though they should not be.
- Screenshot shows tracker summary blocks such as `Current Streak`, `Best Streak`, `Workouts`, `Hearts`, and `Stars` behaving visually like interactive/highlightable units.
- Future batch should remove hover/highlight/action affordances from tracker summary stats unless they get real drill-down destinations.
- This should follow the static metric rule from ADR-0007: display-only panels do not use hover/lift styling.

## 2026-05-11 - Home Menu Tactical Centering

- User requested a temporary Home menu layout until a fuller design pass happens later.
- Reordered primary Home actions to `Learn` on the left, `Start Workout` in the center, and `Progress` on the right.
- Centered the three-button Home menu group under the hero.
- User explicitly deferred the full Home action design/composition pass.
- Reran `scripts/check-repo.ps1`; expected docs snapshot drift remains.

## 2026-05-11 - v0.16.0 Publish Close Prepared

- User requested executing the current UI batch, merging to `main`, and ensuring it is live.
- Bumped `APP_VERSION` to `v0.16.0` in `js/app-core.js`.
- Moved current `CHANGELOG.md` Unreleased notes into `0.16.0 - 2026-05-11`.
- Updated `README.md` publish command to use `docs/v13` with the `v0.16.0 app shell UI contract snapshot` label.
- Published `docs/v13` via `scripts/publish-snapshot.ps1` and marked it latest in `docs/index.html`.
- Ran `scripts/check-repo.ps1`; result: `All repo checks passed.`
- Ran `node --check` on `js/app-core.js`, `js/app-init.js`, `js/app-practice.js`, `js/app-progress.js`, and `js/app-techniques.js`; all syntax checks passed.
- Next steps in this publish close: commit the batch, merge into `main`, push, then verify GitHub Pages live URLs.

## 2026-05-11 - v0.16.0 Main Merge

- Committed the UI system batch on `feature/learning-telemetry-mastery` as `2d7a0ad` (`Release v0.16.0 app shell UI polish`).
- Fetched `origin`, checked out `main`, confirmed it was up to date, and merged the feature branch into `main`.
- Reran `scripts/check-repo.ps1` on `main`; result: `All repo checks passed.`
- Reran `node --check` on all root JS modules on `main`; all syntax checks passed.

## 2026-05-11 - v0.16.0 Push and Live Verification

- Pushed `main` to `origin`; push advanced `main` from `b31dccd` to `1ca84cb`.
- Verified GitHub Pages after deployment:
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/` returned HTTP 200 and lists `Version 13 - v0.16.0 app shell UI contract snapshot (latest)`.
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v13/index.html` returned HTTP 200.
  - `https://frichmonds-stack.github.io/Math-Muscle-Trainer/v13/js/app-core.js` returned HTTP 200 and serves `APP_VERSION = "v0.16.0"`.

## 2026-05-11 - v0.17.0 App Viewport Frame

- User confirmed the existing responsive rules and app end-goal make a preserved app viewport frame appropriate.
- Changed desktop/tablet-landscape rendering so `.page-shell` fits a centered `1194 x 834` iPad-landscape canvas inside the browser viewport instead of stretching to arbitrary desktop window dimensions.
- Kept narrow/mobile behavior scroll-friendly by allowing the existing small-screen rules to switch `.page-shell` back to full-width/auto-height below `700px`.
- Updated ADR-0007 with the app viewport frame rule.
- Bumped `APP_VERSION` to `v0.17.0`.
- Added `0.17.0` release notes to `CHANGELOG.md`.
- Updated `README.md` publish command to `docs/v14`.
- Published `docs/v14` via `scripts/publish-snapshot.ps1` and marked it latest in `docs/index.html`.
- Ran `scripts/check-repo.ps1`; result: `All repo checks passed.`
- Ran `node --check` on all root JS modules; all syntax checks passed.
