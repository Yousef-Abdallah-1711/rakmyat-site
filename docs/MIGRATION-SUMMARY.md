# Migration Summary

## History

The workspace began as a local Vite multi-page clone using browser-delivered HTML, CSS, JavaScript, fonts, and images. The Next.js implementation was built in the independent `next-app/` Git repository. The root Vite project remains in place as the migration baseline and was not changed by the migration.

The Next app uses Next.js 16.4.2, React 19.3.1, strict TypeScript, and the App Router. The Phase 2 work was completed on branch `phase-2/finalization` at commit `3a59ed8600cde27ac7161ee4cb7c8675d260c719`, based on rollback point `3a8ced26f98870429582e3c80858e4211d469875`. No deployment occurred.

## Final validation recorded for Phase 2

- TypeScript check, ESLint, production build, and `npm audit --audit-level=low` passed; the recorded audit reported zero vulnerabilities.
- Seven clean routes plus seven legacy aliases returned HTTP 200; a missing route returned 404.
- All seven pages were captured at 1440, 1280, 768, and 390 CSS pixels (28 comparisons).
- The final Next captures matched the local Vite source dimensions and page heights. Maximum local-source MAE was 0.00447/255; maximum share of pixels with a max-channel delta above 40 was 0.74927%.
- Functional, accessibility DOM, local network, and overflow checks are described in the [Phase 2 report index](../../specs/iteck-saas-clone/nextjs-migration/phase-2/README.md).

## Metrics reconciliation

The earlier migration report records a separate capture run with maximum local-source MAE 0.637/255. Phase 2 reran the captures and recorded maximum MAE 0.00447/255. These are different runs with different capture artifacts; the later Phase 2 manifest and metrics are the final result. The historical report and metrics remain available for context. Live-hosted reference captures have separate discrepancies, recorded in the Phase 2 live-reference review; they are not covered by the local-source parity result.

## Phase 3.2 project integration

The later Rakmyat content phase added nine owner-confirmed portfolio projects, bilingual detail routes, selected local project media, featured homepage work, service-to-project links, and localized project metadata. It passed a fresh typecheck/lint/build and 120 route/viewport captures. Rights and content approvals still open are documented in [Known Issues](KNOWN-ISSUES.md) and the [Phase 3.2 report](phase-3.2/implementation-report.md).

## Evidence locations

- Final Next regression captures: `specs/iteck-saas-clone/nextjs-migration/phase-2/screenshots/current/`
- Original local Vite baseline: `specs/iteck-saas-clone/nextjs-migration/screenshots/baseline/local/`
- Current saved hosted-reference set: `specs/iteck-saas-clone/nextjs-migration/screenshots/stable/reference/`
- Phase 2 manifest and metrics: `specs/iteck-saas-clone/nextjs-migration/phase-2/screenshots/captures.json` and `metrics.json`
- Full workspace inventory and cleanup actions: [cleanup report](../../specs/iteck-saas-clone/cleanup-report.md)

## Blog CMS migration: `0003_blog.sql`

`db/migrations/0003_blog.sql` adds the database-backed blog. It creates new tables only and does not alter the existing contact, admin, rate-limit, or outbox tables. Full details are in the [blog CMS guide](blog-cms/README.md).

- Tables: `blog_categories`, `blog_post_types`, `blog_tags`, `blog_posts`, and `blog_post_tags` (the join table between posts and tags).
- Relationships: `blog_posts.category_id` and `blog_posts.post_type_id` are `ON DELETE SET NULL`. `blog_post_tags` rows are removed when their post or tag is deleted (`ON DELETE CASCADE`).
- Constraints: `blog_posts.status` is `draft`, `published`, or `archived`; `locale_primary` is `en` or `ar`. Slugs are unique in every table.
- Indexes: `blog_posts(status, published_at DESC)` for the public list, plus `blog_posts(category_id)` and `blog_posts(slug)`.
- Seed data: 4 post types (`article`, `tutorial`, `case-study`, `news`), 4 categories, and 8 tags. Seeds use `ON CONFLICT (slug) DO NOTHING`.
- Re-running the migration is safe: tables and indexes use `IF NOT EXISTS`, and seeds skip existing slugs.
- Applied with `npm run db:migrate`. The runner picks up `NNNN_name.sql` files in filename order, so `0003` runs after `0002`.
- Rollback: there is no `0003` down file. `0002` has one (`0002_bounded_outbox_retries.down.sql`). Reverting the blog schema means dropping the five tables by hand, in dependency order (`blog_post_tags`, `blog_posts`, then the taxonomy tables).
- Verification in this pass: the SQL text and the runner's filename pattern were checked by reading the files. The migration was not re-run against the database in this pass.
