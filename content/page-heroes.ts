import type { Locale } from "@/content/i18n";

export const pageHeroCopy = {
  home: {
    en: {
      headingLead: "Software built around your",
      headingAccent: "business needs.",
      description: "We build websites, applications, and business systems that simplify your operations, connect your tools, and help your business grow.",
      capabilities: ["Websites & Applications", "Business Systems", "AI & Integrations"],
      caption: "From customer experiences to everyday operations — software that works together.",
      cta: { label: "Discuss Your Project", href: "/en/contact" },
    },
    ar: {
      headingLead: "برمجيات مصممة",
      headingAccent: "لاحتياجات عملك",
      description: "بنطوّر مواقع وتطبيقات وأنظمة أعمال تساعدك تنظّم شغلك، وتربط أدواتك ببعض، وتسهّل تجربة عملائك.",
      capabilities: ["مواقع وتطبيقات", "أنظمة أعمال", "ذكاء اصطناعي وتكاملات"],
      caption: "من تجربة العميل لإدارة شغلك اليومي، حلول برمجية مترابطة تخدم أعمالك.",
      cta: { label: "ناقش مشروعك معنا", href: "/ar/contact" },
    },
  },
  about: {
    en: {
      headingLead: "We turn business needs into ",
      headingAccent: "practical software.",
      description: "At Rakmyat, we combine business understanding, thoughtful design, and software engineering to build digital solutions around real workflows and the people who use them.",
      cta: { label: "How We Work", href: "/en/how-we-work" },
    },
    ar: {
      headingLead: "بنحوّل احتياجات عملك ",
      headingAccent: "لحلول برمجية عملية",
      description: "في رقميات، بنجمع بين فهم طبيعة الأعمال والتصميم المدروس والهندسة البرمجية، عشان نبني حلول رقمية مناسبة لطريقة شغلك واحتياجات المستخدمين.",
      cta: { label: "اعرف طريقة شغلنا", href: "/ar/how-we-work" },
    },
  },
} satisfies Record<"home" | "about", Record<Locale, object>>;

export function getPageHeroCopy(page: "home", locale: Locale): (typeof pageHeroCopy.home)[Locale];
export function getPageHeroCopy(page: "about", locale: Locale): (typeof pageHeroCopy.about)[Locale];
export function getPageHeroCopy(page: "home" | "about", locale: Locale) {
  return pageHeroCopy[page][locale];
}
