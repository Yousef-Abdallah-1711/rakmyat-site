# 05 — CDN and HTTP caching

No CDN product or domain has been selected, so CDN configuration and edge behavior were not tested. Next's static HTML was observed as `Cache-Control: s-maxage=31536000`; dynamic admin login returned `private, no-cache, no-store, max-age=0, must-revalidate`. Public source assets under `/assets/` and `/fonts/` return `public, max-age=86400, stale-while-revalidate=604800`. Next's hashed static output should retain its built-in immutable policy.

## CDN policy to apply when a provider is chosen

1. Cache only GET/HEAD for public locale HTML, static assets, and successful optimized images. Respect origin cache headers.
2. Never shared-cache `/admin/`, `/api/`, `/api/internal/`, health responses, POST/PUT/PATCH/DELETE, or any response with `private`/`no-store`/`Set-Cookie`.
3. Preserve Next router `Vary` headers (`RSC`, router state, prefetch/segment-prefetch, and `Accept-Encoding`) and include `_rsc` in the cache key. Do not collapse HTML and RSC responses.
4. Keep query strings in cache keys where Next uses them, including `w`/`q` for `/_next/image` and `dpl` for deployment-versioned assets.
5. Purge public HTML/RSC entries during release, or use a deliberately bounded edge TTL. Keep the static asset TTL long because the build hash changes.
6. Forward the original host/proto/client address only through trusted proxy configuration. Do not trust arbitrary client-supplied forwarded headers.

Caddy currently provides TLS/edge proxying and compression (`zstd`/`gzip`) but no shared response cache. Browser and CDN behavior should be rechecked after deployment through the chosen edge.
