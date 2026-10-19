import type { Locale } from "@/content/i18n";

const capabilityLabels = {
  en: ["Web & commerce", "Mobile applications", "Business systems", "AI & automation", "Integrations & APIs"],
  ar: ["الويب والتجارة", "تطبيقات الجوال", "أنظمة الأعمال", "الذكاء الاصطناعي والأتمتة", "التكاملات وواجهات API"],
} as const;

export function ClientLogosSection({ locale = "en" }: { locale?: Locale }) {
  const labels = capabilityLabels[locale];
  const copy = locale === "en"
    ? { heading: "Company", accent: "focus", description: "Our work spans customer-facing experiences and the software systems behind them." }
    : { heading: "مجالات", accent: "العمل", description: "يمتد العمل من تجارب العملاء إلى الأنظمة البرمجية التي تدعمها." };
  return (
    <section className="clients section-padding style-5">
      <div className="section-head text-center mb-40 style-5"><h2 className="mb-20">{copy.heading} <span>{copy.accent}</span></h2><p>{copy.description}</p></div>
      <div className="content">
        {[0, 1].map((row) => <div className="clients-slider5" dir={row === 1 ? "rtl" : undefined} key={row} aria-hidden={row === 1 || undefined}>
          <div className="swiper-container"><div className="swiper-wrapper">{labels.map((label, index) => <div className="swiper-slide" key={`${row}-${index}`}><div className="img neutral-logo"><span>{label}</span></div></div>)}</div></div>
        </div>)}
      </div>
    </section>
  );
}
