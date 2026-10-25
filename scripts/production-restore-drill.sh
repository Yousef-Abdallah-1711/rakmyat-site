#!/usr/bin/env bash
set -euo pipefail

: "${BACKUP_FILE:?Set BACKUP_FILE to an encrypted backup file}"
: "${RESTORE_DATABASE_NAME:?Set a pre-created disposable restore database name}"
if [[ "$RESTORE_DATABASE_NAME" == "rakmyat_prod" || "$RESTORE_DATABASE_NAME" == "postgres" ]]; then
  echo "Refusing to restore into a production or default database name." >&2
  exit 2
fi
compose=(docker compose --env-file deployment/production.env -f docker-compose.production.yml)
bootstrap_user="${POSTGRES_USER:-rakmyat_bootstrap}"
if ! "${compose[@]}" exec -T postgres psql --username "$bootstrap_user" --dbname "$RESTORE_DATABASE_NAME" -Atqc 'SELECT 1' >/dev/null; then
  echo "Restore target must already exist and be disposable; this script will not create or drop databases." >&2
  exit 2
fi
empty="$("${compose[@]}" exec -T postgres psql --username "$bootstrap_user" --dbname "$RESTORE_DATABASE_NAME" -Atqc "SELECT NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema'))")"
if [[ "$empty" != "t" ]]; then
  echo "Restore target must be empty; no data was changed." >&2
  exit 2
fi
# The target database must be empty and separately provisioned. No live target is dropped.
gpg --batch --quiet --decrypt "$BACKUP_FILE" \
  | "${compose[@]}" exec -T postgres pg_restore --exit-on-error --no-owner --username "$bootstrap_user" --dbname "$RESTORE_DATABASE_NAME"
printf 'Restore drill completed into pre-existing disposable database %s.\n' "$RESTORE_DATABASE_NAME"
