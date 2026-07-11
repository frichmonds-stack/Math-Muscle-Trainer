# ADR-0010: Hybrid UI Component Architecture

Date: 2026-07-11

## Status

Accepted

## Context

Math Muscle Trainer already has a substantial internal UI built in plain HTML, CSS, and browser JavaScript. The product also has increasingly complex interaction needs around dialogs, popovers, selects, tabs, and accessibility behavior.

Replacing all internal UI with a library would risk losing product-specific training and learning patterns. Avoiding any future external primitives entirely could force the project to reinvent advanced interaction behavior that generic libraries often handle well.

## Decision

Use a hybrid component model.

- Preserve useful existing internal components.
- Keep product-specific learning and training components internal.
- Allow a future compatible external component library for advanced generic interaction primitives only.
- Apply one shared Math Trainer design-token system across internal and external components.

Internal ownership should continue to cover product-specific UI such as:

- app shell and iPad frame
- training dock
- Home training modules
- custom operation choices where behavior is product-specific
- Practice task layout
- answer input and keypad
- recent-answer feedback rail
- lesson stages and task panels
- learning feedback and gates
- mastery and fact-tracking visualizations
- Results composition
- custom progress evidence
- Math Muscle Trainer visual identity

External-library candidates, if adopted later, are generic primitives such as:

- dialogs
- drawers
- popovers
- tooltips
- menus
- tabs
- comboboxes and selects
- radio groups
- switches
- accordions
- progress primitives
- alerts or toasts

Preferred dependency boundary:

`Math Trainer screen -> Math Trainer wrapper/helper -> external primitive`

Use wrappers/helpers when they enforce defaults, centralize accessibility, map tokens, hide unstable APIs, or reduce migration cost. Do not create wrappers that only rename every property.

## Consequences

- The project can keep its product-specific task and learning UI without unnecessary replacement work.
- Future external primitive adoption must be handled as a separate authorized proof-of-concept batch.
- That future batch must verify compatibility with plain browser JavaScript, controlled dependency delivery, local development, GitHub Pages publishing, iPad Safari, keyboard navigation, touch, focus management, accessibility checks, theme coverage, token mapping, bundle impact, and fallback behavior.
- This ADR does not select a vendor or authorize implementation work by itself.
