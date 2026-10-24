import { ProductReasonsSection } from "@/components/sections/ProductReasonsSection";
import { ProjectShowcaseSection } from "@/components/sections/ProjectShowcaseSection";
import { HowWeWorkHomeSection } from "@/components/sections/HowWeWork";
import { HomeBlogSection } from "@/components/sections/HomeBlogSection";
import { ServicesWorkflowCards } from "@/components/sections/ServicesWorkflowCards";
import { AboutCapabilitiesHero } from "@/components/sections/PageHeroes";
import { getHomeContent } from "@/content/home";
import { getPageCopy } from "@/content/page-copy";
import type { Locale } from "@/content/i18n";
import Link from "next/link";

export function HomeSourceSections({ locale = "en" }: { locale?: Locale }) {
  const direction = locale === "ar" ? "rtl" : "ltr";
  return (
    <>
      <AboutCapabilitiesHero locale={locale} direction={direction} />
      <HomeMainSection2 locale={locale} direction={direction} />
    </>
  );
}

function HomeMainSection2({ locale, direction }: { locale: Locale; direction: "rtl" | "ltr" }) {
  return (
    <main dir={direction}>
      <HomeCommunityPt40Section3 locale={locale} />
      <HomeAboutSectionPaddingSection4 locale={locale} />
      <HomeFeaturesSectionPaddingSection6 locale={locale} />
      <HowWeWorkHomeSection locale={locale} />
      <HomeBlogSection locale={locale} />
      <HomeClientsStyle5Section5 locale={locale} />
      <HomeDownloadSectionPaddingSection9 locale={locale} />
    </main>
  );
}

function HomeCommunityPt40Section3({ locale }: { locale: Locale }) {
  return <ProductReasonsSection locale={locale} />;
}

function HomeAboutSectionPaddingSection4({ locale }: { locale: Locale }) {
  const copy = locale === "en" ? {
    sections: ["Websites and commerce for customer journeys", "Business systems for real operations", "AI and integrations with clear boundaries"],
    body: ["Plan clear web and e-commerce experiences around what customers need to find, understand, and do.", "Organize information, responsibilities, and recurring workflows in a custom system.", "Connect tools and automate a defined task with selected data and review points."],
    values: ["Web & commerce", "Mobile applications", "Business systems"],
    heading: "Software for real workflows",
  } : {
    sections: ["مواقع ومتاجر تراعي رحلة العميل", "أنظمة أعمال تدعم العمليات", "ذكاء اصطناعي وتكامل بحدود واضحة"],
    body: ["نخطط لتجارب ويب وتجارة إلكترونية واضحة تساعد العملاء على العثور على ما يحتاجون إليه وفهمه واستخدامه.", "ننظم المعلومات والمسؤوليات ومسارات العمل المتكررة في نظام مخصص.", "نربط الأدوات ونؤتمت مهمة محددة ببيانات منتقاة ونقاط مراجعة واضحة."],
    values: ["الويب والتجارة", "تطبيقات الجوال", "أنظمة الأعمال"],
    heading: "برمجيات لسير العمل الفعلي",
  };
  return (
    <section className={"about section-padding style-5"}>
      <div className={"content"}>
        <div className={"container"}>
          <div className={"row align-items-center"}>
            <div className={"col-lg-4 order-2 order-lg-0"}>
              <div className={"section-head mb-30 style-5"}>
                <h2>
                  {locale === "en" ? "Websites &" : "مواقع"}
                  <span>{locale === "en" ? "commerce" : "ومتاجر"}</span>{" "}
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
                  src={"/assets/img/about/about_s5_1_2.webp"}
                  alt={""}
                  className={"img-body"}
                />
                <img
                  src={"/assets/img/about/about_s5_1_3.webp"}
                  alt={""}
                  className={"card1"}
                />
                <img
                  src={"/assets/img/about/about_s5_1_4.webp"}
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
                  src={"/assets/img/about/about_s5_2_2.webp"}
                  alt={""}
                  className={"img-body"}
                />
              </div>
            </div>
            <div className={"col-lg-4"}>
              <div className={"section-head mb-30 style-5"}>
                <h2>
                  {locale === "en" ? "Business" : "أنظمة"}
                  <span>{locale === "en" ? "systems" : "الأعمال"}</span>{" "}
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
                  <p className="workflow-point-label">{locale === "en" ? "Map the information each workflow needs" : "تحديد المعلومات التي يحتاج إليها كل مسار عمل"}</p>
                </li>
                <li>
                  <span className={"icon"}>
                    <i className={"bi bi-check2"}></i>
                  </span>
                  <p className="workflow-point-label">{locale === "en" ? "Review available systems and interfaces" : "مراجعة الأنظمة والواجهات المتاحة"}</p>
                </li>
                <li>
                  <span className={"icon"}>
                    <i className={"bi bi-check2"}></i>
                  </span>
                  <p className="workflow-point-label">{locale === "en" ? "Plan how data should move between tools" : "تخطيط انتقال البيانات بين الأدوات"}</p>
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
                  {locale === "en" ? "AI &" : "ذكاء اصطناعي"}
                  <span>{locale === "en" ? "integrations" : "وتكامل"}</span>{" "}
                </h2>
              </div>
              <p>
                {copy.body[2]}
              </p>
              <p className={"mt-20"}>
                {locale === "en" ? "Choose a defined task, approved information sources, and a clear point for human review." : "نحدد المهمة ومصادر المعلومات ونقطة المراجعة البشرية بوضوح."}
              </p>
              <div className={"d-flex align-items-center mt-70"}>
                <div className={"img me-2 flex-shrink-0"}>
                  <img src={"/assets/img/about/owners.png"} alt={""} />
                </div>
                <div className={"inf"}>
                  <h3 className={"color-blue5 mb-0 lh-1 workflow-subheading"}>{locale === "en" ? "AI & automation" : "الذكاء الاصطناعي والأتمتة"}</h3>
                  <p>{locale === "en" ? "Defined tasks, sources, and review" : "مهام ومصادر ومراجعة محددة"}</p>
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
                <img src={"/assets/img/about/about_s5_3_2.webp"} alt={""} />
                <img src={"/assets/img/about/about_s5_3_3.webp"} alt={""} />
                <img src={"/assets/img/about/about_s5_3_4.webp"} alt={""} />
                <img src={"/assets/img/about/about_s5_3_5.webp"} alt={""} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeClientsStyle5Section5({ locale }: { locale: Locale }) {
  return <ProjectShowcaseSection locale={locale} />;
}

function HomeFeaturesSectionPaddingSection6({ locale }: { locale: Locale }) {
  const copy = getPageCopy(locale).services;

  return (
    <section className="services section-padding bg-white pb-50 style-6" aria-labelledby="home-services-workflow-heading" data-home-services>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="section-head text-center mb-60 style-5">
              <h2 className="mb-20" id="home-services-workflow-heading">{copy.introHeading}</h2>
              <p>{copy.introDescription}</p>
            </div>
          </div>
        </div>
      </div>
      <ServicesWorkflowCards locale={locale} />
    </section>
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
