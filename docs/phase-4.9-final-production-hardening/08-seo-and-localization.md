# 08 — SEO and localization

The Arabic-default URL policy remains: `/` and unprefixed aliases resolve to Arabic; `/ar` and `/en` remain directly available. Localized root layouts set `lang` and `dir`, and Phase 4.7 generates static HTML for the 32 supported public routes. Unknown localized paths use the localized not-found path. Project metadata uses localized titles/descriptions and reciprocal `en`, `ar`, and `x-default` alternates; the Arabic route is the `x-default` target.

The site URL/indexing helper permits an indexable origin only when the deployment is production, indexing is explicitly enabled, and the configured origin is HTTPS without credentials or localhost. Robots and sitemap remain non-indexable when this gate is closed. The new preflight requires `INDEXING_APPROVED=true` separately before it accepts `ROBOTS_INDEXING_ENABLED=true`; the example keeps both disabled. The release image must be built with the owner-approved origin and policy because public metadata is statically generated.

Code and unit coverage pass for origin gating, localized metadata, and sitemap selection. Production canonical output, robots, sitemap, DNS, and Search Console behavior have not been checked against an approved domain. Staging and preview must remain non-indexable.
