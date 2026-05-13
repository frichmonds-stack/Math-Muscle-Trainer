# Project Notes

This file is the project's broad working memory. Use it for durable context, design direction, and idea-bank material that should survive chat history. Use `ai/` files for concise session handoff, active open questions, and next actions.

## Working Preferences

- Keep explanations beginner-friendly, scaffolded, and chunked.
- Avoid large text dumps.
- Prefer small steps with one clear action at a time when learning or setting things up.
- Keep user-facing copy in the workout/training language unless a specific screen needs a quieter tone.

## Current Project Snapshot

- Product name: `Math Muscle Trainer`.
- Stack: plain `HTML`, `CSS`, and browser JavaScript.
- Main source files: `index.html`, `styles.css`, `js/app-core.js`, `js/app-practice.js`, `js/app-progress.js`, `js/app-techniques.js`, and `js/app-init.js`.
- Project docs: `README.md`, `CHANGELOG.md`, `AGENTS.md`, `PROJECT_NOTES.md`, and `ai/`.
- Stable UI direction lives in `docs/design/ui-direction.md`; reusable component roles live in `docs/design/component-system.md`; the current implemented button/control baseline lives in `docs/design/current-button-ui.md`.
- Published snapshots live in `docs/v*`; `docs/index.html` marks the latest GitHub Pages snapshot.
- Hosting is set up through GitHub Pages from `main`.

## Current Design Direction

- Strength-training framing for arithmetic practice.
- App-style shell rather than a webpage with a persistent site header.
- Desktop/tablet-landscape layout preserves a centered iPad-landscape app frame; narrow/mobile layouts stay scroll-friendly.
- iPad-first and eventual Apple App Store direction.
- The app should work for primary students through adults, so the visual style should feel motivating without becoming age-locked or overly childish.
- Regular usage should come from useful skill-building, learning habits, visible growth, and mastery rather than attention-hacking gamification.
- Minimalism is part of the target feel: use restrained, clear, low-clutter UI that still feels tactile, friendly, and app-native. Minimal should not mean empty, cold, boxy, or adult-only.
- A key visual upgrade is moving from mostly text-based surfaces toward app-like interactive surfaces with math-strength marks, status symbols, and simple pictorial cues, but buttons should remain mostly clean/text-first rather than gaining decorative icons everywhere.
- Primary app navigation is moving toward a compact centered rounded training dock on iPad/tablet landscape. The dock should hug its content instead of stretching into a full-width phone-style bottom banner.
- The initial Home experience should not be a generic marketing page or a bare launcher. It should feel like a `Today` training dashboard that identifies the app, gives one clear next action, and previews the main Train/Learn/Progress workflows.

## Product Priorities

- Finish teacher-authored lesson content, then build progression through lessons.
- Keep four-operation mastery visible across Addition, Subtraction, Multiplication, and Division.
- Improve the first-time learner flow so new users can start usefully without understanding every app area.
- Continue UI polish around the app-shell contract before starting another large redesign.
- Design and refine a stronger initial Home / Today screen before treating Train-first startup as final.

## Home Screen And Training Dashboard Ideas

These ideas combine the GitHub-saved Home research notes from commit `4ef3917` with the current local first-pass implementation.

- Research references included motivational, health/training, and education-app patterns such as Elevate-style skill setup, Fabulous-style routines, Duolingo-style progression paths, Nike Training Club-style programs/routines, Fitbod-style body heat maps, and Brilliant-style streak/momentum surfaces.
- Home should be a `Today's Training` dashboard, not a marketing page and not a generic launcher.
- Home should quickly answer: what is this app, what should I do now, what else can I work on, and how am I improving?
- The first-pass dashboard restores Home as the startup surface and keeps the dock as persistent navigation.
- Current first-pass behavior:
  - There is no overall daily start button yet. Each Daily Routine row launches its own operation routine.
  - Daily Routine has `5 Addition`, `5 Subtraction`, `5 Multiplication`, and `5 Division`; each ticks off after 5 correct answers for that operation today.
  - Quick Workout operation tiles start direct 20-rep workouts.
  - Continue Learning routes to Learn/Techniques.
  - The snapshot strip shows day streak with a 7-day flame strip, total reps, accuracy, and average pace.
  - The bottom dock is `Home / Workout / Learn / Progress`, with Workout and Learn kept in the middle.
- Strong Home modules to keep testing: app identity header, Today's Routine/Daily 3 card, primary routine CTA, Quick Workout, Continue Learning/Recommended Lesson, Next Focus, Training Snapshot, and a small Mastery Path preview.
- Future dashboard decisions:
  - decide whether Daily Training should become a real adaptive routine engine,
  - decide when to add a single `Do all` CTA once multi-operation workouts exist,
  - decide whether `Daily 5` eventually means five correct per operation plus weak-spot reps,
  - decide whether multi-operation workout setup should allow selecting several operations at once,
  - decide whether a Duolingo-like arithmetic progression path belongs on Home, Learn, or Progress,
  - decide whether a Fitbod-inspired operation/fact-family heat map should show readiness or coverage,
  - decide how much Progress/Mastery detail belongs on Home versus the Progress screen.
- Workout-style rep tracking remains a strong fit: track reps by operation, fact family, difficulty bucket, workout type, and lesson skill so reps can feed mastery/expertise signals.
- The app likely needs a simple icon/logo soon. Strong directions: rounded badge or weight plate containing `+ - x /`, dumbbell with math-symbol plates, or a shield/badge with one clear math cue. Avoid dumbbell-only, calculator-only, busy multi-symbol marks, and mascots unless explicitly chosen later.
- Eventual lesson formats may include video or audio lessons in addition to text, but this is a later idea and not required for the first Home redesign.
- The previous brand/launcher-style Home is archived in `docs/design/home-screen-archive-v0.18.0.md` and exactly preserved in `docs/v15`.

## Near-Term Roadmap Shape

- `v0.18.0` published the first UI direction implementation: shared control softening, Train-first startup, compact training dock, and restrained visual-anchor usage.
- Next UI cleanup: Practice shell container, lesson-local Exit Lesson placement, Results/Progress kicker spacing, and static Tracker metric affordances.
- Next Home/onboarding design batch: review the new `Today's Training` home surface, then decide the daily routine default, quick workout behavior, learning recommendation, mastery/path preview, and progress snapshot density.
- `v0.19.0` lesson content foundation: fill/review Make 10 spec, convert one teacher-approved lesson into structured lesson data, and decide the first Addition progression path.
- `v0.20.0` onboarding/mastery clarity: first-time learner starting path, current-rank versus best-earned-rank explanation, and clearer metric/reward language.
- Process track: review the AI continuity system and define a written versioning policy before release activity becomes more frequent.

## Durable Decisions

- Treat `README.md` as the current project overview.
- Treat `CHANGELOG.md` as version history.
- Treat `PROJECT_NOTES.md` as broader project memory, not the active task list.
- Treat `AGENTS.md`, `ai/`, and `docs/decisions/` as Codex-managed continuity files.
- Prefer `workout` as the main user-facing term instead of mixing `session` and `workout`.
- Use this operation mastery rank chain: `Rookie -> Novice -> Adept -> Expert -> Elite -> Master -> Legend`.
- Keep current-rank and best-earned-rank separate so learners can see both present fluency and earned achievement.
- Teacher-authored lesson wording is the source of truth; Codex should not invent pedagogy unless asked.

## Idea Bank

These ideas are not committed roadmap items unless promoted by the user.

- Optional sound feedback: answer cues, milestone chimes, and a mute toggle.
- Toggle/control candidates for future settings and setup design:
  - Settings toggles: sound on/off, reduce motion on/off, keypad always visible on/off, hints on/off, and a possible Day/Night theme switch.
  - Workout setup toggles: negatives on/off, practice missed facts only on/off, show hints during workout on/off, and auto-advance on/off only if learners or teachers need control.
  - Avoid an `Adaptive on/off` setting. Adaptive behavior should be app intelligence by default, exposed through friendly training preferences such as Gentle/Balanced/Challenge, session length, focus mode, hints, or mistake review.
- Competitive `Flex` mode:
  - points-based scoring,
  - pressure timer that resets after each correct answer,
  - run ends when the timer expires,
  - emphasis on speed, streaks, and competitive chaining.
- Dedicated motion pass for screen transitions, lesson-step transitions, carousel movement, and subtle reveal/feedback animations.
- More visual style options beyond the dark red gym theme.
- Dedicated metric-language pass so learner-facing rewards do not compete with accuracy, pace, reps, streaks, and mastery.
- Post-session reflection or journaling, deferred until there is a reliable data collection and review path.
- Motivation quote candidate: `Attitudes determine your actions. Actions determine your destiny.`

## Adaptive Learning Ideas

- Infer a learner developmental profile from reading speed, response latency, accuracy stability, session duration, and interaction patterns.
- Adapt difficulty quietly in the background based on profile.
- Younger-learner direction: shorter sessions, more immediate rewards, gentler ramps, fewer consecutive failures, and slower demotions.
- Older-learner direction: longer practice blocks, more direct feedback, faster progression, higher challenge ceilings, and richer statistics.
- Candidate arithmetic-learning metrics:
  - accuracy by operation, fact family, and error pattern,
  - speed and fluency,
  - retention and relearning speed,
  - reliable difficulty ceiling,
  - consistency and fatigue resistance,
  - strategy use and self-correction,
  - learning efficiency and improvement slope.
- Candidate composite metrics:
  - Arithmetic Fluency Score,
  - Mastery Confidence,
  - Cognitive Load Indicator,
  - Automaticity Index.

## Recent Session Memory

### 2026-05-13

- Captured initial Home screen research and design direction after reviewing motivational, health/training, and education-app patterns.
- Noted that Train-first startup is too bare as an initial landing experience because it gives little app identity or workflow guidance.
- Proposed and began implementing a `Today's Training` dashboard model with daily routine CTA, Quick Workout, Continue Learning, Next Focus, Training Snapshot, streaks, reps, and future operation heat maps.
- Added `Daily 5`, `Daily 3`, multi-operation workout selection, operation/fact-family rep tracking, and logo/icon exploration to durable project memory.

### 2026-05-12

- Pruned and reorganized project memory so `PROJECT_NOTES.md` holds durable context and the `ai/` files hold active handoff items.
- Added a near-term roadmap shape for `v0.18.0` through `v0.20.0`, plus process review items for AI continuity and versioning.
- Captured the visual north star as minimalist, friendly native iPad controls for all ages: clear enough for young learners and polished enough for adults.
- Added `docs/design/ui-direction.md` as the stable design direction document for future AI/UI work.
- Added `docs/design/component-system.md` to define the reusable button/control/content roles before CSS alignment begins.
- Captured visual anchors/icons as a priority for making the app feel more interactive and less text-only, with the later clarification that these belong mainly at the app/screen/card/lesson/progress level rather than inside every button.
- Added `docs/design/current-button-ui.md` so current screenshots can be compared against the implemented button/control baseline.
- Implemented a first compact training dock for `Train`, `Learn`, and `Progress`; the app now opens directly to `Train`/setup instead of the brand home launcher.
- Published the UI direction implementation as `v0.18.0` in `docs/v15`.

### 2026-05-11

- Published `v0.17.0` in `docs/v14` to preserve a centered `1194 x 834` iPad-landscape app canvas on desktop/tablet-landscape viewports, while retaining scroll-friendly rules for narrow/mobile screens.
- Established the shared app-shell UI contract in ADR-0007: global utilities stay in the top-right rail, local selectors live with content headers, carousel/kicker labels use fixed title space, and static metrics do not hover.
- Published the UI system batch as `v0.16.0` in `docs/v13`.

### 2026-05-10

- Added separate current rank and best-earned rank concepts for Operation Mastery.
- Revised Operation Mastery toward an overview-to-detail structure.
- Hardened Progress dynamic markup by escaping labels before HTML injection.

### 2026-05-09

- Started the learning telemetry and operation mastery work.
- Added browser-local answer telemetry as the evidence base for future ranks and adaptive behavior.

### 2026-05-08

- Initialized the lesson content workflow under `learn/`.
- Added workflow rules that preserve teacher-authored lesson wording.

### Earlier Memory

- `v0.10.0` introduced the single-shell navigation model.
- `v0.11.0` added repo-native checks and snapshot publishing helpers.
- Addition and multiplication lessons were expanded, with addition using a reusable atomic runner and multiplication using selectable `x1` through `x12` table lessons.
- iPad-first answer flow includes an on-screen number pad to reduce virtual keyboard friction.
