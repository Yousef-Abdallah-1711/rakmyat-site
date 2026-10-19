import type { Locale } from "@/content/i18n";
import { getPageCopy } from "@/content/page-copy";

export function TeamGrid({ locale = "en" }: { locale?: Locale }) {
  const labels = getPageCopy(locale).about.teamCards;
  const subtitle = locale === "en" ? "Software practice" : "ممارسة برمجية";
  return <div className="row">{labels.map((label, index) => <div className="col-lg-3 col-sm-6" key={label}><article className={`team-card${index < labels.length - 1 ? " mb-30 mb-lg-0" : ""} style-6`}><div className="img neutral-content"><span>{label}</span></div><div className="info"><h6>{label}</h6><small>{subtitle}</small></div></article></div>)}</div>;
}
