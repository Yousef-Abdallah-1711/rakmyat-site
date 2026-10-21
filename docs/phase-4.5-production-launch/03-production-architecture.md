# Production architecture

The separate `docker-compose.production.yml` contains a Next.js web service, one-shot migration service, PostgreSQL 17, authenticated outbox worker, Caddy HTTPS edge, and an opt-in admin provisioning tool. Mailpit is deliberately absent. The existing Phase 4.3 Compose file and named volumes are not reused.

PostgreSQL has no published port and joins only an internal network. Web joins that database network plus private app and ingress networks; the worker joins only the internal app network; Caddy alone publishes 80/443 and proxies to the web service. SMTP egress originates from the app runtime; host firewall and provider egress policy still require configuration. The internal worker endpoint is never published.

The database bootstrap account is distinct from `rakmyat_migrator` and least-privilege `rakmyat_app`. App role receives table DML and sequence privileges by migration-role default grants. Migration runs before web startup. Persistent production volumes have unique names.

Caddy obtains certificates only when a real owner-approved hostname resolves to the deployment. HSTS is intentionally absent until HTTPS is independently verified. Local Compose syntax does not prove public routing, firewall, DNS, or certificate issuance.

For a small bilingual site with one outbox worker, a managed container platform plus managed PostgreSQL minimizes host patching and backup burden if it supports persistent/secret-safe jobs and SMTP egress. A dedicated Linux VPS is a portable lower-level option but requires the owner to operate OS updates, Docker, host firewall, disk monitoring, backup storage, and incident response. The exhaustive local route matrix drove the app container near 1 GiB; the template allows 1.5 GiB for web and about 1.5 GiB across database, worker, and edge, so budget at least 4 GiB host memory plus operating-system headroom and verify on the selected host. No provider or price is selected because none is approved.
