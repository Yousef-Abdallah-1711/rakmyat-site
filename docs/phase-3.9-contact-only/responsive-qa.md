# Responsive QA

The production build was opened in Chromium and captured at 1440, 1280, 1024, 768, 390, and 360 CSS pixels for English and Arabic. The screenshot manifest also records the page heading, form panel, first two fields, submit button, text clipping, scroll width, and select direction.

## Rendered form dimensions

Each cell shows **panel width × height; first field width × height** in CSS pixels. The panel's 390px and 360px widths include the page's existing 15px outer gutters on each side.

| Viewport | English panel; first field | Arabic panel; first field | Layout result |
|---:|---|---|---|
| 1440 | 1040 × 1029; 452 × 52 | 1040 × 1007; 452 × 52 | Two balanced columns; centered panel |
| 1280 | 1040 × 1029; 452 × 52 | 1040 × 1007; 452 × 52 | Two balanced columns; centered panel |
| 1024 | 994 × 1008; 436 × 52 | 994 × 986; 436 × 52 | Two columns; full container width |
| 768 | 738 × 984; 319 × 52 | 738 × 962; 319 × 52 | Two columns remain readable |
| 390 | 360 × 1204; 322 × 50 | 360 × 1182; 322 × 50 | Single-column, full-width fields and button |
| 360 | 330 × 1204; 292 × 50 | 330 × 1204; 292 × 50 | Single-column, full-width fields and button |

The first two fields share a row at 768px and above and stack at 390px and 360px. All 12 Contact captures report document width equal to viewport width and an unclipped main heading. The submit target is 50px tall on mobile and spans the card width.

Arabic fields and labels flow RTL; the service select arrow is on the left (`12px 50%` computed background position), while English uses the right (`calc(100% - 12px) 50%`). Phone, email, and reference URL fields are explicitly LTR in both locales.

See the machine-readable metrics in [`after-captures.json`](./after-captures.json) and visual samples in [`screenshots/after/`](./screenshots/after/).
