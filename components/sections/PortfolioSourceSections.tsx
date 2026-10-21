import { Suspense } from "react";
import Link from "next/link";
import { PortfolioProjects } from "@/components/sections/PortfolioProjects";
import { getPageCopy } from "@/content/page-copy";
import type { Locale } from "@/content/i18n";

export function PortfolioSourceSections({ locale = "en" }: { locale?: Locale }) {
  const copy = getPageCopy(locale).portfolio;
  return <main className="portfolio-page style-1"><h1 className="visually-hidden">{`${copy.heading} ${copy.accent}`}</h1>
    <section className="portfolio-projects section-padding pt-50 style-1"><div className="container"><div className="section-head text-center mb-60 style-5"><h2 className="mb-20">{` ${copy.heading} `}<span>{` ${copy.accent} `}</span></h2><p>{copy.description}</p></div><Suspense fallback={null}><PortfolioProjects locale={locale} /></Suspense></div></section>
    <section className="download section-padding style-5"><div className="container"><div className="row justify-content-center"><div className="col-lg-9"><div className="content text-center"><h2>{copy.closingHeading} <span>{locale === "en" ? "Discuss" : "ناقش"}<img src="/assets/img/header/head5_line.png" alt="" className="head-line" /><img src="/assets/img/header/head5_pen.png" alt="" className="head-pen" /></span></h2><p>{copy.closingDescription}</p><div className="butns mt-70"><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mx-1"><span>{locale === "en" ? "Discuss a project" : "ناقش مشروعك"}</span></Link><Link href={`/${locale}/services`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mx-1"><span>{locale === "en" ? "Explore services" : "استكشف الخدمات"}</span></Link></div></div></div></div></div><img src="/assets/img/contact_globe.svg" alt="" className="contact_globe" /></section>
  </main>;
}
