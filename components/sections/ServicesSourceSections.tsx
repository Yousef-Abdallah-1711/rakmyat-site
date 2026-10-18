import { MarketplaceFeaturesSection } from "@/components/sections/MarketplaceFeaturesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingControls, PricingFeatureRows, PricingIntro, PricingPlanFooter, PricingPlanHeader } from "@/components/pricing/PricingTable";
import { ServicesCarousel } from "@/components/sections/ServicesCarousel";
import { servicesPageContent as content } from "@/content/services";
import Link from "next/link";

export function ServicesSourceSections() {
  return (
    <>
      <ServicesServicesPageStyle5Section1 />
    </>
  );
}

function ServicesServicesPageStyle5Section1() {
  return (
    <main className={"services-page style-5"}>
      <h1 className="visually-hidden">{content.pageHeading}</h1>
      <ServicesFeaturesSectionPaddingSection2 />
      <ServicesServicesSectionPaddingSection3 />
      <ServicesAboutPt0Section4 />
      <ServicesTestimonialsSectionPaddingSection5 />
      <ServicesPricingSectionPaddingSection6 />
    </main>
  );
}

function ServicesFeaturesSectionPaddingSection2() {
  return <MarketplaceFeaturesSection variant="services" />;
}

function ServicesServicesSectionPaddingSection3() {
  return (
    <section className={"services section-padding bg-white pb-50 style-6"}>
      <div className={"container"}>
        <div className={"row justify-content-center"}>
          <div className={"col-lg-8"}>
            <div className={"section-head text-center mb-60 style-5"}>
              <h2 className={"mb-20"}>
                {` ${content.sectionHeading.split(" ").slice(0, 2).join(" ")} `}
                <span>{` ${content.sectionHeading.split(" ").slice(2).join(" ")} `}</span>{" "}
              </h2>
              <p>
                {content.sectionDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={"content"}>
        <ServicesCarousel />
      </div>
    </section>
  );
}

function ServicesAboutPt0Section4() {
  return (
    <section className={"about pt-0 pb-150 style-5"}>
      <div className={"content"}>
        <div className={"container"}>
          <div className={"row align-items-center"}>
            <div className={"col-lg-4 order-2 order-lg-0"}>
              <div className={"section-head mb-30 style-5"}>
                <h2>
                  {` ${content.optimizedHeadingLead} `}
                  <span>{` ${content.optimizedHeadingAccent} `}</span>{" "}
                </h2>
              </div>
              <p>
                {content.optimizedDescription}
              </p>
              <div className={"line-links"}>
                {content.optimizedLinks.map((label) => (
                  <a href={"#"} key={label}>{label}</a>
                ))}
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
                  {content.payment.headingLead}
                  <span>{content.payment.headingAccent}</span>{" "}
                </h2>
              </div>
              <p>
                {
                  content.payment.description
                }
              </p>
              <ul className={"list-icon"}>
                <li>
                  <span className={"icon"}>
                    <i className={"bi bi-check2"}></i>
                  </span>
                  <h6>
                    {
                      content.payment.benefits[0]
                    }
                  </h6>
                </li>
                <li>
                  <span className={"icon"}>
                    <i className={"bi bi-check2"}></i>
                  </span>
                  <h6>
                    {
                      content.payment.benefits[1]
                    }
                  </h6>
                </li>
                <li>
                  <span className={"icon"}>
                    <i className={"bi bi-check2"}></i>
                  </span>
                  <h6>
                    {
                      content.payment.benefits[2]
                    }
                  </h6>
                </li>
              </ul>
              <Link
                href={"/contact"}
                className={
                  "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-50"
                }
              >
                <span>{content.payment.button}</span>
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
                  {content.customization.headingLead}
                  <span>{content.customization.headingAccent}</span>{" "}
                </h2>
              </div>
              <p>
                {
                  content.customization.paragraphs[0]
                }
              </p>
              <p className={"mt-20"}>
                {
                  content.customization.paragraphs[1]
                }
              </p>
              <div className={"d-flex align-items-center mt-70"}>
                <div className={"img me-2 flex-shrink-0"}>
                  <img src={"/assets/img/about/owners.png"} alt={""} />
                </div>
                <div className={"inf"}>
                  <h4 className={"color-blue5 mb-0 lh-1"}>{content.customization.statistic}</h4>
                  <p>{content.customization.statisticLabel}</p>
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

function ServicesTestimonialsSectionPaddingSection5() {
  return (
    <TestimonialsSection />
  );
}

function ServicesPricingSectionPaddingSection6() {
  return (
    <section
      className={
        "pricing section-padding border-bottom border-1 brd-gray style-5"
      }
    >
      <div className={"container"}>
        <PricingIntro />
        <PricingControls />
        <div className={"table-responsive"}>
          <div className={"content"}>
            <PricingPlanHeader />
            <PricingFeatureRows variant="services" />
            <PricingPlanFooter />
          </div>
        </div>
      </div>
    </section>
  );
}
