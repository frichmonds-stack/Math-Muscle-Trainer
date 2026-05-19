# Screenshot Audit - v0.20.5

Last updated: 2026-05-18

This audit is the starting point for the visual reference system. It pairs future screenshots with explicit notes so AI sessions can use the references more like a lightweight Figma board.

## Reference Workflow

For each screenshot, record:

- Preserve: what should stay part of the app's visual language.
- Fix: known issues or near-term corrections.
- Decide later: open design/product questions.
- Component roles visible: the reusable UI roles shown in the screenshot.

Future screenshots should be stored in `screenshots/` with names like:

- `home-dark-v0.20.5.png`
- `home-light-v0.20.5.png`
- `setup-dark-v0.20.5.png`
- `setup-light-v0.20.5.png`
- `practice-dark-v0.20.5.png`
- `practice-light-v0.20.5.png`
- `progress-light-fact-tracker-v0.20.5.png`
- `options-light-v0.20.5.png`

## Button UI Reference Board

Reference: `button-ui-design-brief.jpg`

Preserve:

- Button/control shape, spacing, density, and state hierarchy.
- Warm coral/red primary action treatment.
- Quiet secondary and ghost button hierarchy.
- Compact icon utility button scale.
- Toggle, segmented chip, metric panel, and action tile proportions.

Fix:

- Do not copy the placeholder symbols as brand or control language.
- Do not add icons to every primary or secondary text button.

Decide later:

- Whether to redraw the reference board with current app labels and cleaner operation/status examples.
- Whether to add a component preview page after the visual system stabilizes.

Component roles visible:

- Primary action.
- Secondary action.
- Ghost action.
- Icon utility.
- Toggle.
- Segmented choice.
- Operation choice.
- Static metric.
- Action tile.

## Home - Dark

Reference: `screenshots/home-dark-v0.20.5.png`

Status: current baseline reference, not final target.

Preserve:

- Compact iPad dashboard feel.
- App identity area with brand mark and training tagline.
- Dock scale and placement.
- Darker border line and restrained card surfaces from the current Home QA pass.
- Snapshot metrics as display-only panels.
- Strong red/coral accent hierarchy without adding icons to every button.

Fix:

- Add a Daily Goal summary/edit card in the currently underused upper-right Home space when that feature is promoted.
- Keep the Weekly Reps goal line tied to the eventual saved daily goal.
- Do not lock the exact current spacing as final; preserve the structure while allowing future refinement.

Decide later:

- Whether Daily Goal supports correct reps, training minutes, or both in the first implementation.
- Whether Home should add a future multi-operation `Do all` routine action.
- Whether the Home surface/card language changes after the Surface/Card UI reference is created.

Component roles visible:

- Training dashboard.
- Action tile.
- Static metric.
- Training dock.
- Icon utility.
- Progress mini-visual.

## Home - Light

Reference: `screenshots/home-light-v0.20.5.png`

Status: current baseline reference, not final target.

Preserve:

- Same structure and hierarchy as dark mode.
- Light-mode card separation with readable borders and low clutter.
- Brand identity remaining strong without relying on a dark background.
- Static metric panels reading as display-only.
- Dock active state staying clear and compact.

Fix:

- Ensure future red/coral usage does not become the only semantic progress/status language.
- Keep chart, daily routine, and snapshot contrast legible as Daily Goal and other Home features evolve.

Decide later:

- Whether light mode should keep this clean high-key feel or gain slightly stronger neutral contrast after the Surface/Card UI reference is created.

Component roles visible:

- Training dashboard.
- Action tile.
- Static metric.
- Training dock.
- Icon utility.
- Progress mini-visual.

## Setup - Dark

Reference: `screenshots/setup-dark-v0.20.5.png`

Status: current baseline reference, not final target.

Preserve:

- Operation choices with meaningful math symbols.
- Compact difficulty and duration chips.
- Toggle chips for binary workout options.
- Workout type choices as peer options.

Fix:

- Continue checking text alignment and vertical density after the latest quick pass.
- Ensure three visible workout types read as a peer row, with Isolation falling back cleanly when visible.

Decide later:

- Whether setup should eventually expose friendly adaptive preferences such as Gentle/Balanced/Challenge.

Component roles visible:

- Workout preparation surface.
- Operation choice.
- Segmented choice.
- Toggle.
- Primary action.
- Content header.

## Setup - Light

Reference: `screenshots/setup-light-v0.20.5.png`

Status: current baseline reference, not final target.

Preserve:

- Same compact workout-preparation structure as dark mode.
- Light-mode separation between choice groups without making the screen feel like a form.
- Operation, difficulty, duration, and workout-type controls staying visually related as setup decisions.
- Start action remaining clearly primary.

Fix:

- Keep checking selected/unselected contrast across themes and color modes.
- Watch small-label legibility as more setup options are added.

Decide later:

- Whether setup needs a friendlier adaptive preference layer or should stay mostly automatic.

Component roles visible:

- Workout preparation surface.
- Operation choice.
- Segmented choice.
- Toggle.
- Primary action.
- Content header.

## Practice - Dark

Reference: `screenshots/practice-dark-v0.20.5.png`

Status: current baseline reference, not final target.

Preserve:

- Question/task-first layout.
- HUD as secondary status, not the main focus.
- In-card combo badge and recent-answer dots.
- Large answer input and touch keypad affordance.

Fix:

- Manual iPad portrait/landscape keypad review remains needed.
- Watch long prompts with combo and response dots in the same card.

Decide later:

- Whether the visible `Question` wording should stay in Workout while the internal design role becomes `Task`.

Component roles visible:

- Learning task card.
- Prompt.
- Response input.
- Feedback/status indicator.
- Static metric.
- Ghost action.
- Primary action.

## Practice - Light

Reference: `screenshots/practice-light-v0.20.5.png`

Status: current baseline reference, not final target.

Preserve:

- Same question/task-first hierarchy as dark mode.
- Large readable answer input and clear feedback icon placement.
- Touch keypad remaining legible without becoming the whole screen.
- Recent-answer dots staying inside the task card as pace feedback.

Fix:

- Keep checking the task card, input border, and keypad contrast in light mode across themes.
- Watch for crowding on portrait tablets and mobile widths.

Decide later:

- Whether Workout keeps visible `Question` language while the design system uses `Task` internally.

Component roles visible:

- Learning task card.
- Prompt.
- Response input.
- Feedback/status indicator.
- Static metric.
- Ghost action.
- Primary action.

## Learn - Dark

Reference: pending screenshot.

Preserve:

- Lesson stages as local navigation.
- Guided and solo practice patterns.
- Correct-rep counters for gated lesson tasks.

Fix:

- Move toward the shared Learning Interaction System so lessons do not invent one-off task layouts.
- Future lesson visuals need consistent explanation, example, hint, and feedback patterns.

Decide later:

- When normal learner lesson-stage locks return, with debug mode preserving bypass.
- When hardcoded lesson text moves into structured lesson data.

Component roles visible:

- Lesson shell.
- Stage navigation.
- Learning task card.
- Scaffold/hint.
- Feedback.
- Completion gate.

## Progress - Light

Reference: pending screenshot.

Preserve:

- Fact Tracker and Operation Mastery as evidence surfaces.
- Compact carousel selectors with stable arrow placement.
- Static metric panels that do not look tappable.

Fix:

- Progress still has several screen-specific card/list patterns that should be mapped to shared roles.
- Fact Tracker may eventually become the evidence layer inside Operation Mastery.

Decide later:

- Whether Progress keeps carousel navigation or moves to tabs/section switching.
- Whether Operation Mastery and Fact Tracker merge into one hierarchy.

Component roles visible:

- Carousel/kicker control.
- Static metric.
- Action tile.
- Insight board/list.
- Selector chip.
- Status badge.

## Options - Light

Reference: pending screenshot.

Preserve:

- Compact app dialog style.
- About first, with Give Feedback in the About card.
- Normal modal backdrop behavior.

Fix:

- Keep Options compact as more settings are added.
- Avoid turning Options into a deep settings page too early.

Decide later:

- Whether Daily Goal editing belongs in Options, a Home card dialog, or both.

Component roles visible:

- Dialog.
- Field/select.
- Ghost action.
- Destructive action.
