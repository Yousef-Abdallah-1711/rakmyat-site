import type { Locale } from "@/content/i18n";

const icons = Array.from({ length: 8 }, (_, index) => `/assets/img/icons/features/${index + 1}.png`);

export function MarketplaceFeaturesSection({ variant, locale = "en" }: { variant: "home" | "services"; locale?: Locale }) {
  const copy = locale === "en" ? {
    heading: variant === "home" ? "Topics to" : "Project",
    accent: variant === "home" ? "discuss" : "discussion",
    description: variant === "home" ? "Use these prompts to explain the context and goals of a software project." : "Specific service offerings are pending confirmation. These are questions for an initial discussion.",
    items: ["Business need", "Current workflow", "Project scope", "User experience", "Software requirements", "Data and systems", "Delivery questions", "Next steps"],
    body: "A prompt to help describe the project context and open questions.",
    sectionClass: variant === "home" ? "features section-padding style-5 bg-gray5" : "features section-padding pt-50 style-5",
  } : {
    heading: variant === "home" ? "موضوعات" : "نقاش",
    accent: variant === "home" ? "للنقاش" : "المشروع",
    description: variant === "home" ? "استخدم هذه النقاط لشرح سياق المشروع البرمجي وأهدافه." : "تنتظر الخدمات المحددة تأكيد الشركة. هذه أسئلة لمناقشة أولية.",
    items: ["احتياج العمل", "سير العمل الحالي", "نطاق المشروع", "تجربة المستخدم", "متطلبات البرمجيات", "البيانات والأنظمة", "أسئلة التنفيذ", "الخطوات التالية"],
    body: "نقطة تساعد في وصف سياق المشروع والأسئلة المفتوحة.",
    sectionClass: variant === "home" ? "features section-padding style-5 bg-gray5" : "features section-padding pt-50 style-5",
  };
  return (
    <section className={copy.sectionClass}>
      <div className="container"><div className="row justify-content-center"><div className="col-lg-8"><div className="section-head text-center mb-60 style-5"><h2 className="mb-20">{` ${copy.heading} `}<span>{` ${copy.accent} `}</span></h2><p>{copy.description}</p></div></div></div>
        <div className="content"><div className="row">{copy.items.map((title, index) => <div className="col-lg-3 col-sm-6" key={title}><div className={`features-card ${index < 4 ? "mb-30 style-5" : index < 7 ? "mb-30 mb-lg-0 style-5" : "style-5"}`}><div className="icon"><img src={icons[index]} alt="" /></div><div className="info"><h5 className="card-title">{title}</h5><p className="text">{copy.body}</p></div></div></div>)}</div></div>
      </div>
    </section>
  );
}
