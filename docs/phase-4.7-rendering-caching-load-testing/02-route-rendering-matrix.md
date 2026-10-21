# 02 — Route rendering matrix

| Route family | Concrete paths | Rendering | Data source | Shared-cache policy | Notes |
|---|---|---|---|---|---|
| EN public pages | `/en`, `/en/about`, `/en/services`, `/en/services/details`, `/en/how-we-work`, `/en/portfolio`, `/en/contact` | SSG | build-time copy | Next prerendered HTML; CDN policy remains to configure | Contact page is static; POST endpoint is dynamic. |
| EN projects | `/en/projects/{schooly,nora-store,edtech-platform,live-workshop,eduflow,legal-translation,gc-hardware,concord-crm,product-scraper}` | SSG | build-time portfolio data | Next prerendered HTML; CDN policy remains to configure | 9 published slugs. |
| AR public pages | `/ar`, `/ar/about`, `/ar/services`, `/ar/services/details`, `/ar/how-we-work`, `/ar/portfolio`, `/ar/contact` | SSG | build-time copy | Next prerendered HTML; CDN policy remains to configure | Arabic root sets `lang=ar`, `dir=rtl`. |
| AR projects | `/ar/projects/{schooly,nora-store,edtech-platform,live-workshop,eduflow,legal-translation,gc-hardware,concord-crm,product-scraper}` | SSG | build-time portfolio data | Next prerendered HTML; CDN policy remains to configure | 9 published slugs. |
| Admin pages | `/admin/login`, `/admin/inquiries` | Dynamic | PostgreSQL/session | private, no-store | Login and authenticated data are not publicly cacheable. |
| Contact API | `POST /api/inquiries` | Dynamic | PostgreSQL + rate-limit bucket | no-store | Same-origin validation, bounded payload, idempotency. |
| Admin APIs | `/api/admin/login`, `/api/admin/logout`, `/api/admin/inquiries`, `/api/admin/inquiries/[id]` | Dynamic | PostgreSQL/session | private/no-store | Cookie-authenticated writes and reads. |
| Operations | `/api/health`, `/api/internal/outbox` | Dynamic | DB/worker state | no-store | Internal worker requires bearer secret. |
| Indexing | `/robots.txt`, `/sitemap.xml` | Dynamic | runtime indexing flag + static route list | runtime response; do not edge-cache across policy changes | Production origin and indexing toggle must match build config. |
| Legacy aliases | `/`, `/about`, `/contact`, `/portfolio`, `/services`, `/services/details` | static route output or redirect | none | redirect/static | Retained for legacy entry points. |
| Legacy project alias | `/projects/[slug]` | Dynamic | portfolio lookup | verify exact redirect headers before CDN caching | Kept outside locale routes. |
| Invalid/unpublished | invalid locale and unknown/unpublished localized project | 404 | none | not-found response | `dynamicParams=false` prevents arbitrary project generation. |

There are **32** localized public pages: 16 English and 16 Arabic. Each locale has 7 standard pages and 9 project details. `generateStaticParams()` enumerates only `en`, `ar`, standard page paths, and published project slugs; `dynamicParams=false` prevents on-demand creation for unknown combinations.

For each page row, the build generates static HTML. Next's router may also serve RSC/navigation responses; an edge cache must preserve Next's `Vary` dimensions and `_rsc` query key as described in [05-cdn-and-http-caching.md](05-cdn-and-http-caching.md).
