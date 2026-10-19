import type { Locale } from "@/content/i18n";

const topics = {
  en: ["Business need", "Project scope", "Requirements", "Workflow", "Questions", "Next steps"],
  ar: ["احتياج العمل", "نطاق المشروع", "المتطلبات", "سير العمل", "الأسئلة", "الخطوات التالية"],
} as const;

export function ClientLogosSection({ variant, locale = "en" }: { variant: "home" | "about"; locale?: Locale }) {
  const heading = locale === "en"
    ? (variant === "home" ? "Topics for" : "Company")
    : (variant === "home" ? "موضوعات" : "معلومات");
  const accent = locale === "en"
    ? (variant === "home" ? "discussion" : "overview")
    : (variant === "home" ? "للنقاش" : "الشركة");
  const description = locale === "en"
    ? "No customer or partner relationships are represented here."
    : "لا تعرض هذه المساحة علاقات مع عملاء أو شركاء.";
  const rowItems = topics[locale];
  return (
    <section className={variant === "home" ? "clients style-5 pb-100" : "clients section-padding style-5"}>
      <div className="section-head text-center mb-40 style-5">
        <h2 className="mb-20">{` ${heading} `}<span>{` ${accent} `}</span></h2>
        <p>{description}</p>
      </div>
      <div className="content">
        {[0, 1].map((row) => (
          <div className="clients-slider5" dir={row === 1 ? "rtl" : undefined} key={row}>
            <div className="swiper-container"><div className="swiper-wrapper">
              {rowItems.map((label, index) => (
                <div className="swiper-slide" key={`${row}-${index}`}>
                  <div className="img neutral-logo" aria-hidden="true"><span>{label}</span></div>
                </div>
              ))}
            </div></div>
          </div>
        ))}
      </div>
    </section>
  );
}
