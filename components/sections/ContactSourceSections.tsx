import { ContactInquiryForm } from "@/components/forms/ContactInquiryForm";
import { getPageCopy } from "@/content/page-copy";
import type { Locale } from "@/content/i18n";
import styles from "./ContactPage.module.css";

export function ContactSourceSections({ locale = "en" }: { locale?: Locale }) {
  const copy = getPageCopy(locale).contact;
  const direction = locale === "ar" ? "rtl" : "ltr";
  const intro = locale === "en"
    ? {
        eyebrow: "Contact",
        title: "Tell us about the work",
        note: "Share the goal, the people involved, and the systems the project needs to fit. We will review the inquiry and follow up by phone.",
        form: "Project inquiry",
        formNote: "Fields marked optional may be left blank.",
      }
    : {
        eyebrow: "تواصل معنا",
        title: "أخبرنا عن المشروع",
        note: "شاركنا الهدف والأشخاص المعنيين والأنظمة التي يحتاج المشروع إلى التكامل معها. سنراجع الاستفسار ونتابع معك عبر الهاتف.",
        form: "تفاصيل الاستفسار",
        formNote: "يمكن ترك الحقول الاختيارية فارغة.",
      };

  return (
    <main className={`contact-page style-5 ${styles.page}`} dir={direction}>
      <section className={styles.hero} aria-labelledby="contact-page-title">
        <div className="container">
          <div className={`row align-items-center ${styles.heroGrid}`}>
            <div className="col-lg-7">
              <p className={styles.eyebrow}>{intro.eyebrow}</p>
              <h1 id="contact-page-title" className={styles.heroTitle}>{copy.heading}</h1>
              <p className={styles.heroDescription}>{copy.description}</p>
            </div>
            <div className="col-lg-5">
              <div className={styles.heroNote}>
                <span className={styles.noteMark} aria-hidden="true"><span /></span>
                <div>
                  <h2>{intro.title}</h2>
                  <p>{intro.note}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`contact section-padding pt-50 style-6 inquiry-page ${styles.formSection}`} aria-labelledby="contact-form-title">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className={`contact-form inquiry-panel ${styles.formPanel}`}>
                <div className={styles.formHeader}>
                  <span className={styles.formHeaderMark} aria-hidden="true" />
                  <h2 id="contact-form-title">{intro.form}</h2>
                  <p>{intro.formNote}</p>
                </div>
                <ContactInquiryForm locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
