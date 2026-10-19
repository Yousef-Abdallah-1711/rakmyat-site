export const contentStatus = {
  verifiedFacts: [
    { id: "company-name", value: "Rakmyat / رقميات", source: "Owner-provided BDA project materials" },
    { id: "company-category", value: "Software house", source: "Owner-provided PRODUCT.md" },
  ],
  approvedContent: [
    { id: "brand-mark", value: "Rakmyat faceted R mark for existing header and footer wordmarks.", source: "Derived export of the owner-supplied authoritative logo, as documented in BDA BRAND_ASSETS.md." },
    { id: "project-attribution", value: "All nine projects in the BDA Rakmyat portfolio are real projects personally owned and built by the owner.", source: "Explicit owner confirmation in Phase 3.2 instructions." },
  ],
  proposedContent: [
    "Bilingual service and company copy in services.ts, page-copy.ts, and home.ts, adapted from owner-provided product materials.",
    "Bilingual descriptions for nine owner-confirmed projects, with available public-screen captures in the portfolio. Project details and image review notes are in content/portfolio.ts and docs/phase-3.2/project-publication-register.json.",
    "An illustrative workflow and service-scope comparison; neither is a customer quotation, measured result, or fixed-price package.",
  ],
  pendingVerification: [
    "Written permission to reproduce client websites, third-party names, product photography, and marks visible inside the portfolio screenshots; exclude or redact any item without clearance before deployment.",
    "Current implementation details and feature lists for Concord CRM and Product Scraper; the supplied source repositories were unavailable, so only project-name-level descriptions are used.",
    "Logo/media usage-right evidence; approved brand palette and font choice. The source identifies the logo as user-supplied, but does not include a license document.",
    "Pricing policy, customer relationships, testimonials, team profiles, and culture media.",
    "Contact email (info@rakmyat.online), phone, domain, form destination/backend, consent/privacy wording, retention, and spam controls.",
    "Production domain, canonical URLs, and Arabic professional proofreading.",
  ],
  unpublished: [
    "The old unlocalized Notero project alias remains an unpublished 404.",
    "Original Iteck clients, testimonials, team names/photos, business metrics, prices, contact details, and location.",
    "Unapproved pilot design directions, candidate fonts, contact/phone details, and social destinations.",
  ],
} as const;
