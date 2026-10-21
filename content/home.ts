import type { Locale } from "@/content/i18n";

export const homePageContentByLocale = {
  en: {
    download: {
      headingLead: "Let's build something that works ",
      headingAccent: "for your business",
      headingTail: " with Rakmyat.",
      actions: [
        { label: "Discuss a project", href: "/en/contact", icon: "bi bi-arrow-right" },
        { label: "Explore services", href: "/en/services", icon: "bi bi-arrow-right" },
      ],
    },
  },
  ar: {
    download: {
      headingLead: "لنبنِ حلًا يخدم ",
      headingAccent: "عملك",
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
