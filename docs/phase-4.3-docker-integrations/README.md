# Phase 4.3 Docker integrations

Local-only PostgreSQL, Next.js, Mailpit, and an authenticated outbox worker for synthetic testing. Nothing was deployed. No Hostinger request or email was made.

## Current implementation

- Compose file: `docker-compose.phase-4.3.yml`; isolated project/network/volumes are named `rakmyat-phase43-*`.
- Web: `http://127.0.0.1:5212`; Mailpit: `http://127.0.0.1:18025`.
- PostgreSQL has no host-published port. Mailpit SMTP is reachable only on the private Docker network.
- Secret material is generated locally in ignored `.phase43-secrets/`. `.env.docker.local` only contains local configuration.
- Migrations are versioned in `db/migrations`; startup applies them in the one-shot `migrate` service.
- Contact POST persists the inquiry and outbox record in one transaction. The worker processes notifications with PostgreSQL `SKIP LOCKED`, bounded retries, and a stable Message-ID.

## Start and operate

Run from `next-app`:

```powershell
docker compose --env-file .env.docker.local -f docker-compose.phase-4.3.yml -p rakmyat-phase43-staging up --build -d
docker compose --env-file .env.docker.local -f docker-compose.phase-4.3.yml -p rakmyat-phase43-staging ps
docker compose --env-file .env.docker.local -f docker-compose.phase-4.3.yml -p rakmyat-phase43-staging logs --tail 100
```

Use the same `--env-file`, `-f`, and project name for stop/restart/logs. `down` preserves named volumes; do not add `-v` when keeping staging evidence. Backup and restore steps are in [12-backup-and-restore.md](12-backup-and-restore.md).

Provision a local admin interactively without echoing its password:

```powershell
docker compose --env-file .env.docker.local -f docker-compose.phase-4.3.yml -p rakmyat-phase43-staging --profile tools run --rm admin-provision
```

Run the repeatable browser suite with `npm.cmd run phase43:e2e`. It clears only the isolated staging `rate_limit_buckets` fixture before testing; it keeps inquiries, notifications, and admin records.

## Results and limits

The isolated Docker build, migrations, contact persistence, English/Arabic browser flows, Mailpit delivery, admin lifecycle, origin/rate checks, recovery scenarios, backup/restore, typecheck, lint, 15 unit tests, and 2 Playwright E2E tests passed. See [14-test-results.md](14-test-results.md) for evidence and exact results. Hostinger SMTP is BLOCKED pending explicit owner approval and a newly rotated mailbox password. Local Mailpit capture does not prove external delivery. Production readiness remains blocked by provider and operations requirements.

## Contents

See `01-architecture.md` through `17-final-handoff.md` for design, setup, controls, test procedures, evidence, and remaining blockers.
