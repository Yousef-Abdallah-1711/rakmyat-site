#!/bin/sh
set -eu
read_secret() {
  name="$1"
  file="$2"
  if [ -n "$file" ]; then
    if [ ! -r "$file" ]; then
      echo "required secret file is unreadable" >&2
      exit 1
    fi
    value=$(cat "$file")
    if [ -z "$value" ]; then
      echo "required secret file is empty" >&2
      exit 1
    fi
    export "$name=$value"
  fi
}
read_secret DATABASE_URL "${DATABASE_URL_FILE:-}"
read_secret MIGRATION_DATABASE_URL "${MIGRATION_DATABASE_URL_FILE:-}"
read_secret RATE_LIMIT_SECRET "${RATE_LIMIT_SECRET_FILE:-}"
read_secret SMTP_PASS "${SMTP_PASS_FILE:-}"
read_secret OUTBOX_WORKER_SECRET "${OUTBOX_WORKER_SECRET_FILE:-}"
unset DATABASE_URL_FILE MIGRATION_DATABASE_URL_FILE RATE_LIMIT_SECRET_FILE SMTP_PASS_FILE OUTBOX_WORKER_SECRET_FILE || true
exec "$@"
