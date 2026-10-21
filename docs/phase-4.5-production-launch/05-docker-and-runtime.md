# Docker and runtime

The production Compose file is separate, non-root through the existing multi-stage Dockerfile, uses read-only application filesystems with bounded `/tmp`, health checks, restart policies, resource limits, stop grace periods, named volumes, file-mounted secrets, and no web/PostgreSQL/worker host ports. Only Caddy publishes HTTP/HTTPS. There is no management UI or Mailpit production service.

Runtime secrets use the existing `docker/runtime-entrypoint.sh` file loader. Production environment values stay in ignored `deployment/production.env`; secret files stay in ignored `.production-secrets/`. The new example contains nonsecret placeholders only. Production was not started. Compose validation must be done with `config` only until launch is approved.

On a VPS, restrict inbound traffic to 80/443 and administrative access to an owner-defined allowlist/VPN; restrict outbound traffic to required DNS, certificate, SMTP and update destinations where feasible. Docker bridge egress and host firewall behavior need verification on the selected platform. Rotations require updating secret files and controlled service restart; no secret is passed as a build argument.
