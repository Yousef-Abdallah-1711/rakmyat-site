# Phase 3.5 — Project Image Treatment Matrix

All source files remain unchanged. The seven real cover images are 1440×900 (1.60:1) desktop captures and each has a 390×844 (0.46:1) mobile counterpart. The two concept illustrations are 1536×1024 (1.50:1). Source dimensions and copy integrity come from the Phase 3.2 asset review; Next.js serves optimized renditions in the browser.

| Project | Existing cover source | Source ratio | Real mobile source | Before treatment | Image-only refinement | Concept label |
|---|---|---:|---|---|---|---|
| Schooly | `portfolio/schooly/hero-desktop.webp` | 1.60 | `hero-mobile.webp`, 390×844 | Faux browser frame, floating phone, colored stage | Full-width contained screenshot; remove toolbar and overlapping phone; retain a thin neutral edge | No |
| Nora Store | `portfolio/nora-store/hero-desktop.webp` | 1.60 | `hero-mobile.webp`, 390×844 | Same repeated frame and phone | Same minimal, uncropped screenshot presentation | No |
| Nama Academy | `portfolio/edtech-platform/hero-desktop.webp` | 1.60 | `hero-mobile.webp`, 390×844 | Same repeated frame and phone | Same minimal, uncropped screenshot presentation | No |
| From Idea to Production | `portfolio/live-workshop/feature-desktop.webp` | 1.60 | `feature-mobile.webp`, 390×844 | Same repeated frame and phone | Same minimal, uncropped screenshot presentation | No |
| EduFlow | `portfolio/eduflow/hero-english-desktop.webp` | 1.60 | `hero-english-mobile.webp`, 390×844 | Same repeated frame and phone | Same minimal, uncropped screenshot presentation | No |
| Middle East Institute | `portfolio/legal-translation/hero-desktop.webp` | 1.60 | `hero-mobile.webp`, 390×844 | Same repeated frame and phone | Same minimal, uncropped screenshot presentation | No |
| GC Hardware | `portfolio/gc-hardware/hero-desktop.webp` | 1.60 | `hero-mobile.webp`, 390×844 | Same repeated frame and phone | Same minimal, uncropped screenshot presentation | No |
| Concord CRM | `project-presentations/concord-crm-concept.webp` | 1.50 | None | Large decorative presentation frame | Keep the existing concept illustration on white, use minimal edge treatment, retain clear visible concept disclosure | **Yes** |
| Product Scraper to WooCommerce | `project-presentations/product-scraper-concept.webp` | 1.50 | None | Large decorative presentation frame | Same minimal concept presentation and visible disclosure | **Yes** |

Desktop screenshots use `object-fit: contain`; no source screenshot pixels or project records were edited. The fixed card image ratios, card widths, grid columns, text, and section structure remain unchanged. Portrait screenshots in the detail gallery retain a centered, thin-border presentation using their native 390:844 ratio.
