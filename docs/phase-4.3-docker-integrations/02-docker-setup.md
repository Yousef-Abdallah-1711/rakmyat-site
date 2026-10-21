# Docker setup

Compose file: `docker-compose.phase-4.3.yml`. Check ports 5212 and 18025 are free before start. Run from the repository root: `docker compose --env-file .env.docker.local -f docker-compose.phase-4.3.yml -p rakmyat-phase43-staging up --build -d`.

Check with `docker compose --env-file .env.docker.local -f docker-compose.phase-4.3.yml -p rakmyat-phase43-staging ps`, the same command plus `logs --tail 100`, and `Invoke-WebRequest http://127.0.0.1:5212/api/health`. Run browser E2E with `npm.cmd run phase43:e2e`. The test runner only clears `rate_limit_buckets` in the named isolated staging container before a rerun; inquiries and admin records remain intact. Stop without deleting data using `docker compose --env-file .env.docker.local -f docker-compose.phase-4.3.yml -p rakmyat-phase43-staging down` (never add `-v` when retaining the named volume).
