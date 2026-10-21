# Technical SEO

**Current staging gate: PASS. Production SEO readiness: BLOCKED.** Code requires `NODE_ENV=production`, `ROBOTS_INDEXING_ENABLED=true`, and an explicit valid HTTPS `NEXT_PUBLIC_SITE_URL`; malformed/non-HTTPS/local origins return no indexable origin. No origin means no canonical and `noindex,nofollow`; robots disallows all and sitemap is empty. Live staging at `127.0.0.1:5212` returned `robots.txt` with `Disallow: /`, sitemap endpoint 200 with valid empty `<urlset>` XML and no public entries, and EN/AR pages 200. Unit tests cover origin gating, localized alternates, and published-project filtering.

Production gate remains closed because no approved real domain or owner indexing approval was supplied. Hreflang, unique metadata, OG images, and canonical duplication were not exhaustively scraped across the generated full matrix in both indexing modes. No localhost canonical is intended. Admin/API exclusion is configured in robots only when indexing is enabled; protected data authorization remains server-side.

Evidence: `lib/site-url.ts`, `lib/seo.ts`, `app/robots.ts`, `app/sitemap.ts`, `tests/seo.test.ts`; live response results in this report run. No structured data was certified.
