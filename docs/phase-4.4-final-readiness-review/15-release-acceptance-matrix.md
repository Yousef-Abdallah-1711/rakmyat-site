# Release acceptance matrix

| ID | Area / routes | Expected | Actual / evidence | Status | Owner / action |
|---|---|---|---|---|---|
| R-01 | EN/AR public pages, 9 published projects, admin login | Routes render without layout/image failures across requested widths | 1,122 observations across Chromium and WebKit; all HTTP 200, 0 route/layout/image/page/console issues, one H1 each. Firefox executable unavailable; details in `acceptance-matrix.json` | PASS WITH WARNINGS | Engineering: rerun Firefox and review visual/interaction limits |
| R-02 | Localized contact | Validation, persistence, localized success | Phase 4.3 synthetic Postgres/Mailpit E2E 2/2 | PASS locally | Owner/platform: production provider setup |
| R-03 | Admin/API | Unauthorized inquiry data inaccessible | Staging API 401; prior session/auth matrix | PASS locally | Operations: provision lifecycle securely |
| SEO-01 | Public EN/AR | Gate disabled means noindex/no sitemap; enabled requires real approved HTTPS | Live robots disallows all, sitemap empty; SEO unit tests pass | PASS gate / BLOCKED release | Owner: domain and indexing decision |
| SEO-02 | Canonical/hreflang all pages | Unique verified metadata and correct alternates | Code and unit samples reviewed; full enabled-mode crawl not performed | NOT TESTED fully | Engineering/owner: approved origin then crawl |
| A-01 | All public routes | WCAG 2.2 AA evidence | Named Phase4.1 fixes; manual matrix absent | NOT TESTED fully | Accessibility reviewer |
| P-01 | Representative pages EN/AR | Repeatable production-like Lighthouse + field data | Prior raw lab reports; no field data or new repeated run | PASS WITH WARNINGS / NOT VERIFIED field | Engineering/operations |
| S-01 | APIs/admin | Auth, validation, abuse limits, safe headers | Local checks and 4.3 evidence | PASS locally / configuration pending | Operations: production config |
| C-01 | Contact/database/SMTP/admin | Real approved provider delivery | Local Postgres/Mailpit complete; no external SMTP | BLOCKED production | Owner/platform |
| O-01 | Deploy, backup, alerts, rollback | Operationally supported release | Local restore only; production runbook/monitoring absent | BLOCKED | Owner/operations |
| L-01 | Assets/content/privacy | Documented rights and approval | No evidence supplied | BLOCKED | Owner/legal |

Statuses describe the evidence scope; PASS locally is never equivalent to production readiness.
