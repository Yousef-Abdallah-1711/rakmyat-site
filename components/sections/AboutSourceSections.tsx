import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { ClientLogosSection } from "@/components/sections/ClientLogosSection";
import { ProductReasonsSection } from "@/components/sections/ProductReasonsSection";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { getPageCopy } from "@/content/page-copy";
import type { Locale } from "@/content/i18n";

const decoration = ["/assets/img/header/head5_line.png", "/assets/img/header/head5_pen.png"];

export function AboutSourceSections({ locale = "en" }: { locale?: Locale }) {
  const copy = getPageCopy(locale).about;
  const serviceSummaries = locale === "en"
    ? ["Customer-facing websites, online stores, and application experiences.", "Internal systems that organize business information, roles, and workflows.", "Selected task automation, AI assistance, and links between existing tools."]
    : ["مواقع ومتاجر وتجارب تطبيقات موجهة للعملاء.", "أنظمة داخلية تنظم معلومات العمل والأدوار ومساراته.", "أتمتة مهام محددة ومساعدة ذكية وربط الأدوات الحالية."];
  const form = locale === "en" ? {
    required: "Fields marked required must be completed.",
    name: "Name", email: "Email address", phone: "Phone number (optional)", website: "Website (optional)",
    topic: "Project topic", message: "Tell us about your project", submit: "Send inquiry",
  } : {
    required: "يجب تعبئة الحقول المطلوبة.",
    name: "الاسم", email: "البريد الإلكتروني", phone: "رقم الهاتف (اختياري)", website: "الموقع الإلكتروني (اختياري)",
    topic: "موضوع المشروع", message: "أخبرنا عن مشروعك", submit: "إرسال الاستفسار",
  };
  const topics = locale === "en" ? ["Select a topic", "Project requirements", "Project scope", "Other"] : ["اختر موضوعًا", "متطلبات المشروع", "نطاق المشروع", "أخرى"];
  const fields = [
    { name: "name", label: form.name, placeholder: form.name, type: "text" },
    { name: "email", label: form.email, placeholder: form.email, type: "email" },
    { name: "phone", label: form.phone, placeholder: form.phone, type: "text" },
    { name: "website", label: form.website, placeholder: form.website, type: "text" },
  ];

  return (
    <main className="about-page style-5">
      <header className="about-page-sec style-5">
        <div className="container"><div className="row justify-content-center"><div className="col-lg-8"><div className="info">
          <h1>{copy.heroLead}<br /><span>{copy.heroAccent}<img src={decoration[0]} alt="" className="head-line" /><img src={decoration[1]} alt="" className="head-pen" /></span></h1>
          <p>{copy.heroDescription}</p>
        </div></div><div className="col-lg-12"><div className="main-vid">
          <div className="about-hero-neutral" aria-label={copy.mediaStatus}>{copy.mediaStatus}</div>
        </div></div></div></div>
        <img src="/assets/img/header/hand_megaphone.png" alt="" className="hand-mega slide_up_down" />
        <img src="/assets/img/header/head6_rating.png" alt="" className="head6-rating scale_up_down" />
        <img src="/assets/img/header/header5_linechart.png" alt="" className="head6-charts scale_up_down" />
        <img src="/assets/img/header/rocket.png" alt="" className="head6-rocket" />
      </header>
      <ProductReasonsSection locale={locale} />
      <section className="about section-padding style-5 style-6">
        <div className="content border-0 p-0"><div className="container"><div className="row align-items-center justify-content-between">
          <div className="col-lg-4 order-2 order-lg-0"><div className="section-head mb-30 style-5"><h2>{copy.philosophyHeading}</h2></div><p>{copy.philosophyDescription}</p><div className="line-links">{copy.principles.map((label) => <span key={label}>{label}</span>)}</div></div>
          <div className="col-lg-6"><div className="img"><img src="/assets/img/about/superman_3d.png" alt="" /></div></div>
        </div></div></div><img src="/assets/img/about/about_s6_bubbles.png" alt="" className="bubbles rotate-center" />
      </section>
      <section className="choose-us style-6"><div className="container"><div className="row justify-content-between gx-0">
        <div className="col-lg-6"><div className="img"><img src="/assets/img/choose_us/man_arrow.png" alt="" /></div></div>
        <div className="col-lg-4"><div className="info"><div className="section-head mb-30 style-5"><h2>{copy.servicesHeading}</h2></div><div className="text mb-50 fs-12px color-666">{copy.servicesDescription}</div>
          <ul>{copy.serviceCards.map((label, index) => <li className={index < 2 ? "d-flex mb-40" : "d-flex"} key={label}><small className="icon-50 me-4 flex-shrink-0"><img src={`/assets/img/icons/serv_icons/${[1, 3, 5][index]}.png`} alt="" /></small><div className="inf"><h5>{label}</h5><p className="fs-12px color-666 mt-2">{serviceSummaries[index]}</p></div></li>)}</ul>
          <Link href={`/${locale}/services`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-60 px-5">{locale === "en" ? "Services information" : "معلومات الخدمات"}</Link>
        </div></div>
      </div></div><img src="/assets/img/about/about_s6_bubbles.png" alt="" className="bubbles rotate-center" /></section>
      <ClientLogosSection variant="about" locale={locale} />
      <section className="numbers style-6"><div className="container"><div className="content pb-100 border-1 border-bottom brd-gray"><div className="row">
        {copy.stats.map((stat, index) => <div className="col-lg-4" key={stat.label}><div className={`number-card style-6${index === 2 ? " border-0" : ""}`}><h2 className="me-4 color-blue5"><span>{stat.value}</span></h2><div className="text">{stat.label}</div></div></div>)}
      </div></div></div></section>
      <section className="culture section-padding style-5"><div className="section-head text-center mb-70 style-5"><h2 className="mb-20">{copy.cultureHeading}</h2><p>{copy.cultureDescription}</p></div>
        <div className="content"><div className="culture-slider position-relative pb-80 style-5"><div className="swiper-container"><div className="swiper-wrapper">
          {copy.cultureCards.map((label) => <div className="swiper-slide" key={label}><div className="culture-card neutral-content" aria-label={label}><span>{label}</span></div></div>)}
        </div></div><div className="swiper-pagination" /></div></div>
      </section>
      <section className="team section-padding style-6"><div className="content"><div className="container"><div className="section-head text-center mb-70 style-5"><h2 className="mb-20">{copy.teamHeading}</h2><p>{copy.teamDescription}</p></div><TeamGrid locale={locale} /></div></div></section>
      <section className="contact section-padding border-bottom border-1 brd-gray style-6"><div className="container"><div className="section-head text-center mb-70 style-5"><h2 className="mb-20">{copy.closingHeading}</h2><p>{copy.closingDescription}</p></div>
        <div className="content"><div className="row justify-content-center"><div className="col-lg-8"><p className="text-center mb-30">{locale === "en" ? "This form is not connected; no message will be sent." : "هذا النموذج غير متصل؛ لن يتم إرسال أي رسالة."}</p>
          <ContactForm className="form" locale={locale}><p className="text-center text-danger fs-12px mb-30">{form.required}</p><div className="row">
            {fields.map((field) => <div className="col-lg-6" key={field.name}><div className="form-group mb-20"><input type={field.type} name={field.name} aria-label={field.label} className="form-control" placeholder={field.placeholder} required={field.name === "email"} /></div></div>)}
            <div className="col-lg-12"><div className="form-group mb-20"><select className="form-select" name="topic" aria-label={form.topic} defaultValue=""><option value="" disabled>{topics[0]}</option>{topics.slice(1).map((topic) => <option key={topic}>{topic}</option>)}</select></div></div>
            <div className="col-lg-12"><div className="form-group"><textarea name="message" aria-label={form.message} rows={10} className="form-control" placeholder={form.message} /></div></div>
            <div className="col-lg-12 text-center"><input type="submit" value={form.submit} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold text-light" /></div>
          </div></ContactForm>
        </div></div><img src="/assets/img/icons/contact_a.png" alt="" className="contact_a" /><img src="/assets/img/icons/contact_message.png" alt="" className="contact_message" /></div>
      </div></section>
    </main>
  );
}
