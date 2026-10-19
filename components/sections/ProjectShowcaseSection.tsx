import Link from "next/link";
import type { Locale } from "@/content/i18n";
import { portfolioProjects } from "@/content/portfolio";
import { ProjectShowcaseGrid } from "@/components/projects/ProjectShowcaseGrid";

const copy = {
  en: {
    eyebrow: "Our work",
    heading: <>Projects <span>we've built</span></>,
    description: "A selection of Rakmyat projects across education, commerce, business websites, and connected systems.",
    all: "Explore all projects",
  },
  ar: {
    eyebrow: "أعمالنا",
    heading: <>مشاريع <span>نفخر بتنفيذها</span></>,
    description: "نماذج من مشاريع رقميات في التعليم والتجارة الإلكترونية ومواقع الأعمال والأنظمة المتكاملة.",
    all: "استعرض كل المشاريع",
  },
} as const;

export function ProjectShowcaseSection({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return (
    <section className="project-showcase-home section-padding style-5" aria-labelledby="project-showcase-home-title">
      <div className="container">
        <header className="section-head text-center mb-50 style-5">
          <small className="project-showcase-eyebrow">{text.eyebrow}</small>
          <h2 id="project-showcase-home-title" className="mb-20">{text.heading}</h2>
          <p>{text.description}</p>
        </header>
        <ProjectShowcaseGrid projects={portfolioProjects} locale={locale} variant="home" />
        <div className="project-showcase-all text-center mt-50">
          <Link className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold" href={`/${locale}/portfolio`}>
            <span>{text.all}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
