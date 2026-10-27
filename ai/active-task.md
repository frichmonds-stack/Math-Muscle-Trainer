# Active Task

## TASK-UI-002 Responsive layout

Status: `implementing` (Batch 0 published as `v0.20.12` to this branch; Batch 1 authorized and paused before edits; Batches 2-4 proposed, each needs its own `execute now`)

Branch: `claude/magical-tesla-xwpqeh`. Commit only on `publish close`; never push or merge to `main` from the cloud (ADR-0018).

### Owner decisions (2026-10-27)

- Replace the fixed 1194x834 iPad-landscape canvas (ADR-0007) with a fluid layout. Large screens grow to fill the window (option 1), with a comfortable maximum content width (about 1500-1600px); no visible frame edge.
- Keep the reason for the old lock: everything fits on one screen without page scrolling. Size from both screen width and height.
- Optimise for phones, including phone landscape. On phones each screen fits one screen and is split into pages you swipe between (dots show position), reusing the Progress/Results swipe code (`js/app-progress-carousel.js`). Practice stays one unswipeable screen.
- The owner reviews with the debug-mode Screen size switcher rather than Chrome device tools.

### Batch 0: tools (published `v0.20.12`)

- Debug Screen size preview in `js/app-debug.js` and `css/12-debug.css` (ADR-0009).
- `tools/visual-check`: shared viewport list (`lib/viewports.js`), fit checker (`fit.js`, `lib/fit-rules.js`), review sheet (`sheet.js`), `run-all.sh --review`, four extra sizes; capture and fit share `lib/app-session.js`. `tests/viewports.test.js` keeps the two size lists equal.
- Before picture (`run-all.sh --review` on the unchanged layout): see the fit report summary in the batch report; phones fail on page scrolling, the desktop app uses 48% of a 1920x1080 screen.

### Proposed batches

1. Foundation: ADR replacing ADR-0007's fixed canvas (fluid, no page scroll, phone pages); fluid shell and size tokens; reusable page swiper; Home and Practice at every size; Practice answer box locked (read-only) instead of disabled during feedback, so a phone's own keyboard should stay up between questions (suspected bobbing, found by reading the code, not confirmed on a device).
   Batch 1 status: authorized 2026-10-27, paused after code reading; no Batch 1 files edited yet. Design worked out:
   - Desktop growth: scale the root font size, `html { font-size: clamp(1rem, min(calc(100vw / 74.625), calc(100dvh / 52.125)), 1.5rem) }` (1194x834 = 16px), so sizes up to iPad landscape and laptop stay exactly as now. Convert the px caps on Home and the shell to rem (`.screen.is-active` 980px = 61.25rem, `.home-dashboard` 1040px = 65rem, brand mark, Home card min-heights).
   - Shell: `.page-shell` becomes `width: 100%; height: 100dvh`, no aspect-ratio; keep the `.app-shell` background so it fills edge to edge. Remove the `--app-frame-*` tokens if nothing else uses them.
   - Gradual no-scroll: `showView()` (`js/app-techniques-screen.js`) toggles `is-fit-shell` on `.page-shell` for `FIT_SCREEN_VIEWS = ["home", "countdown", "practice"]`. A labelled layer at the end of `14-responsive.css` holds a fixed 100dvh page for fit views inside the existing `(max-width: 900px), (orientation: portrait) and (max-width: 1180px)` scroll block. Later batches add views; remove the layer when all views are in.
   - Phone query: `(max-width: 600px), (max-height: 500px)`.
   - Page swiper: new `js/app-page-swiper.js` (after `app-progress-carousel.js`). `[data-page-swiper]` container, `[data-swiper-page="N"]` on items (several items can share a page), `[data-swiper-dots]` filled with dot buttons (at least 28px tap area). CSS decides when it is paged by showing the dots; non-current pages are `display: none` only under the phone query. Reuse `bindCarouselSwipe`; the app-level view swipe in `initialiseCarouselGestures` must ignore touches inside a paged swiper. Expose `setPageSwiperIndex`, `getPageSwiperCount`, `isPageSwiperPaged`; call init from `app-init.js`.
   - Home on phones: pages 1 = `.home-dashboard-top` + `.today-training-card`, 2 = `.quick-workout-card` + `.continue-learning-card`, 3 = `.home-snapshot-strip`. `.home-dashboard-grid { display: contents }` and `grid-area: auto` on the cards; portrait is one column, landscape two columns (snapshot and dots span both). Compact header. Raise the reps/accuracy day labels from 0.58rem (9.3px fails) to 0.64rem.
   - Practice on phones: three-column HUD and answer form (undo the 640px stacking), smaller problem area and keys. Phone landscape uses grid areas `"top form" "hud keypad" "progress keypad" "problem keypad"`. Countdown panel `min-height: 480px` must shrink. Add `env(safe-area-inset-bottom, 0px)` to the dock offset.
   - Keypad: `prefersTouchKeypad()` (`js/app-progress-settings.js`) drops the `maxSide >= 768` rule so all touch phones get the app keypad (behaviour change to report).
   - Answer box: in `js/app-practice.js` (lines ~836, ~1148, ~1365 set `answerInput.disabled`; ~717 re-enables) use `readOnly` during the feedback pause instead of `disabled`, and add a guard in `handleSubmit` so Enter cannot resubmit during the pause. Remove `answerInput.readOnly = false` from `updatePracticeInputMode` so a resize cannot unlock it early.
   - Tools: `walkScreens` (`tools/visual-check/lib/app-session.js`) shoots each Home page when paged (`01-home-page-N`); the fit checker then covers each page.
2. Setup and Results at every size (replace their iPad-landscape-only rules in `06-setup.css` and `09-results.css`).
3. Progress and Learn at every size.
4. Final pass at every size, then `publish close`.

Exclusions: question generation, saved data, lesson wording, workout logic. JavaScript changes only where screen-size behaviour needs them.

### Checks per batch

`node scripts/check-repo.mjs`, `git diff --check`, `node --test tests/`, `tools/visual-check/run-all.sh --review` (fit report), and a before/after screenshot compare at the iPad landscape size.
