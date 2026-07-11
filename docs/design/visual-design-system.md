# Visual Design System

Last updated: 2026-07-11

This is the canonical design authority for Math Muscle Trainer. Use it before changing layout, controls, hierarchy, screen ownership, or interaction behavior.

## North Star

Math Muscle Trainer should feel like a compact iPad-native training app: focused, tactile, calm, strong, and readable for both students and adults.

The UI should make arithmetic practice feel purposeful and energetic without becoming childish, cluttered, or admin-dashboard cold.

## Canonical Rules

- Identify role before styling.
- Usually present one clear primary action per screen, dialog, or focused panel.
- Use the smallest container that clearly communicates the role.
- Avoid nested cards and unnecessary containment.
- Static metrics must not look tappable.
- Practice and Learn tasks stay prompt-response-feedback focused.
- Do not make text tiny just to force a layout to fit.
- Fit primary workflows inside the iPad landscape frame where practical.
- Allow content-earned scrolling for Learn, Progress, history, Options, portrait, and phone layouts.
- Motion should communicate state rather than decorate.
- Theme colors are identity; semantic colors are meaning.
- Do not rely on color alone for important states.
- Keep navigation predictable and cognitive load learner-friendly.

## Screen Ownership

### Home

Home is the learner's startup surface and daily training dashboard.

It owns today's handoff actions, quick operation training, learning continuation, and a light progress snapshot. It is not a marketing page and not a generic launcher.

### Setup

Setup is the compact workout-preparation surface.

It owns workout choices such as operation, duration, difficulty, workout type, and related toggles. It is not the startup screen.

### Practice

Practice is task-first.

The prompt, response input, feedback, recent-answer rail, and keypad are the main loop. HUD details are secondary status.

### Learn

Learn is guided technique-building.

Lessons own stages, examples, hints, scaffolds, guided practice, final practice, and completion gates.

### Results

Results is the immediate post-workout decision point.

It may recommend the next useful action, but it is not the full Progress screen.

### Progress

Progress is evidence and growth.

It owns workouts, mastery, records, trackers, and evidence-backed next focus. Static metrics stay informational; actionable items should clearly look actionable.

### Options, Dialogs, And Debug

Options, About, and Give Feedback are compact app/support surfaces.

Debug remains teacher/developer tooling, not learner-facing product functionality.

## Universal Design Rules

- Role before styling.
- Usually one clear primary action per screen, dialog, or focused panel.
- Use the smallest container that communicates the role.
- Avoid nested cards and unnecessary containment.
- Interactive controls must visibly support default, hover where relevant, pressed, focus-visible, disabled, selected, loading where relevant, error, and success states.
- Static metrics must not look tappable.
- Practice and Learn tasks remain prompt-response-feedback focused.
- Important touch targets should generally meet at least `44px`, with `48-56px` preferred where practical.
- Keyboard focus must be logical and visibly indicated.
- Do not rely on color alone.
- Distinguish theme colors from semantic colors.
- Do not make text tiny merely to force a layout to fit.
- Fit primary workflows in the iPad landscape frame where practical.
- Allow content-earned scrolling for Learn, Progress, history, Options, portrait, and phone layouts.
- Screen ownership must stay clear across Home, Setup, Practice, Learn, Results, Progress, Options, dialogs, and Debug.
- Motion should communicate state rather than decorate.
- Reduced-motion behavior should be supported where motion is used.
- Contrast and labels should stay readable across dark/light modes and theme palettes.
- Navigation and interaction patterns should lower learner cognitive load.

## Surface Roles

- `App shell`: fixed app frame and persistent navigation context
- `Unframed section`: default content grouping inside a screen
- `Row`: smallest repeated unit for settings, lists, or compact evidence
- `Tile`: tappable contained item that starts, opens, selects, or drills down
- `Metric panel`: display-only value or small chart
- `Task panel`: active learner workspace for prompt, response, and feedback
- `Panel`: larger grouped workspace for a dense focused mode
- `Dialog panel`: temporary modal decision or support surface

Use the smallest fitting surface. Do not promote rows into cards or cards into panels just to make the UI feel designed.

## Control Rules

- Dock items own persistent navigation.
- One primary action should dominate the local decision area.
- Secondary actions should remain meaningful but quieter.
- Ghost actions should support exit, cancel, skip, or reversible moves without competing.
- Icon utilities are for compact app or local utilities, not for every action.
- Choice pills, toggles, and selectors should feel touch-friendly and clearly selected.
- Static evidence and metrics must not borrow action-tile affordances.

## Color And Meaning

- `Accent` is product identity and atmosphere.
- `Success`, `error`, `destructive`, `disabled`, and similar semantic roles must preserve meaning across themes.
- Theme palettes may change mood, but they must not break contrast or semantic recognition.
- Avoid using accent as the default color for everything at once.

## Responsive Rules

- Desktop and tablet landscape preserve the app-frame feel.
- Extra browser space is ambient frame, not a layout area to fill.
- Home, Setup, Practice, Results summary, and core task states should fit the landscape frame where practical.
- Responsive density and clearer hierarchy come before shrinking controls.
- Scroll is acceptable when the content type earns it.

## Accessibility And Motion

- Visible focus states are required.
- Reduced motion should be respected when motion exists.
- Feedback motion should clarify correctness, state change, or progression.
- Labels and contrast must stay readable in dark and light modes.

## Hybrid UI Component Architecture

Math Muscle Trainer uses a hybrid component model:

- preserve useful existing internal components
- keep product-specific learning and training components internal
- selectively use a compatible external component library later for advanced generic interaction primitives
- apply one shared Math Trainer token system across internal and external components

This document defines the product-level rule. `component-system.md` defines ownership and wrapper expectations, and ADR-0010 records the durable architecture decision.

## Reference Spine

The current core visual reference spine is:

- Home dark/light
- Setup dark/light
- Practice dark/light

Learn, Progress, and Options references remain future specialized-brief work.
