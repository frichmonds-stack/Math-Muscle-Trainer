# Design Docs Map

Last updated: 2026-07-11

Use this map before changing UI, layout, controls, lesson surfaces, or design documentation.

## Authority Order

1. `visual-design-system.md`
   - Canonical universal design rules, screen meaning, ownership, interaction expectations, accessibility guardrails, and workflow-fit rules.
2. `component-system.md`
   - Component ownership, usage rules, wrapper expectations, and implementation contracts.
3. visual references and screenshot audits under `reference/`
   - current implementation evidence and targeted visual direction notes.
4. `ui-direction.md`
   - short product-level visual north star and interpretation notes.
5. `current-button-ui.md`
   - temporary current-state audit and control baseline, not a competing authority.

## Read First

- Start with `visual-design-system.md`.
- Then read the matching supporting doc for the task:
  - `component-system.md` for component roles and ownership
  - `reference/README.md` and relevant screenshot audit notes for visual evidence
  - `ui-direction.md` for the high-level visual north star
  - `current-button-ui.md` only when comparing against the current implementation baseline

## Current Reference Spine

- Home dark/light
- Setup dark/light
- Practice dark/light

Learn, Progress, and Options references should be expanded when their dedicated briefs are drafted.

## Notes

- Screenshot filenames keep the capture/baseline version in the name and do not need to match the current app version unless the screenshot was recaptured.
- Use local source and current implementation evidence to correct stale documentation rather than guessing from older design notes.
