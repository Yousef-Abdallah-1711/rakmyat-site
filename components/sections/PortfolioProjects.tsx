"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/content/i18n";

const data = {
  en: {
    filter: "Filter discussion topics",
    filters: [{ id: "all", label: "All topics" }, { id: "requirements", label: "Requirements" }, { id: "scope", label: "Scope" }, { id: "workflow", label: "Workflow" }, { id: "planning", label: "Planning" }],
    cards: [
      ["Business need", "requirements"], ["User needs", "requirements"], ["Project scope", "scope"], ["Project boundaries", "scope"],
      ["Current workflow", "workflow"], ["Systems and data", "workflow"], ["Timing questions", "planning"], ["Next steps", "planning"],
    ],
    label: "Discussion topic",
    description: "This is a planning prompt, not a client project or case study.",
    cardNote: "No approved Rakmyat case studies are available for publication.",
    cta: "Discuss a project",
  },
  ar: {
    filter: "تصفية موضوعات النقاش",
    filters: [{ id: "all", label: "كل الموضوعات" }, { id: "requirements", label: "المتطلبات" }, { id: "scope", label: "النطاق" }, { id: "workflow", label: "سير العمل" }, { id: "planning", label: "التخطيط" }],
    cards: [
      ["احتياج العمل", "requirements"], ["احتياجات المستخدمين", "requirements"], ["نطاق المشروع", "scope"], ["حدود المشروع", "scope"],
      ["سير العمل الحالي", "workflow"], ["الأنظمة والبيانات", "workflow"], ["أسئلة الجدول الزمني", "planning"], ["الخطوات التالية", "planning"],
    ],
    label: "موضوع للنقاش",
    description: "هذه نقطة للتخطيط وليست مشروع عميل أو دراسة حالة.",
    cardNote: "لا تتوفر دراسات حالة معتمدة لرقميات للنشر.",
    cta: "ناقش مشروعك",
  },
} as const;

export function PortfolioProjects({ locale = "en" }: { locale?: Locale }) {
  const [filter, setFilter] = useState("all");
  const copy = data[locale];
  return <>
    <div className="controls" role="group" aria-label={copy.filter}>{copy.filters.map(({ id, label }) => <button type="button" key={id} className={`control${filter === id ? " control-active" : ""}`} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div>
    <section className="portfolio style-1"><div className="content"><div className="row mix-container">
      {copy.cards.map(([title, category], index) => <div className={`col-lg-4 mix ${category}`} key={title} hidden={filter !== "all" && filter !== category}><article className={`portfolio-card${index < 7 ? " mb-50" : ""}`}>
        <div className="img neutral-content"><span>{copy.label}</span></div>
        <div className="info"><h5>{title}</h5><small className="d-block color-main text-uppercase">{copy.label}</small><div className="text">{copy.description}</div><div className="tags"><span>{category}</span></div></div>
      </article></div>)}
    </div></div><div className="text-center"><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-30"><span>{copy.cta}</span></Link><p className="mt-20">{copy.cardNote}</p></div></section>
  </>;
}
