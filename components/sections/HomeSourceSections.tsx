import { ProductReasonsSection } from "@/components/sections/ProductReasonsSection";
import { MarketplaceFeaturesSection } from "@/components/sections/MarketplaceFeaturesSection";
import { ClientLogosSection } from "@/components/sections/ClientLogosSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingControls, PricingFeatureRows, PricingIntro, PricingPlanFooter, PricingPlanHeader, PricingMobileTable } from "@/components/pricing/PricingTable";
import { ContactForm } from "@/components/forms/ContactForm";
import { getHomeContent } from "@/content/home";
import type { Locale } from "@/content/i18n";
import Link from "next/link";

export function HomeSourceSections({ locale = "en" }: { locale?: Locale }) {
  return (
    <>
      <HomeStyle5Section1 locale={locale} />
      <HomeMainSection2 locale={locale} />
    </>
  );
}

function HomeStyle5Section1({ locale }: { locale: Locale }) {
  const homePageContent = getHomeContent(locale);
  return (
    <header className={"style-5"}>
      <div className={"container"}>
        <div className={"row justify-content-center"}>
          <div className={"col-lg-8"}>
            <div className={"info"}>
              <h1>
                {homePageContent.hero.headingLead}
                <span>
                  {homePageContent.hero.headingAccent}
                  <img
                    src={"/assets/img/header/head5_line.png"}
                    alt={""}
                    className={"head-line"}
                  />
                  <img
                    src={"/assets/img/header/head5_pen.png"}
                    alt={""}
                    className={"head-pen"}
                  />
                </span>
              </h1>
              <p>
                {homePageContent.hero.descriptionLead}
                <br />
                {homePageContent.hero.descriptionTail}
              </p>
              <ContactForm className={"form"} locale={locale}>
                <div className={"form-group"}>
                  <span className={"icon"}>
                    <i className={"far fa-envelope"}></i>
                  </span>
                  <input
                    type={"email"}
                    aria-label={locale === "ar" ? "البريد الإلكتروني" : "Email address"}
                    placeholder={homePageContent.hero.emailPlaceholder}
                  />
                  <Link
                    href={homePageContent.hero.cta.href}
                    className={
                      "btn rounded-pill bg-blue5 hover-blue2 sm-butn fw-bold text-white"
                    }
                  >
                    <span>
                  {`${homePageContent.hero.cta.label} `}
                      <i className={"bi bi-arrow-right ms-1"}></i>{" "}
                    </span>
                  </Link>
                </div>
              </ContactForm>
              <div className={"main-img"}>
                <img
                  src={"/assets/img/header/header5_page.png"}
                  alt={""}
                  className={"page-img"}
                />
                <img
                  src={"/assets/img/header/header5_linechart.png"}
                  alt={""}
                  className={"linechart-img"}
                />
                <img
                  src={"/assets/img/header/header5_piechart.png"}
                  alt={""}
                  className={"piechart-img"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src={"/assets/img/header/header5_handl.png"}
        alt={""}
        className={"handl-img"}
      />
      <img
        src={"/assets/img/header/header5_handr.png"}
        alt={""}
        className={"handr-img"}
      />
    </header>
  );
}

function HomeMainSection2({ locale }: { locale: Locale }) {
  return (
    <main>
      <HomeCommunityPt40Section3 locale={locale} />
      <HomeAboutSectionPaddingSection4 locale={locale} />
      <HomeClientsStyle5Section5 locale={locale} />
      <HomeFeaturesSectionPaddingSection6 locale={locale} />
      <HomePricingSectionPaddingSection7 locale={locale} />
      <HomeTestimonialsSectionPaddingSection8 locale={locale} />
      <HomeDownloadSectionPaddingSection9 locale={locale} />
    </main>
  );
}

function HomeCommunityPt40Section3({ locale }: { locale: Locale }) {
  return <ProductReasonsSection locale={locale} />;
}

function HomeAboutSectionPaddingSection4({ locale }: { locale: Locale }) {
  const copy = locale === "en" ? {
    sections: ["Start with the need", "Clarify the scope", "Consider next steps"],
    body: ["Describe the task, workflow, or business question you want software to address.", "A project conversation can help define the requirements and boundaries.", "Discuss a possible approach and what information is needed to move forward."],
    values: ["Business need", "Current workflow", "Project scope"],
    heading: "A project conversation",
  } : {
    sections: ["ابدأ بالاحتياج", "وضح النطاق", "ناقش الخطوات التالية"],
    body: ["اشرح المهمة أو سير العمل أو سؤال العمل الذي تريد من البرمجيات معالجته.", "يمكن لمناقشة المشروع أن تساعد في تحديد المتطلبات والحدود.", "ناقش نهجًا ممكنًا والمعلومات اللازمة للمتابعة."],
    values: ["احتياج العمل", "سير العمل الحالي", "نطاق المشروع"],
    heading: "مناقشة مشروع",
  };
  return (
    <section className={"about section-padding style-5"}>
      <div className={"content"}>
        <div className={"container"}>
          <div className={"row align-items-center"}>
            <div className={"col-lg-4 order-2 order-lg-0"}>
              <div className={"section-head mb-30 style-5"}>
                <h2>
                  {locale === "en" ? "Start with" : "ابدأ بـ"}
                  <span>{locale === "en" ? "the need" : "الاحتياج"}</span>{" "}
                </h2>
              </div>
              <p>
                {copy.body[0]}
              </p>
              <div className={"line-links"}>
                {copy.values.map((value) => <Link href={locale === "en" ? "/en/contact" : "/ar/contact"} key={value}>{value}</Link>)}
              </div>
            </div>
            <div className={"col-lg-8 order-0 order-lg-2"}>
              <div className={"img main-img1"}>
                <img
                  src={"/assets/img/about/about_s5_1_1.png"}
                  alt={""}
                  className={"sm-circle"}
                />
                <img
                  src={"/assets/img/about/about_s5_1_2.png"}
                  alt={""}
                  className={"img-body"}
                />
                <img
                  src={"/assets/img/about/about_s5_1_3.png"}
                  alt={""}
                  className={"card1"}
                />
                <img
                  src={"/assets/img/about/about_s5_1_4.png"}
                  alt={""}
                  className={"card2"}
                />
                <img
                  src={"/assets/img/about/about_s5_1_5.png"}
                  alt={""}
                  className={"lg-circle"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"content"}>
        <div className={"container"}>
          <div className={"row align-items-center"}>
            <div className={"col-lg-8"}>
              <div className={"img main-img2"}>
                <img src={"/assets/img/about/about_s5_2_1.png"} alt={""} />
                <img
                  src={"/assets/img/about/about_s5_2_2.png"}
                  alt={""}
                  className={"img-body"}
                />
              </div>
            </div>
            <div className={"col-lg-4"}>
              <div className={"section-head mb-30 style-5"}>
                <h2>
                  {locale === "en" ? "Clarify" : "وضح"}
                  <span>{locale === "en" ? "the scope" : "النطاق"}</span>{" "}
                </h2>
              </div>
              <p>
                {copy.body[1]}
              </p>
              <ul className={"list-icon"}>
                <li>
                  <span className={"icon"}>
                    <i className={"bi bi-check2"}></i>
                  </span>
                  <h6>{locale === "en" ? "Clarify project requirements" : "توضيح متطلبات المشروع"}</h6>
                </li>
                <li>
                  <span className={"icon"}>
                    <i className={"bi bi-check2"}></i>
                  </span>
                  <h6>{locale === "en" ? "Discuss scope and constraints" : "مناقشة النطاق والقيود"}</h6>
                </li>
                <li>
                  <span className={"icon"}>
                    <i className={"bi bi-check2"}></i>
                  </span>
                  <h6>{locale === "en" ? "Agree on next steps" : "الاتفاق على الخطوات التالية"}</h6>
                </li>
              </ul>
              <Link
                href={locale === "ar" ? "/ar/contact" : "/en/contact"}
                className={
                  "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-50"
                }
              >
                <span>{locale === "en" ? "Discuss a project" : "ناقش مشروعك"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={"content pb-0"}>
        <div className={"container"}>
          <div className={"row align-items-center"}>
            <div className={"col-lg-4 order-2 order-lg-0"}>
              <div className={"section-head mb-30 style-5"}>
                <h2>
                  {locale === "en" ? "Consider" : "ناقش"}
                  <span>{locale === "en" ? "next steps" : "الخطوات التالية"}</span>{" "}
                </h2>
              </div>
              <p>
                {copy.body[2]}
              </p>
              <p className={"mt-20"}>
                {locale === "en" ? "Use the conversation to identify the decisions that need to be made first." : "استخدم النقاش لتحديد القرارات التي ينبغي اتخاذها أولًا."}
              </p>
              <div className={"d-flex align-items-center mt-70"}>
                <div className={"img me-2 flex-shrink-0"}>
                  <img src={"/assets/img/about/owners.png"} alt={""} />
                </div>
                <div className={"inf"}>
                  <h4 className={"color-blue5 mb-0 lh-1"}>{locale === "en" ? "Software house" : "شركة برمجيات"}</h4>
                  <p>{locale === "en" ? "Verified company category" : "مجال الشركة المتاح"}</p>
                </div>
              </div>
            </div>
            <div className={"col-lg-8 order-0 order-lg-2"}>
              <div className={"img main-img3"}>
                <img
                  src={"/assets/img/about/about_s5_3_1.png"}
                  alt={""}
                  className={"img-body"}
                />
                <img src={"/assets/img/about/about_s5_3_2.png"} alt={""} />
                <img src={"/assets/img/about/about_s5_3_3.png"} alt={""} />
                <img src={"/assets/img/about/about_s5_3_4.png"} alt={""} />
                <img src={"/assets/img/about/about_s5_3_5.png"} alt={""} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeClientsStyle5Section5({ locale }: { locale: Locale }) {
  return (
    <ClientLogosSection variant="home" locale={locale} />
  );
}

function HomeFeaturesSectionPaddingSection6({ locale }: { locale: Locale }) {
  return <MarketplaceFeaturesSection variant="home" locale={locale} />;
}

function HomePricingSectionPaddingSection7({ locale }: { locale: Locale }) {
  return (
    <section className={"pricing section-padding style-5"}>
      <div className={"container"}>
        <PricingIntro locale={locale} />
        <PricingControls locale={locale} />
        <div className={"table-responsive d-none d-lg-block"}>
          <div className={"content"}>
            <PricingPlanHeader locale={locale} />
            <PricingFeatureRows variant="home" locale={locale} />
            <PricingPlanFooter locale={locale} />
          </div>
        </div>
        <PricingMobileTable locale={locale} />
      </div>
    </section>
  );
}

function HomeTestimonialsSectionPaddingSection8({ locale }: { locale: Locale }) {
  return (
    <TestimonialsSection locale={locale} />
  );
}

function HomeDownloadSectionPaddingSection9({ locale }: { locale: Locale }) {
  const homePageContent = getHomeContent(locale);
  return (
    <section className={"download section-padding style-5"}>
      <div className={"container"}>
        <div className={"row justify-content-center"}>
          <div className={"col-lg-9"}>
            <div className={"content text-center"}>
              <h2>
                {homePageContent.download.headingLead}
                <span>
                  {homePageContent.download.headingAccent}
                  <img src={"/assets/img/header/head5_line.png"} alt={""} className={"head-line"} />
                  <img src={"/assets/img/header/head5_pen.png"} alt={""} className={"head-pen"} />
                </span>
                {homePageContent.download.headingTail}
              </h2>
              <div className={"butns mt-70"}>
                {homePageContent.download.actions.map((action) => (
                  <a
                    href={action.href}
                    className={"btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mx-1"}
                    key={action.href}
                  >
                    <span>
                      {` ${action.label} `}
                      <i className={`${action.icon} ms-1`}></i>{" "}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
