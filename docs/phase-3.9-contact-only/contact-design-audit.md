# Contact design audit

## Read-only reference

The Homepage and existing site chrome were inspected as read-only references. The Contact refinement follows the current Iteck/Rakmyat light theme: blue accent (`#1683ff`), pale blue surfaces, dark ink, rounded white cards, soft blue shadows, and the existing blue CTA treatment. No new font, package, or global token was introduced.

## Baseline findings

- The page had a hidden `<h1>` followed by a second visible heading, so the visual title was not the page's primary heading.
- The title and inquiry introduction were stacked and centered with large vertical gaps; the plain white page offered little visual connection to the homepage.
- The 1440px form panel was 850px wide, with 367px fields and a 40px-tall submit control. At 1280px the panel narrowed to 750px.
- Inputs had white fills and thin gray borders. Focus, hover, field errors, and submission feedback had little visual distinction.
- Arabic inherited RTL text and grid order, but the browser kept select arrows on the right edge.

## Contact-only treatment

- Replaced the duplicate hidden/visible heading arrangement with one visible localized `<h1>`.
- Added a pale blue gradient hero with restrained circular accents and a supporting inquiry note, arranged beside the heading on wide screens and stacked at smaller widths.
- Widened the form panel to 1040px where the container permits, with a blue top accent, a rounded white surface, and a soft shadow.
- Styled fields with a faint blue surface, larger touch targets, clearer labels, hover/focus states, and distinct invalid feedback.
- Styled the submit control and visible error/success states while preserving the existing semantics and persistence gate.
- Added Contact-scoped RTL select-arrow placement and explicit LTR direction for phone, email, and URL fields.

All new presentation rules live in `components/sections/ContactPage.module.css`, imported only by the Contact section component.
