import type { Locale } from "@/content/i18n";

export type ProjectCategory =
  | "education-discovery"
  | "ecommerce"
  | "education-platform"
  | "workshop-platform"
  | "learning-platform"
  | "business-website"
  | "product-catalog"
  | "business-systems"
  | "automation-integration";

export type ProjectImage = {
  src: string;
  alt: Record<Locale, string>;
  role: "cover" | "desktop" | "mobile" | "gallery";
  width: number;
  height: number;
  presentation: "landscape" | "tall-preview" | "mobile";
};

export type LocalizedProject = {
  title: string;
  category: string;
  summary: string;
  overview: string;
  challenge: string;
  solution: string;
  features: readonly string[];
  projectType: string;
  technologies: readonly string[];
  seoTitle: string;
  seoDescription: string;
  galleryHeading: string;
  imageAlts: readonly string[];
};

export type PortfolioProject = {
  slug: string;
  publicationState: "published";
  featured: boolean;
  categoryId: ProjectCategory;
  locales: Record<Locale, LocalizedProject>;
  assets: {
    cover: string;
    coverKind: "real-screenshot" | "conceptual-visual";
    coverAlt: Record<Locale, string>;
    mobileCover?: string;
    gallery: readonly ProjectImage[];
  };
  links: { publicUrl?: string };
  relatedProjects: readonly string[];
  evidence: {
    ownerAttribution: "confirmed-by-owner";
    description: "documented" | "limited-to-project-name";
    publicUrl: "observed-in-source-review" | "not-provided";
    screenshotSource: "owner-supplied-public-site-captures" | "none";
    thirdPartyContentReview: "confirm-before-production" | "not-applicable";
    notes: string;
  };
};

const asset = (slug: string, file: string) =>
  `/assets/rakmyat/portfolio/${slug}/${file}`;

type ProjectImageInput = Omit<ProjectImage, "width" | "height" | "presentation">;
type PortfolioProjectInput = Omit<PortfolioProject, "assets"> & {
  assets: Omit<PortfolioProject["assets"], "gallery"> & {
    gallery: readonly ProjectImageInput[];
  };
};

const imagePresentation: Record<
  string,
  Pick<ProjectImage, "width" | "height" | "presentation">
> = {
  [asset("schooly", "schools-desktop.webp")]: { width: 1425, height: 5727, presentation: "tall-preview" },
  [asset("schooly", "compare-desktop.webp")]: { width: 1425, height: 1195, presentation: "landscape" },
  [asset("schooly", "school-detail-desktop.webp")]: { width: 1425, height: 4182, presentation: "tall-preview" },
  [asset("schooly", "hero-arabic-desktop.webp")]: { width: 1440, height: 900, presentation: "landscape" },
  [asset("schooly", "school-detail-mobile.webp")]: { width: 390, height: 844, presentation: "mobile" },
  [asset("nora-store", "homepage-full.webp")]: { width: 1425, height: 12106, presentation: "tall-preview" },
  [asset("nora-store", "product-desktop.webp")]: { width: 1425, height: 2964, presentation: "tall-preview" },
  [asset("nora-store", "product-mobile.webp")]: { width: 390, height: 844, presentation: "mobile" },
  [asset("edtech-platform", "course-detail-desktop.webp")]: { width: 1425, height: 3623, presentation: "tall-preview" },
  [asset("edtech-platform", "course-detail-mobile.webp")]: { width: 390, height: 844, presentation: "mobile" },
  [asset("live-workshop", "feature-mobile.webp")]: { width: 390, height: 844, presentation: "mobile" },
  [asset("live-workshop", "curriculum-desktop.webp")]: { width: 1440, height: 900, presentation: "landscape" },
  [asset("eduflow", "hero-desktop.webp")]: { width: 1440, height: 900, presentation: "landscape" },
  [asset("eduflow", "feature-desktop.webp")]: { width: 1434, height: 4466, presentation: "tall-preview" },
  [asset("eduflow", "feature-mobile.webp")]: { width: 390, height: 844, presentation: "mobile" },
  [asset("legal-translation", "homepage-full.webp")]: { width: 1425, height: 7355, presentation: "tall-preview" },
  [asset("legal-translation", "homepage-mobile-full.webp")]: { width: 375, height: 13474, presentation: "mobile" },
  [asset("legal-translation", "hero-desktop.webp")]: { width: 1440, height: 900, presentation: "landscape" },
  [asset("gc-hardware", "homepage-full.webp")]: { width: 1425, height: 10065, presentation: "tall-preview" },
  [asset("gc-hardware", "product-desktop.webp")]: { width: 1425, height: 9089, presentation: "tall-preview" },
  [asset("gc-hardware", "product-mobile.webp")]: { width: 390, height: 844, presentation: "mobile" },
};

const project = (record: PortfolioProjectInput): PortfolioProject => ({
  ...record,
  assets: {
    ...record.assets,
    gallery: record.assets.gallery.map((image) => {
      const presentation = imagePresentation[image.src];
      if (!presentation) throw new Error(`Missing presentation metadata for ${image.src}`);
      return { ...image, ...presentation };
    }),
  },
});

export const portfolioProjects: readonly PortfolioProject[] = [
  project({
    slug: "schooly",
    publicationState: "published",
    featured: true,
    categoryId: "education-discovery",
    locales: {
      en: {
        title: "Schooly",
        category: "Education · School discovery",
        summary:
          "Families can narrow school choices by emirate and curriculum, review public school profiles, and compare options in Arabic or English.",
        overview:
          "Schooly brings school search, school profiles, and comparison into one public web experience, with English and Arabic interfaces.",
        challenge:
          "The public experience organizes school discovery across emirates and gives families ways to narrow and compare their options.",
        solution:
          "The website presents school listings, curriculum and location filters, school detail pages, and a comparison workspace.",
        features: [
          "School discovery by emirate",
          "Curriculum and school filters",
          "School profiles with public information",
          "Save and compare controls",
        ],
        projectType: "Bilingual web platform",
        technologies: [],
        seoTitle: "Schooly — School Discovery Platform | Rakmyat",
        seoDescription:
          "Explore Schooly, a bilingual school-discovery platform where families narrow choices by emirate and curriculum, review profiles, and compare options.",
        galleryHeading: "Explore the school journey",
        imageAlts: [
          "School directory with school discovery filters",
          "School comparison workspace",
          "School profile with public information",
          "Arabic Schooly homepage",
          "School profile displayed on mobile",
        ],
      },
      ar: {
        title: "Schooly",
        category: "التعليم · استكشاف المدارس",
        summary:
          "تساعد الأسر على تضييق خيارات المدارس بحسب الإمارة والمنهج، ثم مراجعة الملفات العامة ومقارنة البدائل بالعربية أو الإنجليزية.",
        overview:
          "يجمع Schooly البحث عن المدارس وصفحاتها ومقارنتها ضمن تجربة ويب عامة باللغتين العربية والإنجليزية.",
        challenge:
          "تنظم التجربة استكشاف المدارس بحسب الإمارة، وتتيح للأسر تضييق الخيارات ومقارنتها.",
        solution:
          "يعرض الموقع قوائم المدارس وفلاتر المنهج والموقع وصفحات التفاصيل ومساحة للمقارنة.",
        features: [
          "استكشاف المدارس بحسب الإمارة",
          "فلاتر المناهج والمدارس",
          "صفحات المدارس بمعلوماتها العامة",
          "أدوات الحفظ والمقارنة",
        ],
        projectType: "منصة ويب ثنائية اللغة",
        technologies: [],
        seoTitle: "Schooly — منصة استكشاف المدارس | رقميات",
        seoDescription:
          "تعرّف على Schooly، منصة ثنائية اللغة تساعد الأسر على تضييق خيارات المدارس بحسب الإمارة والمنهج، ومراجعة الملفات ومقارنة البدائل.",
        galleryHeading: "تعرّف على رحلة استكشاف المدارس",
        imageAlts: [
          "دليل المدارس مع فلاتر البحث والاستكشاف",
          "مساحة مقارنة المدارس",
          "صفحة مدرسة بمعلوماتها العامة",
          "الصفحة الرئيسية لـ Schooly باللغة العربية",
          "صفحة مدرسة معروضة على الجوال",
        ],
      },
    },
    assets: {
      cover: asset("schooly", "hero-desktop.webp"),
      coverKind: "real-screenshot",
      coverAlt: {
        en: "Schooly English school-discovery homepage",
        ar: "الصفحة الرئيسية لـ Schooly لاستكشاف المدارس باللغة الإنجليزية",
      },
      mobileCover: asset("schooly", "hero-mobile.webp"),
      gallery: [
        { src: asset("schooly", "schools-desktop.webp"), alt: { en: "School directory with school discovery filters", ar: "دليل المدارس مع فلاتر البحث والاستكشاف" }, role: "gallery" },
        { src: asset("schooly", "compare-desktop.webp"), alt: { en: "School comparison workspace", ar: "مساحة مقارنة المدارس" }, role: "gallery" },
        { src: asset("schooly", "school-detail-desktop.webp"), alt: { en: "School profile with public information", ar: "صفحة مدرسة بمعلوماتها العامة" }, role: "gallery" },
        { src: asset("schooly", "hero-arabic-desktop.webp"), alt: { en: "Schooly Arabic homepage", ar: "الصفحة الرئيسية لـ Schooly باللغة العربية" }, role: "gallery" },
        { src: asset("schooly", "school-detail-mobile.webp"), alt: { en: "School profile displayed on mobile", ar: "صفحة مدرسة معروضة على الجوال" }, role: "mobile" },
      ],
    },
    links: { publicUrl: "https://schooly.ae/" },
    relatedProjects: ["edtech-platform", "eduflow", "nora-store"],
    evidence: {
      ownerAttribution: "confirmed-by-owner",
      description: "documented",
      publicUrl: "observed-in-source-review",
      screenshotSource: "owner-supplied-public-site-captures",
      thirdPartyContentReview: "confirm-before-production",
      notes: "Bilingual public pages, school discovery, school profiles, and comparison controls were documented in the supplied source review. Repository implementation and framework were not verified. Public school information appears in screenshots.",
    },
  }),
  project({
    slug: "nora-store",
    publicationState: "published",
    featured: true,
    categoryId: "ecommerce",
    locales: {
      en: {
        title: "Nora Store",
        category: "E-commerce · Beauty and personal care",
        summary:
          "An Arabic beauty and personal-care storefront brings category browsing, product details, and visible cart actions together.",
        overview:
          "The public store organizes beauty and personal-care items into categories, product pages, and visible shopping actions.",
        challenge:
          "The store experience brings product discovery and product information together for Arabic-speaking shoppers.",
        solution:
          "The public storefront presents product categories, product details, and add-to-cart and purchase controls.",
        features: [
          "Arabic storefront navigation",
          "Product categories and listings",
          "Product detail pages",
          "Visible cart and purchase controls",
        ],
        projectType: "E-commerce website",
        technologies: ["WordPress", "WooCommerce", "Elementor"],
        seoTitle: "Nora Store — E-commerce Website | Rakmyat",
        seoDescription:
          "Explore Nora Store, an Arabic beauty and personal-care e-commerce experience with category browsing, product details, and a visible shopping cart.",
        galleryHeading: "Browse the storefront",
        imageAlts: [
          "Nora Store Arabic storefront homepage",
          "Beauty product detail page",
          "Product and category browsing on mobile",
        ],
      },
      ar: {
        title: "متجر نورا",
        category: "التجارة الإلكترونية · الجمال والعناية الشخصية",
        summary:
          "يجمع متجر عربي لمنتجات الجمال والعناية الشخصية بين تصفح التصنيفات وتفاصيل المنتجات وخيارات السلة الظاهرة.",
        overview:
          "ينظم المتجر العام منتجات الجمال والعناية ضمن تصنيفات وصفحات تفصيلية مع خيارات التسوق الظاهرة.",
        challenge:
          "تجمع تجربة المتجر بين استكشاف المنتجات ومعلوماتها للمتسوقين باللغة العربية.",
        solution:
          "يعرض المتجر التصنيفات والمنتجات وتفاصيلها، إلى جانب أزرار الإضافة إلى السلة والشراء.",
        features: [
          "واجهة متجر باللغة العربية",
          "تصنيفات وقوائم المنتجات",
          "صفحات تفاصيل المنتجات",
          "خيارات ظاهرة للسلة والشراء",
        ],
        projectType: "متجر إلكتروني",
        technologies: ["WordPress", "WooCommerce", "Elementor"],
        seoTitle: "متجر نورا — موقع للتجارة الإلكترونية | رقميات",
        seoDescription:
          "تعرّف على متجر نورا العربي لمنتجات الجمال والعناية الشخصية، الذي يجمع تصفح التصنيفات وتفاصيل المنتجات وسلة مشتريات ظاهرة.",
        galleryHeading: "استكشف المتجر",
        imageAlts: [
          "الصفحة الرئيسية لمتجر نورا باللغة العربية",
          "صفحة تفاصيل منتج للعناية والجمال",
          "تصفح المنتجات والتصنيفات على الجوال",
        ],
      },
    },
    assets: {
      cover: asset("nora-store", "hero-desktop.webp"),
      coverKind: "real-screenshot",
      coverAlt: { en: "Nora Store Arabic e-commerce homepage", ar: "الصفحة الرئيسية لمتجر نورا الإلكتروني باللغة العربية" },
      mobileCover: asset("nora-store", "hero-mobile.webp"),
      gallery: [
        { src: asset("nora-store", "homepage-full.webp"), alt: { en: "Nora Store storefront and product categories", ar: "واجهة متجر نورا وتصنيفات المنتجات" }, role: "gallery" },
        { src: asset("nora-store", "product-desktop.webp"), alt: { en: "Nora Store product detail page", ar: "صفحة تفاصيل منتج في متجر نورا" }, role: "desktop" },
        { src: asset("nora-store", "product-mobile.webp"), alt: { en: "Nora Store product page on mobile", ar: "صفحة منتج من متجر نورا على الجوال" }, role: "mobile" },
      ],
    },
    links: { publicUrl: "https://nora-store.online/" },
    relatedProjects: ["gc-hardware", "schooly", "eduflow"],
    evidence: {
      ownerAttribution: "confirmed-by-owner",
      description: "documented",
      publicUrl: "observed-in-source-review",
      screenshotSource: "owner-supplied-public-site-captures",
      thirdPartyContentReview: "confirm-before-production",
      notes: "Arabic public storefront and product pages were reviewed. WordPress, WooCommerce, and Elementor are documented in the source review. Screenshots include the storefront brand and product imagery; clear third-party permissions before external production use.",
    },
  }),
  project({
    slug: "edtech-platform",
    publicationState: "published",
    featured: true,
    categoryId: "education-platform",
    locales: {
      en: {
        title: "Nama Academy",
        category: "Education · Professional training",
        summary:
          "A public training catalog brings professional programs, course outlines, trainer information, and events into one place.",
        overview:
          "Nama Academy presents training programs and course information through a public Arabic-language web experience.",
        challenge:
          "Visitors need a clear way to browse programs, understand course content, and learn about instructors and events.",
        solution:
          "The site organizes programs, course details, trainer and event information, and an interest form.",
        features: [
          "Program and subject browsing",
          "Course pages with objectives and outlines",
          "Trainer and event information",
          "Course interest form",
        ],
        projectType: "Professional training website",
        technologies: ["Nuxt runtime observed on public site"],
        seoTitle: "Nama Academy — Professional Training Website | Rakmyat",
        seoDescription:
          "Explore Nama Academy, a professional-training website bringing programs, course outlines, trainer information, and events together in one place.",
        galleryHeading: "Explore the learning experience",
        imageAlts: [
          "Nama Academy Arabic training homepage",
          "Professional course detail page",
          "Course information displayed on mobile",
        ],
      },
      ar: {
        title: "أكاديمية نماء",
        category: "التعليم · التدريب المهني",
        summary:
          "يجمع دليل تدريبي عام البرامج المهنية ومحاور الدورات ومعلومات المدربين والفعاليات في مكان واحد.",
        overview:
          "تعرض أكاديمية نماء البرامج التدريبية ومعلومات الدورات عبر تجربة ويب عامة باللغة العربية.",
        challenge:
          "يحتاج الزائر إلى طريقة واضحة لتصفح البرامج ومعرفة محتوى الدورات والمدربين والفعاليات.",
        solution:
          "ينظم الموقع البرامج وتفاصيل الدورات ومعلومات المدربين والفعاليات ونموذج الاهتمام بالدورات.",
        features: [
          "تصفح البرامج والتخصصات",
          "صفحات الدورات وأهدافها ومحاورها",
          "معلومات المدربين والفعاليات",
          "نموذج للاهتمام بالدورات",
        ],
        projectType: "موقع للتدريب المهني",
        technologies: ["لوحظ تشغيل الموقع باستخدام Nuxt"],
        seoTitle: "أكاديمية نماء — موقع للتدريب المهني | رقميات",
        seoDescription:
          "تعرّف على موقع أكاديمية نماء التدريبي، الذي يجمع البرامج المهنية ومحاور الدورات ومعلومات المدربين والفعاليات في مكان واحد.",
        galleryHeading: "استكشف تجربة التعلم",
        imageAlts: [
          "الصفحة الرئيسية لأكاديمية نماء باللغة العربية",
          "صفحة تفاصيل دورة مهنية",
          "معلومات الدورة معروضة على الجوال",
        ],
      },
    },
    assets: {
      cover: asset("edtech-platform", "hero-desktop.webp"),
      coverKind: "real-screenshot",
      coverAlt: { en: "Nama Academy Arabic training homepage", ar: "الصفحة الرئيسية لأكاديمية نماء باللغة العربية" },
      mobileCover: asset("edtech-platform", "hero-mobile.webp"),
      gallery: [
        { src: asset("edtech-platform", "course-detail-desktop.webp"), alt: { en: "Nama Academy course detail page", ar: "صفحة تفاصيل دورة في أكاديمية نماء" }, role: "desktop" },
      ],
    },
    links: { publicUrl: "https://edu-tech.youesf-abdallah.online/" },
    relatedProjects: ["schooly", "eduflow", "live-workshop"],
    evidence: {
      ownerAttribution: "confirmed-by-owner",
      description: "documented",
      publicUrl: "observed-in-source-review",
      screenshotSource: "owner-supplied-public-site-captures",
      thirdPartyContentReview: "confirm-before-production",
      notes: "The public site showed programs, courses, events, trainer pages, and an interest form. Nuxt was observed at runtime; the source implementation is unavailable, so it is described as an observed runtime rather than a confirmed development stack. Screenshots include public brand and photography.",
    },
  }),
  project({
    slug: "live-workshop",
    publicationState: "published",
    featured: false,
    categoryId: "workshop-platform",
    locales: {
      en: {
        title: "From Idea to Production",
        category: "Education · Workshop platform",
        summary:
          "A workshop landing page introduces the course through a ten-session outline, published pricing, and enrollment information.",
        overview:
          "The public site introduces the workshop, outlines its sessions, and provides public pricing and enrollment information.",
        challenge:
          "A learning offer needs a clear presentation of its subject, course structure, and the path to enroll.",
        solution:
          "The site combines a course landing page with a session outline, pricing content, and a registration call to action.",
        features: [
          "Workshop overview and course details",
          "Session-by-session curriculum",
          "Public pricing section",
          "Enrollment call to action",
        ],
        projectType: "Workshop website",
        technologies: [],
        seoTitle: "From Idea to Production — Workshop Website | Rakmyat",
        seoDescription:
          "Explore From Idea to Production, a workshop website presenting a ten-session course outline alongside published pricing and enrollment information.",
        galleryHeading: "A closer look at the workshop site",
        imageAlts: [
          "From Idea to Production workshop site section",
          "Workshop content shown on mobile",
        ],
      },
      ar: {
        title: "من الفكرة إلى الإنتاج",
        category: "التعليم · منصة ورش العمل",
        summary:
          "تقدم صفحة الورشة الدورة عبر منهج من عشر جلسات ومعلومات الأسعار والتسجيل المنشورة.",
        overview:
          "يقدم الموقع العام الورشة ومحاور جلساتها ومعلومات الأسعار والتسجيل.",
        challenge:
          "يحتاج العرض التعليمي إلى توضيح موضوعه وبنية الدورة وخطوة التسجيل.",
        solution:
          "يجمع الموقع بين صفحة تعريفية بالدورة وخريطة للجلسات ومحتوى الأسعار ودعوة للتسجيل.",
        features: [
          "تعريف بالورشة ومحتوى الدورة",
          "منهج منظم بحسب الجلسات",
          "قسم الأسعار المنشور",
          "دعوة للتسجيل",
        ],
        projectType: "موقع لورشة تعليمية",
        technologies: [],
        seoTitle: "من الفكرة إلى الإنتاج — موقع ورشة تعليمية | رقميات",
        seoDescription:
          "تعرّف على موقع ورشة من الفكرة إلى الإنتاج، الذي يقدم الدورة التعليمية عبر منهج من عشر جلسات مع معلومات الأسعار والتسجيل المنشورة بوضوح.",
        galleryHeading: "نظرة أقرب إلى موقع الورشة",
        imageAlts: [
          "قسم من موقع ورشة من الفكرة إلى الإنتاج",
          "محتوى الورشة معروض على الجوال",
        ],
      },
    },
    assets: {
      cover: asset("live-workshop", "feature-desktop.webp"),
      coverKind: "real-screenshot",
      coverAlt: { en: "From Idea to Production workshop homepage hero", ar: "الصفحة الرئيسية لموقع ورشة من الفكرة إلى الإنتاج" },
      mobileCover: asset("live-workshop", "feature-mobile.webp"),
      gallery: [
        { src: asset("live-workshop", "curriculum-desktop.webp"), alt: { en: "From Idea to Production session-by-session curriculum and course stats", ar: "منهج الورشة جلسة بجلسة وإحصاءات الدورة" }, role: "gallery" },
      ],
    },
    links: { publicUrl: "https://live-workshop.youesf-abdallah.online/" },
    relatedProjects: ["eduflow", "edtech-platform", "schooly"],
    evidence: {
      ownerAttribution: "confirmed-by-owner",
      description: "documented",
      publicUrl: "observed-in-source-review",
      screenshotSource: "owner-supplied-public-site-captures",
      thirdPartyContentReview: "confirm-before-production",
      notes: "Public course pages, a session outline, a pricing section, and an enrollment CTA were observed. Promotional counts and outcome claims were deliberately omitted from copy and selected imagery.",
    },
  }),
  project({
    slug: "eduflow",
    publicationState: "published",
    featured: false,
    categoryId: "learning-platform",
    locales: {
      en: {
        title: "EduFlow",
        category: "Education · Learning platform",
        summary:
          "Arabic and English course pages lead into a public lesson preview with notes, alongside sign-in and enrollment paths.",
        overview:
          "EduFlow presents course information in Arabic and English and offers a public preview lesson alongside sign-in and enrollment paths.",
        challenge:
          "Course visitors need to understand the learning offer and preview available public material before choosing a next step.",
        solution:
          "The public website combines course information, a lesson preview with notes, language switching, and account or enrollment links.",
        features: [
          "Arabic and English course presentation",
          "Public lesson preview",
          "Lesson notes on the preview page",
          "Sign-in and enrollment paths",
        ],
        projectType: "Bilingual course website",
        technologies: [],
        seoTitle: "EduFlow — Bilingual Learning Platform | Rakmyat",
        seoDescription:
          "Explore EduFlow, a bilingual course website offering a public lesson preview with notes, plus sign-in and enrollment paths for learners.",
        galleryHeading: "Preview the learning experience",
        imageAlts: [
          "EduFlow English course homepage",
          "EduFlow Arabic course homepage",
          "Course feature section",
          "Course preview shown on mobile",
        ],
      },
      ar: {
        title: "EduFlow",
        category: "التعليم · منصة تعلم",
        summary:
          "تقود صفحات الدورات بالعربية والإنجليزية إلى معاينة درس عامة وملاحظاتها، مع مسارات لتسجيل الدخول والالتحاق.",
        overview:
          "يعرض EduFlow معلومات الدورات بالعربية والإنجليزية، ويتيح معاينة درس عامة مع مسارات لتسجيل الدخول والالتحاق.",
        challenge:
          "يحتاج زائر الدورة إلى فهم محتواها ومعاينة المواد المتاحة قبل اختيار الخطوة التالية.",
        solution:
          "يجمع الموقع بين معلومات الدورة ومعاينة درس وملاحظاته وتبديل اللغة وروابط الحساب أو الالتحاق.",
        features: [
          "عرض الدورات بالعربية والإنجليزية",
          "معاينة عامة لدرس",
          "ملاحظات الدرس في صفحة المعاينة",
          "مسارات تسجيل الدخول والالتحاق",
        ],
        projectType: "موقع دورات ثنائي اللغة",
        technologies: [],
        seoTitle: "EduFlow — منصة تعلم ثنائية اللغة | رقميات",
        seoDescription:
          "تعرّف على EduFlow، موقع دورات ثنائي اللغة يقدم معاينة عامة لدرس تعليمي مع ملاحظاته، إلى جانب مسارات لتسجيل الدخول والالتحاق بالدورات.",
        galleryHeading: "استكشف تجربة التعلم",
        imageAlts: [
          "الصفحة الرئيسية لـ EduFlow باللغة الإنجليزية",
          "الصفحة الرئيسية لـ EduFlow باللغة العربية",
          "قسم من صفحة خصائص الدورة",
          "معاينة الدورة على الجوال",
        ],
      },
    },
    assets: {
      cover: asset("eduflow", "hero-english-desktop.webp"),
      coverKind: "real-screenshot",
      coverAlt: { en: "EduFlow English course homepage", ar: "الصفحة الرئيسية لـ EduFlow باللغة الإنجليزية" },
      mobileCover: asset("eduflow", "hero-english-mobile.webp"),
      gallery: [
        { src: asset("eduflow", "hero-desktop.webp"), alt: { en: "EduFlow Arabic course homepage", ar: "الصفحة الرئيسية لـ EduFlow باللغة العربية" }, role: "gallery" },
        { src: asset("eduflow", "feature-desktop.webp"), alt: { en: "EduFlow course feature section", ar: "قسم من صفحة خصائص الدورة في EduFlow" }, role: "desktop" },
      ],
    },
    links: { publicUrl: "https://courses.youesf-abdallah.online/" },
    relatedProjects: ["edtech-platform", "schooly", "live-workshop"],
    evidence: {
      ownerAttribution: "confirmed-by-owner",
      description: "documented",
      publicUrl: "observed-in-source-review",
      screenshotSource: "owner-supplied-public-site-captures",
      thirdPartyContentReview: "confirm-before-production",
      notes: "The public preview and bilingual landing pages were reviewed. Authenticated learner and admin areas were not accessed. No LMS architecture, private functionality, or technology stack is claimed.",
    },
  }),
  project({
    slug: "legal-translation",
    publicationState: "published",
    featured: false,
    categoryId: "business-website",
    locales: {
      en: {
        title: "Middle East Institute",
        category: "Business website · Legal translation",
        summary:
          "Translation categories, a four-step request guide, FAQs, and contact options organize this public service website.",
        overview:
          "The public website introduces translation services, explains the request process, answers common questions, and provides contact paths.",
        challenge:
          "Visitors need to understand the available service types and what information is needed to begin a request.",
        solution:
          "The site organizes service categories, a step-by-step request overview, frequently asked questions, and contact actions.",
        features: [
          "Translation service categories",
          "Four-step public request overview",
          "Frequently asked questions",
          "Contact and quote actions",
        ],
        projectType: "Business service website",
        technologies: ["WordPress"],
        seoTitle: "Middle East Institute — Service Website | Rakmyat",
        seoDescription:
          "Explore the Middle East Institute service website for translation categories, request guidance, and contact information.",
        galleryHeading: "A look at the service experience",
        imageAlts: [
          "Middle East Institute public service website homepage",
          "Translation website displayed on mobile",
        ],
      },
      ar: {
        title: "معهد الشرق الأوسط",
        category: "موقع أعمال · الترجمة القانونية",
        summary:
          "ينظم موقع الخدمات فئات الترجمة ودليلًا من أربع خطوات للطلب وأسئلة شائعة وخيارات للتواصل.",
        overview:
          "يعرّف الموقع بالخدمات، ويوضح خطوات الطلب، ويجيب عن الأسئلة الشائعة، ويوفر قنوات للتواصل.",
        challenge:
          "يحتاج الزائر إلى معرفة أنواع الخدمات المتاحة والمعلومات اللازمة لبدء الطلب.",
        solution:
          "ينظم الموقع فئات الخدمات ونظرة متسلسلة لخطوات الطلب والأسئلة الشائعة وخيارات التواصل.",
        features: [
          "فئات خدمات الترجمة",
          "عرض عام لخطوات الطلب الأربع",
          "إجابات عن الأسئلة الشائعة",
          "خيارات للتواصل وطلب عرض سعر",
        ],
        projectType: "موقع لخدمات الأعمال",
        technologies: ["WordPress"],
        seoTitle: "معهد الشرق الأوسط — موقع خدمات | رقميات",
        seoDescription:
          "تعرّف على موقع معهد الشرق الأوسط الخاص بخدمات الترجمة، الذي ينظم فئات الترجمة ودليلًا من أربع خطوات للطلب وأسئلة شائعة وخيارات للتواصل.",
        galleryHeading: "نظرة على تجربة الخدمات",
        imageAlts: [
          "الصفحة الرئيسية لموقع خدمات معهد الشرق الأوسط",
          "موقع الترجمة معروض على الجوال",
        ],
      },
    },
    assets: {
      cover: asset("legal-translation", "hero-desktop.webp"),
      coverKind: "real-screenshot",
      coverAlt: { en: "Middle East Institute legal-translation website homepage", ar: "الصفحة الرئيسية لموقع الترجمة القانونية لمعهد الشرق الأوسط" },
      mobileCover: asset("legal-translation", "hero-mobile.webp"),
      gallery: [
        { src: asset("legal-translation", "homepage-full.webp"), alt: { en: "Middle East Institute service website", ar: "موقع خدمات معهد الشرق الأوسط" }, role: "gallery" },
        { src: asset("legal-translation", "hero-desktop.webp"), alt: { en: "Middle East Institute public service website homepage", ar: "الصفحة الرئيسية لموقع خدمات معهد الشرق الأوسط" }, role: "gallery" },
      ],
    },
    links: { publicUrl: "https://wegomei.com/" },
    relatedProjects: ["nora-store", "gc-hardware", "schooly"],
    evidence: {
      ownerAttribution: "confirmed-by-owner",
      description: "documented",
      publicUrl: "observed-in-source-review",
      screenshotSource: "owner-supplied-public-site-captures",
      thirdPartyContentReview: "confirm-before-production",
      notes: "The public English site and its service process were reviewed. WordPress was observed in public metadata. Screenshots contain the business brand and public promotional content; review the client's permission and claims before external production use.",
    },
  }),
  project({
    slug: "gc-hardware",
    publicationState: "published",
    featured: true,
    categoryId: "product-catalog",
    locales: {
      en: {
        title: "GC Hardware",
        category: "E-commerce · Computer hardware",
        summary:
          "A bilingual hardware catalog connects component categories with product details, displayed prices, and purchase or support options.",
        overview:
          "The public store presents computer-component categories, product listings, and individual product pages in Arabic and English.",
        challenge:
          "Shoppers need a clear path from hardware categories to the product information and purchase options available for each item.",
        solution:
          "The storefront organizes product categories and details alongside visible pricing, purchase, and support information.",
        features: [
          "Computer-component catalog",
          "Hardware categories and product listings",
          "Product detail pages",
          "Purchase and contact actions",
        ],
        projectType: "Bilingual product catalog and store",
        technologies: ["WordPress"],
        seoTitle: "GC Hardware — Computer Hardware Store | Rakmyat",
        seoDescription:
          "Explore GC Hardware, a bilingual catalog and e-commerce website connecting computer component categories with product details, prices, and support options.",
        galleryHeading: "Browse the hardware catalog",
        imageAlts: [
          "GC Hardware Arabic product-catalog homepage",
          "Computer hardware product page",
          "Product catalog on a mobile screen",
        ],
      },
      ar: {
        title: "GC Hardware",
        category: "التجارة الإلكترونية · أجهزة الحاسوب",
        summary:
          "يربط كتالوج ثنائي اللغة فئات مكونات الحاسوب بتفاصيل المنتجات والأسعار وخيارات الشراء أو الدعم الظاهرة.",
        overview:
          "يعرض المتجر العام فئات مكونات الحاسوب وقوائم المنتجات وصفحاتها التفصيلية بالعربية والإنجليزية.",
        challenge:
          "يحتاج المتسوق إلى الانتقال بوضوح من فئات الأجهزة إلى معلومات المنتج وخيارات الشراء المتاحة.",
        solution:
          "ينظم المتجر الفئات وتفاصيل المنتجات، إلى جانب الأسعار وخيارات الشراء والدعم الظاهرة.",
        features: [
          "كتالوج لمكونات الحاسوب",
          "فئات للأجهزة وقوائم المنتجات",
          "صفحات تفاصيل المنتجات",
          "خيارات الشراء والتواصل",
        ],
        projectType: "كتالوج ومتجر ثنائي اللغة",
        technologies: ["WordPress"],
        seoTitle: "GC Hardware — متجر أجهزة الحاسوب | رقميات",
        seoDescription:
          "تعرّف على GC Hardware، كتالوج وموقع تجارة إلكترونية ثنائي اللغة يربط فئات مكونات الحاسوب بتفاصيل المنتجات والأسعار وخيارات الدعم.",
        galleryHeading: "استكشف كتالوج الأجهزة",
        imageAlts: [
          "الصفحة الرئيسية لكتالوج GC Hardware باللغة العربية",
          "صفحة منتج من أجهزة الحاسوب",
          "كتالوج المنتجات على شاشة الجوال",
        ],
      },
    },
    assets: {
      cover: asset("gc-hardware", "hero-desktop.webp"),
      coverKind: "real-screenshot",
      coverAlt: { en: "GC Hardware Arabic product-catalog homepage", ar: "الصفحة الرئيسية لكتالوج GC Hardware باللغة العربية" },
      mobileCover: asset("gc-hardware", "hero-mobile.webp"),
      gallery: [
        { src: asset("gc-hardware", "homepage-full.webp"), alt: { en: "GC Hardware product catalog", ar: "كتالوج منتجات GC Hardware" }, role: "gallery" },
        { src: asset("gc-hardware", "product-desktop.webp"), alt: { en: "GC Hardware product detail page", ar: "صفحة تفاصيل منتج في GC Hardware" }, role: "desktop" },
        { src: asset("gc-hardware", "product-mobile.webp"), alt: { en: "GC Hardware product page on mobile", ar: "صفحة منتج من GC Hardware على الجوال" }, role: "mobile" },
      ],
    },
    links: { publicUrl: "https://gc-hardware.net/" },
    relatedProjects: ["nora-store", "legal-translation", "schooly"],
    evidence: {
      ownerAttribution: "confirmed-by-owner",
      description: "documented",
      publicUrl: "observed-in-source-review",
      screenshotSource: "owner-supplied-public-site-captures",
      thirdPartyContentReview: "confirm-before-production",
      notes: "Public hardware categories, product details, and purchase controls were observed. WordPress was visible in public metadata; WooCommerce was not verified. Product images, marks, prices, and offer details in captures need client clearance before deployment.",
    },
  }),
  project({
    slug: "concord-crm",
    publicationState: "published",
    featured: false,
    categoryId: "business-systems",
    locales: {
      en: {
        title: "Concord CRM",
        category: "Business systems · CRM",
        summary:
          "A business-systems project associated with Concord CRM and WooCommerce; further implementation details are not available.",
        overview:
          "The confirmed project record names Concord CRM and its association with WooCommerce. The supplied evidence does not document its workflows, delivered scope, or implementation.",
        challenge:
          "Project goals and workflow details are not documented in the available source material.",
        solution:
          "The delivered integration behavior and implementation details have not been documented.",
        features: [],
        projectType: "CRM and commerce integration project",
        technologies: [],
        seoTitle: "Concord CRM — Business Systems Project | Rakmyat",
        seoDescription:
          "Concord CRM is a Rakmyat business-systems project associated with a WooCommerce integration; further implementation details are not publicly available.",
        galleryHeading: "Project identity",
        imageAlts: [],
      },
      ar: {
        title: "Concord CRM",
        category: "أنظمة الأعمال · إدارة علاقات العملاء",
        summary:
          "مشروع لأنظمة الأعمال يرتبط باسم Concord CRM وWooCommerce، ولا تتوفر تفاصيل موثقة عن التنفيذ.",
        overview:
          "يسمي سجل المشروع المؤكد Concord CRM ويربطه بـ WooCommerce. ولا توثق المواد المتاحة مسارات العمل أو النطاق المنفذ أو تفاصيل التنفيذ.",
        challenge:
          "لا توثق المواد المتاحة أهداف المشروع أو تفاصيل مسارات العمل.",
        solution:
          "لم توثق تفاصيل التكامل المنفذ أو آلية عمله.",
        features: [],
        projectType: "مشروع تكامل CRM وتجارة إلكترونية",
        technologies: [],
        seoTitle: "Concord CRM — مشروع أنظمة أعمال | رقميات",
        seoDescription:
          "Concord CRM مشروع لرقميات في أنظمة الأعمال يرتبط باسمه بتكامل مع WooCommerce، ولا تتوفر حاليًا تفاصيل موثقة إضافية عن تنفيذه الكامل.",
        galleryHeading: "هوية المشروع",
        imageAlts: [],
      },
    },
    assets: {
      cover: "/assets/rakmyat/project-presentations/concord-crm-concept.webp",
      coverKind: "conceptual-visual",
      coverAlt: {
        en: "Concept illustration of linked customer records and commerce modules; not a screenshot of the Concord CRM project.",
        ar: "رسم تصوري يوضح ترابط سجلات العملاء ووحدات التجارة؛ وليس لقطة شاشة من مشروع Concord CRM.",
      },
      gallery: [],
    },
    links: {},
    relatedProjects: ["product-scraper", "nora-store", "gc-hardware"],
    evidence: {
      ownerAttribution: "confirmed-by-owner",
      description: "limited-to-project-name",
      publicUrl: "not-provided",
      screenshotSource: "none",
      thirdPartyContentReview: "not-applicable",
      notes: "Owner confirmed this as a real project. The supplied discovery record names Concord CRM and a WooCommerce integration, but the supplied repository URLs were unavailable and no screenshots or feature documentation were present. No dashboard, feature, or technology claims are made.",
    },
  }),
  project({
    slug: "product-scraper",
    publicationState: "published",
    featured: false,
    categoryId: "automation-integration",
    locales: {
      en: {
        title: "Product Scraper to WooCommerce",
        category: "Automation · E-commerce integration",
        summary:
          "A project titled Product Scraper to WooCommerce; verified interface and implementation details are not available.",
        overview:
          "The project name is confirmed, but current source materials do not establish its delivered workflow, interface, or implementation details.",
        challenge:
          "Project goals and workflow details are not documented in the available source material.",
        solution:
          "The delivered processing steps and implementation details have not been documented.",
        features: [],
        projectType: "Product data and e-commerce integration project",
        technologies: [],
        seoTitle: "Product Scraper to WooCommerce | Rakmyat",
        seoDescription:
          "An owner-confirmed Rakmyat project, Product Scraper to WooCommerce focuses on product-sourcing data; verified implementation details are not available.",
        galleryHeading: "Project identity",
        imageAlts: [],
      },
      ar: {
        title: "أداة جمع المنتجات إلى WooCommerce",
        category: "الأتمتة · تكامل التجارة الإلكترونية",
        summary:
          "مشروع بعنوان Product Scraper to WooCommerce، ولا تتوفر تفاصيل موثقة عن واجهته أو تنفيذه.",
        overview:
          "اسم المشروع مؤكد، لكن المواد المتاحة لا تثبت مسار العمل أو الواجهة أو تفاصيل التنفيذ المنجزة.",
        challenge:
          "لا توثق المواد المتاحة أهداف المشروع أو تفاصيل مسارات العمل.",
        solution:
          "لم توثق خطوات المعالجة المنفذة أو تفاصيل التنفيذ.",
        features: [],
        projectType: "مشروع بيانات منتجات وتكامل تجارة إلكترونية",
        technologies: [],
        seoTitle: "جمع المنتجات إلى WooCommerce | رقميات",
        seoDescription:
          "مشروع لرقميات أكده المالك بعنوان Product Scraper to WooCommerce، يركز على بيانات مصادر المنتجات، ولا تتوفر تفاصيل تنفيذ موثقة.",
        galleryHeading: "هوية المشروع",
        imageAlts: [],
      },
    },
    assets: {
      cover: "/assets/rakmyat/project-presentations/product-scraper-concept.webp",
      coverKind: "conceptual-visual",
      coverAlt: {
        en: "Concept illustration of product information flowing toward a WooCommerce catalog; not a screenshot of the delivered project.",
        ar: "رسم تصوري لتدفق معلومات المنتجات نحو كتالوج WooCommerce؛ وليس لقطة شاشة من المشروع المنفذ.",
      },
      gallery: [],
    },
    links: {},
    relatedProjects: ["concord-crm", "nora-store", "gc-hardware"],
    evidence: {
      ownerAttribution: "confirmed-by-owner",
      description: "limited-to-project-name",
      publicUrl: "not-provided",
      screenshotSource: "none",
      thirdPartyContentReview: "not-applicable",
      notes: "Owner confirmed this as a real project. The current supplied source repository returns 404; the indexed historical README is explicitly stale and is not used to claim a current GUI, translation, batch processing, CSV export, error-handling behavior, or stack.",
    },
  }),
];

export const projectCategories = {
  en: [
    { id: "all", label: "All projects" },
    { id: "education", label: "Education" },
    { id: "commerce", label: "E-commerce" },
    { id: "business", label: "Business systems" },
    { id: "integration", label: "Automation & integrations" },
  ],
  ar: [
    { id: "all", label: "كل المشاريع" },
    { id: "education", label: "التعليم" },
    { id: "commerce", label: "التجارة الإلكترونية" },
    { id: "business", label: "أنظمة الأعمال" },
    { id: "integration", label: "الأتمتة والتكامل" },
  ],
} as const;

export function categoryGroup(categoryId: ProjectCategory) {
  if (categoryId.startsWith("education") || categoryId === "learning-platform" || categoryId === "workshop-platform") return "education";
  if (categoryId === "ecommerce" || categoryId === "product-catalog") return "commerce";
  if (categoryId === "business-systems" || categoryId === "business-website") return "business";
  return "integration";
}

export function getPortfolioProjects(locale: Locale) {
  return portfolioProjects.map((item) => ({
    ...item,
    content: item.locales[locale],
  }));
}

export function getPortfolioProject(slug: string) {
  return portfolioProjects.find(
    (item) => item.slug === slug && item.publicationState === "published",
  );
}

export function getRelatedProjects(slugs: readonly string[]) {
  return slugs
    .map((slug) => getPortfolioProject(slug))
    .filter((item): item is PortfolioProject => Boolean(item));
}
