import type { Locale } from "@/content/i18n";

export type ScopeArea = { id: "web" | "mobile" | "systems"; name: string };
export type ScopeRow = { id: string; label: string; values: Record<ScopeArea["id"], string> };

const scopeContent = {
  en: {
    heading: "Define the project", accent: "scope",
    description: "These are service areas, not packaged plans or published prices. Project scope, timing, and cost are determined for each inquiry.",
    note: "Service area overview", planCta: "Discuss this service area",
    plans: [
      { id: "web", name: "Web & commerce" },
      { id: "mobile", name: "Mobile applications" },
      { id: "systems", name: "Business systems" },
    ] as const,
    rows: [
      { id: "experience", label: "Primary experience", values: { web: "Customer-facing web", mobile: "Focused mobile tasks", systems: "Internal team workflows" } },
      { id: "information", label: "Information", values: { web: "Content, products, orders", mobile: "Users and app data", systems: "Records and permissions" } },
      { id: "workflow", label: "Workflow", values: { web: "Customer journeys", mobile: "Mobile task paths", systems: "Operational processes" } },
      { id: "connections", label: "Connections", values: { web: "Commerce tools", mobile: "Business services", systems: "Systems and APIs" } },
    ] as const,
    value: "Discuss per project",
  },
  ar: {
    heading: "حدد نطاق", accent: "المشروع",
    description: "هذه مجالات خدمة وليست باقات أو أسعارًا منشورة. يتحدد نطاق المشروع وتوقيته وتكلفته بحسب كل استفسار.",
    note: "نظرة على مجالات الخدمة", planCta: "ناقش مجال الخدمة",
    plans: [
      { id: "web", name: "الويب والتجارة" },
      { id: "mobile", name: "تطبيقات الجوال" },
      { id: "systems", name: "أنظمة الأعمال" },
    ] as const,
    rows: [
      { id: "experience", label: "التجربة الأساسية", values: { web: "تجربة الويب للعميل", mobile: "مهام جوال محددة", systems: "مسارات عمل الفريق" } },
      { id: "information", label: "المعلومات", values: { web: "المحتوى والمنتجات والطلبات", mobile: "المستخدمون وبيانات التطبيق", systems: "السجلات والصلاحيات" } },
      { id: "workflow", label: "سير العمل", values: { web: "مسارات العملاء", mobile: "مهام عبر الجوال", systems: "العمليات الداخلية" } },
      { id: "connections", label: "الترابط", values: { web: "أدوات التجارة", mobile: "خدمات الأعمال", systems: "الأنظمة وواجهات API" } },
    ] as const,
    value: "يُناقش لكل مشروع",
  },
} as const;

export function getPricingCopy(locale: Locale) {
  return scopeContent[locale];
}
