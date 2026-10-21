# 03 — Docker and environment

`docker-compose.production.yml` is separate from Phase 4.3 staging. It defines the production image, one-shot migrations, PostgreSQL, worker, Caddy, health checks, restart policies, resource limits, read-only web/worker filesystems, bounded JSON logs, and persistent PostgreSQL/Caddy data. The web image is non-root and standalone. Mailpit remains staging-only.

Compose secrets are mounted from ignored `.production-secrets/` files. These local file-backed secrets are not an encrypted secret manager: on a real host use the provider's secret store where possible, otherwise restrict file access, encrypt host storage, and keep independent staging/production values. The template contains no credentials. The entrypoint fails when configured secret files are missing or empty.

Copy `deployment/production.env.example` to the ignored `deployment/production.env`, replace the placeholder hostname and release ID, and create the secret files from a secure operator process. `scripts/production-preflight.ps1` checks the approved HTTPS origin, explicit release ID, indexing authorization, SMTP values, proxy header, and secret/database-role consistency without printing secret values or contacting production. It intentionally rejects the example file. Do not start Compose until provider, host firewall, backup, and deployment approvals are complete.

The prepared deployment uses local PostgreSQL, so `DATABASE_SSL=false` is limited to the private Compose network. Do not reuse that setting for a managed remote database. Resource limits are starting budgets, not capacity claims. Monitoring destinations and host-level firewall/log shipping are not active in this repository.
