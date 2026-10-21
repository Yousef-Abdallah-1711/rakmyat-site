import type { Locale } from "@/content/i18n";

const icons = [
  "/assets/img/icons/service-capabilities/business-websites.webp",
  "/assets/img/icons/service-capabilities/ecommerce.webp",
  "/assets/img/icons/service-capabilities/mobile-applications.webp",
  "/assets/img/icons/service-capabilities/business-systems.webp",
  "/assets/img/icons/service-capabilities/ai-assistants.webp",
  "/assets/img/icons/service-capabilities/task-automation.webp",
  "/assets/img/icons/service-capabilities/api-integrations.webp",
  "/assets/img/icons/service-capabilities/data-workflows.webp",
];

export function MarketplaceFeaturesSection({ variant, locale = "en" }: { variant: "home" | "services"; locale?: Locale }) {
  const copy = locale === "en" ? {
    heading: variant === "home" ? "Connected software" : "Software",
    accent: variant === "home" ? "capabilities" : "capabilities",
    description: "Service areas from Rakmyat's supplied catalogue, shaped around the requirements of each project.",
    items: ["Business websites", "E-commerce", "Mobile applications", "Custom business systems", "AI assistants", "Task automation", "APIs and integrations", "Data workflows"],
    bodies: ["Present services, information, and customer journeys on the web.", "Support product discovery and online order workflows.", "Help customers or staff complete focused tasks on mobile.", "Bring operational records, roles, and tasks into one system.", "Use selected information to assist with a defined business task.", "Coordinate repeated steps with clear review and exception paths.", "Connect tools through available interfaces and APIs.", "Organize the information that connected workflows rely on."],
    sectionClass: variant === "home" ? "features section-padding style-5 bg-gray5" : "features section-padding pt-50 style-5",
  } : {
    heading: variant === "home" ? "قدرات برمجية" : "مجالات",
    accent: variant === "home" ? "مترابطة" : "الخدمات",
    description: "مجالات واردة في قائمة خدمات رقميات المقدمة، ويُحدد نطاق كل مشروع وفق احتياجاته.",
    items: ["مواقع الشركات", "التجارة الإلكترونية", "تطبيقات الجوال", "أنظمة أعمال مخصصة", "مساعدون بالذكاء الاصطناعي", "أتمتة المهام", "واجهات API والتكامل", "مسارات البيانات"],
    bodies: ["عرض الخدمات والمعلومات ومسارات العملاء عبر الويب.", "دعم استكشاف المنتجات ومسارات الطلب الإلكتروني.", "مساعدة العملاء أو الموظفين على إنجاز مهام محددة عبر الجوال.", "جمع سجلات العمليات والأدوار والمهام ضمن نظام واحد.", "استخدام معلومات محددة للمساعدة في مهمة عمل واضحة.", "تنسيق الخطوات المتكررة مع مراجعة ومعالجة للاستثناءات.", "ربط الأدوات عبر الواجهات وواجهات API المتاحة.", "تنظيم المعلومات التي تعتمد عليها مسارات العمل المترابطة."],
    sectionClass: variant === "home" ? "features section-padding style-5 bg-gray5" : "features section-padding pt-50 style-5",
  };
  return (
    <section className={copy.sectionClass}>
      <div className="container"><div className="row justify-content-center"><div className="col-lg-8"><div className="section-head text-center mb-60 style-5"><h2 className="mb-20">{` ${copy.heading} `}<span>{` ${copy.accent} `}</span></h2><p>{copy.description}</p></div></div></div>
        <div className="content"><div className="row">{copy.items.map((title, index) => <div className="col-lg-3 col-sm-6" key={title}><div className={`features-card ${index < 4 ? "mb-30 style-5" : index < 7 ? "mb-30 mb-lg-0 style-5" : "style-5"}`}><div className="icon"><img src={icons[index]} alt="" /></div><div className="info"><h3 className="card-title">{title}</h3><p className="text">{copy.bodies[index]}</p></div></div></div>)}</div></div>
      </div>
    </section>
  );
}
