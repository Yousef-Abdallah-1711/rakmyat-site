# 17 — Remaining risks

1. **CDN unknown:** provider, domain, cache key, purge API and request-header forwarding are not selected or tested.
2. **Production capacity unknown:** local same-host VUs do not model independent user networks, TLS/proxy, browser execution, production DB size or CPU/memory limits.
3. **Static metadata is build-time:** `NEXT_PUBLIC_SITE_URL`, indexing flag and deployment ID need to be aligned between build and runtime. Compose/preflight now require an explicit release ID; verify release values before building.
4. **Image cache is local:** transforms may repeat after a replica restart or across replicas; monitor misses and local cache usage.
5. **Search query scaling:** leading-wildcard admin inquiry searches can scan many rows when matches are sparse. Validate with a representative production-like dataset before increasing admin volume.
6. **Connection ceiling:** web pool size is per process. Recalculate against actual PostgreSQL max connections before adding replicas.
7. **Worker throughput:** SMTP and outbox drain rates were not measured; use a safe mail sink and deduplication before scaling workers.
8. **Browser JavaScript budget:** no analyzer or field performance run was performed in Phase 4.7.
9. **Legacy project path:** `/projects/[slug]` remains a dynamic handler outside the localized static matrix; confirm redirects and cache semantics if old URLs receive traffic.
10. **Old `.next` tree:** pre-existing main-worktree generated type files reference route paths that were moved. A fresh isolated build passes; the existing `.next` directory was preserved.
