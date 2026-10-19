export const contentStatus = {
  verifiedFacts: [
    { id: "company-name", value: "Rakmyat / رقميات", source: "Phase 3 approved plan" },
    { id: "company-category", value: "Software house", source: "Phase 3 approved plan" },
  ],
  approvedContent: [],
  proposedContent: [
    "Bilingual generic positioning, navigation, prompts, and page copy in page-copy.ts, home.ts, i18n.ts, and pricing.ts.",
    "Text-only Rakmyat wordmark inside the existing Iteck logo areas; provisional until identity approval.",
    "Neutral discussion-topic cards in place of unapproved client, testimonial, team/culture, and portfolio evidence.",
  ],
  pendingVerification: [
    "Official logo, palette, font choice, and asset usage rights.",
    "Service inventory, deliverables, operating process, and public business claims.",
    "Pricing policy, client relationships, testimonials, team profiles, culture media, and case studies.",
    "Contact email/phone/address, form destination/backend, consent/privacy wording, retention, and spam controls.",
    "Production domain, canonical URLs, and Arabic professional proofreading.",
  ],
  unpublished: [
    "Notero and all template project records; no Rakmyat project detail is published.",
    "Original Iteck clients, testimonials, team names/photos, business metrics, prices, contact details, and location.",
    "Candidate pilot logo/font assets and contact/service details.",
  ],
} as const;
