# Local Docker and production deployment

## Docker files

| File | Purpose |
|---|---|
| `Dockerfile.dev` | Node 22 development image with hot reload. |
| `docker-compose.development.yml` | Local Next.js, PostgreSQL 17, Mailpit, migrations, and email worker. Uses local-only credentials and localhost-only ports. |
| `Dockerfile` | Multi-stage standalone Next.js production image. Requires a canonical site URL, an explicit indexing flag, and a per-release `NEXT_DEPLOYMENT_ID` at build time. |
| `docker-compose.phase-4.3.yml` | Older isolated integration/staging stack with Caddy and Mailpit. It does not deploy production. |
| `docker-compose.production.yml` | Production app/database topology. Host nginx remains the public TLS proxy and selects the blue or green app slot. |

## Local development

The existing native setup remains available:

```powershell
npm.cmd ci
npm.cmd run db:migrate
npm.cmd run dev
```

For an isolated Docker setup, run from the `next-app` repository root:

```powershell
docker compose -f docker-compose.development.yml up --build
```

The site is at `http://localhost:5175`; Mailpit is at `http://localhost:18025`. PostgreSQL is published only on `127.0.0.1:5433`, so the stack does not collide with a local PostgreSQL server on port 5432. Set `DEV_WEB_PORT`, `DEV_POSTGRES_PORT`, or `DEV_MAILPIT_UI_PORT` to change those ports. `docker compose ... down` keeps the database volume. Use `down --volumes` only when intentionally deleting local database data.

Create a local admin account with:

```powershell
docker compose -f docker-compose.development.yml --profile tools run --rm admin-provision
```

## What GitHub Actions does

The workflow at `.github/workflows/ci-cd.yml` runs on pull requests to `main` and pushes to `main`:

1. Installs the exact lockfile dependencies with `npm ci` using Node 22.
2. Runs lint, TypeScript checking, and unit tests.
3. Runs the existing responsive browser suite in Chromium, Firefox, and WebKit against a local Next.js dev server.
4. Creates a disposable PostgreSQL 17 and Mailpit Compose stack, then runs the existing production-mode contact/admin/outbox Playwright integration suite. The workflow removes this CI-only database volume afterward.
5. Builds the Next.js app and validates production Compose syntax.
6. On a push to `main`, builds and publishes the Linux/amd64 production Docker image to GHCR with the full Git commit SHA as its immutable tag and sets the same SHA as the Next.js deployment ID.
7. If `PRODUCTION_DEPLOY_ENABLED=true`, uploads the Compose configuration and invokes the VPS deployment command through SSH and the protected GitHub `production` environment.

The Actions variables `NEXT_PUBLIC_SITE_URL` and `ROBOTS_INDEXING_ENABLED` default to `https://rakmyat.online` and `true`, matching the public site described in the owner-provided review. Override them only for a deliberate environment change. Pull requests never receive production secrets or publish images.

## Blue-green release behavior

The production Compose stack runs app containers as `web-blue` and `web-green`, bound only to localhost ports 3101 and 3102. The host nginx site must include `deployment/nginx/rakmyat-upstream.conf.example` (as the active upstream include) and use `deployment/nginx/rakmyat-location.conf.example` as a pattern for the proxy location. Preserve the server's current certificate and TLS configuration. Deny external access to `/api/internal/`.

On a release, the VPS script:

1. Takes an exclusive deployment lock and verifies the nginx upstream agrees with `ACTIVE_SLOT`.
2. Starts PostgreSQL if required and runs the new image's migrations. Migrations must be backward compatible with both app slots.
3. Starts the inactive app slot and waits for its database-backed `/api/health` check.
4. Stops the single outbox worker cleanly, atomically changes the nginx upstream, validates nginx, and reloads it.
5. Checks the public health URL, switches the worker to the new app, and waits for worker health.
6. Rolls back the nginx upstream and environment file if the health check fails. It retains the previous app slot for a later rollback.

No cache purge is performed. The candidate instance starts with its own Next.js runtime cache, and static route output is already in the image. Immutable asset URLs and the deployment ID protect clients moving between releases. Both app versions share the PostgreSQL data and persistent uploads volume.

## One-time VPS setup before enabling automatic deploys

The repository cannot inspect the live VPS's database, nginx configuration, deployed source version, filesystem paths, or secrets. Before setting `PRODUCTION_DEPLOY_ENABLED=true`:

1. Confirm that the running site is backed by this repository's app and identify its current PostgreSQL database. Back up and verify restore before changing the database or applying migrations. Do not start the bundled PostgreSQL volume if production data is actually in another database.
2. Configure `/opt/rakmyat/deployment/production.env` from `deployment/production.env.example`; set five image entries to valid SHA-tagged GHCR images, the approved site origin, active slot, indexing state, database details, and SMTP settings.
3. Create the eight secret files listed in Compose under `/opt/rakmyat/.production-secrets/`. Restrict file and directory permissions. Do not put credentials in GitHub build variables or image layers.
4. Configure root's Docker credentials for read-only access to the GHCR package, and ensure the deployment host can reach only the approved database, SMTP, and TLS destinations.
5. Prepare the nginx upstream include and site location. Initially route traffic to the verified blue slot on port 3101. Test the config with `nginx -t` and keep the current site config and rollback copy.
6. Install `deployment/deploy-production.sh` root-owned at `/usr/local/sbin/rakmyat-deploy`. Give the SSH deploy account permission to invoke only that command. The account needs write access to `/opt/rakmyat` for Compose config updates.
7. Configure the GitHub `production` environment, its required reviewers if desired, and these secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_PRIVATE_KEY`, and `VPS_KNOWN_HOSTS`. Pin the SSH host key; do not use `ssh-keyscan` at deployment time.
8. Protect `main` so the `Validate application` job must pass before merging. Enable the Actions variable `PRODUCTION_DEPLOY_ENABLED=true` only after a supervised first release confirms nginx, database compatibility, worker, uploads, SMTP, health checks, rollback, and backups.

The current production environment template intentionally contains placeholder host/image values and fails `scripts/production-preflight.ps1`. The workflow can publish images before VPS deployment is enabled; it does not claim that the live server has been updated.

## Resource requirement and limits

Blue-green requires the current and candidate app containers to run at the same time. The VPS therefore needs enough memory and CPU for two app instances plus PostgreSQL, nginx, and the worker. Compose limits of 1.5 GiB and two CPUs per app are ceilings, not a VPS sizing guarantee. If the host cannot support both slots, zero-downtime rollout is not available without adding capacity or using another deployment platform.

The deployment mechanism has not been run against the production VPS. SMTP, production database state, uploads migration, backups, external monitoring, and host firewall policy still require owner/operator verification.
