# Visual regression evidence

## Captures

The saved baseline contains 28 full-page PNGs: 12 Contact views (both locales at six widths) plus 16 unchanged-page references. The after set has the same route/viewport matrix. Each manifest records file path, HTTP status, bytes, SHA-256, and Contact DOM measurements.

Contact samples:

| Locale | Before | After |
|---|---|---|
| English, 1440px | [Before](./screenshots/before/en-contact-1440.png) | [After](./screenshots/after/en-contact-1440.png) |
| English, 390px | [Before](./screenshots/before/en-contact-390.png) | [After](./screenshots/after/en-contact-390.png) |
| Arabic, 1440px | [Before](./screenshots/before/ar-contact-1440.png) | [After](./screenshots/after/ar-contact-1440.png) |
| Arabic, 390px | [Before](./screenshots/before/ar-contact-390.png) | [After](./screenshots/after/ar-contact-390.png) |

All other Contact widths are included in both screenshot directories.

## Non-Contact references

Homepage, About, Services, and Portfolio were captured before and after in both locales at 1440px and 390px. About, Services, and Portfolio matched pixel-for-pixel across all 12 paired captures. The four Homepage pairs differed only in the project showcase media region: pixel-difference bounds were `(77, 4709, 1363, 5100)` at 1440px and `(17, 5938, 373, 6644)` at 390px. The header, hero, other homepage sections, and footer matched outside that region. No non-Contact source files were edited in Phase 3.9; the localized project images may differ with capture-time image loading.

The before and after matrices each returned HTTP 200 for all 28 captures. After captures reported no horizontal page overflow or clipped Contact headings. Contact-specific source changes are restricted to the Contact section, its exclusively used form component, and the Contact CSS Module.

Review [before manifest](./before-captures.json) and [after manifest](./after-captures.json) for per-file hashes and sizes.
