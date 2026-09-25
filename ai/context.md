# Stable Project Context

`Math Muscle Trainer` is a plain HTML/CSS/JavaScript arithmetic trainer. It runs as a static browser app and saves user progress in `localStorage`.

## Product Shape

- Primary audience: learners practicing arithmetic with motivational, workout-themed framing.
- Current operations: addition, subtraction, multiplication, and division practice.
- Core screens: Home, Setup, Learn / Techniques, Countdown, Practice, Results, Progress.
- Learn mode currently has a multiplication `10x` lesson flow and an addition `Make 10` lesson shell.
- Progress includes daily streaks, workout records, fact trackers, and operation-aware filters.

## Technical Shape

- No build step or package manager is required.
- Root app files are the source of truth for active development.
- `docs/live` is the rolling publishable build; `docs/v*` contains preserved static snapshots. GitHub Pages is shut down.
- `CHANGELOG.md` is version history.
- `APP_VERSION` in `js/app-core.js` is the local runtime fallback.
- `scripts/check-repo.ps1` validates repo consistency.
- `scripts/publish-snapshot.ps1` copies root app files into a new `docs/v*` snapshot.
- Current browser storage namespace is `math-muscle-trainer-*`, with legacy fallback reads for older saved progress.

## Working Preferences

- Keep explanations beginner-friendly and chunked.
- Prefer small, safe changes over broad rewrites.
- Preserve the app's current visual direction unless a redesign is requested.
- Use `docs/product/` for broader product memory and `ai/` for compact session continuity.
- After session initialization, default to discussion/planning mode. `execute now` authorizes the agreed local batch; `Publish Close` authorizes release closeout. Command details live in `AGENTS.md` and `ai/procedures/`.

## Documentation Ownership

- `README.md`: project overview and run/check/publish instructions.
- `CHANGELOG.md`: versioned release history.
- `docs/product/product-direction.md`: durable product positioning, principles, and constraints.
- `docs/product/roadmap.md`: broad sequencing and future workstreams.
- `docs/product/idea-bank.md`: speculative concepts that are not commitments.
- `AGENTS.md`, `ai/`, and `docs/decisions/`: Codex-managed continuity and decision records.
- The user should not need to edit the AI continuity files manually; future Codex sessions should maintain them.
