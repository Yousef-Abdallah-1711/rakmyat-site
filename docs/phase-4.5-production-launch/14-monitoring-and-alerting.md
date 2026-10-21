# Monitoring and alerting

The production Compose template has health checks for PostgreSQL, web, worker, and Caddy, with restart policies and bounded container resources. `scripts/production-healthcheck.sh` checks an approved HTTPS health endpoint without printing response bodies. Health checks report process readiness; they do not create external alerts.

No monitoring provider, paging address, log aggregation service or incident owner has been approved. Configure alerts for public health/TLS expiry, database availability and capacity, inquiry/outbox backlog and terminal failures, SMTP delivery errors, login failure spikes, container restart loops, disk/memory, backup failure and API error rate. Route alerts to a named owner and test delivery before release.

Keep inquiry bodies, passwords, session tokens and SMTP credentials out of logs. Apply retention and access controls to logs containing administrator email or request metadata. The app's error logs intentionally expose only notification attempt metadata.
