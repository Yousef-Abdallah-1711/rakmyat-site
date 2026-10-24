import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutSourceSections } from "@/components/sections/AboutSourceSections";
import { ContactSourceSections } from "@/components/sections/ContactSourceSections";
import { HomeSourceSections } from "@/components/sections/HomeSourceSections";
import { HowWeWorkPage } from "@/components/sections/HowWeWork";
import { PortfolioSourceSections } from "@/components/sections/PortfolioSourceSections";
import { ProjectDetailSections } from "@/components/sections/ProjectDetailSections";
import { ServiceDetailsSourceSections } from "@/components/sections/ServiceDetailsSourceSections";
import { ServicesSourceSections } from "@/components/sections/ServicesSourceSections";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { localeCopy, type Locale, type PageKey } from "@/content/i18n";
import { getPortfolioProject } from "@/content/portfolio";
import { portfolioProjects } from "@/content/portfolio";
import { processCopy } from "@/content/process";
import { publicRouteMetadata } from "@/lib/seo";
import { getIndexableSiteOrigin } from "@/lib/site-url";
import { escapeJsonLd } from "@/lib/structured-data";

export const dynamicParams = false;

const staticPagePaths: string[][] = [
  [],
  ["about"],
  ["services"],
  ["services", "details"],
  ["how-we-work"],
  ["portfolio"],
  ["contact"],
];

export function generateStaticParams(_params: { params: { locale: string } }) {
  const projectPaths = portfolioProjects
    .filter((project) => project.publicationState === "published")
    .map((project) => ["projects", project.slug]);

  return [...staticPagePaths, ...projectPaths].map((path) => ({ path }));
}

type RouteParams = { locale: string; path?: string[] };
function getPageKey(path: string[] = []): PageKey | null {
  const key = path.join("/");
  if (key === "") return "home";
  if (key === "about") return "about";
  if (key === "services") return "services";
  if (key === "how-we-work") return "howWeWork";
  if (key === "services/details") return "serviceDetails";
  if (key === "portfolio") return "portfolio";
  if (key === "contact") return "contact";
  return null;
}

type BreadcrumbLabel = "about" | "services" | "serviceDetails" | "howWeWork" | "portfolio" | "contact";

function breadcrumbItems(page: PageKey): { label: BreadcrumbLabel; path: string }[] | null {
  switch (page) {
    case "about": return [{ label: "about", path: "/about" }];
    case "services": return [{ label: "services", path: "/services" }];
    case "serviceDetails": return [
      { label: "services", path: "/services" },
      { label: "serviceDetails", path: "/services/details" },
    ];
    case "howWeWork": return [{ label: "howWeWork", path: "/how-we-work" }];
    case "portfolio": return [{ label: "portfolio", path: "/portfolio" }];
    case "contact": return [{ label: "contact", path: "/contact" }];
    default: return null;
  }
}

function breadcrumbJsonLd(locale: Locale, page: PageKey, siteUrl: string) {
  const items = breadcrumbItems(page);
  if (!items) return null;
  const copy = localeCopy[locale];
  const trail = [
    { name: copy.home, path: "" },
    ...items.map((item) => ({ name: copy[item.label], path: item.path })),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: new URL(`/${locale}${crumb.path}`, siteUrl).toString(),
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { locale: localeParam, path } = await params;
  if (localeParam !== "en" && localeParam !== "ar") return {};
  const locale: Locale = localeParam;
  const copy = localeCopy[locale];
  if (path?.length === 2 && path[0] === "projects") {
    const project = getPortfolioProject(path[1]);
    if (!project) {
      return {
        title: copy.notFoundTitle,
        description: copy.notFoundText,
        robots: { index: false, follow: false },
      };
    }
    const content = project.locales[locale];
    const route = `/${locale}/projects/${project.slug}`;
    const siteUrl = getIndexableSiteOrigin();
    const image = project.assets.cover || "/assets/rakmyat/brand/rakmyat-mark.webp";
    const socialImage = siteUrl
      ? { images: [{ url: new URL(image, siteUrl).toString(), alt: project.assets.coverAlt[locale] }] }
      : {};
    return {
      title: content.seoTitle,
      description: content.seoDescription,
      ...publicRouteMetadata(locale, `/projects/${project.slug}`, siteUrl),
      openGraph: {
        title: content.seoTitle,
        description: content.seoDescription,
        siteName: locale === "ar" ? "رقميات" : "Rakmyat",
        locale: locale === "ar" ? "ar_EG" : "en_US",
        type: "article",
        url: siteUrl ? new URL(route, siteUrl).toString() : undefined,
        ...socialImage,
      },
      twitter: {
        card: "summary_large_image",
        title: content.seoTitle,
        description: content.seoDescription,
        ...socialImage,
      },
    };
  }
  if (path?.[0] === "projects") {
    return { title: copy.notFoundTitle, robots: { index: false, follow: false } };
  }
  const page = getPageKey(path);
  if (!page) {
    return {
      title: copy.notFoundTitle,
      description: copy.notFoundText,
      openGraph: {
        title: copy.notFoundTitle,
        description: copy.notFoundText,
        locale: locale === "ar" ? "ar_EG" : "en_US",
        type: "website",
      },
    };
  }
  const localizedPath = path?.length ? `/${path.join("/")}` : "";
  const siteUrl = getIndexableSiteOrigin();
  const route = `/${locale}${localizedPath}`;
  const publicMetadata = publicRouteMetadata(locale, localizedPath, siteUrl);
  const socialImageUrl = siteUrl ? new URL("/assets/rakmyat/brand/rakmyat-social.png", siteUrl).toString() : undefined;
  return {
    title: copy.pageTitles[page],
    description: copy.pageDescriptions[page],
    ...publicMetadata,
    openGraph: {
      title: copy.pageTitles[page],
      description: copy.pageDescriptions[page],
      siteName: locale === "ar" ? "رقميات" : "Rakmyat",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
      url: siteUrl ? new URL(route, siteUrl).toString() : undefined,
      ...(socialImageUrl ? { images: [{ url: socialImageUrl, width: 1200, height: 630, alt: locale === "ar" ? "رقميات — حلول برمجية للأعمال" : "Rakmyat — software for business" }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: copy.pageTitles[page],
      description: copy.pageDescriptions[page],
      ...(socialImageUrl ? { images: [socialImageUrl] } : {}),
    },
  };
}

export default async function LocalizedPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale: localeParam, path } = await params;
  if (localeParam !== "en" && localeParam !== "ar") notFound();
  const locale: Locale = localeParam;
  const siteUrl = getIndexableSiteOrigin();
  if (path?.[0] === "projects") {
    if (path.length !== 2) notFound();
    const project = getPortfolioProject(path[1]);
    if (!project) notFound();
    return (
      <SiteLayout activePage="project" locale={locale} borderedFooter>
        <ProjectDetailSections project={project} locale={locale} />
      </SiteLayout>
    );
  }
  const page = getPageKey(path);
  if (!page) notFound();

  const section = {
    home: <HomeSourceSections locale={locale} />,
    about: <AboutSourceSections locale={locale} />,
    services: <ServicesSourceSections locale={locale} />,
    howWeWork: <HowWeWorkPage locale={locale} />,
    serviceDetails: <ServiceDetailsSourceSections locale={locale} />,
    portfolio: <PortfolioSourceSections locale={locale} />,
    contact: <ContactSourceSections locale={locale} />,
    blog: null,
    project: null,
  }[page];
  const websiteJsonLd = page === "home" && siteUrl ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Rakmyat",
        alternateName: "رقميات",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: new URL("/assets/rakmyat/brand/rakmyat-mark.webp", siteUrl).toString(),
          width: 256,
          height: 256,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: locale === "ar" ? "رقميات" : "Rakmyat",
        alternateName: locale === "ar" ? "Rakmyat" : "رقميات",
        inLanguage: locale,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  } : null;
  const breadcrumbLd = siteUrl ? breadcrumbJsonLd(locale, page, siteUrl) : null;
  const serviceLd = page === "services" && siteUrl ? {
    "@context": "https://schema.org",
    "@type": "Service",
    name: locale === "en" ? "Custom Software Development" : "تطوير البرمجيات المخصصة",
    provider: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Rakmyat" },
    serviceType: locale === "en" ? "Software Development" : "تطوير البرمجيات",
    areaServed: "Worldwide",
    description: locale === "en"
      ? "Websites, applications, business systems, AI features, and integrations."
      : "مواقع وتطبيقات وأنظمة أعمال وميزات للذكاء الاصطناعي وتكاملات.",
  } : null;
  // FAQPage uses the visible FAQ (real questions and answers), not the process stage titles.
  const faqLd = page === "howWeWork" && siteUrl ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: processCopy[locale].faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  } : null;
  const activePage = page === "home" || page === "about" || page === "contact" || page === "portfolio" || page === "services" || page === "howWeWork"
    ? page
    : page === "serviceDetails" ? "services" : "project";
  return (
    <SiteLayout
      activePage={activePage}
      locale={locale}
      transparentHeader={page === "contact" || page === "serviceDetails"}
      borderedFooter={page === "home" || page === "portfolio" || page === "serviceDetails"}
    >
      {websiteJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(websiteJsonLd) }} />}
      {breadcrumbLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(breadcrumbLd) }} />}
      {serviceLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(serviceLd) }} />}
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(faqLd) }} />}
      {page === "serviceDetails" && (
        <link rel="preload" as="image" href="/assets/img/inner5_back.webp" fetchPriority="high" />
      )}
      {page === "home" && (
        <link rel="preload" as="image" href="/assets/img/header/hand_megaphone.webp" fetchPriority="high" />
      )}
      {section}
    </SiteLayout>
  );
}
