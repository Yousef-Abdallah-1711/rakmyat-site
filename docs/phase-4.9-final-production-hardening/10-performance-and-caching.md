# 10 — Performance and caching

Phase 4.7 static generation, deployment-ID support, source-asset cache headers, one-day image derivative minimum TTL, and private/no-store handling for admin and API routes are retained. Next's build output is the verification point for actual static routes; external CDN cache keys, query behavior (`_rsc`, `dpl`), purge semantics, and cache bypass for mutations require provider-specific configuration and remain unverified. No Redis or ISR was added.

The previous lightweight observation measured the Phase 4.3 web container at about 985 MiB of its 1 GiB limit, worker at about 36 MiB of 256 MiB, with the worker idle in that sample. This is a resource warning, not proof of a leak. The running Node heap cannot be measured safely without enabling an inspector or changing the running process. Production Compose budgets web at 1.5 GiB and caps V8 old space at 1 GiB; verify under an isolated release candidate and monitor image cache size.

The Phase 4.7 500-VU local public GET/asset run remains bounded evidence only. This phase did not repeat it, run a spike/soak, or claim formal capacity.
