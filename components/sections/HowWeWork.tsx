import Link from "next/link";
import type { Locale } from "@/content/i18n";
import { processCopy, type ProcessStage } from "@/content/process";
import { JourneyArtwork, ProcessArtwork, type ProcessIconId } from "@/components/sections/ProcessArtwork";
import styles from "./HowWeWork.module.css";

const stageIcons: ProcessIconId[] = ["discovery", "analysis", "documents", "flows", "agreement", "design", "development", "testing", "launch"];

function StepCard({ stage, index, locale, detailed = false }: { stage: ProcessStage; index: number; locale: Locale; detailed?: boolean }) {
  return (
    <article className={`${styles.stepCard} ${detailed ? styles.detailCard : ""}`} id={detailed ? `process-step-${index + 1}` : undefined}>
      <span className={styles.stepNumber} dir="ltr">{String(index + 1).padStart(2, "0")}</span>
      <div className={styles.stepArtwork}><ProcessArtwork icon={stageIcons[index]} /></div>
      <div className={styles.stepBody}>
        <h3>{stage.title}</h3>
        <p className={styles.stepSummary}>{stage.summary}</p>
        {detailed && <>
          <p className={styles.stepDetail}>{stage.detail}</p>
          <h4>{locale === "en" ? "Key activities" : "الأنشطة الرئيسية"}</h4>
          <ul className={styles.activityList}>{stage.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul>
          <div className={styles.deliverable}><span>{locale === "en" ? "Deliverable" : "المخرج"}</span><p>{stage.deliverable}</p></div>
          <div className={styles.clientRole}><span>{locale === "en" ? "Your role" : "دورك"}</span><p>{stage.clientRole}</p></div>
        </>}
      </div>
    </article>
  );
}

export function HowWeWorkHomeSection({ locale }: { locale: Locale }) {
  const copy = processCopy[locale];
  return (
    <section className={`${styles.homeSection} section-padding`} aria-labelledby="how-we-work-home-title" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>{locale === "en" ? "A clear project journey" : "مسار واضح للمشروع"}</span>
          <h2 id="how-we-work-home-title">{copy.title}</h2>
          <p>{copy.homeDescription}</p>
        </div>
        <ol className={styles.overviewGrid}>
          {copy.stages.map((stage, index) => <li key={stage.title}><StepCard stage={stage} index={index} locale={locale} /></li>)}
        </ol>
        <div className={styles.homeActions}>
          <Link href={`/${locale}/how-we-work`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold">
            <span>{copy.homeCta}<i className={`bi ${locale === "ar" ? "bi-arrow-left" : "bi-arrow-right"} ms-1`} aria-hidden="true" /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HowWeWorkPage({ locale }: { locale: Locale }) {
  const copy = processCopy[locale];
  const isArabic = locale === "ar";
  return (
    <main className={styles.processPage} dir={isArabic ? "rtl" : "ltr"}>
      <header className={styles.pageHero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>{isArabic ? "منهجية رقميات" : "The Rakmyat approach"}</span>
              <h1>{copy.title}</h1>
              <h2>{copy.subtitle}</h2>
              <p>{copy.description}</p>
              <Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold">
                <span>{copy.contactCta}<i className={`bi ${isArabic ? "bi-arrow-left" : "bi-arrow-right"} ms-1`} aria-hidden="true" /></span>
              </Link>
            </div>
            <JourneyArtwork locale={locale} />
          </div>
        </div>
      </header>

      <section className={styles.contentSection} aria-labelledby="process-overview-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>{isArabic ? "من البداية إلى التسليم" : "From first conversation to handover"}</span>
            <h2 id="process-overview-title">{copy.overviewTitle}</h2>
            <p>{copy.description}</p>
          </div>
          <ol className={styles.overviewGrid}>
            {copy.stages.map((stage, index) => <li key={stage.title}><a className={styles.overviewLink} href={`#process-step-${index + 1}`} aria-label={`${String(index + 1).padStart(2, "0")}: ${stage.title}`}><StepCard stage={stage} index={index} locale={locale} /></a></li>)}
          </ol>
        </div>
      </section>

      <section className={`${styles.contentSection} ${styles.detailSection}`} aria-labelledby="process-journey-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>{isArabic ? "التفاصيل والمخرجات" : "Activities, outputs, and collaboration"}</span>
            <h2 id="process-journey-title">{copy.journeyTitle}</h2>
          </div>
          <div className={styles.detailList}>
            {copy.stages.map((stage, index) => <StepCard key={stage.title} stage={stage} index={index} locale={locale} detailed />)}
          </div>
        </div>
      </section>

      <section className={styles.contentSection} aria-labelledby="process-documents-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>{isArabic ? "توثيق مناسب للنطاق" : "Documentation shaped to scope"}</span>
            <h2 id="process-documents-title">{copy.documentsTitle}</h2>
            <p>{copy.documentsIntro}</p>
          </div>
          <div className={styles.documentGrid}>
            {copy.documents.map((document) => <article className={styles.documentCard} key={document.acronym}><span className={styles.documentMark}>{document.acronym}</span><div><h3>{document.name}</h3><p>{document.description}</p></div></article>)}
          </div>
          <div className={styles.supportingDocs}><h3>{isArabic ? "مواد أخرى بحسب الحاجة" : "Other useful project records"}</h3><ul>{copy.supportingArtifacts.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <p className={styles.note}>{copy.documentsNote}</p>
        </div>
      </section>

      <section className={`${styles.contentSection} ${styles.approvalSection}`} aria-labelledby="process-approval-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>{isArabic ? "مشاركة العميل" : "Client collaboration"}</span>
            <h2 id="process-approval-title">{copy.approvalTitle}</h2>
            <p>{copy.approvalIntro}</p>
          </div>
          <ol className={styles.checkpointGrid}>
            {copy.checkpoints.map((checkpoint, index) => <li className={styles.checkpoint} key={checkpoint.title}><span className={styles.checkpointNumber} dir="ltr">{String(index + 1).padStart(2, "0")}</span><h3>{checkpoint.title}</h3><p>{checkpoint.description}</p></li>)}
          </ol>
        </div>
      </section>

      <section className={styles.contentSection} aria-labelledby="process-release-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>{isArabic ? "قبل النشر وبعده" : "Before and after release"}</span>
            <h2 id="process-release-title">{copy.releaseTitle}</h2>
            <p>{copy.releaseIntro}</p>
          </div>
          <ol className={styles.releaseFlow}>{copy.releaseSteps.map((step, index) => <li className={styles.releaseStep} key={step}><span className={styles.releaseNumber} dir="ltr">{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < copy.releaseSteps.length - 1 && <span className={styles.flowArrow} aria-hidden="true">{isArabic ? "←" : "→"}</span>}</li>)}</ol>
          <div className={styles.releaseNotes}><p>{isArabic ? "بيئة التجربة مخصصة للاختبار قبل الإطلاق. تُعالج المشكلات المكتشفة قبل القبول النهائي." : "Staging is used for testing before launch. Identified issues are addressed before final acceptance."}</p><p>{isArabic ? "يُنسق النشر على بيئة استضافة العميل أو مزود متفق عليه، ويشمل التسليم ما تم الاتفاق عليه في نطاق المشروع." : "Production deployment is coordinated with the client’s hosting environment or an agreed provider. Handover follows the agreed project scope."}</p></div>
        </div>
      </section>

      <section className={`${styles.contentSection} ${styles.faqSection}`} aria-labelledby="process-faq-title">
        <div className="container">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>{isArabic ? "إجابات عملية" : "Practical answers"}</span><h2 id="process-faq-title">{copy.faqTitle}</h2></div>
          <div className={styles.faqList}>{copy.faq.map((item) => <details className={styles.faqItem} key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="process-final-title">
        <div className="container">
          <div className={styles.finalCtaInner}><span className={styles.ctaSpark} aria-hidden="true" /><h2 id="process-final-title">{copy.finalTitle}</h2><p>{copy.finalText}</p><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"><span>{copy.contactCta}<i className={`bi ${isArabic ? "bi-arrow-left" : "bi-arrow-right"} ms-1`} aria-hidden="true" /></span></Link></div>
        </div>
      </section>
    </main>
  );
}
