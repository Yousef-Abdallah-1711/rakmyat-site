import { ContactInquiryForm } from "@/components/forms/ContactInquiryForm";
import { getPageCopy } from "@/content/page-copy";
import type { Locale } from "@/content/i18n";

export function ContactSourceSections({ locale = "en" }: { locale?: Locale }) {
  const copy = getPageCopy(locale).contact;
  const intro = locale === "en"
    ? { title: "Tell us about the work", note: "Share the goal, the people involved, and the systems the project needs to fit. We will review the inquiry and follow up by phone.", form: "Project inquiry" }
    : { title: "أخبرنا عن المشروع", note: "شاركنا الهدف والأشخاص المعنيين والأنظمة التي يحتاج المشروع إلى التكامل معها. سنراجع الاستفسار ونتابع معك عبر الهاتف.", form: "تفاصيل الاستفسار" };
  return (
    <main className="contact-page style-5">
      <h1 className="visually-hidden">{copy.heading}</h1>
      <section className="contact section-padding pt-50 style-6 inquiry-page"><div className="container">
        <div className="section-head text-center mb-60 style-5"><h2 className="mb-20">{copy.heading}</h2><p>{copy.description}</p></div>
        <div className="row justify-content-center"><div className="col-lg-9 col-xl-8">
          <div className="inquiry-heading"><h3>{intro.title}</h3><p>{intro.note}</p></div>
          <div className="contact-form inquiry-panel"><h4 className="mb-30">{intro.form}</h4><ContactInquiryForm locale={locale} /></div>
        </div></div>
      </div></section>
    </main>
  );
}
