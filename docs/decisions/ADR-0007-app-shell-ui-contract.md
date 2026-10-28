# ADR-0007: App Shell UI Contract

Date: 2026-05-11

## Status

Accepted

## Related Design Guidance

- `docs/design/ui-direction.md` is the stable UI direction document for future design and implementation work.
- `docs/design/component-system.md` defines reusable component roles and target class contracts for keeping the style consistent.
- This ADR records the app-shell contract decision; the design document translates that contract into practical visual and control rules.

## Context

Recent UI passes created several individually reasonable layouts, but Progress, Results, Learn, and lesson practice screens started to feel visually inconsistent. The app direction is iPad-first, with desktop expected to look like the same app rather than a separate website adaptation.

## Decision

Use a shared app-shell contract across the main app surfaces:

- App-level options live in the bottom dock as an icon-only gear utility. Home should not carry floating About/Settings buttons unless a later redesign explicitly restores them.
- About and temporary classroom feedback live inside Options; debug tools remain separate developer/teacher tooling for now.
- Carousel/kicker navigation uses a fixed label space so left/right arrows do not shift between slides.
- Local selectors and actions live with the slide/content header, not with global utility controls.
- Static metric panels are display-only and do not use hover/lift affordances.
- Actionable lesson/fact tiles can use hover/focus/press states because they open lessons, start training, or drill into detail.
- Insight and coaching sections can use open columns/lists when scanning and comparison matter more than tapping every block.
- Avoid visible page-section boxes inside the app canvas unless the surface is an intentional card, dialog, or repeated item.
- Superseded by ADR-0019 (2026-10-27): the app fills the window at every size, fits each screen without page scrolling, and splits screens into swipeable pages on phones. The earlier rule was a fixed iPad-landscape canvas (`1194 x 834`) with scrolling narrow layouts.

## Consequences

Future UI work should classify each element by role before styling it. This keeps cards, lists, chips, selectors, metric panels, and action tiles consistent without forcing every section into the same visual layout.

Desktop review covers the whole window at the reference sizes in `tools/visual-check/lib/viewports.js` (ADR-0019).
