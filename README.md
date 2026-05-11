# Math Muscle Trainer

A strength-themed arithmetic practice webapp built with plain HTML, CSS, and JavaScript.

## What it does

- Uses a slimmer app-style shell with a separate header band and dedicated Setup, Practice, Results, and Progress screens
- Adds a Learn / Techniques mode with linked multiplication lessons for `x1` through `x12` and a linked addition lesson set
- Includes Learn / Techniques operation navigation for Addition, Multiplication, Subtraction, and Division (with visible placeholders where content is still in progress)
- Supports operation-based training with Addition, Subtraction, Multiplication, and Division
- Supports mixed-table multiplication practice or a focused single-table isolation mode
- Supports High Intensity Training, Target Reps, Zen Mode, and Spar Mode workout types
- Supports all workout modes for Addition except Isolation
- Supports addition difficulty presets (`easy`, `medium`, `hard`) for quick setup
- Supports positive and negative integer multiplication while keeping the practice range magnitude-based
- Keeps the practice screen minimal with a question timer, workout timer, countdown start, and quick right/wrong feedback
- Adds a touch-first number pad for iPad/tablet-friendly answering without disabling keyboard input
- Uses adaptive question weighting to bring back new or missed facts more often
- Tracks daily star and heart goals with browser-local workout history
- Captures browser-local answer telemetry so mastery can use accuracy, fluency, coverage, retention, and consistency signals
- Shows operation mastery through a single cyclic selector (`Overview -> Addition -> Subtraction -> Multiplication -> Division`) with current and best-earned ranks
- Shows a shared month-view workout tracker calendar across Results and Progress
- Uses carousel-style Results and Progress screens to reduce scrolling
- Supports swipe gestures and visible slide-position indicators on carousel screens
- Applies soft min/max carousel height bounds to reduce layout jumps across different slides
- Shows Positive Progress before weaker targets so the feedback loop starts with wins
- Shows operation-aware fact tracking:
  - multiplication table tracker
  - division table tracker
  - addition bucket tracker with overall, regrouping, and non-regrouping stats
  - subtraction bucket tracker by digit complexity
- Includes personal bests, recent workouts, and daily record stats like most attempts in a day
- Uses a custom in-app end-workout modal instead of the browser confirm popup
- Uses a matching in-app lesson exit modal for leaving a technique mid-way
- Saves completed table and addition lessons in the browser so finished techniques can be shown on the menu
- Uses operation selection in Learn / Techniques to load operation-specific lessons
- Uses staged Learn progress pills so learners can jump directly to any lesson section
- Keeps a rolling recent-progress window for dated history data to keep storage lean
- Saves long-term progress in the browser with localStorage
- Supports independent palette and dark/light mode appearance controls with rotating strength-building banner messages

## Run it

Because this is a static app, you can open `index.html` directly in a browser.

If you prefer a local server, run one from this folder with Python:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Check it

Run the lightweight repo checks before publishing a snapshot:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repo.ps1
```

The check validates duplicate IDs, script references, release/version drift, stale `docs/` latest labels, and whether the latest docs snapshot matches the root app files.

## Publish on the internet

This repo is prepared for GitHub Pages using the `docs/` folder.

1. Push the branch to GitHub.
2. In repository settings, open `Pages`.
3. Set Source to `Deploy from a branch`.
4. Select branch `main` (or your release branch) and folder `/docs`.
5. Save and wait for Pages to publish.

The latest hosted build is linked from `docs/index.html`.

To publish a new static snapshot after updating the root app, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\publish-snapshot.ps1 -SnapshotNumber 13 -Label "v0.16.0 app shell UI contract snapshot"
```

## Files

- `index.html` contains the app structure
- `styles.css` contains the visual design and responsive layout
- `js/app-core.js` contains shared constants, state setup, sanitising, and setup helpers
- `js/app-techniques.js` contains Learn / Techniques screen logic
- `js/app-practice.js` contains question generation, session flow, and answer handling
- `js/app-progress.js` contains results/progress trackers, filters, and analytics rendering
- `js/app-init.js` contains startup rendering and event wiring

## Versioning

- `APP_VERSION` in `js/app-core.js` is the local runtime fallback, used when the app is opened directly from disk.
- When served over HTTP, the app also reads `CHANGELOG.md` and displays the greater of `APP_VERSION` and the latest released changelog heading.
- `scripts/check-repo.ps1` fails if `APP_VERSION` and the latest released changelog heading drift apart.
