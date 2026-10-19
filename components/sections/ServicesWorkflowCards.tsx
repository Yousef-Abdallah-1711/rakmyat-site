import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/content/i18n";
import { getPortfolioProject } from "@/content/portfolio";
import { getServices } from "@/content/services";
import styles from "./ServicesWorkflowCards.module.css";

const projectSlugs: Record<string, readonly string[]> = {
  "web-commerce": ["nora-store", "gc-hardware", "schooly"],
  "business-systems": ["concord-crm"],
  "integrations-apis": ["product-scraper"],
};

const illustrations: Record<string, string> = {
  "web-commerce": "/assets/img/icons/service-showcase/web-commerce.webp",
  "mobile-apps": "/assets/img/icons/service-showcase/mobile-applications.webp",
  "business-systems": "/assets/img/icons/service-showcase/business-systems.webp",
  "ai-automation": "/assets/img/icons/service-showcase/ai-automation.webp",
  "integrations-apis": "/assets/img/icons/service-showcase/integrations-apis.webp",
};

export function ServicesWorkflowCards({ locale }: { locale: Locale }) {
  const services = getServices(locale);
  const selectedProjectsLabel = locale === "en" ? "Selected projects" : "مشاريع مختارة";

  return (
    <div className={styles.grid} data-services-cards>
      {services.map((service) => {
        const projects = (projectSlugs[service.id] ?? [])
          .map((slug) => getPortfolioProject(slug))
          .filter((project) => project !== undefined);

        return (
          <article className={styles.card} data-service-card={service.id} key={service.id}>
            <div className={styles.illustration}>
              <Image
                src={illustrations[service.id]}
                alt=""
                aria-hidden="true"
                width={300}
                height={300}
                sizes="(max-width: 620px) 200px, (max-width: 900px) 190px, (max-width: 1199px) 180px, 200px"
              />
            </div>
            <h3 className={styles.title}>{service.title}</h3>
            <p className={styles.description}>{service.summary}</p>
            <ul className={styles.capabilities}>
              {service.capabilities.slice(0, 3).map((capability) => (
                <li key={capability}>
                  <span className={styles.check} aria-hidden="true">
                    <svg viewBox="0 0 16 16" focusable="false">
                      <path d="m3.5 8.2 2.8 2.7 6.2-6.2" />
                    </svg>
                  </span>
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
            {projects.length > 0 && (
              <div className={styles.projectGroup}>
                <span className={styles.projectLabel}>{selectedProjectsLabel}</span>
                <div className={styles.projectLinks}>
                  {projects.map((project) => (
                    <Link
                      className={styles.projectPill}
                      data-project-link
                      href={`/${locale}/projects/${project.slug}`}
                      key={project.slug}
                    >
                      {project.locales[locale].title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
