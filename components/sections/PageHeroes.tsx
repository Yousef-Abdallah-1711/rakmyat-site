import Link from "next/link";
import type { Locale } from "@/content/i18n";
import { getPageHeroCopy } from "@/content/page-heroes";
import styles from "./PageHeroes.module.css";

const decoration = ["/assets/img/header/head5_line.png", "/assets/img/header/head5_pen.png"];
const ecosystem = [
  { image: "/assets/img/icons/service-capabilities/business-websites.webp", id: "experience", index: 0 },
  { image: "/assets/img/icons/service-capabilities/business-systems.webp", id: "operations", index: 1 },
  { image: "/assets/img/icons/service-capabilities/api-integrations.webp", id: "connections", index: 2 },
] as const;

export function AboutCapabilitiesHero({ locale, direction = locale === "ar" ? "rtl" : "ltr" }: { locale: Locale; direction?: "rtl" | "ltr" }) {
  const copy = getPageHeroCopy("home", locale);

  return (
    <header className={`about-page-sec style-5 ${styles.capabilitiesHero}`} dir={direction}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8"><div className="info">
            <h1 id="home-hero-title">{copy.headingLead}<br /><span>{copy.headingAccent}<img src={decoration[0]} alt="" className="head-line" /><img src={decoration[1]} alt="" className="head-pen" /></span></h1>
            <p>{copy.description}</p>
          </div></div>
          <div className="col-lg-12">
            <figure className={styles.heroVisual} aria-labelledby="home-ecosystem-caption" dir="ltr">
              <div className={styles.flow} data-home-capabilities>
                {ecosystem.map(({ image, id, index }) => <div className={styles.flowNode} key={id}>
                  <span className={styles.iconFrame}><img src={image} alt="" /></span>
                  <span className={styles.flowLabel} dir={direction}>{copy.capabilities[index]}</span>
                </div>)}
              </div>
              <figcaption id="home-ecosystem-caption" className={styles.heroCaption} dir={direction}>{copy.caption}</figcaption>
            </figure>
            <div className={`d-flex justify-content-center ${styles.heroCta}`}>
              <Link href={copy.cta.href} className="btn rounded-pill bg-blue5 hover-blue2 sm-butn fw-bold text-white">
                <span>{copy.cta.label} <i className={`bi ${locale === "ar" ? "bi-arrow-left" : "bi-arrow-right"} ms-1`} aria-hidden="true" /></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <img src="/assets/img/header/hand_megaphone.webp" alt="" className="hand-mega slide_up_down" />
      <img src="/assets/img/header/head6_rating.png" alt="" className="head6-rating scale_up_down" />
      <img src="/assets/img/header/header5_linechart.webp" alt="" className="head6-charts scale_up_down" />
      <img src="/assets/img/header/rocket.webp" alt="" className="head6-rocket" />
    </header>
  );
}

export function SoftwareApproachHero({ locale }: { locale: Locale }) {
  const content = getPageHeroCopy("about", locale);
  return (
    <header className="style-5 home-hero">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="info">
              <h1 id="about-hero-title">
                {content.headingLead}
                <span>
                  {content.headingAccent}
                  <img src={decoration[0]} alt="" className="head-line" />
                  <img src={decoration[1]} alt="" className="head-pen" />
                </span>
              </h1>
              <p>{content.description}</p>
              <div className="home-hero-cta">
                <Link href={content.cta.href} className="btn rounded-pill bg-blue5 hover-blue2 sm-butn fw-bold text-white">
                  <span>{`${content.cta.label} `}<i className={`bi ${locale === "ar" ? "bi-arrow-left" : "bi-arrow-right"} ms-1`} aria-hidden="true" /></span>
                </Link>
              </div>
              <div className="main-img">
                <img src="/assets/img/header/header5_page.webp" alt="" className="page-img" fetchPriority="high" />
                <img src="/assets/img/header/header5_linechart.webp" alt="" className="linechart-img" />
                <img src="/assets/img/header/header5_piechart.png" alt="" className="piechart-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <img src="/assets/img/header/header5_handl.webp" alt="" className="handl-img" />
      <img src="/assets/img/header/header5_handr.webp" alt="" className="handr-img" />
    </header>
  );
}
