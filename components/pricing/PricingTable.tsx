import Link from "next/link";
import { getPricingCopy, pricingPlans } from "@/content/pricing";
import type { Locale } from "@/content/i18n";

export function PricingIntro({ locale = "en" }: { locale?: Locale }) {
  const copy = getPricingCopy(locale);
  return <div className="section-head text-center mb-60 style-5"><h2 className="mb-20">{` ${copy.heading} `}<span>{` ${copy.accent} `}</span></h2><p>{copy.description}</p></div>;
}

export function PricingControls({ locale = "en" }: { locale?: Locale }) {
  const label = locale === "en" ? "Pricing approach" : "آلية التسعير";
  const note = getPricingCopy(locale).note;
  return <div className="pricing-tabsHead text-center"><div className="price-radios"><span>{label}: </span><strong>{note}</strong></div></div>;
}

export function PricingPlanHeader({ locale = "en" }: { locale?: Locale }) {
  const copy = getPricingCopy(locale);
  return <div className="price-head"><div className="price-headTitle"><img src="/assets/img/icons/price_s5.png" alt="" /></div>{pricingPlans.map((plan, index) => <div className={`price-headItem${plan.id === "premium" ? " bg-gray5" : ""}`} key={plan.id}><h6>{copy.plans[index]}</h6><h2 className={plan.id === "premium" ? "color-blue5" : ""}>{copy.value}</h2><small>{copy.note}</small></div>)}</div>;
}

export function PricingFeatureRows({ variant: _variant, locale = "en" }: { variant: "home" | "services"; locale?: Locale }) {
  const copy = getPricingCopy(locale);
  return <div className="price-body">{copy.rows.map((label) => <div className="price-bodyItems" key={label}><div className="price-bodyTitle">{label}</div>{pricingPlans.map((plan, index) => <div className={`price-item${index === 1 ? " bg-gray5" : ""}`} key={plan.id}><span>{copy.value}</span></div>)}</div>)}</div>;
}

export function PricingPlanFooter({ locale = "en" }: { locale?: Locale }) {
  const copy = getPricingCopy(locale);
  return <div className="price-foot"><div className="price-footTitle" />{pricingPlans.map((plan) => <div className={`price-footItem${plan.id === "premium" ? " bg-gray5" : ""}`} key={plan.id}><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"><span>{copy.planCta}</span></Link></div>)}</div>;
}

export function PricingMobileTable({ locale = "en" }: { locale?: Locale }) {
  const copy = getPricingCopy(locale);
  return <div className="mob-table d-block d-lg-none mt-5"><div className="mob-table-title"><div className="row gx-0">{pricingPlans.map((plan, index) => <div className="col-4" key={plan.id}><div className="title-item"><h6>{copy.plans[index]}</h6><h4>{copy.value}</h4><p>{copy.note}</p></div></div>)}</div></div><div className="mob-table-body">{copy.rows.map((label) => <div className="table-row" key={label}><h5>{label}</h5><div className="row gx-0">{pricingPlans.map((plan) => <div className="col-4" key={plan.id}><div className="price-item"><span>{copy.value}</span></div></div>)}</div></div>)}</div><div className="mob-table-foot"><div className="row gx-0">{pricingPlans.map((plan, index) => <div className="col-4" key={plan.id}><div className="title-item"><h6>{copy.plans[index]}</h6><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"><span>{copy.planCta}</span></Link></div></div>)}</div></div></div>;
}
