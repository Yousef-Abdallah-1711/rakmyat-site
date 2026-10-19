import type { Locale } from "@/content/i18n";

export const homePageContentByLocale = {
  en: {
    hero: {
      headingLead: "Custom software that moves your business ",
      headingAccent: "forward",
      descriptionLead: "Websites, applications, business systems, AI, and integrations. ",
      descriptionTail: "We shape software around real workflows and the people who use them.",
      emailPlaceholder: "Email address",
      cta: { label: "Discuss a project", href: "/en/contact" },
    },
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
    hero: {
      headingLead: "حلول برمجية تدفع ",
      headingAccent: "أعمالك إلى الأمام",
      descriptionLead: "مواقع وتطبيقات وأنظمة أعمال وحلول للذكاء الاصطناعي والتكامل. ",
      descriptionTail: "نصمم البرمجيات حول سير العمل الفعلي واحتياجات مستخدميها.",
      emailPlaceholder: "البريد الإلكتروني",
      cta: { label: "ناقش مشروعك", href: "/ar/contact" },
    },
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
