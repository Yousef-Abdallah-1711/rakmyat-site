#!/usr/bin/env bash
set -Eeuo pipefail

# Install as a root-owned script on the VPS. The unprivileged CI deploy account
# should be allowed to invoke only this script through sudo.
APP_DIR="${RAKMYAT_APP_DIR:-/opt/rakmyat}"
COMPOSE_FILE="$APP_DIR/docker-compose.production.yml"
COMPOSE_OVERRIDE="$APP_DIR/docker-compose.production.override.yml"
ENV_FILE="$APP_DIR/deployment/production.env"
UPSTREAM_FILE="${RAKMYAT_NGINX_UPSTREAM_FILE:-/etc/nginx/conf.d/rakmyat-upstream.conf}"
LOCK_FILE="/var/lock/rakmyat-production-deploy.lock"
IMAGE="${1:-}"

if [[ ! "$IMAGE" =~ ^ghcr\.io/yousef-abdallah-1711/rakmyat-site:[a-f0-9]{40}$ ]]; then
  echo "Pass an immutable Rakmyat GHCR image tagged with a full commit SHA." >&2
  exit 2
fi
if [[ ! -f "$COMPOSE_FILE" || ! -f "$COMPOSE_OVERRIDE" || ! -f "$ENV_FILE" || ! -f "$UPSTREAM_FILE" ]]; then
  echo "Production Compose, environment, and nginx upstream files must be installed first." >&2
  exit 2
fi

exec 9>"$LOCK_FILE"
flock -n 9 || { echo "Another production deployment is already running." >&2; exit 2; }

read_env() {
  local key="$1"
  awk -v key="$key" 'index($0, key "=") == 1 { sub("^[^=]*=", ""); print; exit }' "$ENV_FILE"
}

set_env() {
  local key="$1" value="$2" temporary
  temporary="$(mktemp "${ENV_FILE}.XXXXXX")"
  awk -v key="$key" -v value="$value" '
    BEGIN { found = 0 }
    index($0, key "=") == 1 { print key "=" value; found = 1; next }
    { print }
    END { if (!found) print key "=" value }
  ' "$ENV_FILE" > "$temporary"
  chmod --reference="$ENV_FILE" "$temporary"
  chown --reference="$ENV_FILE" "$temporary"
  mv -f "$temporary" "$ENV_FILE"
}

ACTIVE_SLOT="$(read_env ACTIVE_SLOT)"
case "$ACTIVE_SLOT" in
  blue) OLD_PORT=3101; NEW_SLOT=green; NEW_PORT=3102 ;;
  green) OLD_PORT=3102; NEW_SLOT=blue; NEW_PORT=3101 ;;
  *) echo "ACTIVE_SLOT in production.env must be blue or green." >&2; exit 2 ;;
esac
if ! grep -Eq "server[[:space:]]+127\.0\.0\.1:${OLD_PORT}([;[:space:]]|$)" "$UPSTREAM_FILE"; then
  echo "The configured nginx upstream does not match ACTIVE_SLOT; refusing to guess." >&2
  exit 2
fi

SITE_URL="$(read_env NEXT_PUBLIC_SITE_URL)"
if [[ "$SITE_URL" != https://* ]]; then
  echo "NEXT_PUBLIC_SITE_URL must be an approved HTTPS origin." >&2
  exit 2
fi

ENV_BACKUP="$(mktemp "${ENV_FILE}.rollback.XXXXXX")"
UPSTREAM_BACKUP="$(mktemp "${UPSTREAM_FILE}.rollback.XXXXXX")"
cp -p "$ENV_FILE" "$ENV_BACKUP"
cp -p "$UPSTREAM_FILE" "$UPSTREAM_BACKUP"
TRAFFIC_SWITCHED=0
DEPLOY_COMPLETE=0

compose() {
  docker compose --project-directory "$APP_DIR" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" -f "$COMPOSE_OVERRIDE" "$@"
}

write_upstream() {
  local port="$1" temporary
  temporary="$(mktemp "${UPSTREAM_FILE}.XXXXXX")"
  printf 'upstream rakmyat_app {\n    server 127.0.0.1:%s max_fails=3 fail_timeout=5s;\n    keepalive 32;\n}\n' "$port" > "$temporary"
  chmod --reference="$UPSTREAM_FILE" "$temporary"
  chown --reference="$UPSTREAM_FILE" "$temporary"
  mv -f "$temporary" "$UPSTREAM_FILE"
  nginx -t
  systemctl reload nginx
}

rollback() {
  local status="$1"
  trap - ERR
  if [[ "$DEPLOY_COMPLETE" -eq 0 ]]; then
    cp -p "$ENV_BACKUP" "$ENV_FILE"
    if [[ "$TRAFFIC_SWITCHED" -eq 1 ]]; then
      cp -p "$UPSTREAM_BACKUP" "$UPSTREAM_FILE"
      nginx -t && systemctl reload nginx || true
    fi
    compose up -d --no-deps email-worker >/dev/null 2>&1 || true
  fi
  rm -f "$ENV_BACKUP" "$UPSTREAM_BACKUP"
  exit "$status"
}
trap 'rollback $?' ERR

cd "$APP_DIR"
NEW_SERVICE="web-$NEW_SLOT"
if [[ "$NEW_SLOT" == blue ]]; then IMAGE_KEY=RAKMYAT_IMAGE_BLUE; else IMAGE_KEY=RAKMYAT_IMAGE_GREEN; fi

# Apply migrations first. The previous app remains online, so migrations must
# follow expand/contract practice and remain compatible with both app releases.
compose up -d postgres
RAKMYAT_IMAGE_MIGRATION="$IMAGE" compose pull migrate
RAKMYAT_IMAGE_MIGRATION="$IMAGE" compose run --rm migrate

# Start the inactive slot and wait for its database-backed health endpoint.
env "$IMAGE_KEY=$IMAGE" docker compose --project-directory "$APP_DIR" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" -f "$COMPOSE_OVERRIDE" pull "$NEW_SERVICE"
env "$IMAGE_KEY=$IMAGE" docker compose --project-directory "$APP_DIR" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" -f "$COMPOSE_OVERRIDE" up -d --no-deps "$NEW_SERVICE"
HEALTH_URL="http://127.0.0.1:${NEW_PORT}/api/health"
HEALTHY=0
for attempt in $(seq 1 60); do
  if curl --fail --silent --max-time 3 "$HEALTH_URL" >/dev/null; then HEALTHY=1; break; fi
  sleep 2
done
if [[ "$HEALTHY" -ne 1 ]]; then
  echo "New app slot did not become healthy; the current upstream is unchanged." >&2
  false
fi

# Stop the sole email worker cleanly during the brief handover, so both releases
# cannot drain the same outbox at once. Inquiry requests continue to queue in DB.
TRAFFIC_SWITCHED=1
RAKMYAT_IMAGE_WORKER="$IMAGE" compose pull email-worker
compose stop email-worker || true
write_upstream "$NEW_PORT"
curl --fail --silent --show-error --max-time 15 "${SITE_URL%/}/api/health" >/dev/null

set_env "$IMAGE_KEY" "$IMAGE"
set_env RAKMYAT_IMAGE_MIGRATION "$IMAGE"
set_env RAKMYAT_IMAGE_WORKER "$IMAGE"
set_env RAKMYAT_IMAGE_ADMIN "$IMAGE"
set_env ACTIVE_SLOT "$NEW_SLOT"
compose up -d --no-deps email-worker
WORKER_ID="$(compose ps -q email-worker)"
WORKER_HEALTHY=0
for attempt in $(seq 1 30); do
  WORKER_STATE="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$WORKER_ID" 2>/dev/null || true)"
  if [[ "$WORKER_STATE" == healthy ]]; then WORKER_HEALTHY=1; break; fi
  sleep 2
done
if [[ "$WORKER_HEALTHY" -ne 1 ]]; then
  echo "Email worker did not become healthy; restoring the previous nginx slot." >&2
  false
fi

DEPLOY_COMPLETE=1
trap - ERR
rm -f "$ENV_BACKUP" "$UPSTREAM_BACKUP"
printf 'Rakmyat deployment %s is healthy on the %s slot. Previous slot retained on port %s.\n' "$IMAGE" "$NEW_SLOT" "$OLD_PORT"
