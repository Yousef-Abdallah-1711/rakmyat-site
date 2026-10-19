"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/content/i18n";
import { getServices } from "@/content/services";

const copy = {
  en: {
    filter: "Filter capabilities",
    filters: [
      { id: "all", label: "All capabilities" },
      { id: "web-commerce", label: "Web & commerce" },
      { id: "mobile-apps", label: "Applications" },
      { id: "business-systems", label: "Business systems" },
      { id: "connected", label: "AI & integrations" },
    ],
    label: "Service capability",
    cardNote: "These cards describe service areas, not completed client projects. Candidate project case studies remain unpublished pending review.",
    cta: "Discuss a project",
  },
  ar: {
    filter: "تصفية مجالات القدرات",
    filters: [
      { id: "all", label: "كل القدرات" },
      { id: "web-commerce", label: "الويب والتجارة" },
      { id: "mobile-apps", label: "التطبيقات" },
      { id: "business-systems", label: "أنظمة الأعمال" },
      { id: "connected", label: "الذكاء الاصطناعي والتكامل" },
    ],
    label: "مجال خدمة",
    cardNote: "تعرض هذه البطاقات مجالات الخدمات، ولا تمثل مشاريع منفذة لعملاء. تظل دراسات المشاريع المرشحة غير منشورة حتى مراجعتها.",
    cta: "ناقش مشروعك",
  },
} as const;

function serviceCategory(id: string) {
  return id === "ai-automation" || id === "integrations-apis" ? "connected" : id;
}

export function PortfolioProjects({ locale = "en" }: { locale?: Locale }) {
  const [filter, setFilter] = useState("all");
  const labels = copy[locale];
  const services = getServices(locale);
  return <>
    <div className="controls" role="group" aria-label={labels.filter}>
      {labels.filters.map(({ id, label }) => <button type="button" key={id} className={`control${filter === id ? " control-active" : ""}`} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}
    </div>
    <section className="portfolio style-1"><div className="content"><div className="row mix-container">
      {services.map((service, index) => <div className={`col-lg-4 mix ${serviceCategory(service.id)}`} key={service.id} hidden={filter !== "all" && filter !== serviceCategory(service.id)}>
        <article className={`portfolio-card${index < services.length - 1 ? " mb-50" : ""}`}>
          <div className="img neutral-content"><span>{service.category}</span></div>
          <div className="info"><h5>{service.title}</h5><small className="d-block color-main text-uppercase">{labels.label}</small><div className="text">{service.summary}</div><ul className="tags">{service.capabilities.slice(0, 3).map((capability) => <li key={capability}><span>{capability}</span></li>)}</ul></div>
        </article>
      </div>)}
    </div></div><div className="text-center"><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-30"><span>{labels.cta}</span></Link><p className="mt-20">{labels.cardNote}</p></div></section>
  </>;
}
