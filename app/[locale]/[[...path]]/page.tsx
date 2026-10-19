import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutSourceSections } from "@/components/sections/AboutSourceSections";
import { ContactSourceSections } from "@/components/sections/ContactSourceSections";
import { HomeSourceSections } from "@/components/sections/HomeSourceSections";
import { PortfolioSourceSections } from "@/components/sections/PortfolioSourceSections";
import { ProjectDetailSections } from "@/components/sections/ProjectDetailSections";
import { ServiceDetailsSourceSections } from "@/components/sections/ServiceDetailsSourceSections";
import { ServicesSourceSections } from "@/components/sections/ServicesSourceSections";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { localeCopy, type Locale, type PageKey } from "@/content/i18n";
import { getPortfolioProject } from "@/content/portfolio";

export const dynamic = "force-dynamic";

type RouteParams = { locale: string; path?: string[] };
function getPageKey(path: string[] = []): PageKey | null {
  const key = path.join("/");
  if (key === "") return "home";
  if (key === "about") return "about";
  if (key === "services") return "services";
  if (key === "services/details") return "serviceDetails";
  if (key === "portfolio") return "portfolio";
  if (key === "contact") return "contact";
  return null;
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
    const siteUrl = getConfiguredSiteUrl();
    const image = project.assets.cover || "/assets/rakmyat/brand/rakmyat-mark.webp";
    const socialImage = siteUrl
      ? { images: [{ url: new URL(image, siteUrl).toString(), alt: project.assets.coverAlt[locale] }] }
      : {};
    return {
      title: content.seoTitle,
      description: content.seoDescription,
      alternates: {
        canonical: siteUrl ? new URL(route, siteUrl).toString() : undefined,
        languages: {
          en: `/en/projects/${project.slug}`,
          ar: `/ar/projects/${project.slug}`,
        },
      },
      openGraph: {
        title: content.seoTitle,
        description: content.seoDescription,
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
  return {
    title: copy.pageTitles[page],
    description: copy.pageDescriptions[page],
    openGraph: {
      title: copy.pageTitles[page],
      description: copy.pageDescriptions[page],
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
    alternates: {
      languages: {
        en: `/en${localizedPath}`,
        ar: `/ar${localizedPath}`,
      },
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
    serviceDetails: <ServiceDetailsSourceSections locale={locale} />,
    portfolio: <PortfolioSourceSections locale={locale} />,
    contact: <ContactSourceSections locale={locale} />,
    project: null,
  }[page];
  const activePage = page === "home" || page === "about" || page === "contact" || page === "portfolio" || page === "services"
    ? page
    : page === "serviceDetails" ? "services" : "project";
  return (
    <SiteLayout
      activePage={activePage}
      locale={locale}
      transparentHeader={page === "contact" || page === "serviceDetails"}
      borderedFooter={page === "home" || page === "portfolio" || page === "serviceDetails"}
    >
      {section}
    </SiteLayout>
  );
}

function getConfiguredSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}
