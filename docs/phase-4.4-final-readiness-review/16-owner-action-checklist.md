# Owner action checklist

1. Select hosting/platform and approve a production HTTPS domain.
2. Decide whether indexing is enabled; configure `NEXT_PUBLIC_SITE_URL` and `ROBOTS_INDEXING_ENABLED` only after approval.
3. Provision production PostgreSQL, secrets, migrations, backup schedule, retention and tested restore.
4. Approve external SMTP provider and recipient; rotate credentials; authorize a synthetic test message and verify receipt.
5. Select trusted origins/proxy settings and production rate limit settings.
6. Decide admin exposure, named administrator lifecycle, MFA/identity expectations and incident ownership.
7. Approve monitoring, alerts, logging, health checks, rollback and incident runbook.
8. Approve privacy notice, lawful basis, retention and deletion workflow.
9. Supply theme, icon/font, illustration, project-media and attribution rights evidence.
10. Review and sign off English and Arabic copy, company claims, project attribution and contact response expectations.
11. Complete manual keyboard, screen reader, zoom/reflow and WCAG 2.2 AA review; define release acceptance.
12. After approved deployment candidate exists, run production-like SEO crawl, repeated Lighthouse and Firefox/WebKit/browser matrix.
