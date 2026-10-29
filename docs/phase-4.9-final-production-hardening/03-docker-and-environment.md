# Docker and environment

`Dockerfile.dev` and `docker-compose.development.yml` provide an isolated local hot-reload setup with PostgreSQL 17, migrations, Mailpit, and the outbox worker. The normal host-based `npm run dev` workflow remains available.

`Dockerfile` builds the standalone production app as a non-root Node 22 image. The builder requires `NEXT_PUBLIC_SITE_URL`, `ROBOTS_INDEXING_ENABLED`, and a unique `NEXT_DEPLOYMENT_ID`. GitHub Actions builds and publishes the image to GHCR with the full source commit SHA as both image tag and deployment ID. Compose consumes immutable image references instead of building app source on the VPS.

Production Compose defines blue and green app slots, a single outbox worker, a one-shot migration job, PostgreSQL, private Docker networks, health checks, restart policies, read-only application filesystems, bounded logs, and persistent PostgreSQL and uploads volumes. The two app slots bind only to `127.0.0.1:3101` and `127.0.0.1:3102`; host nginx selects the active slot. There is no Caddy service in production Compose. Phase 4.3 staging remains a separate Caddy/Mailpit topology.

Compose credentials are mounted from `.production-secrets/`. Those file-backed secrets are not an encrypted secret manager; restrict file access on the VPS and keep separate values per environment. The checked-in `deployment/production.env.example` contains placeholders and is intentionally rejected by production preflight. It must be replaced with owner-approved hostname, image tags, database roles, SMTP settings, and indexing decision.

The blue-green process requires both app containers to fit on the VPS at once. Resource limits are ceilings, not a capacity guarantee. The deployment script has not been run on the live host. Before enabling it, inspect the current database and uploads, configure nginx, make and verify a backup, and rehearse the rollback on a non-production target. See [Deployment](../DEPLOYMENT.md).
