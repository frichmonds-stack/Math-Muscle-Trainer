# Active Task

## TASK-UI-002 Responsive layout

Status: `implementing` (Batch 0 published as `v0.20.12`, Batch 1 as `v0.20.13`; Batch 2 implemented as `v0.20.14`, awaiting `publish close`; Batches 3-4 proposed)

Branch: `claude/v0-20-11-deployment-backlog-v9xjbt`. Commit only on `publish close`; never push or merge to `main` from the cloud (ADR-0018).

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

### Batch 2: Setup and Results (implemented `v0.20.14`, awaiting `publish close`)

- Owner decision (2026-10-28): Start shows on every Setup page, above the dots. It stays the one `#setupStartButton` inside the settings form; on phones the form and step shell are `display: contents`, so Start sits at the bottom of the page above the dots. It appears once a workout type is chosen, as before.
- Landed: `setup` and `results` in `FIT_SCREEN_VIEWS`. Setup on phones is three `data-page-swiper="setup"` pages (1 Skill: operation 2x2 plus difficulty; 2 Workout type 2x2 plus options; 3 Goal: presets in one row, isolation or free-training settings); phone landscape lays each page out in two columns. Pages count only once they have visible items (`getPageSwiperCount` skips items inside `.is-hidden`; `toggleSetupFields()` calls `refreshPageSwipers()`), and a lone dot is hidden. iPad portrait: tighter grids, no pages. Results on phones and iPad portrait: Summary stats 3x2; Tracker with smaller day cells, streak numbers beside the calendar in phone landscape; Next Focus tightened, three columns in phone landscape. Results panel arrows and Tracker month arrows are 44px on touch screens (`css/09-results.css`). `walkScreens` visits Setup pages 2 and 3 (`03-setup-configured-page-N`).
- Checks (2026-10-28, cloud): every Setup and Results screen fits at all seven sizes (fit report before: Setup configured failed on phones and iPad portrait; all Results slides failed on touch sizes for 22px arrows, and on phones for page scrolling). Extra browser test of other Setup paths (multiplication isolation, division timed custom, subtraction spar timed) at five touch sizes: every page fits, Start visible and starting the workout from page 1, swipe changes page not view. Not verified on a real device.

### Next batches

3. Progress and Learn at every size (Progress arrows are 22px, Learn card notes are truncated).
4. Final pass at every size: remove the older scrolling rules and the fit layer once every view is in `FIT_SCREEN_VIEWS`, then `publish close`.

Exclusions: question generation, saved data, lesson wording, workout logic. JavaScript changes only where screen-size behaviour needs them.

### Checks per batch

`node scripts/check-repo.mjs`, `git diff --check`, `node --test tests/`, `tools/visual-check/run-all.sh --review` (fit report), and a before/after screenshot compare at the iPad landscape size.
