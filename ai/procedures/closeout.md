# Publish Close Procedure

Use only when the owner says `Publish Close`. The batch's local implementation, checks, and matching documentation should already be complete under `execute-now.md`. `Publish Close` verifies and releases that batch; it does not start another one.

## 1. Confirm Scope And Repository

Confirm the repository root is `C:\Users\Rawr\Desktop\Codex Projects\Math Muscle Trainer`. Inspect `git status --short` and `git remote -v`. Preserve unrelated changes and do not touch sibling repositories.

## 2. Verify And Prepare The Release

1. Run the best checks for the changed files. Run `scripts/check-repo.ps1` after any `docs/live` or snapshot publish, plus `git diff --check`. For changed JavaScript, run available syntax checks; report device and browser checks that were not run.
2. Verify documentation with `documentation-write.md`: finished work is removed from operational files, current claims agree, new routes are indexed, lasting decisions have ADRs, and user-visible changes are reflected in `README.md` and `CHANGELOG.md` as needed. Do not append a session summary.
3. For app changes that should become the next publishable build, use `scripts/publish-live.ps1`. Use `scripts/publish-snapshot.ps1` only for a requested or significant preserved milestone. A docs-only workflow batch does not need an app version bump or a `docs/live` copy.
4. Check `APP_VERSION`, changelog, and `docs/index.html` labels for any versioned app release. GitHub Pages is shut down, so do not claim GitHub Pages live verification. Cloudflare Workers remains a separate manual deployment and requires an explicit deployment request.

## 3. Curate Portfolio Identities

Before committing, select the current work item and any actionable Queued or decision-ready Proposed items for cross-project visibility. Compare existing Math Muscle Trainer Work Queue rows by meaning. Reuse equivalent Sync Keys and record any new permanent keys in `../portfolio-identities.md` so the committed repository owns them. If reconciliation is unavailable, do not invent keys; leave Notion delivery pending and say why.

## 4. Commit And Push

Review the final diff, run the applicable checks again after publishing, and confirm the files to include. Commit the approved batch and push it. Report the commit, push result, and any live URL actually verified. A GitHub push alone does not establish that a site is live.

## 5. AI Project Manager And Notion Closeout

The owner approved Notion Work Queue closeout. `.ai-efficiency.toml` selects connector delivery with `notion_sync = true`. The AI Project Manager accepts this authorization only when the same configuration is in committed HEAD. Therefore, perform this step after the commit; if commit/push fails, report delivery as pending.

1. Use the curated items and committed Sync Keys from step 3. Work underway stays `Active`, including blocked work with its blocker. Use `Completed` only for finished, resolved, or deliberately declined work.
2. Prepare a temporary work-return JSON with the CLI's required fields: Sync Key, Work Item, Description, Completion Criteria, Latest Closeout, outcome, observed evidence, unverified work, decisions needed, next action, state, testing requirement, blocker, curated next actions and open threads, and session ID only if exposed. Optional priority, model, and effort may be null. Use only observed facts. For `Completed`, set `next_action` to `none`.
3. Run `ai-project-manager status --project-root . --db-path <existing-db>` and confirm the database is the populated AI Project Manager database. Then submit `ai-project-manager work-closeout --project-root . --harness <active-harness> --db-path <same-db> --file <temporary-return.json>`. The console command is not on PATH on this machine; the verified fallback is `C:\Users\Rawr\Desktop\Codex Projects\Budget Tool\.venv\Scripts\python.exe -m ai_efficiency.cli`, with `PYTHONPATH` set to `C:\Users\Rawr\Desktop\Codex Projects\AI Project Manager\src`. The observed database is `C:\Users\Rawr\AppData\Local\AI Efficiency\telemetry.sqlite3`; recheck it with `status` rather than assuming a different Windows profile resolves to the same file. Remove the temporary JSON after submission.
4. Connector mode leaves a local outbox pending until an authenticated Notion connector upserts every non-superseded manifest row by exact `Project + Sync Key`, including Description, Completion Criteria, and Latest Closeout. Use `ai-project-manager notion-manifest --work-return-id <id> --db-path <same-db>` for the approved payload. Read existing pages before updating and preserve human-authored content. Do not fall back to REST when the connector is unavailable.
5. After all rows are delivered, run `ai-project-manager notion-ack --work-return-id <id> --db-path <same-db> --item <sync-key>=<notion-page-id>` with one `--item` per delivered row. Report pending delivery if the connector or acknowledgement cannot complete. Do not change the Work Queue schema or views as part of closeout.

Notion receives a narrow portfolio summary only. Do not send file paths, commands, source content, prompts, credentials, secrets, learner data, or detailed technical evidence. Repository documents remain authoritative.

## 6. Final Report

State files and docs changed, checks and limits, commit and push status, live verification status, assumptions, and manual review needed. Include a **Notion Closeout** section with the current item's state and Sync Key, curated Queued/Proposed items, and delivery state: delivered, pending with reason, superseded with reason, disabled, or not requested. A local return or a properties-only page is not completed Notion delivery.
