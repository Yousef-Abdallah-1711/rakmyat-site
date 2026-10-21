# SEO and localization

The current indexing gate requires production mode, explicit `ROBOTS_INDEXING_ENABLED=true`, and an explicit HTTPS origin. Production example defaults indexing off and has no approved site origin. `robots.ts` and `sitemap.ts` are now forced dynamic so these values can be supplied to the deployed runtime rather than frozen into a build. Public English/Arabic route metadata uses reciprocal language alternates, published projects only, and x-default English; admin/API remain excluded.

No production hostname was approved and no production crawl ran. Phase 4.4 route evidence verifies EN/AR `lang`, `dir`, titles and one H1 across the checked routes, but does not prove copy quality or canonical host behavior at a live domain. After domain approval, test disabled and enabled mode against the candidate, inspect every canonical/hreflang target, social image, redirect and sitemap URL, and only enable indexing after explicit owner approval.
