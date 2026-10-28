# ADR-0019: Fluid Fit-To-Screen Layout

Date: 2026-10-27
Status: Accepted (supersedes the fixed-canvas and narrow-scrolling bullets of ADR-0007)

## Context

ADR-0007 fixed desktop and tablet-landscape rendering to an iPad-landscape canvas of 1194 x 834, fitted inside the browser. The owner chose that lock so nothing would scroll and everything would fit on the screen. On a 1920 x 1080 desktop the canvas used 48% of the screen and floated in black, and phones fell back to long scrolling pages (the fit report in `TASK-UI-002` Batch 0 found Home and Practice scrolling on every phone size).

## Decision

- The app fills the browser window at every size. There is no fixed canvas and no visible frame edge: `.page-shell` is the full window with no side padding, and the app background reaches the edges.
- Keep the original goal: each screen fits on one screen without page scrolling. Layout is sized from both screen width and height.
- Large screens grow. The root font size scales with the window from the iPad-landscape design size (`clamp(1rem, min(100vw / 74.625, 100dvh / 52.125), 1.5rem)`, which is 16px at 1194 x 834), so rem-based layout grows on screens bigger than that in both directions and is unchanged at iPad, laptop and phone sizes. Content keeps a comfortable maximum width (`--app-content-max-width`, in rem). Size caps that should grow with the app are written in rem, not px.
- Phones (`(max-width: 600px), (max-height: 500px)`) split content-heavy screens into pages shown one at a time. Swiping left or right or tapping the dots changes page (`js/app-page-swiper.js`). Practice stays a single, unswipeable screen.
- Screens move to this layout one batch at a time. `FIT_SCREEN_VIEWS` in `js/app-techniques-screen.js` lists the screens that have moved; `showView()` marks the shell `is-fit-shell` for them, and a labelled layer at the end of `css/14-responsive.css` keeps those screens fixed to the window inside the older scrolling rules. When every screen has moved, the older scrolling rules and that layer are removed.
- `tools/visual-check/fit.js` (ADR-0016) is the measure of "fits": no page or panel scrolling and no off-screen or cut-off content, at all seven reference sizes.

## Consequences

- Desktop and laptop look like the iPad-landscape design, larger, with the app background reaching the window edges.
- Phone layouts need their own page grouping per screen; each later screen batch decides its pages.
- Touch phones use the app's on-screen keypad in Practice (no phone keyboard), so the answer area stays inside the fixed layout.
- ADR-0007's other app-shell rules (dock, options, carousel navigation, component roles) still apply.
