# 04 — Next.js cache layers

| Layer | Current use | Lifetime / scope | Invalidation |
|---|---|---|---|
| React request memoization | No significant public remote fetches to deduplicate | One server render/request | Request end |
| Data Cache | Not used for public content; source content is imported from files | None | New build |
| Full Route Cache | Yes, 32 localized EN/AR pages | Generated as part of immutable build output | Deploy a new image/build |
| Client Router Cache | Next client navigation cache is active for static route segments | Build/runtime framework defaults; tested response advertises stale time 300s | Navigation expiration, refresh, hard navigation, or release behavior |
| Image optimizer cache | Yes, `next/image` | `minimumCacheTTL: 86400`; generated derivatives cached locally by each container | Expiration or local cache eviction |
| Static asset output | Yes, hashed `/_next/static` build files | Content-addressed; Next serves immutable caching | New build yields new hash and deployment ID |

There is no custom persistent Next Data Cache handler configured. Next's static HTML is present in the image, so replicas of the same image have identical public route content. Runtime image derivatives are local to each replica and may be recomputed on another replica. They are safe to lose; monitor CPU and cache volume if image traffic grows.

`NEXT_DEPLOYMENT_ID` is now required by the production compose build path. Use one unique release ID for the image and all replicas so clients do not mix build assets during rollout. A CDN must include the deployment query parameter in the asset key and purge or expire old HTML/RSC entries on release.
