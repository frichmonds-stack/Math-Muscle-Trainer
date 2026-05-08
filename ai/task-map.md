# AI Task Map

Use this map to route future Codex/GPT sessions to the right files before editing.

## App Structure / Startup

1. Relevant source files
   - `index.html` - screen markup, controls, dialogs, script order.
   - `js/app-init.js` - display version resolution, startup rendering, event binding.
   - `js/app-core.js` - shared constants, state defaults, setup helpers.
   - `js/app-techniques.js` - app view routing via `requestView` and `showView`.
2. Related docs or ADRs
   - `README.md`
   - `AGENTS.md`
   - `ai/context.md`
   - `docs/decisions/ADR-0001-ai-continuity-system.md`
3. Read before editing
   - `AGENTS.md`, `ai/context.md`, `ai/current-state.md`
   - The script tags near the end of `index.html`
   - `initialise()` in `js/app-init.js`
4. Common risks or things not to break
   - Script order matters because modules share globals.
   - Duplicate element IDs break bindings and `scripts/check-repo.ps1`.
   - View buttons depend on matching `data-view-target` values and screen IDs.
   - The app should still open directly from `index.html`.

## Workout Logic

1. Relevant source files
   - `js/app-practice.js` - session lifecycle, timers, answer handling, completion.
   - `js/app-core.js` - setup reading, settings snapshots, defaults, labels.
   - `js/app-progress.js` - tracker-card workout entry points.
   - `js/app-techniques.js` - Learn-to-workout handoff actions.
   - `index.html` - setup controls, practice form, end-workout dialog.
2. Related docs or ADRs
   - `CHANGELOG.md`
   - `PROJECT_NOTES.md`
   - `ai/current-state.md`
3. Read before editing
   - `readSettings()`, `applySettingsSnapshot()`, and `sanitiseSettingsSnapshot()` in `js/app-core.js`
   - `startSession()`, `beginPracticeSession()`, `registerAnswer()`, and `completeSession()` in `js/app-practice.js`
   - Tracker training helpers in `js/app-progress.js` if the entry point starts from Progress.
4. Common risks or things not to break
   - Do not bypass `applySettingsSnapshot()` for focused workouts.
   - Keep countdown, HUD timers, Spar strikes, and completion paths in sync.
   - Completed workouts must update progress, records, calendars, streaks, and results.
   - Manual exits should still use the in-app confirmation dialog.

## Question Generation

1. Relevant source files
   - `js/app-practice.js` - `buildMultiplicationPool()`, `buildAdditionPool()`, `buildSubtractionPool()`, `buildDivisionPool()`, `buildPool()`, `pickQuestion()`.
   - `js/app-core.js` - operation options, display/storage symbols, settings normalization.
   - `js/app-progress.js` - fact and bucket parsing used by progress views.
2. Related docs or ADRs
   - `README.md`
   - `CHANGELOG.md`
   - `PROJECT_NOTES.md`
3. Read before editing
   - `OPERATION_OPTIONS`, `OPERATION_SYMBOLS`, and `OPERATION_STORAGE_SYMBOLS` in `js/app-core.js`
   - The relevant `build*Pool()` function and `evaluateFactAnswer()` in `js/app-practice.js`
   - Bucket helpers in `js/app-progress.js` if new facts affect analytics.
4. Common risks or things not to break
   - Fact keys should stay stable so old progress remains readable.
   - Division stores `/` in keys and displays `\u00f7` in UI.
   - Addition and multiplication are commutative; subtraction and division are not.
   - Isolation ranges should generate varied facts, not a single repeated fact.

## Learn / Techniques Mode

1. Relevant source files
   - `js/app-techniques.js` - Learn menu, multiplication lessons, addition lessons, routing, dialogs.
   - `js/app-core.js` - technique state defaults and technique question helpers.
   - `index.html` - Learn screen shell and lesson exit dialog.
   - `styles.css` - lesson, keypad, stage, and full-screen Learn styling.
2. Related docs or ADRs
   - `PROJECT_NOTES.md`
   - `CHANGELOG.md`
   - `ai/current-state.md`
3. Read before editing
   - `renderTechniqueScreen()` and `handleTechniqueAction()` in `js/app-techniques.js`
   - Multiplication helpers around `getMultiplicationLessonPlan()` and the `renderTechnique*Stage()` functions.
   - Make 10 helpers around `createMake10LessonState()` and `renderMake10LessonScreen()`
   - Generic addition lesson helpers around `ADDITION_LESSON_PLANS`, `createAdditionLessonState()`, and `renderAdditionLessonScreen()`
   - `createTechniqueState()` and related technique helpers in `js/app-core.js`
4. Common risks or things not to break
   - Leaving a lesson should preserve the intended modal behavior.
   - `Start Focused Workout` actions should route through setup snapshots.
   - Technique completion state is saved in browser progress.
   - Addition technique completion uses `addition:<lesson-id>` progress keys.
   - Lesson section pills are intentionally unlocked; do not reintroduce section locking unless a new assessment mode requires it.
   - Keyboard and touch keypad behavior should remain usable on tablets.

## Lesson Content Workflow

1. Relevant source files
   - `learn/specs/` - teacher-authored lesson specs.
   - `learn/lessons/` - structured lesson data by operation.
   - `learn/scaffolds/`, `learn/mental-models/`, `learn/review/` - supporting teacher-authored notes.
   - `AGENTS.md` - lesson content workflow rules.
   - `docs/decisions/ADR-0005-lesson-content-workflow.md`
2. Related docs or ADRs
   - `learn/README.md`
   - `docs/decisions/ADR-0005-lesson-content-workflow.md`
3. Read before editing
   - `AGENTS.md` Lesson Content Workflow section.
   - The relevant teacher spec in `learn/specs/`.
   - The relevant structured lesson file in `learn/lessons/`.
4. Common risks or things not to break
   - The user is the pedagogy source of truth.
   - Do not invent lesson wording unless explicitly asked.
   - Preserve teacher-authored wording when converting specs to structured data.
   - Keep content-only edits separate from renderer/refactor edits.

## Progress Tracking

1. Relevant source files
   - `js/app-progress.js` - overview, records, coach notes, fact trackers, calendars, carousels.
   - `js/app-practice.js` - daily records, fact updates, workout history writes.
   - `js/app-core.js` - progress defaults, normalization, pruning, date helpers.
   - `index.html` - Progress and Results screen markup.
2. Related docs or ADRs
   - `README.md`
   - `CHANGELOG.md`
   - `PROJECT_NOTES.md`
   - `ai/open-threads.md`
3. Read before editing
   - `defaultProgress()`, `normaliseFactProgressEntry()`, and `pruneProgressForRollingWindow()` in `js/app-core.js`
   - `updateFactProgress()` and `appendWorkoutHistory()` in `js/app-practice.js`
   - `renderOverall()`, `renderWorkoutHistory()`, `renderTableRadar()`, and tracker training helpers in `js/app-progress.js`
4. Common risks or things not to break
   - Progress data must survive schema changes through normalization.
   - Results and Progress share several renderers; check both screens.
   - Operation filters should not hide valid records or facts.
   - Carousel height and swipe behavior are sensitive on iPad/tablet widths.

## localStorage / Saved Data

1. Relevant source files
   - `js/app-core.js` - storage keys, legacy fallbacks, load/save/normalization.
   - `js/app-practice.js` - writes progress after attempts and completions.
   - `js/app-progress.js` - reset progress and appearance preference handlers.
2. Related docs or ADRs
   - `README.md`
   - `CHANGELOG.md`
   - `docs/decisions/ADR-0002-project-rename-to-math-muscle-trainer.md`
   - `ai/current-state.md`
3. Read before editing
   - Storage constants at the top of `js/app-core.js`
   - `getLocalStorageItemWithFallback()`, `loadProgress()`, `saveProgress()`, `loadTheme()`, `loadColorMode()`, and `loadKeypadPreference()`
   - All `normalise*` helpers touching stored objects.
4. Common risks or things not to break
   - Keep legacy fallback reads for older saved progress and preferences.
   - Do not rename fact-key formats without migration/normalization.
   - `file://` localStorage can differ by path; test with care after folder renames.
   - Avoid writing malformed JSON or partial progress objects.

## UI Styling

1. Relevant source files
   - `styles.css` - visual system, app shell, responsive behavior, controls.
   - `index.html` - semantic structure and class hooks.
   - `js/app-progress.js` and `js/app-techniques.js` - generated markup for dynamic panels.
2. Related docs or ADRs
   - `README.md`
   - `PROJECT_NOTES.md`
   - `ai/open-threads.md`
3. Read before editing
   - Relevant markup in `index.html`
   - Existing nearby CSS sections in `styles.css`
   - Generated markup for the affected screen if the DOM is built in JavaScript.
4. Common risks or things not to break
   - Keep text from overflowing compact controls on mobile and tablet.
   - Do not place cards inside cards or turn full page sections into floating cards.
   - Preserve touch-friendly number pad and carousel interactions.
   - Check light/dark mode and palette variables when changing colors.

## GitHub Pages / Docs Builds

1. Relevant source files
   - `scripts/check-repo.ps1` - repo consistency checks.
   - `scripts/publish-snapshot.ps1` - copies root app into `docs/v*` and updates `docs/index.html`.
   - `docs/index.html` - snapshot index and latest marker.
   - `docs/v*` - published static snapshots.
   - `js/app-core.js` and `CHANGELOG.md` - version consistency.
2. Related docs or ADRs
   - `README.md`
   - `CHANGELOG.md`
   - `docs/decisions/ADR-0002-project-rename-to-math-muscle-trainer.md`
3. Read before editing
   - `README.md` publish/check instructions
   - `Get-AppVersion` logic in both scripts
   - Latest release heading in `CHANGELOG.md`
4. Common risks or things not to break
   - `APP_VERSION` and latest released changelog heading must match.
   - Only one docs index entry should be marked latest.
   - Latest docs snapshot should match root app files after publishing.
   - Do not manually edit archived snapshots except for targeted release fixes.

## AI Continuity Files

1. Relevant source files
   - `AGENTS.md`
   - `ai/context.md`
   - `ai/current-state.md`
   - `ai/task-map.md`
   - `ai/open-threads.md`
   - `ai/session-log.md`
   - `ai/tasks/next-actions.md`
   - `ai/prompts/session-start.md`
   - `ai/prompts/session-close.md`
   - `docs/decisions/`
2. Related docs or ADRs
   - `docs/decisions/ADR-0001-ai-continuity-system.md`
   - `docs/decisions/ADR-0002-project-rename-to-math-muscle-trainer.md`
3. Read before editing
   - `AGENTS.md`
   - `ai/context.md`
   - `ai/current-state.md`
   - `ai/open-threads.md`
   - `ai/tasks/next-actions.md`
   - Recent entries in `ai/session-log.md`
4. Common risks or things not to break
   - These files are Codex-managed; the user should not need to maintain them manually.
   - Keep continuity files concise and practical.
   - Do not duplicate the full README, changelog, or project notes.
   - Add ADRs for lasting architecture, product, release, storage, or workflow decisions.
