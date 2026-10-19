import type { Locale } from "@/content/i18n";

export type ServiceRecord = {
  id: "web-commerce" | "mobile-apps" | "business-systems" | "ai-automation" | "integrations-apis";
  category: string;
  title: string;
  summary: string;
  customerProblem: string;
  typicalSolution: string;
  capabilities: readonly string[];
  cta: string;
  seoTitle: string;
  seoDescription: string;
};

// Owner-provided BDA project material; describes service areas, not prior delivery claims.
export const servicesByLocale: Record<Locale, readonly ServiceRecord[]> = {
  en: [
    {
      id: "web-commerce", category: "Web & commerce", title: "Websites and e-commerce",
      summary: "Business websites, web applications, and online stores shaped around the customer journey and the work behind it.",
      customerProblem: "A web presence can become disconnected from product information, orders, or the way the team manages content.",
      typicalSolution: "Plan a clear customer experience and connect the web interface with the required content, product, and order workflows.",
      capabilities: ["Company and service websites", "E-commerce storefronts", "Web applications", "Content and product workflows"],
      cta: "Discuss a website project", seoTitle: "Websites & E-commerce | Rakmyat", seoDescription: "Explore Rakmyat's website, web application, and e-commerce service areas.",
    },
    {
      id: "mobile-apps", category: "Mobile", title: "Mobile applications",
      summary: "Mobile experiences connected to the information and operations people need to complete their tasks.",
      customerProblem: "Customers or staff may need a focused mobile path that works with the business's existing data and processes.",
      typicalSolution: "Define the app's users and tasks, then connect the mobile experience to the appropriate application services and data.",
      capabilities: ["Customer applications", "Internal operations apps", "Booking and follow-up flows", "Connections to existing systems"],
      cta: "Discuss a mobile app", seoTitle: "Mobile Applications | Rakmyat", seoDescription: "Explore mobile application concepts for customer and internal business workflows.",
    },
    {
      id: "business-systems", category: "Business systems", title: "Custom business systems",
      summary: "Purpose-built internal systems that bring operational information, tasks, and permissions into a coherent workflow.",
      customerProblem: "Scattered processes and information can make it harder for a team to see what needs attention and who can act.",
      typicalSolution: "Map the workflow and information model, then shape the system around the roles, records, and decisions it supports.",
      capabilities: ["Internal management systems", "Customer and order workflows", "Inventory follow-up", "Roles and reporting"],
      cta: "Discuss a business system", seoTitle: "Custom Business Systems | Rakmyat", seoDescription: "Explore custom software systems for organizing business data and operations.",
    },
    {
      id: "ai-automation", category: "AI & automation", title: "AI solutions and automation",
      summary: "Use AI assistance and automation for defined tasks, with clear information sources, boundaries, and review points.",
      customerProblem: "Repeated work or scattered information may slow a workflow, while unbounded automation can create new risks.",
      typicalSolution: "Identify a specific task, define approved inputs and permissions, and decide where a person reviews or takes over.",
      capabilities: ["Task automation", "AI assistants grounded in selected sources", "Request classification", "Human review and exception paths"],
      cta: "Discuss an automation need", seoTitle: "AI & Automation | Rakmyat", seoDescription: "Explore bounded AI assistance and automation for defined business tasks.",
    },
    {
      id: "integrations-apis", category: "Integrations", title: "Integrations and APIs",
      summary: "Connect the systems and tools a business already uses so information can follow a defined path between them.",
      customerProblem: "Teams may repeat data entry or rely on isolated tools when systems do not share the information a workflow needs.",
      typicalSolution: "Review the systems, available interfaces, data ownership, and failure cases before designing a suitable connection.",
      capabilities: ["API connections", "System-to-system workflows", "Data exchange", "Status and exception handling"],
      cta: "Discuss an integration", seoTitle: "Integrations & APIs | Rakmyat", seoDescription: "Explore API and system integration service areas for connected business workflows.",
    },
  ],
  ar: [
    {
      id: "web-commerce", category: "الويب والتجارة", title: "المواقع والتجارة الإلكترونية",
      summary: "مواقع للشركات وتطبيقات ويب ومتاجر إلكترونية تراعي رحلة العميل والعمليات التي تديرها.",
      customerProblem: "قد ينفصل الموقع عن معلومات المنتجات أو الطلبات أو طريقة إدارة الفريق للمحتوى.",
      typicalSolution: "نخطط تجربة واضحة للعميل ونربط الواجهة بالمحتوى والمنتجات ومسارات الطلب المطلوبة.",
      capabilities: ["مواقع الشركات والخدمات", "المتاجر الإلكترونية", "تطبيقات الويب", "مسارات المحتوى والمنتجات"],
      cta: "ناقش مشروع موقع", seoTitle: "المواقع والتجارة الإلكترونية | رقميات", seoDescription: "تعرّف على مجالات المواقع وتطبيقات الويب والتجارة الإلكترونية لدى رقميات.",
    },
    {
      id: "mobile-apps", category: "تطبيقات الجوال", title: "تطبيقات الجوال",
      summary: "تجارب جوال متصلة بالمعلومات والعمليات التي يحتاج إليها العملاء أو فريق العمل لإنجاز مهامهم.",
      customerProblem: "قد يحتاج العملاء أو الموظفون إلى مسار جوال واضح يعمل مع بيانات المنشأة وعملياتها الحالية.",
      typicalSolution: "نحدد مستخدمي التطبيق ومهامهم، ثم نصل تجربة الجوال بالخدمات والبيانات المناسبة.",
      capabilities: ["تطبيقات العملاء", "تطبيقات العمليات الداخلية", "مسارات الحجز والمتابعة", "الربط بالأنظمة الحالية"],
      cta: "ناقش تطبيقًا للجوال", seoTitle: "تطبيقات الجوال | رقميات", seoDescription: "تعرّف على تطبيقات الجوال الموجهة لمسارات العملاء والعمل الداخلي.",
    },
    {
      id: "business-systems", category: "أنظمة الأعمال", title: "أنظمة أعمال مخصصة",
      summary: "أنظمة داخلية مصممة لتجمع معلومات العمل والمهام والصلاحيات ضمن مسار واضح.",
      customerProblem: "قد تجعل الإجراءات والمعلومات المتفرقة معرفة ما يحتاج إلى متابعة ومن يملك صلاحية التصرف أمرًا أصعب.",
      typicalSolution: "نرسم سير العمل ونموذج المعلومات، ثم نحدد شكل النظام وفق الأدوار والسجلات والقرارات التي يدعمها.",
      capabilities: ["أنظمة الإدارة الداخلية", "مسارات العملاء والطلبات", "متابعة المخزون", "الصلاحيات والتقارير"],
      cta: "ناقش نظام أعمال", seoTitle: "أنظمة أعمال مخصصة | رقميات", seoDescription: "تعرّف على الأنظمة البرمجية المخصصة لتنظيم بيانات الأعمال وعملياتها.",
    },
    {
      id: "ai-automation", category: "الذكاء الاصطناعي والأتمتة", title: "حلول الذكاء الاصطناعي والأتمتة",
      summary: "مساعدة ذكية وأتمتة لمهام محددة، مع مصادر معلومات وحدود ونقاط مراجعة واضحة.",
      customerProblem: "قد يبطئ العمل المتكرر أو تشتت المعلومات سير العمل، بينما قد تخلق الأتمتة غير المحدودة مخاطر جديدة.",
      typicalSolution: "نحدد مهمة بعينها ومدخلاتها وصلاحياتها، ونوضح متى يراجع الشخص النتيجة أو يتولى المهمة.",
      capabilities: ["أتمتة المهام", "مساعدون يعتمدون على مصادر محددة", "تصنيف الطلبات", "مراجعة بشرية ومسارات للاستثناءات"],
      cta: "ناقش احتياجًا للأتمتة", seoTitle: "الذكاء الاصطناعي والأتمتة | رقميات", seoDescription: "تعرّف على مجالات المساعدة الذكية والأتمتة المنضبطة لمهام العمل المحددة.",
    },
    {
      id: "integrations-apis", category: "التكاملات", title: "التكاملات وواجهات API",
      summary: "ربط الأنظمة والأدوات المستخدمة حاليًا كي تنتقل المعلومات بينها وفق مسار محدد.",
      customerProblem: "قد يكرر الفريق إدخال البيانات أو يتعامل مع أدوات منفصلة عندما لا تتبادل الأنظمة المعلومات اللازمة.",
      typicalSolution: "نراجع الأنظمة والواجهات المتاحة وملكية البيانات وحالات التعثر قبل تصميم الربط المناسب.",
      capabilities: ["الربط عبر API", "مسارات بين الأنظمة", "تبادل البيانات", "متابعة الحالة ومعالجة الاستثناءات"],
      cta: "ناقش تكاملًا", seoTitle: "التكاملات وواجهات API | رقميات", seoDescription: "تعرّف على مجالات ربط واجهات API والأنظمة لدعم مسارات عمل مترابطة.",
    },
  ],
};

export function getServices(locale: Locale) {
  return servicesByLocale[locale];
}
