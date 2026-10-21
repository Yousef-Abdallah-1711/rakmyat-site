import Link from "next/link";
import type { Locale } from "@/content/i18n";
import { aboutCopy } from "@/content/about-copy";
import { SoftwareApproachHero } from "@/components/sections/PageHeroes";
import styles from "./AboutSourceSections.module.css";

export function AboutSourceSections({ locale = "en" }: { locale?: Locale }) {
  const copy = aboutCopy[locale];

  return (
    <main className={`about-page style-5 ${styles.page}`}>
      <SoftwareApproachHero locale={locale} />

      <section className="community pt-40 style-5">
        <div className="container">
          <div className="section-head text-center mb-40 style-5">
            <h2 className="mb-20">{copy.workHeading}<span>{copy.workAccent}</span></h2>
            <p>{copy.workDescription}</p>
          </div>
          <div className="content rounded-pill">
            {copy.principles.map(({ title, image }) => <div className="commun-card" key={title}>
              <div className="icon"><img src={image} alt="" /></div>
              <div className="inf"><h3>{title}</h3></div>
            </div>)}
          </div>
        </div>
      </section>

      <section className="about section-padding style-5 style-6">
        <div className="content border-0 p-0"><div className="container"><div className="row align-items-center justify-content-between">
          <div className="col-lg-4 order-2 order-lg-0"><div className="section-head mb-30 style-5"><h2>{copy.challengeHeading}</h2></div><p>{copy.challengeDescription}</p><div className="line-links">{copy.challengePoints.map((label) => <span key={label}>{label}</span>)}</div></div>
          <div className="col-lg-6"><div className="img"><img src="/assets/img/about/superman_3d.webp" alt="" /></div></div>
        </div></div></div><img src="/assets/img/about/about_s6_bubbles.png" alt="" className="bubbles rotate-center" />
      </section>

      <section className="choose-us style-6"><div className="container"><div className="row justify-content-between gx-0">
        <div className="col-lg-6"><div className="img"><img src="/assets/img/choose_us/man_arrow.webp" alt="" /></div></div>
        <div className="col-lg-4"><div className="info"><div className="section-head mb-30 style-5"><h2>{copy.capabilitiesHeading}</h2></div><div className="text mb-50 fs-12px color-666">{copy.capabilitiesDescription}</div>
          <ul>{copy.capabilities.map(({ title, description, image }) => <li className="d-flex mb-30" key={title}><small className="icon-50 me-4 flex-shrink-0"><img src={image} alt="" /></small><div className="inf"><h5>{title}</h5><p className="fs-12px color-666 mt-2">{description}</p></div></li>)}</ul>
          <Link href={`/${locale}/services`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-30 px-5">{copy.servicesCta}</Link>
        </div></div>
      </div></div><img src="/assets/img/about/about_s6_bubbles.png" alt="" className="bubbles rotate-center" /></section>

      <section className={`section-padding ${styles.focusSection}`}>
        <div className="container">
          <div className="section-head text-center mb-50 style-5"><h2 className="mb-20">{copy.focusHeading}</h2><p>{copy.focusDescription}</p></div>
          <ul className={styles.focusList} data-about-focus-list>{copy.focusAreas.map((area) => <li key={area}>{area}</li>)}</ul>
        </div>
      </section>

      <section className={`section-padding ${styles.processSection}`}>
        <div className="container">
          <div className="section-head text-center mb-50 style-5"><h2 className="mb-20">{copy.processHeading}</h2><p>{copy.processDescription}</p></div>
          <ol className={styles.processList} data-about-process>{copy.processSteps.map(({ title, description }) => <li key={title}>
            <span className={styles.processNumber} aria-hidden="true" />
            <h3>{title}</h3><p>{description}</p>
          </li>)}</ol>
        </div>
      </section>

      <section className={`contact section-padding border-bottom border-1 brd-gray style-6 ${styles.contactSection}`}>
        <div className="container"><div className="section-head text-center mb-40 style-5"><h2 className="mb-20">{copy.closingHeading}</h2><p>{copy.closingDescription}</p></div>
          <div className="text-center"><Link href={`/${locale}/contact`} className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold px-5">{copy.contactCta}</Link></div>
        </div>
      </section>
    </main>
  );
}
