export const contentStatus = {
  verifiedFacts: [
    { id: "company-name", value: "Rakmyat / رقميات", source: "Owner-provided BDA project materials" },
    { id: "company-category", value: "Software house", source: "Owner-provided PRODUCT.md" },
  ],
  approvedContent: [
    { id: "brand-mark", value: "Rakmyat faceted R mark for existing header and footer wordmarks.", source: "Derived export of the owner-supplied authoritative logo, as documented in BDA BRAND_ASSETS.md." },
  ],
  proposedContent: [
    "Bilingual marketing copy and the service catalogue in services.ts, page-copy.ts, and home.ts, adapted from supplied BDA PRODUCT.md and project materials; owner publication approval remains pending.",
    "An illustrative workflow and service-scope comparison; neither is a client case study, quotation, or fixed package.",
  ],
  pendingVerification: [
    "Logo/media usage-right evidence; approved brand palette and font choice. The source identifies the logo as user-supplied, but does not include a license document.",
    "Confirmation that the supplied service catalogue is approved for public marketing; project-specific deliverables and operating practices.",
    "Pricing policy, client relationships, testimonials, team profiles, culture media, and case-study attribution/publication permissions.",
    "Contact email (info@rakmyat.online), phone, domain, form destination/backend, consent/privacy wording, retention, and spam controls.",
    "Production domain, canonical URLs, and Arabic professional proofreading.",
  ],
  unpublished: [
    "All nine BDA portfolio candidates; none is represented as completed Rakmyat work pending attribution and publication review.",
    "Notero and all Iteck template project records; no Rakmyat case study is published.",
    "Original Iteck clients, testimonials, team names/photos, business metrics, prices, contact details, and location.",
    "Unapproved pilot design directions, candidate fonts, contact/phone details, and social destinations.",
  ],
} as const;
