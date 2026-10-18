# Deployment Procedure

Use only exact owner `deploy now`; load `../command-profile.json` and its central contract.
Name the specific reviewed artifact/ref, environment, target and necessary deployment actions.
If the target, artifact or deployment path is unknown, stop and establish the missing scope in
read-only planning. Never invent a host or deployment configuration. Check prerequisites and
rollback constraints, perform only the agreed deployment actions and report observed status.
No new implementation; a changed candidate requires `execute now` and renewed review.
`publish close` stops before a push/merge that deploys or has unknown deployment triggers.
Cloudflare: deploying means promoting an uploaded version (dashboard Deployments or
`npx wrangler versions deploy`); a push to `main` counts as a deployment until ADR-0018 is verified.
