# Cloud Interim Overlay

Temporary. Loaded only in Claude Code cloud sessions by the `SessionStart` hook in
`.claude/settings.json` (it prints this file when `CLAUDE_CODE_REMOTE=true`). Local sessions never
see it. It adjusts how `AGENTS.md` procedures run in a cloud container; it does not change command
authority.

## Removal (when cloud work ends)

1. Run the deferred local steps listed under "Deferred To Local" below, then clear that list.
2. In one commit, delete this file, `.claude/settings.json` (or just its `SessionStart` hook), and
   the "Cloud interim overlay" line in `current-state.md`.
3. Optionally keep `scripts/check-repo.mjs`; otherwise delete it in the same commit.

## What Still Applies

- `AGENTS.md`, `command-profile.json`, and `ai/procedures/` remain authoritative. `execute now`,
  `publish close`, and `deploy now` keep their exact meaning and scope.
- The Windows paths in `command-profile.json` and the procedures do not exist in the container.
  Wherever a step needs them, use the alteration below instead of failing or improvising.

## Alterations

- **Owner time:** skip `time-activity`, `time-out`, and `time-complete`. Do not claim timing began.
  Git commit history on the cloud branch is the record of cloud work.
- **Repo checks:** run `node scripts/check-repo.mjs` in place of `scripts/check-repo.ps1`. It runs
  the same checks. Also run `git diff --check`. Keep the two scripts in step if checks change.
- **Unit tests:** run `node --test tests/` for any JS change.
- **UI checks:** for changes that touch markup, CSS or JS, run `tools/visual-check` (`npm ci` once,
  then `run-all.sh --baseline` before and `run-all.sh <appDir> out/baseline` after). For layout
  changes also run `run-all.sh --review <appDir>` for the fit report and review sheet.
- **Live build:** `scripts/publish-live.ps1` cannot run. When a batch needs `docs/live` updated,
  copy `index.html`, `css/*.css` (clearing old `docs/live/css/*.css` first), and `js/*.js` into
  `docs/live/`, update the live line in `docs/index.html` exactly as the script would, then run
  the Node check.
- **Repository root:** the cloud root is the container checkout, not the Windows path in
  `closeout.md` step 1. Confirm it with `git rev-parse --show-toplevel`.
- **Publish close:** run steps 1, 2 and 4 of `closeout.md` (checks, docs, commit and push). Push
  only to the session's assigned `claude/*` branch. Skip step 3 (portfolio identities) and step 5
  (AI Project Manager and Notion); add the batch to "Deferred To Local" instead and report Notion
  delivery as pending.
- **Deployment:** never push or merge to `main` from the cloud. Cloudflare Workers Builds runs on
  pushes to `main` and has auto-promoted (ADR-0018), so that requires `deploy now` and the owner's review.

## Deferred To Local

Batches published from the cloud that still need portfolio identities, the AI Project Manager
work-closeout, and Notion delivery when back on the local machine:

- 2026-10-18 `v0.20.8` cloud setup, bug fixes, CSS cleanup and stylesheet split (branch `claude/ecstatic-planck-n6rbuz`).
- 2026-10-18 `v0.20.9` dev tools in repo, unit tests, JS split (branch `claude/ecstatic-planck-n6rbuz`).
- 2026-10-18 `v0.20.10` focus-trend and saved-progress fixes, Make 10 dead-code removal, ADR-0018 deploy docs (branch `claude/hopeful-pasteur-vxziav`).
- 2026-10-20 `v0.20.11` new-user zero states (TASK-UI-001) and project-memory refresh (branch `claude/vigilant-ritchie-listcm`).
- 2026-10-27 `v0.20.12` screen-size tools: debug Screen size preview, fit checker, review sheet (TASK-UI-002 Batch 0; branch `claude/magical-tesla-xwpqeh`).
