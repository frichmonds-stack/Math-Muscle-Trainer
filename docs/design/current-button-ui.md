# Current Button UI Reference

Last updated: 2026-05-18

This document describes the current implemented button/control direction after the early UI direction batches. Use it when comparing screenshots against the intended style.

It is not the final design system. It is the current working baseline.

## Visual Reference

![Current button UI reference](reference/button-ui-design-brief.jpg)

Use `docs/design/reference/button-ui-design-brief.jpg` as the current visual reference for button/control shape, spacing, density, hierarchy, and states.

Important: the symbols shown inside primary and secondary buttons are examples only. They are not canonical app icons and should not be copied by default. Text buttons do not need icons unless the icon carries real meaning, improves scanning, or identifies a specific operation, status, or utility action.

## Design Formula

Current target:

`Concept 3 tactile softness + Concept 1 hierarchy and spacing discipline`

In practice this means:

- softer controls than the original boxy design-system concepts,
- clearer layout hierarchy than the more playful concept directions,
- native iPad feel,
- minimalist and low-clutter,
- friendly enough for young learners,
- polished enough for adults,
- strength/math identity without heavy decoration.

## Implemented Visual Language

The current UI uses:

- rounded pill buttons for global utilities and most text buttons,
- a compact centered rounded training dock for primary app navigation,
- soft dark surfaces with subtle highlight gradients,
- warm red/coral primary actions from the existing theme tokens,
- restrained buttons with fewer decorative icons inside them,
- visual anchors/icons used more selectively for app context, operation identity, and status scanability,
- softer card radii on action tiles and metrics,
- switch-style toggles for binary setup options,
- compact rounded icon utilities for Home/settings and carousel-style controls.
- static metric panels that do not hover, lift, or use pointer-style affordances.
- text-first primary and secondary buttons by default, with icons reserved for meaningful operation, status, or utility roles.

The current implementation deliberately keeps the existing theme/color system:

- `--accent`, `--accent-strong`, and `--accent-rgb` still drive primary color.
- Theme variants still override those tokens.
- Light mode receives separate overrides where needed.

## Button Roles

### Primary

Current classes:

- `.primary-button`
- `.nav-button-primary`
- `.home-start-button`

Intended look:

- solid warm red/coral,
- tactile highlight,
- stronger shadow than secondary/ghost,
- obvious main next action,
- not neon,
- usually one per screen or local panel.

Current examples:

- Setup `Start`
- Practice `Check`
- Confirmation dialog confirm buttons

Icon rule:

- Do not add icons to primary buttons by default.
- Use a primary-button icon only when it adds clear meaning, not decoration.

Compare screenshots for:

- Does the primary action clearly stand out?
- Does it feel strong but not aggressive?
- Is there only one dominant action in the area?

### Secondary / Action Tile

Current classes:

- `.nav-button`
- `.home-menu-row .nav-button`
- `.choice-pill`
- `.operation-choice`
- `.technique-card`
- `.table-card[role="button"]`

Intended look:

- dark tactile surface,
- softer than a rectangle,
- clear label plus optional visual anchor,
- interactive but not as loud as primary,
- strong enough to feel tappable.

Current examples:

- Setup operation choices
- Setup workout type choices
- Lesson cards
- Fact tracker cards

Icon rule:

- Operation choices can use `+`, `-`, `x`, and division symbols because the symbols carry direct meaning.
- Most secondary text buttons, such as `Practice More`, `Repeat Workout`, and `Learn`, should remain text-only unless a visual anchor improves scanning.

Compare screenshots for:

- Does it look tappable?
- Does it avoid competing with the primary button?
- Does any visual anchor help scanning rather than decorating the button?
- Does the card feel too empty or too boxed?

### Training Dock

Current classes:

- `.app-dock`
- `.app-dock-button`

Intended look:

- compact rounded taskbar/dock,
- centered near the bottom of the iPad app canvas,
- text-first labels,
- selected destination filled with the warm red/coral accent,
- inactive destinations quiet and legible,
- not stretched across the full landscape width.

Current examples:

- `Train`
- `Learn`
- `Progress`

Compare screenshots for:

- Does the dock feel like native app chrome rather than a website nav bar?
- Does it hug its contents instead of becoming a wide empty banner?
- Is the active destination clear?
- Are labels readable for young learners?
- Does it stay calm enough for adults?

### Ghost

Current classes:

- `.ghost-button`
- `.subtle-button`

Intended look:

- quiet,
- lower emphasis,
- useful for exit/cancel/back/skip,
- still touchable,
- not a full primary-style box.

Current examples:

- `End Workout`
- `Skip`
- Home icon button when implemented as a ghost button in focused screens
- Cancel buttons in dialogs

Compare screenshots for:

- Does it stay quiet?
- Is it still discoverable?
- Does it avoid looking like the main action?

### Icon Utility

Current classes:

- `.utility-button`
- `.carousel-button`
- `.calendar-nav-button`
- `.carousel-inline-nav-button`
- `.fact-range-button`
- selected small local icon buttons

Intended look:

- compact rounded touch targets,
- icon-first,
- app utility feel,
- used for Home/settings/arrows/help/close.

Current examples:

- top-right settings button,
- top-right Home button on focused screens,
- carousel arrows,
- fact-range arrows,
- calendar month arrows,
- help/explainer buttons.

Compare screenshots for:

- Does it feel like app chrome rather than content?
- Is it compact but still easy to tap?
- Are local controls kept out of the global rail?
- Do repeated arrow controls share the same local icon-button treatment instead of falling back to native browser buttons?

### Static Metrics

Current classes:

- `.stat-block`
- `.hud-card`
- tracker summary rows
- mastery metric cells

Intended look:

- display-only,
- calm borders/surfaces,
- no hover lift,
- no pointer cursor,
- clearly different from action tiles.

Current examples:

- Results summary numbers,
- Workout Log metrics,
- Workout Tracker streak/month rows,
- Home snapshot metrics.

Compare screenshots for:

- Does the metric read as information rather than a button?
- Does it avoid competing with real controls nearby?
- Are dividers visible enough in light mode without becoming table-heavy?

## Visual Anchors

Current classes:

- `.visual-anchor`
- `.operation-choice-icon`
- `.session-badge-icon`
- `.hud-icon`

Current examples:

- Setup operations: `+`, `-`, `x`, division
- Practice status/HUD icons

Intended look:

- small contained marks,
- consistent rounded mini surface,
- useful for scanning,
- not decorative clutter,
- labels remain present for young learners.

Current rule:

- Do not add icons to every button just to make the app feel visual.
- Prefer screen-level, card-level, lesson-level, progress/status, and brand/operation visuals.
- Text-first buttons are preferred unless the icon is the action or the symbol carries direct math meaning.

Compare screenshots for:

- Does the visual anchor make the area easier to understand?
- Does it feel integrated with the text?
- Is it too small, too detached, or floating?
- Is the icon style consistent?

## Toggles

Current classes:

- `.toggle`
- `.toggle-row`
- `.toggle-label`

Current behavior:

- native checkbox inputs are restyled as switch-like toggles.
- on state uses the current accent theme.
- off state uses a dark neutral track.

Current examples:

- `Targeted`
- `Negatives`
- `Regrouping`

Compare screenshots for:

- Does the switch read as on/off?
- Is the label close enough to the control?
- Does the active state fit the current theme?
- Is the switch too visually heavy in Setup?

## Current Screen Read

### Home

Current status: retained as a brand/home surface, but no longer the default entry screen.

Working:

- clear primary/secondary hierarchy,
- app-like utility buttons,
- brand mark gives the screen a visual identity.

Watch:

- the home destination modules are now secondary to the dock and may eventually be reduced further,
- long-term logo/icon mark should combine math and strength more clearly.

### Setup

Current status: default entry screen and main Train surface.

Working:

- rounded training dock makes Setup feel like a primary app destination,
- operation chip/choice benefits from math symbols,
- difficulty buttons feel closer to the button system,
- top utilities are consistent.

Watch:

- workout type cards are cleaner without decorative internal icons, but still need manual review for spacing and scale,
- selected and unselected states need careful visual review.

Likely next refinement:

- tune workout type cards so they feel like compact setup choices rather than empty panels.
- add richer visual identity elsewhere in the app, especially lessons/progress/status, instead of decorating those buttons.

### Practice

Current status: first pass applied, needs manual review.

Working:

- status/HUD icons reduce text-only feel,
- shared button/toggle styling carries through.

Watch:

- Practice still needs the larger app-shell pass that removes/softens any remaining "box inside shell" feeling,
- keypad buttons should stay large and highly legible,
- HUD icons should not make the top area feel busy.

## Consistency Checklist

Use this when reviewing a screenshot:

- Does the rounded dock look centered, compact, and purpose-built?
- Is the main action red/coral and visually dominant?
- Are secondary/action tiles dark, tactile, and softer than hard rectangles?
- Are ghost buttons quiet?
- Are icon utilities compact and in the right place?
- Are visual anchors used selectively rather than stuffed into every control?
- Do labels remain clear for young learners?
- Does the screen avoid feeling like a website or corporate dashboard?
- Does the screen avoid feeling like a toy or arcade game?
- Does the screen still feel minimalist?
- Does light mode preserve the same role hierarchy?

## Known Gaps

- The current classes are still historical (`primary-button`, `ghost-button`, `nav-button`) rather than the cleaner future contract (`.btn`, `.btn-primary`, `.action-tile`, etc.).
- Setup workout type cards need another visual pass after the icon cleanup.
- Progress and Learn have not fully received the visual-anchor/component-system treatment yet.
- App screenshots are now scaffolded in `docs/design/reference/screenshot-audit-v0.20.5.md`, but the actual screenshot image set still needs to be captured.
- The latest docs snapshot has not been republished after root UI changes.
