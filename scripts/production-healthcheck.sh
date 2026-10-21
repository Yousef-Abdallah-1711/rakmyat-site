#!/usr/bin/env bash
set -euo pipefail
: "${HEALTHCHECK_URL:?Set the approved HTTPS health URL}"
case "$HEALTHCHECK_URL" in https://*) ;; *) echo "Health URL must use HTTPS." >&2; exit 2 ;; esac
curl --fail --silent --show-error --max-time 10 "$HEALTHCHECK_URL/api/health" >/dev/null
printf '%s healthcheck passed\n' "$(date -u +%FT%TZ)"
