import Link from "next/link";
import type { Locale } from "@/content/i18n";
import { featuredProjectSlugs, getPortfolioProject } from "@/content/portfolio";

const capabilityLabels = {
  en: ["Web & commerce", "Mobile applications", "Business systems", "AI & automation", "Integrations & APIs"],
  ar: ["الويب والتجارة", "تطبيقات الجوال", "أنظمة الأعمال", "الذكاء الاصطناعي والأتمتة", "التكاملات وواجهات API"],
} as const;

export function ClientLogosSection({ variant, locale = "en" }: { variant: "home" | "about"; locale?: Locale }) {
  if (variant === "home") {
    const projects = featuredProjectSlugs.map((slug) => getPortfolioProject(slug)).filter((item) => Boolean(item));
    const copy = locale === "en"
      ? { heading: "Selected", accent: "projects", description: "A look at software work across education, commerce, and product catalogs." }
      : { heading: "نماذج من", accent: "المشاريع", description: "مشاريع في مجالات التعليم والتجارة الإلكترونية وكتالوجات المنتجات." };
    return <section className="clients style-5 pb-100 featured-work-strip">
      <div className="section-head text-center mb-40 style-5"><h2 className="mb-20">{copy.heading} <span>{copy.accent}</span></h2><p>{copy.description}</p></div>
      <div className="content"><div className="clients-slider5">
        <div className="swiper-container"><div className="swiper-wrapper">
          {projects.map((item) => item && <div className="swiper-slide" key={item.slug}><Link href={`/${locale}/projects/${item.slug}`} className="img featured-work-link"><img src={item.assets.cover} alt="" loading="lazy" /><span><strong>{item.locales[locale].title}</strong><small>{item.locales[locale].category}</small></span></Link></div>)}
        </div></div>
      </div></div>
    </section>;
  }

  const labels = capabilityLabels[locale];
  const copy = locale === "en"
    ? { heading: "Company", accent: "focus", description: "Our work spans customer-facing experiences and the software systems behind them." }
    : { heading: "مجالات", accent: "العمل", description: "يمتد العمل من تجارب العملاء إلى الأنظمة البرمجية التي تدعمها." };
  return (
    <section className="clients section-padding style-5">
      <div className="section-head text-center mb-40 style-5"><h2 className="mb-20">{copy.heading} <span>{copy.accent}</span></h2><p>{copy.description}</p></div>
      <div className="content">
        {[0, 1].map((row) => <div className="clients-slider5" dir={row === 1 ? "rtl" : undefined} key={row} aria-hidden={row === 1 || undefined}>
          <div className="swiper-container"><div className="swiper-wrapper">{labels.map((label, index) => <div className="swiper-slide" key={`${row}-${index}`}><div className="img neutral-logo"><span>{label}</span></div></div>)}</div></div>
        </div>)}
      </div>
    </section>
  );
}
