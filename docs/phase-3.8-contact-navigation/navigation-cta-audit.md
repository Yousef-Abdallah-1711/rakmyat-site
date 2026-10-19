# Navigation and CTA audit

## Shared navigation

- Header: localized Home, About, Services, Work, and Contact links; active page uses `aria-current="page"`.
- Removed the “More pages” menu because its entries duplicated Work or led to unpublished/secondary pages without an approved navigation purpose.
- Locale link switches EN/AR while retaining supported path, project slug, and current query string. Unsupported localized route paths map to Contact, preventing dead locale links.
- Mobile menu retains its button, `aria-expanded`, outside-click close, Escape close, and focus restoration.
- Localized primary CTA points to `/{locale}/contact`.

## Project-intent links reviewed

Homepage hero, homepage closing CTA, About closing CTA, service cards and section CTAs, service detail action, pricing plan CTAs, portfolio closing CTA, project detail CTA, top promotion, header CTA, footer Contact link, and related project-to-contact action all use the matching locale’s Contact route. Informational navigation and project detail links retain their existing destinations.

The homepage hero’s old email field was inside a non-delivery demo form. It is now a clear Contact action, preserving its Iteck button treatment and avoiding a false form affordance. Service detail’s disconnected form was replaced by a bilingual Contact link in its existing section so project-intent actions lead to the working inquiry flow.
