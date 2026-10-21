# Production smoke tests

Production smoke tests remain **NOT TESTED** because no production host exists. A separate local, database-disconnected candidate check returned HTTP 200 for 16 representative EN/AR/admin/SEO routes and for an optimized image request; `/api/health` correctly returned 503 without a database. This is not production health evidence. After approval and deployment, use only synthetic records and the approved domain. Keep indexing disabled until separately authorized.

Checklist: verify HTTP redirects to HTTPS and canonical host; TLS certificate/renewal; security headers including CSP report-only; health; EN/AR home/about/services/how-we-work/portfolio/contact and published project routes; admin login plus unauthenticated API rejection; canonical/hreflang/OG/sitemap and robots gate; noindex until approved; allowed and denied contact origins; synthetic contact persistence and outbox state without external email unless separately approved; worker health; private database ports; monitoring/backup age; and browser/320px RTL checks.

Do not send a real customer inquiry. Do not access customer data beyond a specifically approved synthetic record. A successful health endpoint is not evidence that the form, database, outbox, SMTP, admin, backup or browser flows work.
