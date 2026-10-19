import { ContactForm } from "@/components/forms/ContactForm";
import { getPageCopy } from "@/content/page-copy";
import type { Locale } from "@/content/i18n";

export function ContactSourceSections({ locale = "en" }: { locale?: Locale }) {
  const copy = getPageCopy(locale).contact;
  const fields = locale === "en"
    ? { name: "Name", email: "Email address", phone: "Phone number (optional)", website: "Website (optional)", topic: "Project topic", message: "Tell us about your project", submit: "Send inquiry", required: "Required" }
    : { name: "الاسم", email: "البريد الإلكتروني", phone: "رقم الهاتف (اختياري)", website: "الموقع الإلكتروني (اختياري)", topic: "موضوع المشروع", message: "أخبرنا عن مشروعك", submit: "إرسال الاستفسار", required: "مطلوب" };
  const topicOptions = locale === "en" ? ["Select a topic", "Project requirements", "Project scope", "Other"] : ["اختر موضوعًا", "متطلبات المشروع", "نطاق المشروع", "أخرى"];

  return (
    <main className="contact-page style-5">
      <h1 className="visually-hidden">{copy.heading}</h1>
      <section className="contact section-padding pt-50 style-6"><div className="container">
        <div className="section-head text-center mb-100 style-5"><h2 className="mb-20">{copy.heading}</h2><p>{copy.description}</p></div>
        <div className="text-center mb-100"><h4 className="fw-normal mb-20 color-000">{copy.contactStatus}</h4></div>
        <div className="content"><div className="row justify-content-center"><div className="col-lg-8">
          <h3 className="text-center mb-20">{copy.formTitle}</h3>
          <p className="text-center mb-30">{locale === "en" ? "This form is not connected; no message will be sent." : "هذا النموذج غير متصل؛ لن يتم إرسال أي رسالة."}</p>
          <ContactForm className="form" locale={locale}>
            <p className="text-center text-danger fs-12px mb-30">{fields.required}: *</p><div className="row">
              {([fields.name, fields.email, fields.phone, fields.website] as const).map((label, index) => {
                const name = ["name", "email", "phone", "website"][index];
                return <div className="col-lg-6" key={name}><div className="form-group mb-20"><input type={index === 1 ? "email" : "text"} name={name} aria-label={label} className="form-control" placeholder={label} required={index === 1} /></div></div>;
              })}
              <div className="col-lg-12"><div className="form-group mb-20"><select name="topic" aria-label={fields.topic} className="form-select" defaultValue=""><option value="" disabled>{topicOptions[0]}</option>{topicOptions.slice(1).map((topic) => <option key={topic}>{topic}</option>)}</select></div></div>
              <div className="col-lg-12"><div className="form-group"><textarea rows={10} name="message" aria-label={fields.message} className="form-control" placeholder={fields.message} /></div></div>
              <div className="col-lg-12 text-center"><input type="submit" value={fields.submit} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold text-light" /></div>
            </div>
          </ContactForm>
        </div></div>
          <img src="/assets/img/icons/contact_a.png" alt="" className="contact_a" /><img src="/assets/img/icons/contact_message.png" alt="" className="contact_message" />
        </div>
      </div></section>
      <div className="map"><div className="map-unconfigured" role="note">{locale === "en" ? "No public office location is listed." : "لا يوجد عنوان مكتب معلن."}</div></div>
    </main>
  );
}
