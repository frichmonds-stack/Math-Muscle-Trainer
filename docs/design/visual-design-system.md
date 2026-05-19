# Visual Design System

Last updated: 2026-05-19

This is the app-wide visual and meaning brief for Math Muscle Trainer. It sits above the button/control references: use it to understand what each part of the app means before changing layout, copy, surfaces, or interaction patterns.

## North Star

Math Muscle Trainer should feel like a compact iPad-native training app: focused, tactile, calm, strong, and readable for both students and adults. The interface should make arithmetic practice feel purposeful and energetic without becoming childish, game-cluttered, or admin-dashboard cold.

The app should use clear roles, restrained surfaces, confident spacing, and simple math-strength visual cues so learners always know what to do next.

## Core Experience Vocabulary

- `Training` is the umbrella for learner activity across Workout and Learn.
- `Workout` is a timed, target-rep, free, isolation, zen, or spar arithmetic session from the Workout area or a focused handoff.
- `Lesson` is guided Learn content that builds a technique or mental model.
- `Task` is the reusable internal design word for one learner interaction unit. A task can be a typed answer, multiple choice, comparison, fill blank, tap/drag interaction, diagram prompt, or future lesson activity.
- `Prompt` is what the learner is asked to solve, notice, compare, or complete.
- `Response` is what the learner enters, selects, taps, drags, or otherwise does.
- `Feedback` is the correctness, hint, reveal, timing, lockout, or coaching response after a response.
- `Rep` is one completed task attempt, especially in fluency and training contexts.
- `Gate` is a progress requirement, such as 5 correct reps before a stage can complete.
- `Stage` is a section or navigation step inside a lesson.
- `Evidence` is saved progress data created by completed tasks, reps, workouts, and lessons.

Use `Task` internally so Workout and Learn can share one interaction model, even when the visible UI still says `Question`, `Answer`, `Practice`, or `Check`.

## Screen Meaning

### Home

Home is the learner's daily training dashboard, not a marketing page and not a generic launcher.

It should frame what to do today: Daily Warmup Routine, quick operation training, Keep Learning, and a small training snapshot. Home may preview progress, but deeper evidence belongs in Progress.

### Setup

Setup is a compact workout preparation surface, not a form and not a landing page.

Operation choices, difficulty, duration, workout type, and toggles should feel like choosing a training set. `Start` is the primary action. Adaptive behavior should stay behind the scenes unless it becomes a friendly training preference such as Gentle/Balanced/Challenge.

### Practice

Practice is question-first and task-first.

The prompt, response input, feedback state, recent-answer dots, and keypad are the core learner loop. HUD details are secondary status. The screen should preserve pace and reduce distraction.

### Learn

Learn is guided technique-building.

Lessons contain stages, and stages contain tasks. Guided practice and final practice should use the same prompt-response-feedback loop as Workout, but with more scaffolding, hints, examples, and gates.

### Progress

Progress is evidence and growth, not judgment.

Reps, accuracy, workouts, mastery, rank, fact data, and records should help learners see what is improving and what to train next. Static metrics should not look pressable. Action tiles should clearly start training or open detail.

### Options And Dialogs

Options, About, and Feedback are app/support surfaces, not learning surfaces.

Keep them compact. Avoid turning Options into a deep settings page before the product needs it.

### Debug Mode

Debug mode is teacher/developer review tooling, not a learner-facing power mode. It must not imply real security, admin access, accounts, or protected data.

## Surface Roles

Define containers on two axes: role and size.

Role is what the thing means or does: action, metric, info, task, setting, or evidence. Size is how much space and containment it deserves: row, tile, metric card, task card/panel, large panel, or dialog panel.

Core surface roles:

- `App shell`: the fixed iPad-like app frame and persistent navigation context.
- `Unframed section`: normal screen content inside the app shell. This is the default for dashboard zones and page structure.
- `Row`: the smallest repeated unit. Use for settings, routine steps, compact evidence, breakdowns, and simple list items.
- `Tile`: a small-to-medium contained item, usually interactive when it starts, opens, selects, or drills down.
- `Metric card` or `metric panel`: a display-only value or small chart. It may be contained, but it must not look tappable.
- `Task card` or `task panel`: a medium-to-large active learner workspace for a prompt, response, feedback, and supporting task controls.
- `Panel`: a larger grouped workspace. Use sparingly for a focused mode or dense evidence area, not for generic page sections.
- `Dialog panel`: temporary modal decision, settings, support, or confirmation surface.

Size follows role and focus. A repeated object should usually be a row or tile. A display value should be a metric card. An active learner task can be a task card or task panel. A whole screen section should stay unframed unless containment clarifies the workflow.

Do not promote a row into a card, or a card into a panel, just to make the screen feel more designed. Bigger containers imply stronger focus. Do not add a new surface style when one of these roles already fits.

## Control Roles

Use `docs/design/component-system.md` and `docs/design/current-button-ui.md` for implementation detail. The app-wide roles are:

- `Dock item`: persistent destination in the bottom training dock.
- `Primary action`: the main next action in a screen or panel.
- `Secondary action`: meaningful alternative that should not compete with the primary action.
- `Ghost action`: quiet exit, cancel, skip, clear, or reversible action.
- `Icon utility`: compact app or local utility such as settings, close, info, hint, or arrows.
- `Choice pill`: operation, difficulty, duration, workout type, or similar selection.
- `Toggle`: binary setting.
- `Selector pill`: compact current-view or filter selector with arrows.
- `Status badge`: current state, rank, mode, completion, or feedback label.

## Typography Rules

Typography should create a calm hierarchy: task prompts, learner responses, and key numbers get scale; navigation, setup labels, support copy, and card/tile titles stay compact and consistent.

Like text roles should look alike across the app:

- `App identity`: product name or brand moment. It can be distinctive, but it should stay compact inside the iPad frame.
- `Screen title`: names the current surface. Clear and medium-large, not landing-page hero scale.
- `Kicker/context label`: small orientation label such as `Today's Training`, `Workout Setup`, or `Operation Mastery`. Quiet, short, and not decorative.
- `Section heading`: local group label such as `Daily Warmup Routine`, `1 Minute Workout`, or `Workout Options`.
- `Tile/card title`: short object label such as `Addition`, `Make 10`, or `Weekly Reps`.
- `Task prompt`: active math or lesson prompt. This gets priority during Practice and Learn.
- `Response text`: learner input. Large, clear, and high contrast.
- `Metric value`: numeric evidence such as streak, reps, accuracy, timer, or rank score. It can be large only inside metric surfaces.
- `Metric label`: quiet label paired closely with a value.
- `Support copy`: short explanation that clarifies a decision or learning moment. It should not fill space for decoration.
- `Control label`: button, selector, toggle, chip, and dock text. Compact, readable, touch-friendly, and not cramped.

Rules:

- Never use landing-page hero typography inside the app shell.
- Use short labels and avoid wrapping in controls.
- Do not solve cramped UI by making text tiny. Shorten the label or change the layout.
- Chunk lesson prose into short paragraphs, examples, hints, and task prompts.
- Keep explanation text to a comfortable line length, especially in lessons and dialogs.
- Pair typography with semantic text roles: primary, secondary, muted, inverse/on-accent, and status text. Detailed palette, light/dark mode, and theme behavior belongs in Color And Themes.

## Color And Theme Rules

Theme accent is identity and atmosphere. Semantic color is meaning.

Semantic colors must remain recognizable across every theme and in both dark and light mode. Keep semantic color lean:

- `Success`: correct, complete, achieved.
- `Error`: incorrect.
- `Destructive`: reset, clear, delete, or other data-risk actions.
- `Disabled/unavailable`: inactive controls, unavailable choices, coming soon.
- `Mastery/rank`: stable rank and evidence language.
- `Streak/momentum`: activity continuation and training momentum.

Do not create a separate color for every app concept. Focus, recommended, neutral evidence, in-progress, personal best, hints, and info can usually use layout, labels, icons, and neutral hierarchy.

Dark mode can use softer borders, deeper surfaces, and subtle glow. Light mode needs stronger neutral borders, clear selected states, and readable small text.

Selected states must be obvious without relying on hover or tiny text color changes.

Use accent color with restraint: primary actions, selected states, app identity moments, and small highlights. Do not use accent color as the default border, text color, chart color, badge color, and background all at once.

Jungle, Solo Leveling, Aang, and future palettes may change accent and atmosphere, but they must preserve semantic contrast and readable text.

Destructive red should be reserved for true data-risk actions. Incorrect-answer feedback may use the error family, but it should not feel as severe as clearing saved progress.

Do not rely on color alone for important states. Pair color with labels, icons, shape, position, or motion where needed.

## App Frame And Responsive Rules

Math Muscle Trainer is an iPad-first app, not a responsive marketing website.

- Desktop and tablet-landscape should preserve the centered app-frame feel.
- Extra browser space outside the app canvas is ambient frame, not layout space to fill.
- On the full-size app frame, primary workflows should fit without required scrolling whenever practical.
- Home, Setup, Practice, Results summary, and core lesson/task states should fit inside the iPad-landscape frame.
- Use responsive density, shorter copy, and better hierarchy before adding scroll.
- Scrolling is acceptable for content-heavy Learn, Progress, Options, history, or small portrait/mobile layouts.
- Do not shrink controls below usable touch size just to avoid scrolling.
- Compact controls should avoid wrapping. If a label wraps inside a button, chip, dock item, selector, or compact card, shorten the label or change the layout.
- Keep the dock usable and readable across device sizes.
- Feedback and motion should clarify state without slowing the learner. Practice feedback must stay fast.

Fit the primary task in the full app frame. Scroll only when the content type earns it. Do not use scrolling to hide poor density, oversized typography, or unnecessary containers.

## Screen Patterns

### Home

Home is an action-first daily training dashboard.

A dashboard is an action-first summary surface: it combines a few immediate next actions with lightweight progress evidence so the learner knows what to do today. It is not a full analytics view; detailed evidence belongs in Progress.

Home can show Daily Warmup Routine, quick operation training, Keep Learning, and training snapshot metrics. It should avoid marketing-page composition, generic launcher behavior, and overloaded analytics.

### Setup

Setup is the workout option-selection surface.

It lets the learner choose the kind of workout they want, then start. It should feel quick and controlled, not like filling out a form. Setup owns workout choices.

### Practice

Practice is the task-first training surface.

The prompt, response input, feedback, and keypad are the focus. HUD, navigation, streak/combo indicators, and exit controls stay secondary and compact. Avoid extra status/control rows or large surrounding UI that competes with the task.

The visible app may still use `Question`, `Answer`, and `Check`; the design system uses `Task` for the reusable interaction unit.

### Learn

Learn is guided technique-building.

It should support lessons, stages, examples, hints, task panels, feedback, and completion gates without turning every lesson section into a card.

In the Learn menu, each available lesson is an action tile: a contained, tappable object that opens a lesson. Coming-soon lessons use the same tile structure with a disabled/unavailable state. Inside a lesson, use task panels, example blocks, hint rows, and feedback states rather than treating every lesson section as another card.

### Progress

Progress is the evidence and growth surface.

It should surface high-value data only: mastery, reps, accuracy, streaks, records, weak facts, trends, and next useful training focus. Use the clearest format for the data. Tables are allowed when comparison or scanability makes them the best option, but they should feel purpose-built, readable, and learner-friendly rather than like a spreadsheet export.

Avoid low-value analytics, redundant charts, decorative metrics, and dense table layouts that do not help the learner or teacher decide what to do next.

### Results

Results is the immediate post-workout decision point.

It may recommend a next step based on the workout that just finished: repeat, practice missed facts, start a focused workout, or go to Progress. It should not become a full Progress screen.

### Options And Dialogs

Options and dialogs are compact app/support/settings surfaces.

Options owns app preferences. Home may own lightweight daily-training preferences only when they directly affect the daily dashboard, such as a future daily goal. Keep settings out of unrelated screens.

Avoid turning Options into a full settings app too early.

## Recommendations And Settings

Recommendations live only where they match the learner's current decision moment:

- Home for today's next action.
- Progress for evidence-backed next focus.
- Results for immediate post-workout next steps.

Avoid adding recommendations to Setup, Options, or random lesson sections.

Setup owns workout choices. Options owns app preferences. Home may own lightweight daily-training preferences only when they directly affect the daily dashboard.

## Do / Do Not

Do:

- Identify the role of each element before styling it.
- Choose the smallest container that fits the role.
- Use Home, Setup, and Practice references before changing the app spine.
- Keep Practice task-first.
- Keep Home focused on today's training.
- Keep Progress as evidence and growth.
- Use color for meaning, not decoration.
- Use visual anchors where they improve scanning or meaning.
- Preserve touch target size and text fit on iPad/tablet layouts.

Do not:

- Add a new card style if an existing metric, action tile, panel, or dialog role fits.
- Add containers just to make a section feel designed.
- Turn every section into a floating card.
- Nest cards inside cards.
- Make static metrics hover, lift, or look tappable.
- Add icons to every button just to make the app feel visual.
- Add recommendations or settings outside the screens that own them.
- Treat `Practice` as a single reusable system word; use `Task` internally when describing the interaction unit.
- Expose adaptive learning as a simple learner-facing on/off switch.
- Let theme accent colors replace semantic success/error meaning.
- Use hero typography or marketing-page composition inside the app shell.

## Current Reference Spine

The first visual-reference pass covers the app's core spine:

- Home dark/light: daily training dashboard and app identity.
- Setup dark/light: workout preparation and control surface.
- Practice dark/light: reusable learner task loop.

Learn, Progress, and Options should get specialized references later when their dedicated system briefs are drafted.
