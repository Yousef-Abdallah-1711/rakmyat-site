#!/usr/bin/env bash
set -euo pipefail

: "${BACKUP_GPG_RECIPIENT:?Set a public GPG recipient for encrypted backups}"
: "${BACKUP_DESTINATION:?Set a protected backup destination}"
: "${MEDIA_ROOT:=/home/rakmyat/data/uploads}"

if ! gpg --batch --list-secret-keys "$BACKUP_GPG_RECIPIENT" 2>/dev/null | grep -q '^sec'; then
  echo "The matching GPG private key is required here to verify the encrypted backup." >&2
  exit 2
fi
if [[ ! -d "$MEDIA_ROOT" ]]; then
  echo "MEDIA_ROOT must be an existing uploads directory; no empty volume was substituted." >&2
  exit 2
fi
mkdir -p -- "$BACKUP_DESTINATION"
chmod 700 -- "$BACKUP_DESTINATION"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
base="$BACKUP_DESTINATION/rakmyat-${stamp}"
db_output="${base}.db.dump.gpg"
media_output="${base}.uploads.tar.gz.gpg"
for output in "$db_output" "$media_output"; do
  if [[ -e "$output" || -e "${output}.FAILED" ]]; then
    echo "Refusing to overwrite existing backup output: $output" >&2
    exit 2
  fi
done
work="$(mktemp -d "$BACKUP_DESTINATION/.rakmyat-backup.XXXXXX")"
chmod 700 "$work"
db_temp="$work/database.gpg"
media_temp="$work/uploads.gpg"
completed=0
cleanup() {
  result=$?
  if (( result != 0 && completed == 0 )); then
    for pair in "$db_temp:$db_output" "$media_temp:$media_output"; do
      temp="${pair%%:*}"; output="${pair#*:}"
      failed_output="${output}.FAILED"
      if [[ -e "$failed_output" ]]; then failed_output="${failed_output}.$$"; fi
      if [[ -e "$temp" ]]; then mv --no-clobber -- "$temp" "$failed_output" || true; fi
      if [[ -e "$output" ]]; then mv --no-clobber -- "$output" "$failed_output" || true; fi
    done
  fi
  rm -rf -- "$work"
  exit "$result"
}
trap cleanup EXIT

compose=(docker compose --env-file deployment/production.env -f docker-compose.production.yml)
# Database plaintext stays in the pipe. pg_restore runs inside the PostgreSQL image
# so the archive is checked with a compatible toolchain before it is published.
"${compose[@]}" exec -T postgres sh -ec 'pg_dump --format=custom --no-owner --username "$POSTGRES_USER" "$POSTGRES_DB"' \
  | gpg --batch --yes --encrypt --recipient "$BACKUP_GPG_RECIPIENT" --output "$db_temp"
gpg --batch --quiet --decrypt "$db_temp" \
  | "${compose[@]}" exec -T postgres pg_restore --list >/dev/null

(
  cd "$MEDIA_ROOT"
  find . -type f -print0 | sort -z | xargs -0 -r sha256sum > "$work/MEDIA-MANIFEST.sha256"
)
file_count="$(find "$MEDIA_ROOT" -type f -printf . | wc -c | tr -d ' ')"
byte_count="$(find "$MEDIA_ROOT" -type f -printf '%s\n' | awk '{total += $1} END {print total+0}')"
printf 'file_count=%s\nbyte_count=%s\n' "$file_count" "$byte_count" > "$work/MEDIA-METADATA.txt"
(
  cd "$MEDIA_ROOT"
  tar -czf - --null -T <(find . -type f -print0 | sort -z) -C "$work" MEDIA-MANIFEST.sha256 MEDIA-METADATA.txt
) | gpg --batch --yes --encrypt --recipient "$BACKUP_GPG_RECIPIENT" --output "$media_temp"
gpg --batch --quiet --decrypt "$media_temp" | tar -tzf - >/dev/null

# Hard links publish each verified artifact without replacing an existing file.
ln -- "$db_temp" "$db_output"
ln -- "$media_temp" "$media_output"
chmod 600 -- "$db_output" "$media_output"
completed=1
printf 'Verified encrypted backups created:\n- %s\n- %s\n' "$db_output" "$media_output"
