# Math Muscle Trainer Component System

This document defines the reusable UI roles and class contract for future implementation. It sits under `docs/design/ui-direction.md`: the direction doc explains the feel; this document explains how to keep the same style across screens.

This is a planning contract until the CSS is fully aligned. When future UI work touches controls, prefer these roles/classes instead of inventing one-off styles.

For the current implemented baseline and screenshot review checklist, see `docs/design/current-button-ui.md`.
For visual references and screenshot audit notes, see `docs/design/reference/README.md`.

## Core Rule

Do not create a new visual style until the element's role is clear.

Before styling, ask:

- Is this a primary action, secondary action, ghost action, icon utility, toggle, segmented choice, metric, action tile, insight row, content header, or dialog action?
- Does an existing role/class cover it?
- If not, is there a truly new reusable role, or is this a one-off that should be simplified?
- Which visual reference or screenshot audit entry applies?

## Button Classes

Target class contract:

- `.btn` - shared base for text or icon+text buttons.
- `.btn-primary` - the one main next action.
- `.btn-secondary` - meaningful alternate action.
- `.btn-ghost` - quiet navigation, cancellation, exit, skip, or clear action.
- `.btn-danger` - destructive confirmation only, used sparingly.

States every button role should support:

- default,
- hover for pointer devices,
- active/pressed,
- `:focus-visible`,
- disabled.

Rules:

- Most screens or panels should have no more than one `.btn-primary`.
- Secondary buttons should not visually compete with primary buttons.
- Ghost buttons should not look like boxed primary actions.
- Important touch actions should meet a comfortable target size; prefer at least `44px` and often `48-56px`.
- Text buttons do not need icons by default. Add an icon only when it carries meaning, improves scanning, or identifies an operation, status, or utility action.

## Icon Utility Buttons

Target class contract:

- `.icon-button` - shared icon button base.
- `.icon-button-global` - Home, Settings, and app-wide utilities.
- `.icon-button-local` - local compact controls such as close, hint, info, or carousel arrows.

Use for:

- Home,
- Settings,
- carousel previous/next,
- close dialog,
- info/help,
- hint icons,
- compact repeated controls.

Rules:

- Prefer recognizable icons for global utilities.
- Include accessible labels.
- Do not use large text buttons for repeated compact utilities.
- Do not put local actions in the global rail.

## Training Dock

Target class contract:

- `.app-dock` - compact rounded persistent navigation container.
- `.app-dock-button` - text-first destination button inside the dock.

Current destinations:

- `Train`,
- `Learn`,
- `Progress`.

Future destination:

- `Challenge`, once real challenge modes exist.

Rules:

- On iPad/tablet landscape, the dock should hug its content and stay centered near the bottom.
- Do not stretch the dock into a full-width phone-style banner on wide screens.
- Keep labels visible; do not rely on icons alone for young learners.
- The selected destination should be obvious, but only `Train` should feel like the emotional center of the app.
- Keep dock buttons restrained and text-first. Add icons only if they become necessary for recognition and remain consistent across all dock destinations.

## Visual Anchors

Target class contract:

- `.visual-anchor` - small reusable icon/mark wrapper.
- `.visual-anchor-symbol` - math symbol, status mark, or simple pictorial cue.
- `.visual-anchor-label` - optional nearby label when text is needed.

Use for:

- Home destination modules,
- lesson cards,
- operation choices,
- Progress summary sections,
- setup choices,
- reward/status moments,
- empty states.

Rules:

- Prefer simple, recognizable icons or math-strength symbols over purely decorative imagery.
- Visual anchors should help scanning, hierarchy, or interaction clarity.
- Prefer putting visual anchors in screen context, cards, lesson content, progress/status modules, and app identity moments rather than inside every text button.
- Do not replace important labels with icons alone for young learners.
- Do not copy placeholder symbols from reference boards as canonical app icons.
- Keep icon style consistent across the app.
- Avoid busy illustrations or mascot-like visuals unless the user explicitly chooses that direction.

## Toggles

Target class contract:

- `.toggle-control` - full control wrapper.
- `.toggle-track` - visual track.
- `.toggle-thumb` - moving thumb.
- `.toggle-label` - readable setting label.

Use toggles only for binary choices:

- sound on/off,
- reduce motion on/off,
- keypad always visible on/off,
- hints on/off,
- negatives on/off,
- practice missed facts only on/off,
- show hints during workout on/off.

Do not expose `Adaptive on/off`. Adaptive behavior should be app intelligence by default and, if needed, expressed through friendly training preferences.

States:

- off,
- on,
- focus-visible,
- disabled.

## Segmented Controls And Chips

Target class contract:

- `.segmented-control` - wrapper for a mutually exclusive option set.
- `.segment-button` - each option in a segmented control.
- `.chip-selector` - compact selector/chip control.
- `.chip-option` - selectable chip option.

Use for multi-option choices:

- operation,
- difficulty,
- workout mode,
- Progress filters,
- mastery view,
- training feel such as Gentle / Balanced / Challenge.

Rules:

- Do not use toggles for more than two choices.
- Keep labels short enough for tablet and mobile.
- Selected state must be visible without relying on hover.
- Avoid wrapping text inside compact segmented controls where possible.

## Content Headers

Target class contract:

- `.content-header` - local header for a screen, slide, or major panel.
- `.content-header-main` - title/subtitle group.
- `.content-header-actions` - local actions/selectors.
- `.content-kicker` - small contextual label when useful.

Use for:

- Results summary header,
- Progress slide header,
- Learn/Technique lesson header,
- Setup section header.

Rules:

- Local selectors and local actions belong here or directly in the relevant content area.
- Do not put local selectors/actions beside global Home/settings controls.
- Keep titles, subtitles, selectors, and actions aligned to the same content track.

## Metric Panels

Target class contract:

- `.metric-panel` - display-only metric container.
- `.metric-value` - main numeric/value text.
- `.metric-label` - label text.
- `.metric-support` - optional small supporting text.

Use for:

- streak counts,
- workout totals,
- best records,
- hearts/stars totals,
- summary stats.

Rules:

- Static metrics do not hover, lift, or look tappable.
- Static metrics should use `cursor: default` and should not inherit action-tile hover/focus treatments.
- If a metric becomes clickable, change its role to action tile or add a clearly documented interactive variant.
- Avoid dense admin-dashboard feel.

## Action Tiles

Target class contract:

- `.action-tile` - tappable tile/card base.
- `.action-tile-title` - title.
- `.action-tile-meta` - supporting text.
- `.action-tile-status` - status/rank/badge area.

Use for:

- lesson cards,
- fact tracker cards that start training or open detail,
- Home destination modules,
- selectable operation cards.

States:

- default,
- hover for pointer devices,
- active/pressed,
- focus-visible,
- disabled/coming-soon.

Rules:

- Action tiles can show interactive affordances.
- Coming Soon tiles should look unavailable without feeling broken.
- Avoid nesting action tiles inside larger card containers.

## Insight Lists And Boards

Target class contract:

- `.insight-board` - open board for summaries/coaching.
- `.insight-row` - single row/item.
- `.insight-rank` - optional rank/index marker.
- `.insight-badge` - small status badge.

Use for:

- Next Focus,
- Coach Notes,
- Growth Opportunities,
- Workout History summaries,
- non-clickable recommendation lists.

Rules:

- Insight rows should not look pressable unless they are interactive.
- Use spacing, dividers, and hierarchy before adding more boxes.
- Keep coaching text concise and scannable.

## Dialogs

Target class contract:

- `.dialog-panel` - modal surface.
- `.dialog-header` - title area.
- `.dialog-body` - content.
- `.dialog-actions` - actions.

Rules:

- Destructive or irreversible actions need clear confirmation hierarchy.
- `Cancel` is usually ghost.
- The main confirmation is usually primary, unless the action is destructive.

## Carousel And Kicker Controls

Target class contract:

- `.carousel-kicker` - fixed title/control row.
- `.carousel-title-track` - reserved label space.
- `.carousel-arrow` - previous/next icon utility button.

Rules:

- Arrows do not shift when labels change.
- Labels stay centered within their reserved track.
- Kicker rows should have enough breathing room from page titles and content.

## Visual Exploration Notes

Current visual exploration suggests:

- use Concept 3's softer tactile control language for the feel,
- govern that softness with Concept 1's clearer hierarchy and spacing discipline,
- keep Concept 2 as a maturity/consistency reference, not the main visual base,
- avoid copying the boxiness of the earlier design-system boards literally.

Apply the structural role system, then soften the real app controls:

- tactile iPad controls,
- medium radii,
- fewer hard outlines,
- subtle surfaces instead of rectangle grids,
- strong but restrained primary actions.

## Implementation Path

Recommended order:

1. Audit existing controls and map them to these roles.
2. Define or consolidate base CSS classes in `styles.css`.
3. Refactor one surface at a time:
   - Results/Progress actions and headers,
   - Setup controls,
   - Learn/lesson controls,
   - Practice controls,
   - Settings/dialogs.
4. Add a lightweight component preview page only if visual drift remains a problem.

Do not convert the whole app in one giant pass unless the user explicitly asks for a full UI-system refactor.
