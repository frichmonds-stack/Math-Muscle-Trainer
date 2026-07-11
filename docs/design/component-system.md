# Math Muscle Trainer Component System

This document defines component ownership, usage rules, adapter expectations, and implementation contracts under the canonical `docs/design/visual-design-system.md`.

## Core Rule

Do not create or adopt a component style until the role and ownership are clear.

Ask:

- Is this product-specific or a generic interaction primitive?
- Does the app already have an internal component that works well?
- Would a wrapper/helper add real stability or accessibility value?
- Which design tokens and state rules must it obey?

## Hybrid Ownership Model

Math Muscle Trainer uses a hybrid component model:

- keep product-specific training and learning UI internal
- preserve existing internal components that already work well
- allow a future compatible external library for advanced generic interaction primitives
- require one shared Math Trainer token system across both internal and external components

This document does not select or install a library.

## Internal Ownership

Internal components should continue to own:

- app shell and iPad frame
- training dock
- Home training modules
- custom operation choices where product behavior matters
- Practice task layout
- answer input and number keypad
- recent-answer feedback rail
- lesson stages and task panels
- learning feedback and gates
- mastery and fact-tracking visualizations
- Results composition
- custom progress evidence surfaces
- Math Muscle Trainer visual identity

Existing ordinary components may also stay internal when replacement adds no value.

## External Primitive Candidates

A future external library may provide:

- dialogs
- drawers
- popovers
- tooltips
- accessible menus
- tabs
- comboboxes and selects
- radio groups
- switches where beneficial
- accordions
- progress primitives
- alerts or toasts

The library's job would be behavior, keyboard interaction, focus management, and accessibility semantics. It must not dictate the product's overall aesthetic or screen composition.

## Adapter Boundary

Preferred dependency boundary:

`Math Trainer screen -> Math Trainer wrapper/helper -> external primitive`

Use wrappers/helpers when they:

- enforce consistent defaults
- centralize accessibility requirements
- map design tokens
- hide external APIs
- reduce migration cost
- are reused across the app

Do not create meaningless wrappers that only rename every property.

## Shared Tokens

Internal and external components must use the same semantic Math Trainer tokens for:

- surfaces
- text
- muted text
- borders
- accent
- success
- error
- destructive actions
- disabled states
- spacing
- radii
- shadows
- focus rings
- touch sizes
- motion duration and easing

Theme palettes may change atmosphere, but semantic meaning and contrast must stay stable.

## Component Ownership Register

| Component | Ownership |
| --- | --- |
| Dock | internal |
| Task panel | internal |
| Keypad | internal |
| Lesson interaction | internal |
| Action tile | internal |
| Metric panel | internal |
| Button | internal |
| Dialog | external candidate |
| Tooltip | external candidate |
| Popover | external candidate |
| Select / combobox | external candidate |
| Tabs | external candidate |
| Switch | external candidate |
| Progress indicator | undecided pending proof of concept |
| Alert / toast | external candidate |

## Current Navigation Notes

- The current dock destinations are `Home`, `Workout`, `Learn`, and `Progress`.
- A compact Options gear lives alongside the dock destinations as an app-level utility.
- Home is the current startup surface.

## Future Adoption Gate

Any external-library adoption requires a separate authorized proof-of-concept batch.

That future batch must test:

- compatibility with plain HTML/CSS/browser JavaScript
- no unnecessary framework migration
- self-hosting or controlled dependency delivery
- local development behavior
- GitHub Pages publishing
- iPad Safari
- keyboard navigation
- touch
- focus management
- VoiceOver or equivalent accessibility checks
- light and dark modes
- all supported themes
- token mapping
- bundle or asset impact
- failure and fallback behavior

No library is selected by this document. The durable decision is the hybrid architecture itself.
