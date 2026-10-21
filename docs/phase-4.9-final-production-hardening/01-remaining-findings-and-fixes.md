# 01 — Remaining findings and fixes

## Corrected in this phase

- The production `migrate` service inherited the image's default `node server.js` command. It now explicitly runs `node --experimental-strip-types scripts/migrate.ts`, allowing Compose's `service_completed_successfully` dependency to gate web startup correctly.
- `NEXT_DEPLOYMENT_ID` was passed to the build but was not explicitly wired to Next's `deploymentId` option. The configuration now uses the documented Next.js 16 deployment identifier.
- The web service needed outbound access for the configured SMTP delivery path. Production networks now keep database/application/ingress traffic private and provide a distinct SMTP egress network; Caddy has a separate certificate egress network. Host firewall egress restrictions still need operator configuration.
- The edge health check queried HTTP port 80, which can redirect to HTTPS. It now checks Caddy's local admin config endpoint on 2019; that port is not published.
- Production Compose logs now rotate at 10 MB x 5 files per service.
- The production preflight now requires Hostinger implicit TLS on 465, the configured Rakmyat mailbox, a valid notification recipient, and an overwritten `x-real-ip` proxy header. Indexing requires both the indexing flag and a separate `INDEXING_APPROVED=true` declaration.
- Migration 0002 now adds its retry-attempt constraint idempotently.
- The normal typecheck command now excludes stale generated `.next` validators from the previous route tree. Fresh Next builds still perform Next's generated route validation.
- Admin inquiries now have bounded 25-row server pagination, filtered totals, and accessible previous/next controls. Public localized and admin segments have generic, localized error boundaries that do not reveal exception details.

## Still unresolved

The local validation image and route/SEO plus contact/outbox/admin smoke checks have now passed on a disposable network, with temporary PostgreSQL and Mailpit. The image was built with a reserved `.invalid` origin and indexing disabled; rebuild with an owner-approved origin and run the production preflight. Live SMTP, production hosting, CDN behavior, backup destination/retention, alert delivery, legal approvals, and owner approvals remain external gates.
