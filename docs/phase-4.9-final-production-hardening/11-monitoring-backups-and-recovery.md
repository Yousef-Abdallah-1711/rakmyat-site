# 11 — Monitoring, backups, and recovery

`/api/health` checks database reachability and returns no-store status. The Compose web, worker, PostgreSQL, and Caddy services have container health checks, restart policies, and bounded local JSON log rotation. `scripts/production-healthcheck.sh` can check an approved HTTPS health URL. These checks are not an active monitoring or alerting destination; no provider, dashboard, retention, or alert route is configured.

`scripts/production-backup.sh` streams a custom-format PostgreSQL dump directly to GPG and verifies the encrypted archive. It requires `BACKUP_GPG_RECIPIENT` and a protected `BACKUP_DESTINATION`. `scripts/production-restore-drill.sh` refuses production/default database names and requires a pre-created empty disposable target. Neither script was run in this phase. Off-host storage, key custody, backup schedule, retention, and a witnessed restore drill remain to be established.

The deploy/rollback procedure is to retain the last approved image digest, build a new uniquely identified release, validate preflight and health, apply additive migrations before web startup, then switch traffic. For rollback, redeploy the prior image only when its schema compatibility is confirmed; do not automatically run destructive down migrations. DNS/CDN rollback and host recovery must be documented for the selected provider.
