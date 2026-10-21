# Phase 4.5 production launch preparation

**State: PRODUCTION RELEASE CANDIDATE PREPARED — NOT DEPLOYED.** No production host, database, secrets, external SMTP test, DNS change, public exposure, or indexing approval was available. This folder records work performed against the current local worktree and the loopback Phase 4.3 stack only.

## Evidence and documents

Read [baseline](01-current-state-and-baseline.md), [remediation tracker](02-remediation-tracker.md), [architecture](03-production-architecture.md), and [final scorecard](21-final-readiness-scorecard.md). The [test results](17-automated-test-results.md), machine-readable [acceptance matrix](acceptance-matrix.json), [candidate smoke evidence](candidate-smoke-results.json), [release runbook](18-release-and-rollback-runbook.md), and [owner gates](19-owner-approval-gates.md) identify exactly what remains unverified.

Production deployment configuration is separate in `docker-compose.production.yml`, `docker/production/`, and `deployment/production.env.example`. Production secrets belong only in ignored `.production-secrets/`; never copy staging credentials. The Compose file is a preparation artifact and was not started.

## Current verdict

**NO-GO for production deployment.** The isolated candidate and local checks are prepared, but the approved production domain/provider, external database/SMTP/HTTPS, deployed monitoring and backup restore, legal approvals, and human accessibility review remain outstanding. Phase 4.3 Mailpit and database evidence remains local-only. See `acceptance-matrix.json` and `17-automated-test-results.md`.

## Safe local verification

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd test`
- `docker compose -f docker-compose.production.yml --env-file deployment/production.env.example config` only validates syntax after the hostname placeholder is substituted for a syntactically valid non-production value; it does not start services.
- `powershell -ExecutionPolicy Bypass -File scripts/production-preflight.ps1` requires owner-approved production settings and local secrets. It never connects to production.

Do not run `docker compose -f docker-compose.production.yml up` until the gates in [19](19-owner-approval-gates.md) are approved and production data handling is planned. No production URL or credentials are included in this repository.
