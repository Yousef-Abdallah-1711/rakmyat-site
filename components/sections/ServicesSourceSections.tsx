import Link from "next/link";
import { MarketplaceFeaturesSection } from "@/components/sections/MarketplaceFeaturesSection";
import { ServicesWorkflowCards } from "@/components/sections/ServicesWorkflowCards";
import { getPageCopy } from "@/content/page-copy";
import { getServices } from "@/content/services";
import type { Locale } from "@/content/i18n";

export function ServicesSourceSections({ locale = "en" }: { locale?: Locale }) {
  const copy = getPageCopy(locale).services;
  const services = getServices(locale);
  const items = services.map((service) => service.category);
  const scopeQuestions = locale === "en"
    ? ["Identify the users and tasks", "Review current tools and data", "Agree the project scope and next steps"]
    : ["تحديد المستخدمين والمهام", "مراجعة الأدوات والبيانات الحالية", "الاتفاق على نطاق المشروع وخطواته التالية"];
  return (
    <main className="services-page style-5">
      <h1 className="visually-hidden">{copy.pageHeading}</h1>
      <MarketplaceFeaturesSection variant="services" locale={locale} />
      <section className="services section-padding bg-white pb-50 style-6" aria-labelledby="services-workflow-heading"><div className="container" data-services-intro><div className="row justify-content-center"><div className="col-lg-8"><div className="section-head text-center mb-60 style-5"><h2 className="mb-20" id="services-workflow-heading">{copy.introHeading}</h2><p>{copy.introDescription}</p></div></div></div></div><ServicesWorkflowCards locale={locale} /></section>
      <section className="about pt-0 pb-150 style-5"><div className="content"><div className="container"><div className="row align-items-center">
        <div className="col-lg-4 order-2 order-lg-0"><div className="section-head mb-30 style-5"><h2>{copy.benefitHeading}</h2></div><p>{copy.introDescription}</p><div className="line-links">{items.map((label) => <Link href={`/${locale}/contact`} key={label}>{label}</Link>)}</div></div>
        <div className="col-lg-8 order-0 order-lg-2"><div className="img main-img1"><img src="/assets/img/about/about_s5_1_1.png" alt="" className="sm-circle" /><img src="/assets/img/about/about_s5_1_2.webp" alt="" className="img-body" /><img src="/assets/img/about/about_s5_1_3.webp" alt="" className="card1" /><img src="/assets/img/about/about_s5_1_4.webp" alt="" className="card2" /><img src="/assets/img/about/about_s5_1_5.png" alt="" className="lg-circle" /></div></div>
      </div></div></div>
      <div className="content"><div className="container"><div className="row align-items-center"><div className="col-lg-8"><div className="img main-img2"><img src="/assets/img/about/about_s5_2_1.png" alt="" /><img src="/assets/img/about/about_s5_2_2.webp" alt="" className="img-body" /></div></div>
        <div className="col-lg-4"><div className="section-head mb-30 style-5"><h2>{locale === "en" ? "Plan for" : "نخطط وفق"} <span>{locale === "en" ? "real workflows" : "سير العمل"}</span></h2></div><p>{locale === "en" ? "Each solution is shaped around its users, information, existing systems, and agreed project scope." : "يتشكل كل حل وفق مستخدميه ومعلوماته وأنظمته الحالية ونطاق المشروع المتفق عليه."}</p><ul className="list-icon">{scopeQuestions.map((item) => <li key={item}><span className="icon"><i className="bi bi-check2" /></span><p className="workflow-point-label">{item}</p></li>)}</ul><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-50"><span>{copy.closing}</span></Link></div>
      </div></div></div>
      <div className="content pb-0"><div className="container"><div className="row align-items-center"><div className="col-lg-4 order-2 order-lg-0"><div className="section-head mb-30 style-5"><h2>{locale === "en" ? "Discuss" : "ناقش"} <span>{locale === "en" ? "the scope" : "النطاق"}</span></h2></div><p>{locale === "en" ? "Service areas are available for discussion; deliverables, timing, and pricing are defined for each project." : "يمكن مناقشة مجالات الخدمات، وتُحدد المخرجات والمدة والتكلفة لكل مشروع على حدة."}</p><p className="mt-20">{locale === "en" ? "Share the context, users, and systems involved." : "شاركنا سياق العمل والمستخدمين والأنظمة ذات الصلة."}</p><div className="d-flex align-items-center mt-70"><div className="img me-2 flex-shrink-0"><img src="/assets/img/about/owners.png" alt="" /></div><div className="inf"><strong className="service-owner-name color-blue5 mb-0">{locale === "en" ? "Rakmyat" : "رقميات"}</strong><p>{locale === "en" ? "Software house" : "شركة برمجيات"}</p></div></div></div>
        <div className="col-lg-8 order-0 order-lg-2"><div className="img main-img3"><img src="/assets/img/about/about_s5_3_1.png" alt="" className="img-body" /><img src="/assets/img/about/about_s5_3_2.webp" alt="" /><img src="/assets/img/about/about_s5_3_3.webp" alt="" /><img src="/assets/img/about/about_s5_3_4.webp" alt="" /><img src="/assets/img/about/about_s5_3_5.webp" alt="" /></div></div>
      </div></div></div></section>
    </main>
  );
}
