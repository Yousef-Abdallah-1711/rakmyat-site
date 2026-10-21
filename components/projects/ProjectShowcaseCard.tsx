import Link from "next/link";
import type { Locale } from "@/content/i18n";
import type { PortfolioProject } from "@/content/portfolio";
import { ProjectVisualFrame } from "@/components/projects/ProjectVisualFrame";

export function ProjectShowcaseCard({ project, locale, variant = "grid", index = 0 }: {
  project: PortfolioProject;
  locale: Locale;
  variant?: "grid" | "home" | "related";
  index?: number;
}) {
  const content = project.locales[locale];
  const action = locale === "en" ? "View project" : "عرض المشروع";

  return (
    <article className={`project-showcase-card project-showcase-card--${variant}`} data-project={project.slug}>
      <ProjectVisualFrame project={project} locale={locale} variant={variant === "related" ? "related" : "card"} priority={variant === "grid" && index === 0} group={`project-${project.slug}`} />
      <div className="project-showcase-card-content">
        <div className="project-showcase-card-heading">
          <div>
            <small className="project-showcase-category">{content.category}</small>
            <h3><Link href={`/${locale}/projects/${project.slug}`}>{content.title}</Link></h3>
          </div>
          <span className="project-showcase-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <p>{content.summary}</p>
        <Link className="project-showcase-link" href={`/${locale}/projects/${project.slug}`} aria-label={`${action}: ${content.title}`}>
          {action}<i className="bi bi-arrow-up-right" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
