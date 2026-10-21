#!/usr/bin/env bash
set -euo pipefail

: "${BACKUP_GPG_RECIPIENT:?Set a public GPG recipient for encrypted backups}"
: "${BACKUP_DESTINATION:?Set a protected backup destination}"
mkdir -p "$BACKUP_DESTINATION"
chmod 700 "$BACKUP_DESTINATION"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
output="$BACKUP_DESTINATION/rakmyat-${stamp}.dump.gpg"
compose=(docker compose --env-file deployment/production.env -f docker-compose.production.yml)

# pg_dump custom format is streamed directly to GPG; plaintext is not written to disk.
"${compose[@]}" exec -T postgres sh -ec 'pg_dump --format=custom --no-owner --username "$POSTGRES_USER" "$POSTGRES_DB"' \
  | gpg --batch --encrypt --recipient "$BACKUP_GPG_RECIPIENT" --output "$output"
chmod 600 "$output"
# Verify decryption and archive structure without writing the plaintext archive.
gpg --batch --quiet --decrypt "$output" | pg_restore --list - >/dev/null
printf 'Encrypted backup created and archive integrity checked: %s\n' "$output"
