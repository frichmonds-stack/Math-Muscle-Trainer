# Active Task

## TASK-UI-002 Responsive layout

Status: `implementing` (Batch 0 published as `v0.20.12`, Batch 1 as `v0.20.13`; Batch 2 planned, needs `execute now`; Batches 3-4 proposed)

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

### Batch 1: shell, Home, Countdown, Practice (published `v0.20.13`)

Recorded in ADR-0019. Landed: fluid shell with root-font scaling; `FIT_SCREEN_VIEWS` + `is-fit-shell` layer at the end of `css/14-responsive.css`; `js/app-page-swiper.js` with Home split into three phone pages; Practice and Countdown compact phone layouts (two columns in phone landscape); keypad on all touch screens; read-only answer lock during feedback; Home and dialog px caps converted to rem; `walkScreens` visits each Home page. Not verified on a real device: whether iOS keeps its keyboard up across the read-only lock (keypad set to off).

Patterns for later batches: give a screen `data-page-swiper` pages and dots, add its view to `FIT_SCREEN_VIEWS`, put its phone rules in the phone section at the end of `14-responsive.css`, and convert px caps that should grow to rem.

### Next batches

2. Setup and Results at every size (replace their iPad-landscape-only rules in `06-setup.css` and `09-results.css`). Plan agreed in discussion, not yet authorized:
   - Before (fit report after Batch 1): Setup fits until an operation is picked, then scrolls on phones and iPad portrait (`03-setup-configured`). Results scrolls on phones; its slide arrows are 22px on touch screens.
   - Setup on phones: three swipe pages. 1 Skill: operation as a 2x2 grid plus its difficulty or table options. 2 Workout type plus options (Targeted, Regrouping). 3 Goal: attempt goal or time presets in one row, then Start. iPad portrait: the same tighter grids, no pages.
   - Open owner decision: Start button on every Setup page above the dots (recommended) or only on page 3.
   - Results on phones: Summary stats as a 3x2 grid; Tracker with smaller calendar cells (streak numbers beside the calendar in landscape); Next Focus tightened. Results arrows 44px on touch screens.
   - Add `setup` and `results` to `FIT_SCREEN_VIEWS`; extend `walkScreens` to visit Setup pages; browser-test the Setup pages.
3. Progress and Learn at every size (Progress arrows are 22px, Learn card notes are truncated).
4. Final pass at every size: remove the older scrolling rules and the fit layer once every view is in `FIT_SCREEN_VIEWS`, then `publish close`.

Exclusions: question generation, saved data, lesson wording, workout logic. JavaScript changes only where screen-size behaviour needs them.

### Checks per batch

`node scripts/check-repo.mjs`, `git diff --check`, `node --test tests/`, `tools/visual-check/run-all.sh --review` (fit report), and a before/after screenshot compare at the iPad landscape size.
