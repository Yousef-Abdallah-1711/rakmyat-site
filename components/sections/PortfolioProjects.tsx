"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/content/i18n";
import { getPortfolioProjects, projectCategories } from "@/content/portfolio";

function categoryGroup(categoryId: string) {
  if (categoryId.startsWith("education") || categoryId === "learning-platform" || categoryId === "workshop-platform") return "education";
  if (categoryId === "ecommerce" || categoryId === "product-catalog") return "commerce";
  if (categoryId === "business-systems" || categoryId === "business-website") return "business";
  return "integration";
}

export function PortfolioProjects({ locale = "en" }: { locale?: Locale }) {
  const [filter, setFilter] = useState("all");
  const projects = useMemo(() => getPortfolioProjects(locale), [locale]);
  const filters = projectCategories[locale];
  const copy = locale === "en"
    ? { label: "Project", count: (count: number) => `${count} projects`, open: "View project" }
    : { label: "مشروع", count: (count: number) => `${count} مشاريع`, open: "عرض المشروع" };
  const visible = projects.filter((item) => filter === "all" || filter === categoryGroup(item.categoryId));

  return <>
    <div className="controls" role="group" aria-label={locale === "en" ? "Filter projects" : "تصفية المشاريع"}>
      {filters.map(({ id, label }) => <button type="button" key={id} className={`control${filter === id ? " control-active" : ""}`} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}
    </div>
    <p className="visually-hidden" aria-live="polite">{copy.count(visible.length)}</p>
    <section className="portfolio style-1" aria-label={locale === "en" ? "Rakmyat projects" : "مشاريع رقميات"}>
      <div className="content"><div className="row mix-container">
        {visible.map(({ slug, categoryId, content, assets }, index) => <div className={`col-md-6 mix ${categoryGroup(categoryId)}`} key={slug}>
          <article className={`portfolio-card${index < visible.length - 1 ? " mb-50" : ""}`}>
            <Link className="img portfolio-project-image" href={`/${locale}/projects/${slug}`} aria-label={`${copy.open}: ${content.title}`}>
              {assets.cover
                ? <img src={assets.cover} alt={assets.coverAlt[locale]} loading={index < 3 ? "eager" : "lazy"} />
                : <span className="project-identity project-identity--card" aria-hidden="true"><b>{content.title}</b><small>{content.projectType}</small></span>}
            </Link>
            <div className="info">
              <h5><Link href={`/${locale}/projects/${slug}`}>{content.title}</Link></h5>
              <small className="d-block color-main text-uppercase">{content.category}</small>
              <div className="text">{content.summary}</div>
              <ul className="tags"><li><Link href={`/${locale}/projects/${slug}`}>{copy.label}</Link></li></ul>
            </div>
          </article>
        </div>)}
      </div></div>
    </section>
  </>;
}
