# Test results

- `npm.cmd run typecheck`: pass.
- `npm.cmd run lint`: pass.
- `npm.cmd test`: pass, 15/15 tests (11 existing plus 4 SEO gate/metadata/sitemap tests).
- `npm.cmd run build`: pass in isolated sibling build copy with its own `node_modules`; route table includes robots and sitemap.
- Browser interaction: 27/27 checks pass. Covers language switch/direction, nine projects, category filtering, project navigation and accessible action naming, admin API rejection/no-store, contact required/invalid email validation, safe failure/value retention in EN/AR, mobile navigation target/menu, reduced motion, and zero page errors.
- Responsive browser matrix: 510 combinations across 34 paths and 15 widths. See `responsive-regression.json` for recorded results.

Contact endpoint returned 403 in this isolated environment because the exact production origin allowlist and persistence services were not supplied. This validates honest failure handling only; real successful delivery remains untested.
