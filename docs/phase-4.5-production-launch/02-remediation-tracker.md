# Remediation tracker

| Existing ID | Phase 4.4 finding | Phase 4.5 action/evidence | Status | Remaining owner or engineering action |
|---|---|---|---|---|
| R-01 | Firefox unavailable; 1,122 Chromium/WebKit observations | Firefox 157.0 added; 33 routes x 17 widths x Chromium 156, Firefox 157 and WebKit 27.2 | PASS, 1,683 observations | Visual/interaction review remains human |
| R-02 | Contact lifecycle passed only in staging | Retain Phase 4.3 synthetic PostgreSQL/Mailpit evidence; production Compose prepared | PASS locally / BLOCKED production | Provision approved database and SMTP; authorize one real email test |
| SEO-01 | Indexing gate works, but runtime environment behavior needed release validation | `robots.ts` and `sitemap.ts` explicitly dynamic; default production configuration is noindex | PASS code / NOT TESTED deployed host | Approved hostname and indexing decision, then crawl |
| A-01 | No complete WCAG 2.2 AA manual evidence | Existing route matrix retained; representative automated/manual checks added only where tools permit | PASS WITH WARNINGS | Qualified keyboard, screen reader, zoom, and contrast review |
| P-01 | No current repeatable Phase 4.5 metrics or field data | 18 Lighthouse reports; three-run medians on EN/AR home and contact, mobile plus home desktop | PASS LOCALLY / FOLLOW-UP | Home mobile LCP remains 3.61s EN / 3.86s AR; field metrics require approved analytics/consent policy |
| S-01 | Production headers, proxy trust, secrets, deployment config pending | Report-only CSP, production Caddy overwrites X-Real-IP, separate roles/config | PASS locally / CONFIG PENDING | Review CSP reports; configure host firewall, HTTPS, secrets and alerting |
| O-01 | Production operations, backups, monitoring and rollback absent | Separate config, encrypted backup/restore-drill scripts, healthcheck and runbook prepared | CODE PREPARED / NOT OPERATIONALLY VERIFIED | Approved provider, protected backup store, restore drill and alert route |
| L-01 | Privacy, media rights, licensing, and copy approvals absent | Inventory and decision log in `16-privacy-assets-and-copy.md` | BLOCKED | Owner/legal evidence and signoff |

The source of truth for these classifications is the Phase 4.4 acceptance matrix and scorecard. A staging result is never treated as production acceptance.
