"use client";

import { useState } from "react";
import type { Locale } from "@/content/i18n";
import { portfolioProjects, projectCategories } from "@/content/portfolio";
import { ProjectShowcaseGrid } from "@/components/projects/ProjectShowcaseGrid";

function categoryGroup(categoryId: string) {
  if (categoryId.startsWith("education") || categoryId === "learning-platform" || categoryId === "workshop-platform") return "education";
  if (categoryId === "ecommerce" || categoryId === "product-catalog") return "commerce";
  if (categoryId === "business-systems" || categoryId === "business-website") return "business";
  return "integration";
}

export function PortfolioProjects({ locale = "en" }: { locale?: Locale }) {
  const [filter, setFilter] = useState("all");
  const projects = portfolioProjects;
  const filters = projectCategories[locale];
  const copy = locale === "en"
      ? { count: (count: number) => `${count} projects` }
    : { count: (count: number) => `${count} مشاريع` };
  const visible = projects.filter((item) => filter === "all" || filter === categoryGroup(item.categoryId));

  return <>
    <div className="controls" role="group" aria-label={locale === "en" ? "Filter projects" : "تصفية المشاريع"}>
      {filters.map(({ id, label }) => <button type="button" key={id} className={`control${filter === id ? " control-active" : ""}`} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}
    </div>
    <p className="visually-hidden" aria-live="polite">{copy.count(visible.length)}</p>
    <section className="portfolio style-1 project-showcase-list" aria-label={locale === "en" ? "Rakmyat projects" : "مشاريع رقميات"}>
      <div className="content"><ProjectShowcaseGrid projects={visible} locale={locale} /></div>
    </section>
  </>;
}
