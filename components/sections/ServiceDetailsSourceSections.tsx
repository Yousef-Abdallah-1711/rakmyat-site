import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { getPageCopy } from "@/content/page-copy";
import type { Locale } from "@/content/i18n";

export function ServiceDetailsSourceSections({ locale = "en" }: { locale?: Locale }) {
  const copy = getPageCopy(locale).serviceDetails;
  const contact = locale === "en"
    ? { name: "Name", phone: "Phone number (optional)", email: "Email address", message: "Project details", send: "Send inquiry", note: "This form is not connected; no message will be sent." }
    : { name: "الاسم", phone: "رقم الهاتف (اختياري)", email: "البريد الإلكتروني", message: "تفاصيل المشروع", send: "إرسال الاستفسار", note: "هذا النموذج غير متصل؛ لن يتم إرسال أي رسالة." };
  const related = copy.related;
  return <>
    <section className="inner-header style-5"><div className="container"><div className="content"><div className="links"><Link href={`/${locale}`}>{copy.breadcrumbHome}</Link><span>{copy.breadcrumbPage}</span></div><h2>{copy.title}</h2><img src="/assets/img/header/head7_rock.png" alt="" className="side-img slide_up_down" /></div></div></section>
    <main className="services-details-page style-5"><h1 className="visually-hidden">{copy.title}</h1>
      <section className="ser-details section-padding overflow-hidden"><div className="container"><div className="content"><div className="row gx-5">
        <div className="col-lg-8"><div className="main-info"><div className="main-img img-cover"><img src="/assets/img/services/services2.png" alt="" /></div><h3 className="text-capitalize mb-20">{copy.overviewHeading}</h3><p className="mb-10">{copy.overview[0]}</p><p className="pb-50">{copy.overview[1]}</p>
          <div className="imgs-items border-1 border-bottom border-top brd-gray">{copy.process.map((item, index) => <div className="img-item my-5" key={item.heading}><div className="row align-items-center"><div className="col-lg-2"><div className="icon mb-3 mb-lg-0"><img src={`/assets/img/icons/serv_icons/${index === 0 ? 34 : 35}.png`} alt="" /></div></div><div className="col-lg-10"><h5 className="fw-bold mb-2">{item.heading}</h5><p>{item.description}</p></div></div></div>)}</div>
          <h4 className="mt-5 mb-4">{copy.benefitsHeading}</h4>{copy.benefits.map((label) => <p className="mt-10" key={label}><i className="fas fa-check-circle color-blue5 me-2" aria-hidden="true" /><strong className="color-000">{label}</strong></p>)}
          <div className="testi-card mt-60"><div className="icon"><img src="/assets/img/testimonials/qout.png" alt="" /></div><div className="text">{locale === "en" ? "No client testimonial is published on this page." : "لا تُعرض شهادة عميل في هذه الصفحة."}</div></div>
          <div className="last-next-serv d-flex align-items-center justify-content-between mt-60"><div className="item"><p>{locale === "en" ? "Related topic" : "موضوع ذو صلة"}</p><h5 className="fw-bold">{related[0]}</h5></div><div className="item text-end"><p>{locale === "en" ? "Related topic" : "موضوع ذو صلة"}</p><h5 className="fw-bold">{related[1]}</h5></div></div>
        </div></div>
        <div className="col-lg-4"><div className="side-links mt-5 mt-lg-0"><div className="links-card mb-40"><h5>{copy.relatedHeading}</h5><ul>{related.map((label) => <li key={label}><span><i className="far fa-angle-right icon" aria-hidden="true" />{` ${label} `}</span></li>)}</ul></div>
          <div className="banner1"><div className="title"><h6>{locale === "en" ? "Project" : "المشروع"}</h6><h3>{copy.calloutHeading}</h3></div><Link href={`/${locale}/contact`} className="butn bg-white rounded-pill hover-blue5"><span>{copy.cta}<i className="far fa-long-arrow-right ms-2" aria-hidden="true" /></span></Link><img src="/assets/img/mob1.png" alt="" className="mob" /></div>
        </div></div>
      </div></div></div></section>
      <section className="contact style-5 section-padding"><div className="container"><div className="section-head text-center mb-80 style-5"><h2>{copy.contactHeading}</h2><p>{copy.formDisabled}</p></div><div className="contact-form"><p className="text-center mb-30">{contact.note}</p><ContactForm locale={locale}><div className="row">
        {[contact.name, contact.phone, contact.email].map((label, index) => <div className="col-lg-4" key={label}><div className="form-group"><input type={index === 2 ? "email" : "text"} aria-label={label} className="form-control" placeholder={label} required={index === 2} /><span className="icon"><i className={index === 0 ? "fas fa-user" : index === 1 ? "fas fa-phone" : "fas fa-envelope"} aria-hidden="true" /></span></div></div>)}
        <div className="col-lg-12"><div className="form-group"><textarea rows={6} aria-label={contact.message} placeholder={contact.message} className="form-control" /><span className="icon"><i className="fas fa-pen" aria-hidden="true" /></span></div></div>
        </div><div className="text-center"><button type="submit" className="butn bg-blue5 rounded-3 mt-20 py-3 text-white"><span>{contact.send}<i className="far fa-long-arrow-right ms-2" aria-hidden="true" /></span></button></div></ContactForm></div></div></section>
    </main>
  </>;
}
