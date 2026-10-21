# Baseline trace captures

The `.trace.json.gz` and `.devtoolslog.json.gz` files are gzip-compressed raw Lighthouse artifacts. Decompress with `gzip -dk <file>` or Python's `gzip` module before opening. The adjacent `.json` files are the Lighthouse reports.

| Capture | Route | Finding |
|---|---|---|
| `en-home-mobile` | `/en` | Home request and resource competition baseline |
| `en-services-details-mobile` | `/en/services/details` | Late CSS background discovery and long image transfer |
| `ar-services-details-mobile` | `/ar/services/details` | Same localized route behavior |
| `ar-portfolio-mobile` | `/ar/portfolio` | First visible Schooly card image was lazy loaded |

The captures are single lab runs and should be read alongside the 32 route reports.
