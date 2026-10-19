import Link from "next/link";
import type { Locale } from "@/content/i18n";
import type { PortfolioProject } from "@/content/portfolio";
import { getRelatedProjects, portfolioProjects } from "@/content/portfolio";

const copy = {
  en: {
    home: "Home", work: "Work", category: "Category", type: "Project type", by: "Built by Rakmyat",
    challenge: "Project focus", solution: "The experience", details: "Project features", detailsLead: "What the public experience includes.",
    visit: "Visit the public website", gallery: "Project screens", ctaHeading: "Have a workflow to improve?",
    cta: "Discuss a project", related: "Related projects", previous: "Previous project", next: "Next project",
    languages: "Available experience", identity: "Project identity", connection: "Connected workflow",
  },
  ar: {
    home: "الرئيسية", work: "الأعمال", category: "التصنيف", type: "نوع المشروع", by: "تنفيذ رقميات",
    challenge: "محور المشروع", solution: "التجربة", details: "خصائص المشروع", detailsLead: "ما تتضمنه التجربة العامة.",
    visit: "زيارة الموقع العام", gallery: "واجهات المشروع", ctaHeading: "هل لديك مسار عمل تريد تحسينه؟",
    cta: "ناقش مشروعك", related: "مشاريع ذات صلة", previous: "المشروع السابق", next: "المشروع التالي",
    languages: "اللغات المتاحة", identity: "هوية المشروع", connection: "مسار مترابط",
  },
} as const;

export function ProjectDetailSections({
  project,
  locale,
}: {
  project: PortfolioProject;
  locale: Locale;
}) {
  const text = copy[locale];
  const content = project.locales[locale];
  const related = getRelatedProjects(project.relatedProjects).slice(0, 3);
  const projectIndex = portfolioProjects.findIndex((item) => item.slug === project.slug);
  const adjacent = projectIndex >= 0
    ? [
        { project: portfolioProjects[(projectIndex + portfolioProjects.length - 1) % portfolioProjects.length], label: text.previous },
        { project: portfolioProjects[(projectIndex + 1) % portfolioProjects.length], label: text.next },
      ]
    : [];
  const languages = project.slug === "schooly" || project.slug === "eduflow" || project.slug === "gc-hardware"
    ? locale === "en" ? "English and Arabic" : "العربية والإنجليزية"
    : project.slug === "nora-store" || project.slug === "edtech-platform" || project.slug === "live-workshop"
      ? locale === "en" ? "Arabic interface" : "واجهة عربية"
      : project.slug === "legal-translation"
        ? locale === "en" ? "English interface" : "واجهة إنجليزية"
        : locale === "en" ? "Project information" : "معلومات المشروع";

  return (
    <main className="single-project pt-50 style-5 project-detail" data-project={project.slug}>
      <section className="about-app style-5">
        <div className="container">
          <nav className="project-breadcrumb" aria-label={locale === "en" ? "Breadcrumb" : "مسار التنقل"}>
            <Link href={`/${locale}`}>{text.home}</Link><span aria-hidden="true">/</span>
            <Link href={`/${locale}/portfolio`}>{text.work}</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{content.title}</span>
          </nav>
          <div className="content text-center">
            <h1 className="color-000 mb-50">{content.title}</h1>
            <div className="about-cards border-bottom brd-gray">
              <div className="row">
                <div className="col-lg-3 col-sm-6"><div className="about-card mb-30 mb-lg-0"><small className="d-block">{text.category}</small><h6>{content.category}</h6></div></div>
                <div className="col-lg-3 col-sm-6"><div className="about-card mb-30 mb-lg-0"><small className="d-block">{text.type}</small><h6>{content.projectType}</h6></div></div>
                <div className="col-lg-3 col-sm-6"><div className="about-card mb-30 mb-lg-0"><small className="d-block">{text.languages}</small><h6>{languages}</h6></div></div>
                <div className="col-lg-3 col-sm-6"><div className="about-card mb-30 mb-lg-0"><small className="d-block">{text.by}</small><h6>{locale === "en" ? "Rakmyat" : "رقميات"}</h6></div></div>
              </div>
            </div>
            <div className="img-content pt-70 pb-70 border-bottom brd-gray overflow-hidden">
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-10">
                  {project.assets.cover ? (
                    <a className="project-cover-frame" href={project.assets.cover} data-fancybox="gallery" aria-label={project.assets.coverAlt[locale]}>
                      <picture>
                        {project.assets.mobileCover && <source media="(max-width: 575.98px)" srcSet={project.assets.mobileCover} />}
                        <img className="project-cover-image" src={project.assets.cover} alt={project.assets.coverAlt[locale]} fetchPriority="high" />
                      </picture>
                    </a>
                  ) : (
                    <ProjectIdentity project={project} locale={locale} large />
                  )}
                  <div className="info mt-30 project-overview">
                    <h5 className="lh-4">{content.summary}</h5>
                    <p className="mt-20">{content.overview}</p>
                    {project.links.publicUrl && <a href={project.links.publicUrl} target="_blank" rel="noreferrer" className="color-blue5 mt-20 d-inline-block">{text.visit}<i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></a>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="challenge section-padding style-5 overflow-hidden">
        <div className="container">
          <div className="row gx-5 align-items-start">
            <div className="col-lg-4"><div className="section-head style-5"><h2>{project.slug === "concord-crm" || project.slug === "product-scraper" ? text.challenge : locale === "en" ? "The" : "محور"}<br /><span>{project.slug === "concord-crm" || project.slug === "product-scraper" ? text.connection : locale === "en" ? "challenge" : "المشروع"}</span></h2></div></div>
            <div className="col-lg-8"><div className="inf"><div className="text color-666 mb-20">{content.challenge}</div>{content.features.length > 0 && <ul className="color-000 project-facts">{content.features.slice(0, 4).map((feature) => <li className="d-flex mb-10" key={feature}><i className="bi bi-dot fs-6 me-2" aria-hidden="true" /><span>{feature}</span></li>)}</ul>}</div></div>
          </div>
          {project.assets.gallery.length > 0 && <div className="row project-supporting-images mt-60 mb-60">
            {project.assets.gallery.slice(0, 2).map((image) => <div className="col-lg-6 mb-30" key={image.src}><a href={image.src} data-fancybox="gallery" className="project-supporting-image"><img src={image.src} alt={image.alt[locale]} loading="lazy" /></a></div>)}
          </div>}
          <div className="row gx-5 align-items-start project-solution">
            <div className="col-lg-4"><div className="section-head style-5"><h2>{locale === "en" ? "The" : "شكل"}<br /><span>{locale === "en" ? "experience" : "التجربة"}</span></h2></div></div>
            <div className="col-lg-8"><div className="inf"><div className="text color-666 mb-20">{content.solution}</div>{content.technologies.length > 0 && <div className="project-technologies mt-30"><h5>{locale === "en" ? "Platform and runtime" : "المنصة وبيئة التشغيل"}</h5><ul className="tags">{content.technologies.map((technology) => <li key={technology}><span>{technology}</span></li>)}</ul></div>}</div></div>
          </div>
        </div>
      </section>

      {project.assets.gallery.length > 2 ? (
        <section className="screenshots style-4 project-gallery section-padding">
          <div className="container"><div className="section-head text-center mb-50 style-5"><h2 className="mb-20">{content.galleryHeading}</h2><p>{text.detailsLead}</p></div>
            <div className="row project-gallery-grid">{project.assets.gallery.slice(2).map((image) => <div className="col-lg-6 mb-30" key={image.src}><a href={image.src} data-fancybox="gallery" className="project-gallery-image"><img src={image.src} alt={image.alt[locale]} loading="lazy" /></a></div>)}</div>
          </div>
        </section>
      ) : project.assets.gallery.length === 0 ? (
        <section className="screenshots style-4 project-gallery section-padding"><div className="container"><div className="section-head text-center mb-50 style-5"><h2 className="mb-20">{text.identity}</h2><p>{content.summary}</p></div><ProjectIdentity project={project} locale={locale} /></div></section>
      ) : null}

      <section className="about-app style-5">
        <div className="container"><div className="content text-center"><div className="img-content pt-70 pb-100 border-bottom brd-gray"><div className="row justify-content-center"><div className="col-lg-7"><div className="info mt-30"><h5 className="lh-4">{content.overview}</h5><p className="text color-666 mt-20">{locale === "en" ? "Explore related work or bring a similar business need to Rakmyat." : "استكشف مشاريع ذات صلة أو شارك رقميات احتياجًا مشابهًا في عملك."}</p><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-30"><span>{text.cta}</span></Link></div></div></div></div>
          <div className="next-prog section-padding"><h5 className="color-999 text-uppercase fw-light">{text.related}</h5><nav className="project-neighbor-links" aria-label={text.related}>{adjacent.map(({ project: item, label }) => <Link key={`${label}-${item.slug}`} href={`/${locale}/projects/${item.slug}`} className="color-000 fs-4 fw-bold mt-20"><small>{label}</small><span>{item.locales[locale].title}</span></Link>)}</nav></div>
        </div></div>
      </section>

      {related.length > 0 && <section className="projects style-6 p-0 project-related"><div className="content section-padding rounded-0"><div className="container"><div className="section-head text-center mb-60 style-5"><h2 className="mb-20">{text.related}</h2></div><div className="row">{related.map((item) => <div className="col-lg-4 mb-30" key={item.slug}><article className="project-card style-6"><Link className="img" href={`/${locale}/projects/${item.slug}`}>{item.assets.cover ? <img src={item.assets.cover} alt={item.assets.coverAlt[locale]} loading="lazy" /> : <ProjectIdentity project={item} locale={locale} />}</Link><div className="info"><h3 className="title"><Link href={`/${locale}/projects/${item.slug}`}>{item.locales[locale].title}</Link></h3><small className="color-blue6">{item.locales[locale].category}</small><div className="text">{item.locales[locale].summary}</div></div></article></div>)}</div></div></div></section>}
    </main>
  );
}

function ProjectIdentity({ project, locale, large = false }: { project: PortfolioProject; locale: Locale; large?: boolean }) {
  const content = project.locales[locale];
  const integrationLabel = project.slug === "concord-crm"
    ? "CONCORD CRM   ↔   WOOCOMMERCE"
    : "PRODUCT DATA   →   WOOCOMMERCE";
  return <div className={`project-identity${large ? " project-identity--large" : " project-identity--card"}`} role="img" aria-label={project.assets.coverAlt[locale]}>
    <span className="project-identity-mark" aria-hidden="true">{project.slug === "concord-crm" ? "C" : "P"}</span>
    <span className="project-identity-title">{content.title}</span>
    <span className="project-identity-route" dir="ltr">{integrationLabel}</span>
    <small>{content.category}</small>
  </div>;
}

