# 14 — Horizontal scaling readiness

Public generated routes are included in the release image and are consistent across replicas of that image. No persistent shared Data Cache or ISR coordination is required today. Admin sessions, rate-limit buckets, inquiry rows and the notification outbox are PostgreSQL-backed and therefore shared across web replicas. The outbox claim path uses row locks; confirm duplicate-send idempotency at the SMTP boundary before scaling workers.

The optimized image cache is per container and should be treated as ephemeral. A new replica may pay transform cost again. Use a CDN keyed by the full optimized image URL, or add a shared image service only if measurement demonstrates a need.

The current app pool is up to 8 PostgreSQL connections per web process. Set the upper bound as `web replicas × 8 + worker/migration/operator connections`; reserve headroom under PostgreSQL `max_connections`, or introduce a pooler before exceeding it. Monitor active/waiting connections, transaction duration, lock waits and oldest pending outbox age.

Use the same image and unique `NEXT_DEPLOYMENT_ID` on all replicas in one release. Roll out atomically enough that static HTML, client chunks and CDN entries do not mix deployments. Purge edge HTML/RSC on release; keep old hashed assets available for clients finishing an older session.
