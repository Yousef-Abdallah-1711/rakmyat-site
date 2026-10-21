# Interaction regression checks

Playwright verified these interactions on the production build: five checks passed, zero failed, and zero browser console/page errors were recorded. Detailed output is in [`reports/responsive/interaction-results.json`](./reports/responsive/interaction-results.json).

- At 900 px, the menu opens; Escape closes it and restores focus to the menu button.
- The language switcher changes English Home to Arabic Home and keeps the current route.
- Portfolio category filters update the visible projects (9 to 4 in the captured check).
- Nora Store's project gallery opens and closes with Escape.
- An empty contact form fails native required-field validation before submission. No contact request was sent.

The browser run does not verify actual email delivery, external video providers, production credentials, or a production database.
