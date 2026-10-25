#!/usr/bin/env bash
set -euo pipefail

: "${MEDIA_BACKUP_FILE:?Set MEDIA_BACKUP_FILE to an encrypted uploads archive}"
: "${MEDIA_DRILL_DIRECTORY:?Set MEDIA_DRILL_DIRECTORY to a pre-created disposable empty directory}"
[[ -f "$MEDIA_BACKUP_FILE" ]] || { echo "Media backup file does not exist." >&2; exit 2; }
[[ -d "$MEDIA_DRILL_DIRECTORY" ]] || { echo "Restore drill directory must already exist." >&2; exit 2; }
if find "$MEDIA_DRILL_DIRECTORY" -mindepth 1 -print -quit | grep -q .; then
  echo "Restore drill directory must be empty; no files were changed." >&2
  exit 2
fi

# Refuse absolute paths and parent traversal before extraction into the disposable target.
gpg --batch --quiet --decrypt "$MEDIA_BACKUP_FILE" | tar -tzf - > "$MEDIA_DRILL_DIRECTORY/.archive-list"
if grep -E '(^/|(^|/)\.\.(/|$))' "$MEDIA_DRILL_DIRECTORY/.archive-list"; then
  rm -f -- "$MEDIA_DRILL_DIRECTORY/.archive-list"
  echo "Backup contains an unsafe archive path." >&2
  exit 2
fi

gpg --batch --quiet --decrypt "$MEDIA_BACKUP_FILE" \
  | tar --extract --gzip --no-same-owner --no-same-permissions --directory "$MEDIA_DRILL_DIRECTORY" -f -
rm -f -- "$MEDIA_DRILL_DIRECTORY/.archive-list"
cd "$MEDIA_DRILL_DIRECTORY"
[[ -f MEDIA-METADATA.txt && -f MEDIA-MANIFEST.sha256 ]] || { echo "Backup manifest is missing." >&2; exit 1; }
expected_count="$(sed -n 's/^file_count=//p' MEDIA-METADATA.txt)"
expected_bytes="$(sed -n 's/^byte_count=//p' MEDIA-METADATA.txt)"
[[ "$expected_count" =~ ^[0-9]+$ && "$expected_bytes" =~ ^[0-9]+$ ]] || { echo "Backup metadata is invalid." >&2; exit 1; }
if find . -type l -print -quit | grep -q .; then echo "Backup unexpectedly contains symlinks." >&2; exit 1; fi
actual_count="$(find . -type f ! -name MEDIA-METADATA.txt ! -name MEDIA-MANIFEST.sha256 -printf . | wc -c | tr -d ' ')"
actual_bytes="$(find . -type f ! -name MEDIA-METADATA.txt ! -name MEDIA-MANIFEST.sha256 -printf '%s\n' | awk '{total += $1} END {print total+0}')"
[[ "$actual_count" == "$expected_count" ]] || { echo "Manifest file count mismatch: expected $expected_count, found $actual_count." >&2; exit 1; }
[[ "$actual_bytes" == "$expected_bytes" ]] || { echo "Manifest byte count mismatch: expected $expected_bytes, found $actual_bytes." >&2; exit 1; }
if [[ -s MEDIA-MANIFEST.sha256 ]]; then
  sha256sum --check --strict MEDIA-MANIFEST.sha256
elif [[ "$expected_count" != 0 ]]; then
  echo "Backup manifest is empty but metadata reports files." >&2
  exit 1
fi
printf 'Media restore drill passed: %s files, %s bytes, checksums valid.\n' "$actual_count" "$actual_bytes"
