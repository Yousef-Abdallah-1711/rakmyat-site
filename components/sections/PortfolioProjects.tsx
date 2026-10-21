"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/content/i18n";
import { portfolioProjects, projectCategories, categoryGroup } from "@/content/portfolio";
import { ProjectShowcaseGrid } from "@/components/projects/ProjectShowcaseGrid";

export function PortfolioProjects({ locale = "en" }: { locale?: Locale }) {
  const searchParams = useSearchParams();
  const filters = projectCategories[locale];
  const requestedFilter = searchParams.get("category");
  const initialFilter = filters.some(({ id }) => id === requestedFilter) ? requestedFilter! : "all";
  const [filter, setFilter] = useState(initialFilter);
  const projects = portfolioProjects;
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
