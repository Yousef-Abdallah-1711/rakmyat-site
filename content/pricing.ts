import type { Locale } from "@/content/i18n";

export type PricingPlan = { id: "basic" | "premium" | "ultimate"; name: string; };
export type PricingFeature = { id: string; label: string; };

export const pricingCopy = {
  en: {
    heading: "Discuss your",
    accent: "project",
    description: "No fixed rates are published. Scope and pricing need to be discussed for each project.",
    note: "Project-specific discussion",
    planCta: "Discuss a project",
    plans: ["Start a conversation", "Discuss the scope", "Review next steps"],
    rows: ["Project requirements", "Timing", "Scope", "Budget"],
    value: "Discuss together",
  },
  ar: {
    heading: "ناقش",
    accent: "مشروعك",
    description: "لا توجد أسعار ثابتة منشورة. يجب مناقشة النطاق والتكلفة لكل مشروع.",
    note: "مناقشة بحسب المشروع",
    planCta: "ناقش مشروعك",
    plans: ["ابدأ النقاش", "ناقش النطاق", "راجع الخطوات التالية"],
    rows: ["متطلبات المشروع", "الجدول الزمني", "النطاق", "الميزانية"],
    value: "تُناقش معًا",
  },
} as const;

export const pricingPlans: PricingPlan[] = [
  { id: "basic", name: "Start a conversation" },
  { id: "premium", name: "Discuss the scope" },
  { id: "ultimate", name: "Review next steps" },
];

export function getPricingCopy(locale: Locale) {
  return pricingCopy[locale];
}
