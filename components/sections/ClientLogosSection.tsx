import type { Locale } from "@/content/i18n";

const capabilityLabels = {
  en: ["Web & commerce", "Mobile applications", "Business systems", "AI & automation", "Integrations & APIs"],
  ar: ["الويب والتجارة", "تطبيقات الجوال", "أنظمة الأعمال", "الذكاء الاصطناعي والأتمتة", "التكاملات وواجهات API"],
} as const;

export function ClientLogosSection({ variant, locale = "en" }: { variant: "home" | "about"; locale?: Locale }) {
  const copy = locale === "en"
    ? { heading: variant === "home" ? "One software" : "Company focus", accent: variant === "home" ? "practice" : "areas", description: "Service areas from Rakmyat's supplied catalogue; no client or partner relationships are implied." }
    : { heading: variant === "home" ? "مجالات" : "مجالات", accent: variant === "home" ? "برمجية مترابطة" : "التركيز", description: "مجالات واردة في قائمة خدمات رقميات المقدمة؛ ولا تشير إلى علاقات مع عملاء أو شركاء." };
  const labels = capabilityLabels[locale];
  return (
    <section className={variant === "home" ? "clients style-5 pb-100" : "clients section-padding style-5"}>
      <div className="section-head text-center mb-40 style-5"><h2 className="mb-20">{` ${copy.heading} `}<span>{` ${copy.accent} `}</span></h2><p>{copy.description}</p></div>
      <div className="content">
        {[0, 1].map((row) => <div className="clients-slider5" dir={row === 1 ? "rtl" : undefined} key={row}>
          <div className="swiper-container"><div className="swiper-wrapper">{labels.map((label, index) => <div className="swiper-slide" key={`${row}-${index}`}><div className="img neutral-logo"><span>{label}</span></div></div>)}</div></div>
        </div>)}
      </div>
    </section>
  );
}
