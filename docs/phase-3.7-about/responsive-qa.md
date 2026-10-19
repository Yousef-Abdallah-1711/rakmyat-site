# Responsive QA

All eight About route/locale/width combinations returned HTTP 200. The document language and direction matched the locale. Images decoded, headings fit their boxes, and the document had no horizontal overflow. The viewport is 10px wider than `documentElement.clientWidth` in this browser due to the vertical scrollbar; `scrollWidth` equalled `clientWidth` in every capture.

## Hero visual and ordered process dimensions

| Width | Locale | Hero visual | Each flow item | Process layout | Each process item |
|---:|---|---:|---:|---|---:|
| 1440 | English / Arabic | 1290 × 370px | 361 × 155.5px | 5 columns | 237.2px wide |
| 1280 | English / Arabic | 1140 × 370px | 314.5 × 154px | 5 columns | 207.2px wide |
| 768 | English / Arabic | 728 × 340px | 201.5 × 151px | 2 columns | 352px wide |
| 390 | English | 350 × 398.1px | 312.7 × 94px | 1 column | 350 × 97.2px |
| 390 | Arabic | 350 × 375.7px | 312.7 × 94px | 1 column | 350 × 97.2px |

The Company Focus list has five unique items in both locales. The process list has five ordered items. No About form or People and Practice heading remains. The complete route-by-route results, including content labels and page heights, are in [responsive-qa.json](./responsive-qa.json).

## Checks

- 0 broken images; 0 page errors; 0 clipped headings.
- 0 horizontal overflow across the eight About captures.
- 0 unlocalized mojibake in About headings, paragraphs, links, or list content.
- Reduced-motion rules disable the existing About decorative animations when requested.
- English/Arabic Services and Contact CTAs navigate to the correct locale.

These automated checks supplement visual review; they are not a WCAG 2.2 AA certification.
