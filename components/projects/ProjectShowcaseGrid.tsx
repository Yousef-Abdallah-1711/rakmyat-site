import type { Locale } from "@/content/i18n";
import type { PortfolioProject } from "@/content/portfolio";
import { ProjectShowcaseCard } from "@/components/projects/ProjectShowcaseCard";

export function ProjectShowcaseGrid({ projects, locale, variant = "grid" }: {
  projects: readonly PortfolioProject[];
  locale: Locale;
  variant?: "grid" | "home" | "related";
}) {
  return (
    <div className={`project-showcase-grid project-showcase-grid--${variant}`}>
      {projects.map((project, index) => <ProjectShowcaseCard key={project.slug} project={project} locale={locale} variant={variant} index={index} />)}
    </div>
  );
}
