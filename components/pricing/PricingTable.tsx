import Link from "next/link";
import { getPricingCopy } from "@/content/pricing";
import type { Locale } from "@/content/i18n";

export function PricingIntro({ locale = "en" }: { locale?: Locale }) {
  const copy = getPricingCopy(locale);
  return <div className="section-head text-center mb-60 style-5"><h2 className="mb-20">{` ${copy.heading} `}<span>{` ${copy.accent} `}</span></h2><p>{copy.description}</p></div>;
}

export function PricingControls({ locale = "en" }: { locale?: Locale }) {
  const label = locale === "en" ? "Scope overview" : "نظرة على النطاق";
  const note = getPricingCopy(locale).note;
  return <div className="pricing-tabsHead text-center"><div className="price-radios"><span>{label}: </span><strong>{note}</strong></div></div>;
}

export function PricingPlanHeader({ locale = "en" }: { locale?: Locale }) {
  const copy = getPricingCopy(locale);
  return <div className="price-head"><div className="price-headTitle"><img src="/assets/img/icons/price_s5.png" alt="" /></div>{copy.plans.map((plan, index) => <div className={`price-headItem${index === 1 ? " bg-gray5" : ""}`} key={plan.id}><h6>{plan.name}</h6><h2 className={index === 1 ? "color-blue5" : ""}>{copy.value}</h2><small>{copy.note}</small></div>)}</div>;
}

export function PricingFeatureRows({ variant: _variant, locale = "en" }: { variant: "home" | "services"; locale?: Locale }) {
  const copy = getPricingCopy(locale);
  return <div className="price-body">{copy.rows.map((row) => <div className="price-bodyItems" key={row.id}><div className="price-bodyTitle">{row.label}</div>{copy.plans.map((plan, index) => <div className={`price-item${index === 1 ? " bg-gray5" : ""}`} key={plan.id}><span>{row.values[plan.id]}</span></div>)}</div>)}</div>;
}

export function PricingPlanFooter({ locale = "en" }: { locale?: Locale }) {
  const copy = getPricingCopy(locale);
  return <div className="price-foot"><div className="price-footTitle" />{copy.plans.map((plan, index) => <div className={`price-footItem${index === 1 ? " bg-gray5" : ""}`} key={plan.id}><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"><span>{copy.planCta}</span></Link></div>)}</div>;
}

export function PricingMobileTable({ locale = "en" }: { locale?: Locale }) {
  const copy = getPricingCopy(locale);
  return <div className="mob-table d-block d-lg-none mt-5"><div className="mob-table-title"><div className="row gx-0">{copy.plans.map((plan) => <div className="col-4" key={plan.id}><div className="title-item"><h6>{plan.name}</h6><h4>{copy.value}</h4><p>{copy.note}</p></div></div>)}</div></div><div className="mob-table-body">{copy.rows.map((row) => <div className="table-row" key={row.id}><h5>{row.label}</h5><div className="row gx-0">{copy.plans.map((plan) => <div className="col-4" key={plan.id}><div className="price-item"><span>{row.values[plan.id]}</span></div></div>)}</div></div>)}</div><div className="mob-table-foot"><div className="row gx-0">{copy.plans.map((plan) => <div className="col-4" key={plan.id}><div className="title-item"><h6>{plan.name}</h6><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"><span>{copy.planCta}</span></Link></div></div>)}</div></div></div>;
}
