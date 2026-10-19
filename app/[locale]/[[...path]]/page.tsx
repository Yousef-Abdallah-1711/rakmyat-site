import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutSourceSections } from "@/components/sections/AboutSourceSections";
import { ContactSourceSections } from "@/components/sections/ContactSourceSections";
import { HomeSourceSections } from "@/components/sections/HomeSourceSections";
import { PortfolioSourceSections } from "@/components/sections/PortfolioSourceSections";
import { ServiceDetailsSourceSections } from "@/components/sections/ServiceDetailsSourceSections";
import { ServicesSourceSections } from "@/components/sections/ServicesSourceSections";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { localeCopy, type Locale, type PageKey } from "@/content/i18n";

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
