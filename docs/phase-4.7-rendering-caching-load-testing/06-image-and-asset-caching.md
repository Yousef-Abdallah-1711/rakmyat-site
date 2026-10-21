# 06 — Images and asset caching

`next.config.ts` sets `images.minimumCacheTTL` to 86,400 seconds. A fresh local request for a 640px Schooly hero derivative returned 200, `X-Nextjs-Cache: MISS`, `Cache-Control: public, max-age=86400, must-revalidate`, and 80,968 bytes; a repeat returned `HIT` with the same ETag and body size. This confirms local optimizer cold/warm behavior for that variant, not shared-CDN caching.

Source WebP and font files under `/assets/` and `/fonts/` receive a one-day browser cache and seven-day stale-while-revalidate window. The source logo request returned 200 with `public, max-age=86400, stale-while-revalidate=604800`. Hashed Next chunks are immutable and versioned by the build.

The image cache is instance-local by default; it is disposable and may cold-start after container replacement. A CDN in front should cache optimized derivatives by their complete URL and can reduce repeat transform work. Track optimizer misses, image-transform CPU, disk/tmpfs usage and image response p95. If image transforms dominate load, pre-generate key variants or use a shared image service only after measuring.
