import Link from "next/link";
import { getPageCopy } from "@/content/page-copy";
import type { Locale } from "@/content/i18n";

export function ServiceDetailsSourceSections({ locale = "en" }: { locale?: Locale }) {
  const copy = getPageCopy(locale).serviceDetails;
  const related = copy.related;
  const inquiryNote = locale === "en" ? "Share your project details through the inquiry form." : "شارك تفاصيل مشروعك عبر نموذج الاستفسار.";
  return <>
    <section className="inner-header style-5"><div className="container"><div className="content"><div className="links"><Link href={`/${locale}`}>{copy.breadcrumbHome}</Link><span>{copy.breadcrumbPage}</span></div><h2>{copy.title}</h2><img src="/assets/img/header/head7_rock.webp" alt="" className="side-img slide_up_down" /></div></div></section>
    <main className="services-details-page style-5"><h1 className="visually-hidden">{copy.title}</h1>
      <section className="ser-details section-padding overflow-hidden"><div className="container"><div className="content"><div className="row gx-5">
        <div className="col-lg-8"><div className="main-info"><div className="main-img img-cover"><img src="/assets/img/services/services2.webp" alt="" /></div><h3 className="text-capitalize mb-20">{copy.overviewHeading}</h3><p className="mb-10">{copy.overview[0]}</p><p className="pb-50">{copy.overview[1]}</p>
          <div className="imgs-items border-1 border-bottom border-top brd-gray">{copy.process.map((item, index) => <div className="img-item my-5" key={item.heading}><div className="row align-items-center"><div className="col-lg-2"><div className="icon mb-3 mb-lg-0"><img src={`/assets/img/icons/serv_icons/${index === 0 ? 34 : 35}.png`} alt="" /></div></div><div className="col-lg-10"><h5 className="fw-bold mb-2">{item.heading}</h5><p>{item.description}</p></div></div></div>)}</div>
          <h4 className="mt-5 mb-4">{copy.benefitsHeading}</h4>{copy.benefits.map((label) => <p className="mt-10" key={label}><i className="fas fa-check-circle color-blue5 me-2" aria-hidden="true" /><strong className="color-000">{label}</strong></p>)}
          <aside className="testi-card mt-60"><div className="icon"><img src="/assets/img/testimonials/qout.png" alt="" /></div><div className="text"><strong>{locale === "en" ? "Illustrative workflow" : "مسار عمل توضيحي"}</strong><p className="mb-0 mt-2">{locale === "en" ? "An example can connect a customer interface, selected business information, and a reviewed next action. The actual design depends on the project." : "يمكن للمثال أن يربط واجهة العميل بمعلومات عمل محددة وخطوة تالية يجري التحقق منها. ويتوقف التصميم الفعلي على المشروع."}</p></div></aside>
          <div className="last-next-serv d-flex align-items-center justify-content-between mt-60"><div className="item"><p>{locale === "en" ? "Related topic" : "موضوع ذو صلة"}</p><h5 className="fw-bold">{related[0]}</h5></div><div className="item text-end"><p>{locale === "en" ? "Related topic" : "موضوع ذو صلة"}</p><h5 className="fw-bold">{related[1]}</h5></div></div>
        </div></div>
        <div className="col-lg-4"><div className="side-links mt-5 mt-lg-0"><div className="links-card mb-40"><h5>{copy.relatedHeading}</h5><ul>{related.map((label) => <li key={label}><span><i className="far fa-angle-right icon" aria-hidden="true" />{` ${label} `}</span></li>)}</ul></div>
          <div className="banner1"><div className="title"><h6>{locale === "en" ? "Project" : "المشروع"}</h6><h3>{copy.calloutHeading}</h3></div><Link href={`/${locale}/contact`} className="butn bg-white rounded-pill hover-blue5"><span>{copy.cta}<i className="far fa-long-arrow-right ms-2" aria-hidden="true" /></span></Link><img src="/assets/img/mob1.webp" alt="" className="mob" /></div>
        </div></div>
      </div></div></div></section>
      <section className="contact style-5 section-padding"><div className="container"><div className="section-head text-center mb-60 style-5"><h2>{copy.contactHeading}</h2><p>{inquiryNote}</p><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-20"><span>{copy.cta}<i className="far fa-long-arrow-right ms-2" aria-hidden="true" /></span></Link></div></div></section>
    </main>
  </>;
}
