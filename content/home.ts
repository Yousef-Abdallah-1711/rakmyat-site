import type { Locale } from "@/content/i18n";

export const homePageContentByLocale = {
  en: {
    hero: {
      headingLead: "Software solutions built around your ",
      headingAccent: "business",
      descriptionLead: "Rakmyat is a software house. ",
      descriptionTail: "Tell us what your business needs from software.",
      emailPlaceholder: "Email address",
      cta: { label: "Discuss a project", href: "/en/contact" },
    },
    download: {
      headingLead: "Have a software project in mind? ",
      headingAccent: "Discuss it",
      headingTail: " with Rakmyat.",
      actions: [
        { label: "Discuss a project", href: "/en/contact", icon: "bi bi-arrow-right" },
        { label: "Explore services", href: "/en/services", icon: "bi bi-arrow-right" },
      ],
    },
  },
  ar: {
    hero: {
      headingLead: "حلول برمجية مصممة لاحتياجات ",
      headingAccent: "أعمالك",
      descriptionLead: "رقميات شركة برمجيات. ",
      descriptionTail: "أخبرنا بما يحتاجه عملك من البرمجيات.",
      emailPlaceholder: "البريد الإلكتروني",
      cta: { label: "ناقش مشروعك", href: "/ar/contact" },
    },
    download: {
      headingLead: "هل لديك فكرة لمشروع برمجي؟ ",
      headingAccent: "ناقشها",
      headingTail: " مع رقميات.",
      actions: [
        { label: "ناقش مشروعك", href: "/ar/contact", icon: "bi bi-arrow-left" },
        { label: "استكشف الخدمات", href: "/ar/services", icon: "bi bi-arrow-left" },
      ],
    },
  },
} as const;

export function getHomeContent(locale: Locale) {
  return homePageContentByLocale[locale];
}
