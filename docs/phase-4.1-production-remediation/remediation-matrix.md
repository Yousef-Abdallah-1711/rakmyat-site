# Remediation matrix

| Prior finding | Safe local action | Result / outstanding decision |
|---|---|---|
| Origin, canonical, sitemap absent | Added an HTTPS production-origin gate; localized metadata, reciprocal language alternates, robots, and published-project sitemap are conditional on it | Implemented and tested on an isolated test origin. Real domain and indexing approval remain owner decisions |
| Contrast, heading structure, accessible name mismatch | Corrected scoped brand contrast, selected heading levels, removed unnecessary mismatched card name, and preserved visible action text | Code-level fixes implemented; automated/local checks do not certify WCAG 2.2 AA |
| Mobile navigation control small | Scoped minimum 44px height to the mobile navbar toggler | Measured 56×44px at 390px; interaction passes |
| Contact service not configured | Rechecked validation, focus, error announcement, value retention, auth/cache behavior | Works honestly when persistence is unavailable; DB, origin list, SMTP and delivery verification remain blocked |
| Mobile LCP high | Re-measured representative routes and inspected LCP attribution | LCP candidate is hero heading text. No broad image/CSS change was made without evidence it improves this candidate while preserving appearance; performance work remains open |
| Security headers/CSP review | Added basic hardening headers and removed framework signature header | CSP/HSTS require host and dependency-specific verification; no production host exists |
| Approvals, privacy, licensing, ops | Recorded as release blockers | Cannot be resolved by code-only changes |

No claims of client delivery, asset rights, production contact delivery, or field performance were added.
