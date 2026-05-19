# Math Muscle Trainer UI Direction

This is the stable design direction for UI work. Use it before changing layout, controls, navigation, visual hierarchy, or generated UI copy. It is intentionally practical: future Codex sessions should be able to apply it without needing the full chat history.

For the app-wide design brief, visual roles, screen meaning, and interaction vocabulary, read `docs/design/visual-design-system.md` first.
For reusable component roles and CSS-class expectations, also read `docs/design/component-system.md`.
For the current implemented button/control baseline, read `docs/design/current-button-ui.md`.
For visual references and screenshot audits, read `docs/design/reference/README.md` and `docs/design/reference/screenshot-audit-v0.20.5.md`.

## North Star

Math Muscle Trainer should feel like a minimalist, friendly native iPad training app for all ages.

The target is:

- clear enough for young learners,
- polished enough for adults,
- tactile enough for touch,
- restrained enough to stay focused,
- motivating without becoming gamey,
- strength-themed without looking like a generic fitness app.

The design phrase to remember:

`An iPad training app a child can understand and an adult would not feel silly using.`

Minimalism is a learning-design strategy, not only a visual preference. Use it to reduce extraneous cognitive load so learners can spend more attention on arithmetic. Visuals, motion, surfaces, and feedback should clarify the task or progress state; avoid decoration that competes with the math.

## Visual Feel

Aim for:

- minimalist, but not empty or cold,
- friendly, but not childish,
- strong, but not aggressive,
- app-native, not web-page-like,
- tactile controls, not flat admin rectangles,
- small visual anchors such as icons, symbols, marks, and simple pictorial cues that make the app feel interactive rather than purely text-based,
- low clutter, clear spacing, and obvious next actions.

Avoid:

- large nested boxes inside the app canvas,
- corporate dashboard/admin styling,
- overly decorative gamer UI,
- marketing landing-page composition,
- tiny text-only controls for important actions,
- too many outlined rectangles,
- making every block look tappable.

## Audience

The app must work for primary students through adults. This means:

- use plain labels and predictable controls,
- keep tap targets generous,
- keep feedback fast and clear,
- avoid patronizing copy,
- avoid adult-only productivity density,
- avoid toy-like visual language.

## App Shell

The app uses a single app-shell mental model.

- Desktop and tablet-landscape render inside a centered iPad-landscape-style app canvas.
- Extra browser space outside the app canvas is ambient frame, not a layout area to fill.
- The primary design target is iPad/tablet classroom use, especially landscape. Tablet portrait, narrow desktop, and phones are secondary support targets.
- Phone layouts should be usable, not optimized as the main product target.
- Narrow/mobile layouts may become scroll-friendly and portrait-oriented.
- Avoid unnecessary scrolling on large enough app-frame screens, but use comfortable scrolling on small screens instead of shrinking controls below usable touch sizes.
- Prefer responsive density for app-frame layouts: scale gaps, padding, headings, and control proportions for shorter desktop/tablet heights before allowing avoidable overflow.
- Screens should feel like app surfaces, not website sections.
- Avoid visible page-section panels inside the app shell unless the element is a true card, repeated item, or dialog.
- The default entry should be the learner's main training surface, not a launcher-style home page.
- Primary app navigation should use a compact rounded training dock that hugs its contents on iPad/tablet landscape; avoid a full-width phone-style bottom banner on wide screens.

## Navigation And Placement

Classify every action by role before styling or placing it.

- Global utilities: Home, Settings, and similar app-wide utilities.
- Local actions: actions that belong to the current screen, slide, lesson, or result.
- Primary next action: the one thing the learner is most likely meant to do next.
- Secondary alternatives: useful actions that should not compete with the main one.
- Quiet exits: Back, Cancel, Exit Lesson, Skip, and similar escape paths.

Rules:

- Keep persistent app destinations in the rounded training dock.
- Keep global utilities in the top-right rail.
- Keep local selectors and actions with the content header or relevant content area.
- `Exit Lesson` is local to lesson mode, not a global utility.
- Results next-step actions belong with the Results content, not in the global rail.
- Carousel/kicker rows use a fixed label track so arrows and titles do not jump.
- Future `Challenge` navigation belongs in the dock once real challenge modes exist; do not show a fake permanent destination before it has enough useful content.

## Button Role Contract

Use this role system for future buttons and controls.

Implementation roles and target class names live in `docs/design/component-system.md`.

### Primary

Use for the main next action. Usually one primary button per screen or major panel.

Examples:

- `Start Workout`
- `Start Lesson`
- `Continue`
- `Check Answer` when manual checking is the main action
- `Start Workout` from lesson completion

Visual direction: solid, confident, touch-friendly, medium radius, not neon or oversized.

### Secondary

Use for meaningful alternatives that still matter.

Examples:

- `Repeat Workout`
- `New Workout`
- `Practice More`
- `Learn More`
- `Try Again`

Visual direction: quieter than primary, often a subtle tinted surface rather than a hard outlined box.

### Ghost

Use for quiet navigation, cancellation, exits, and reversible actions.

Examples:

- `Cancel`
- `Back`
- `Exit Lesson`
- `Skip`
- `Clear`
- `Maybe Later`

Visual direction: low emphasis, mostly text/icon with a subtle press surface.

### Icon Utility

Use for compact global or repeated controls.

Examples:

- Home
- Settings
- carousel previous/next
- close dialog
- info/help
- hint icon where compactness matters

Visual direction: compact rounded icon buttons with clear hit targets and accessible labels.

## Toggles And Selectors

Use toggles only for binary choices.

Good toggle candidates:

- sound on/off,
- reduce motion on/off,
- keypad always visible on/off,
- hints on/off,
- negatives on/off,
- practice missed facts only on/off,
- show hints during workout on/off.

Do not use a learner-facing `Adaptive on/off` setting. Adaptive behavior should be app intelligence by default. If learner control is needed, expose friendly training preferences such as:

- Gentle / Balanced / Challenge,
- Short / Standard / Long,
- New skills / Weak spots / Mixed review,
- hints,
- mistake review.

Use segmented controls or chips for multi-option choices.

Good segmented/chip candidates:

- operation selection,
- difficulty,
- workout mode,
- Progress view/filter,
- mastery view.

## Cards, Lists, Metrics, And Tiles

Use content role, not visual habit, to choose a layout.

- Action tiles: tappable items that open, train, drill down, or start something.
- Static metrics: display-only values such as streak counts or totals.
- Insight boards/lists: coaching, summaries, history, comparisons, and next-focus guidance.
- Dialogs/cards: framed surfaces for modal decisions or repeated objects.

Rules:

- Static metrics do not hover, lift, or look pressable.
- Action tiles can use hover/focus/press states.
- Insight rows only look interactive if they actually are interactive.
- Avoid cards inside cards.
- Avoid turning every page section into a floating card.

## Theme And Palette

Keep the strength/mastery identity, but avoid one-note styling.

Direction:

- dark graphite/charcoal base,
- warm red/coral primary accent,
- restrained success/active accents,
- strong text contrast,
- light mode with equal care, not as an afterthought.

Avoid:

- dominant purple/purple-blue gradients,
- beige/brown/espresso dominance,
- muddy low-contrast light mode,
- relying on color alone for meaning.

## Icon And Brand Direction

The mark should communicate both math and strength.

Small interface visuals are part of the app direction. Use icons, simple math-strength marks, compact pictorial cues, and status symbols to help users scan and understand the app. These should clarify structure and interaction, not become decoration.

Do not interpret "more visual" as "put an icon inside every button." Keep buttons mostly text-first and restrained. Use visuals at the app, screen, card, lesson, progress, and status level where they make the experience richer or easier to scan.

Good visual locations:

- operation identity marks near setup/practice context,
- lesson diagrams or mental-model cues,
- progress rank/status badges,
- mastery/fact-family maps,
- challenge trophies/timers/personal-best marks,
- empty-state or next-focus cues,
- compact utility icons where the icon is the action.

Best directions:

- compact dumbbell with a math symbol,
- weight plate with `+`, `x`, or `+ - x /`,
- simple badge/shield with a math cue,
- arithmetic-strength mark that remains legible at app-icon size.

Avoid:

- dumbbell only, because it reads as fitness,
- busy multi-symbol marks that fail at small size,
- mascots unless explicitly requested,
- childish or overly aggressive styling.
- text-only surfaces where a clear icon or visual cue would make the app feel more touchable and understandable.

## AI Design Workflow

When the user reacts without design vocabulary, translate the reaction into a design problem.

Examples:

- "It feels ugly" may mean hierarchy, spacing, shape, or color is wrong.
- "It looks like a website" may mean the composition is too marketing/page-section driven.
- "It is a box inside a box" means nested containment is fighting the app shell.
- "It feels messy" may mean too many layout languages are mixed.
- "It feels too grown-up" may mean density, contrast, or copy is too admin-like.

For UI changes:

1. Identify the role of each element.
2. Check the relevant component roles and visual references.
3. State the intended structure before editing.
4. Apply the smallest useful visual/system change.
5. Check desktop and iPad-sized behavior.
6. Preserve touch ergonomics and text fit.
7. In the final response, name which UI roles changed and whether any reference doc or screenshot needs updating.
