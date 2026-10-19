# Phase 3.11 — Home service showcase

Status: implemented and validated locally; not deployed. Scope: English and Arabic Home pages.

## Change

Home now uses the same “Software for customer and team workflows” heading, description, and five localized service cards as Services. The showcase occupies the existing capability section position before Work, replacing the eight compact capability tiles there. This keeps the Home page from repeating the same catalogue twice. The Services page remains unchanged. Existing About workflow and approach content is already represented on Home; other About sections are page-specific, so they were not copied over.

The five cards reuse the typed service records, generated illustrations, capability bullets, and selected published project links. English and Arabic use the same card content and responsive grid; Arabic layout remains RTL.

## Responsive QA

Before and after browser captures are available at 1440, 1280, 1024, 768, 390, and 360 pixels for both locales. The before set shows the previous compact capability tiles; after shows the five-card showcase.

| Viewport | Columns | EN card size | AR card size |
|---:|---:|---:|---:|
| 1440 | 5 | 262 × 574 px | 262 × 527 px |
| 1280 | 5 | 230 × 611 px | 230 × 525 px |
| 1024 | 3 | 312 × 490 px | 312 × 468 px |
| 768 | 2 | 352 × 478 px | 352 × 456 px |
| 390 | 1 | 358 × 476 px | 358 × 454 px* |
| 360 | 1 | 328 × 476 px | 328 × 454 px* |

*Arabic Mobile applications and AI cards have no selected project links and are 368px high at the two mobile widths; other Arabic cards are 454px high.

- 12/12 route and viewport captures returned HTTP 200.
- All five cards and images rendered; no overflow, heading clipping, text overflow, or console errors were detected.
- Arabic direction was RTL; project links were keyboard-accessible and returned HTTP 200.
- TypeScript, ESLint, unit tests (4), and production build passed.

## Evidence

- [Before capture manifest](./before-captures.json) · [after capture manifest](./after-captures.json)
- [Capture script](./capture-qa.py)
- [Before screenshot at 1440px, English](./screenshots/before/en-1440.png) · [after](./screenshots/after/en-1440.png)
- [Before screenshot at 1440px, Arabic](./screenshots/before/ar-1440.png) · [after](./screenshots/after/ar-1440.png)

Reproduce against a running production build from `next-app/`:

```powershell
$env:PHASE311_BASE_URL = 'http://127.0.0.1:5202'
python docs/phase-3.11-home-services/capture-qa.py after
```

## Preview

- English Home: <http://127.0.0.1:5202/en>
- Arabic Home: <http://127.0.0.1:5202/ar>
