import type { Locale } from "@/content/i18n";
import { getServices } from "@/content/services";
import { getPortfolioProject } from "@/content/portfolio";

const projectLinks: Record<string, readonly string[]> = {
  "web-commerce": ["nora-store", "gc-hardware", "schooly"],
  "business-systems": ["concord-crm"],
  "integrations-apis": ["product-scraper"],
};

export function ServicesCarousel({ locale = "en" }: { locale?: Locale }) {
  const icons = [14, 15, 16, 17, 18];
  const services = getServices(locale);
  const relatedLabel = locale === "en" ? "Selected projects" : "مشاريع ذات صلة";
  return <div className="services-slider position-relative style-6"><div className="swiper-container"><div className="swiper-wrapper">{services.map((service, index) => <div className="swiper-slide" key={service.id}><article className="service-card style-6"><div className="icon"><img src={`/assets/img/icons/serv_icons/${icons[index]}.png`} alt="" /></div><div className="info"><h5>{service.title}</h5><div className="text">{service.summary}</div><ul>{service.capabilities.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>{projectLinks[service.id] && <div className="service-project-links"><small>{relatedLabel}</small><div>{projectLinks[service.id].map((slug) => { const project = getPortfolioProject(slug); return project ? <a key={slug} href={`/${locale}/projects/${slug}`}>{project.locales[locale].title}</a> : null; })}</div></div>}</div></article></div>)}</div></div></div>;
}
