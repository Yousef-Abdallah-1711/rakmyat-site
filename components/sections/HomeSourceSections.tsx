import { ProductReasonsSection } from "@/components/sections/ProductReasonsSection";
import { MarketplaceFeaturesSection } from "@/components/sections/MarketplaceFeaturesSection";
import { ClientLogosSection } from "@/components/sections/ClientLogosSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingControls, PricingFeatureRows, PricingIntro, PricingPlanFooter, PricingPlanHeader, PricingMobileTable } from "@/components/pricing/PricingTable";
import { ContactForm } from "@/components/forms/ContactForm";
import { homePageContent } from "@/content/home";
import Link from "next/link";

export function HomeSourceSections() {
  return (
    <>
      <HomeStyle5Section1 />
      <HomeMainSection2 />
    </>
  );
}

function HomeStyle5Section1() {
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
              <ContactForm className={"form"}>
                <div className={"form-group"}>
                  <span className={"icon"}>
                    <i className={"far fa-envelope"}></i>
                  </span>
                  <input
                    type={"email"}
                    aria-label={"Your email address"}
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

function HomeMainSection2() {
  return (
    <main>
      <HomeCommunityPt40Section3 />
      <HomeAboutSectionPaddingSection4 />
      <HomeClientsStyle5Section5 />
      <HomeFeaturesSectionPaddingSection6 />
      <HomePricingSectionPaddingSection7 />
      <HomeTestimonialsSectionPaddingSection8 />
      <HomeDownloadSectionPaddingSection9 />
    </main>
  );
}

function HomeCommunityPt40Section3() {
  return <ProductReasonsSection />;
}

function HomeAboutSectionPaddingSection4() {
  return (
    <section className={"about section-padding style-5"}>
      <div className={"content"}>
        <div className={"container"}>
          <div className={"row align-items-center"}>
            <div className={"col-lg-4 order-2 order-lg-0"}>
              <div className={"section-head mb-30 style-5"}>
                <h2>
                  {" Optimized User "}
                  <span>{" Experiences "}</span>{" "}
                </h2>
              </div>
              <p>
                {
                  "The uploading and updating processes made by suppliers can be streamlined through\n                                front-end dashboards that create better ease of access. "
                }
              </p>
              <div className={"line-links"}>
                <a href={"#"}>{"Sales Breakdown & Funnel"}</a>
                <a href={"#"}>{"Abadoned Carts"}</a>
                <a href={"#"}>{"Revenue by Channel & Devices"}</a>
                <a href={"#"}>{"Sales Forecast"}</a>
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
                  {" 100+ Payment "}
                  <span>{" Gateways "}</span>{" "}
                </h2>
              </div>
              <p>
                {
                  "\n                                With Iteck Marketplace, choose from hundreds of payment gateways for your customers.\n                                From PayPal to Stripe to Skrill, Visa Debit, Master Card, etc\n                            "
                }
              </p>
              <ul className={"list-icon"}>
                <li>
                  <span className={"icon"}>
                    <i className={"bi bi-check2"}></i>
                  </span>
                  <h6>
                    {
                      "\n                                        100% Guarantee Secure Payment\n                                    "
                    }
                  </h6>
                </li>
                <li>
                  <span className={"icon"}>
                    <i className={"bi bi-check2"}></i>
                  </span>
                  <h6>
                    {
                      "\n                                        1% Extra Fees For All\n                                    "
                    }
                  </h6>
                </li>
                <li>
                  <span className={"icon"}>
                    <i className={"bi bi-check2"}></i>
                  </span>
                  <h6>
                    {
                      "\n                                        Support Dispute & Refund 24/7\n                                    "
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
                <span>{" Book A Free Demo "}</span>
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
                  {" Easy To "}
                  <span>{" Customizable "}</span>{" "}
                </h2>
              </div>
              <p>
                {
                  "\n                                Dashboards are meant to be personal tools for website managers and suppliers to enjoy,\n                                and are therefore largely modifiable.\n                            "
                }
              </p>
              <p className={"mt-20"}>
                {
                  "\n                                When it comes to customer actions, website administrators can choose the permissions of\n                                each supplier, allowing them to limit or empower commerce activity as needed.\n                            "
                }
              </p>
              <div className={"d-flex align-items-center mt-70"}>
                <div className={"img me-2 flex-shrink-0"}>
                  <img src={"/assets/img/about/owners.png"} alt={""} />
                </div>
                <div className={"inf"}>
                  <h4 className={"color-blue5 mb-0 lh-1"}>{"42,500+"}</h4>
                  <p>{"Marketplace Owners Trust Us"}</p>
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

function HomeClientsStyle5Section5() {
  return (
    <ClientLogosSection variant="home" />
  );
}

function HomeFeaturesSectionPaddingSection6() {
  return <MarketplaceFeaturesSection variant="home" />;
}

function HomePricingSectionPaddingSection7() {
  return (
    <section className={"pricing section-padding style-5"}>
      <div className={"container"}>
        <PricingIntro />
        <PricingControls />
        <div className={"table-responsive d-none d-lg-block"}>
          <div className={"content"}>
            <PricingPlanHeader />
            <PricingFeatureRows variant="home" />
            <PricingPlanFooter />
          </div>
        </div>
        <PricingMobileTable />
      </div>
    </section>
  );
}

function HomeTestimonialsSectionPaddingSection8() {
  return (
    <TestimonialsSection />
  );
}

function HomeDownloadSectionPaddingSection9() {
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
                    target={"_blank"}
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
