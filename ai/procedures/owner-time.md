# Owner-Time Integration

Run every command below from the Math Muscle Trainer repository root. AI Project Manager owns timing
logic and persistence. Its canonical contract is
`C:\Users\Rawr\Desktop\Codex Projects\AI Project Manager\docs\design\owner-time.md`.
Both Codex and Claude follow this procedure; no timer implementation lives in this repo.

After confirming the Math Muscle Trainer boundary and before substantive work on each meaningful
owner-linked turn (including planning and resumed sessions), run:

```powershell
$env:PYTHONPATH = 'C:\Users\Rawr\Desktop\Codex Projects\AI Project Manager\src'
& 'C:\Users\Rawr\Desktop\Codex Projects\Budget Tool\.venv\Scripts\python.exe' -m ai_efficiency.cli time-activity --project-root . --harness <codex-or-claude-code> --db-path 'C:\Users\Rawr\AppData\Local\AI Efficiency\telemetry.sqlite3'
```

Replace the harness placeholder. The command reads `.ai-efficiency.toml`; no session ID is
required. It starts a stopped timer and safely leaves an active interval intact. Always pass
the database path above, as in `closeout.md` §5. Report hook errors honestly; never claim timing began.
Skip subagents, tool calls, passive session opening, timer-only queries, `time out` itself,
and generated completion messages. This local timing hook is permitted during planning;
it does not authorise repository edits, commits, pushes, portfolio writes, or deployment.

Owner `time out` runs only:

```powershell
$env:PYTHONPATH = 'C:\Users\Rawr\Desktop\Codex Projects\AI Project Manager\src'
& 'C:\Users\Rawr\Desktop\Codex Projects\Budget Tool\.venv\Scripts\python.exe' -m ai_efficiency.cli time-out --project-root . --db-path 'C:\Users\Rawr\AppData\Local\AI Efficiency\telemetry.sqlite3'
```

After successful Execute Now completion (including checks and documentation), run:

```powershell
$env:PYTHONPATH = 'C:\Users\Rawr\Desktop\Codex Projects\AI Project Manager\src'
& 'C:\Users\Rawr\Desktop\Codex Projects\Budget Tool\.venv\Scripts\python.exe' -m ai_efficiency.cli time-complete --project-root . --workflow execute-now --outcome completed --db-path 'C:\Users\Rawr\AppData\Local\AI Efficiency\telemetry.sqlite3'
```

After successful Publish Close (including push and required portfolio delivery/acknowledgement),
run the same command with `--workflow publish-close`. Run completion hooks near the end.
Partial, failed, or interrupted work preserves timer state; never stop early or claim success.
The next meaningful owner-linked project activity automatically starts another interval,
excluding the idle gap. `time out` changes no work-item state and performs no closeout.

Use `time-status` or `time-report --period today|week|all` with the same project/database arguments
to inspect estimates; `--utc-offset-minutes 480` selects Perth calendar days. Timing remains
local, with no raw timing/session data sent to Notion. Cloudflare deployment keeps its
existing explicit-request boundary.
