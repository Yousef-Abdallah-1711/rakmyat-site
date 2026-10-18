# Known Issues and Production Decisions

- **Contact submissions:** the form provides browser validation and demo feedback only. Specify and implement a production backend if messages must be delivered.
- **External services:** Google Maps and the optional YouTube lightbox require network access when used.
- **Asset rights:** browser-delivered theme assets and Font Awesome Pro files exist locally, but this workspace has no proof of redistribution rights. Confirm the applicable template and Font Awesome licenses before public use.
- **Live-reference variation:** the latest local-source comparison is very close, but previously captured hosted pages contain outliers: About and Single Project pixel differences, and a 22px Services page-height difference at 1280px. Review the [Phase 2 report](../../specs/iteck-saas-clone/nextjs-migration/phase-2/live-reference-review.md) before claiming parity with the current hosted site.
- **Content editing:** typed records cover many shared and repeated data groups, but some labels and prose remain inline in route components. There is no CMS or editor UI.
- **CSS maintenance:** the original theme and vendor CSS remain broad to preserve the cascade. Selector-based pruning was not performed.
- **Source scope:** the local assets are browser-delivered template files, not the vendor's private source repository. No original PHP backend or CMS was available.
- **Accessibility:** automated DOM checks passed as reported, but manual contrast, screen-reader, zoom/reflow, and animation-timing reviews remain production decisions.
