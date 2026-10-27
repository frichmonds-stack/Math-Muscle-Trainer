# ADR-0009: Teacher Debug Mode

Date: 2026-05-17

## Status

Accepted

## Context

Classroom testing and UI polish need faster ways to reproduce learner states without manually completing workouts or lesson steps every time. The app is still a static browser app with no backend, accounts, or shared server data.

The user also wants a simple classroom feedback path for now: students should put up their hand and tell Mr Foo rather than submit networked feedback.

## Decision

Add an opt-in teacher/developer debug mode that activates when the Home arm mark is double-clicked, or when the app is opened with `?debug=1` or `#debug`.

Debug mode uses a client-side password gate (`N0v4r3`) to prevent casual classroom discovery. This is a convenience barrier, not real security, because all static HTML/CSS/JavaScript is visible in the browser.

The first debug-mode slice includes:

1. A hidden Home arm-mark double-click trigger plus URL/hash backup triggers.
2. A visible debug badge and floating `DEBUG` panel button after unlock.
3. Screen jumps for Home, Workout, Learn, and Progress.
4. Canned learner personas that write test progress to normal browser `localStorage`.
5. Quick debug workout starts.
6. Appearance controls for fast light/dark and palette QA.
7. A classroom feedback message: `Put up your hand and tell Mr Foo`.
8. `Exit Debug` to clear the session unlock and remove the visible debug UI.
9. A clear-progress action for the current browser.

Later additions:

- Screen-size preview (2026-10-27): the panel shows the app inside an iframe at an exact device size (the list shared with `tools/visual-check`, ADR-0016), scaled down to fit the window, with optional touch emulation. Panel actions run inside the preview while it is showing. The framed copy loads with `debugPreview=1` (plus `debugTouch=1` for touch), shows no debug UI, and only accepts panel actions when the session is unlocked. Turning the preview off reloads the page so changes made inside it show.

## Consequences

- UI polish and classroom review can switch between realistic learner states quickly.
- Debug actions affect the current browser's normal saved progress.
- The password should not be treated as protection for secrets, billing, accounts, or shared data.
- A later security/privacy pass is required before adding networked feedback, accounts, cloud sync, analytics, payments, student identifiers, or public support exports.
- Lesson stage locks can eventually be restored for normal learners while debug mode keeps teacher/developer bypass controls.
