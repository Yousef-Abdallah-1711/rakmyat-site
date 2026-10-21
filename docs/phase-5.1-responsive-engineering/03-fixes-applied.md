# 03 — Fixes applied

Both edits are in `app/globals.css`, inside the pre-existing `.admin-shell`/`.admin-filters` rule block (lines 433–456 before editing). No other files changed; no visual identity, brand colors, or non-admin pages were touched.

## Fix 1 — admin form control box-sizing (confirmed defect)

```diff
- .admin-shell input, .admin-shell select, .admin-shell textarea { width: 100%; min-height: 42px; padding: 9px 11px; border: 1px solid #aeb8c6; border-radius: 4px; background: #fff; color: #20242a; font: inherit; }
+ .admin-shell input, .admin-shell select, .admin-shell textarea { box-sizing: border-box; width: 100%; min-height: 42px; padding: 9px 11px; border: 1px solid #aeb8c6; border-radius: 4px; background: #fff; color: #20242a; font: inherit; }
```

**Why:** `width: 100%` under the browser's default `box-sizing: content-box` means the declared width is the content box only — the 11px horizontal padding and 1px border get added on top, not absorbed inside. Every input, select, and textarea anywhere under `.admin-shell` (the login form and the inquiries dashboard's search/status/notes fields) was rendering ~23px wider than its parent allowed, overflowing to the right. `border-box` makes the declared width include padding and border, which is what every other sized element in this stylesheet already assumes (see the pre-existing `box-sizing: border-box` usage elsewhere in the file for portfolio cards).

**Verified:** input `right` edge matched the form's `right` edge exactly after the fix (336px = 336px) at 375px viewport width; no visible or measured change at 1440px; lint/typecheck/unit tests all still pass.

## Fix 2 — admin filters intermediate-width compression (defensive)

```diff
- .admin-filters { display: grid; grid-template-columns: minmax(220px,1fr) 230px; gap: 16px; margin-bottom: 20px; }
+ .admin-filters { display: grid; grid-template-columns: minmax(220px,1fr) minmax(160px,230px); gap: 16px; margin-bottom: 20px; }
```

**Why:** The existing `@media (max-width: 600px)` block already collapses `.admin-filters` to a single column, so there was no reproduced break below 600px. Above 600px, though, the second column had a hard 230px floor with no ability to compress; this gives it room to shrink to 160px before the layout has to rely on the single-column breakpoint, reducing how tight the admin shell's padded content area (`min(100% - 36px, 1180px)`) gets on tablet-ish widths. Treat this as a small safety margin, not a reproduced-and-fixed bug — it couldn't be re-rendered against live data locally (see [01](01-route-and-component-inventory.md)).

## Fix 3 — services/details breadcrumb separator and rocket/heading overlap (confirmed defect, public page)

Also in `app/globals.css`, added after the existing `.about.style-5 .content .img.main-img2/3 img` override block.

```css
/* Vendor breadcrumb rule only styles <a>; the current page is correctly a <span>
   (it shouldn't link to itself), so the vendor's own :last-of-type reset zeroes
   the only <a>'s spacing too, and the two breadcrumb labels render with no gap. */
.inner-header.style-5 .content .links {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
}
.inner-header.style-5 .content .links a,
.inner-header.style-5 .content .links span {
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
}
.inner-header.style-5 .content .links > :not(:last-child) {
  padding-inline-end: 10px !important;
  border-inline-end: 1px solid rgb(0 0 0 / 20%) !important;
}

/* The decorative rocket (position:absolute;right:0) is sized from .content's
   height with no reserved width at desktop, and an under-sized 50px reservation
   at <=991px — it visually covers the heading's leading letters at every width. */
@media (min-width: 992px) {
  .inner-header.style-5 .content {
    padding-right: 170px !important; /* scoped so it doesn't fight the vendor's own <=991px padding-right:50px */
  }
  .inner-header.style-5 .content .side-img {
    max-width: 150px;
    object-fit: contain;
  }
}
@media (max-width: 991.98px) {
  .inner-header.style-5 .content .side-img {
    max-width: 42px;
    object-fit: contain;
  }
}
```

**Why `!important` here but not in fix 1/2:** `app/globals.css` loads *before* `public/assets/css/style.css` (the vendor theme stylesheet) in the page's `<link>`/import order, confirmed empirically — a plain override of an equally-specific vendor selector gets silently reset by the vendor rule that follows it. This is the same reason the pre-existing `.navbar.style-5 .navbar-nav .nav-link.active` contrast fix elsewhere in this file already uses `!important` (see its comment). Fixes 1 and 2 didn't need it because they touch `.admin-shell`/`.admin-filters`, which have no competing vendor rule at all — they're app-owned classes, not vendor ones.

**Two regressions caught and corrected during this fix** (kept visible here rather than squashed, per the brief's "do not claim verification that did not happen" standard — this is what real iteration looks like):
1. First pass only scoped the `.side-img` width cap to `≤991.98px`, matching where the vendor's own padding reduction lives. A follow-up check at 1440px (not part of the original plan — done because "verify the fix" should mean more than the one breakpoint it was designed for) found the *same* overlap, worse, at desktop, where the vendor reserves no space for the rocket at all.
2. The desktop fix's `padding-right: 170px !important` was initially unscoped (no `@media`), so `!important` made it win at *every* width, including mobile — overriding the vendor's existing, correct `≤991px` reduction to 50px and squeezing the mobile heading into five cramped single-word lines. Caught by re-screenshotting 375px immediately after the desktop change. Fixed by wrapping the desktop padding in `@media (min-width: 992px)`.

**Verified:** screenshots before/after at 375px, 834px, 1440px, and English/LTR 375px (see [02](02-responsive-defect-matrix.md) for the full list); `h2.textContent` confirmed the heading text itself was always complete — the defect was a visual overlap, not truncation; lint/typecheck/17 unit tests green after the final state.

## What was deliberately not touched

- `.admin-metrics`, `.admin-pagination`, `.admin-inquiry summary`, `.admin-detail dl` already have correct mobile handling in the existing `@media (max-width: 600px)` block — re-verified by reading it, not re-implemented.
- No changes were made to any component file, brand colors/typography, or any file outside `app/globals.css`.
