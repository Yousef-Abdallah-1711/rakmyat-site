import { ContactForm } from "@/components/forms/ContactForm";
import { PricingPeriodInput } from "@/components/sections/PricingPeriod";
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
                {"All-in-one dashboard for\n                            "}
                <span>
                  {
                    "\n                                eCommerce\n                                "
                  }
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
                {
                  "Iteck helps you unify your brand identity by collecting, storing and distributing "
                }
                <br />
                {
                  " design\n                            tokens and assets — automatically."
                }
              </p>
              <ContactForm className={"form"}>
                <div className={"form-group"}>
                  <span className={"icon"}>
                    <i className={"far fa-envelope"}></i>
                  </span>
                  <input type={"text"} placeholder={"Your email address"} />
                  <Link
                    href={"/contact"}
                    className={
                      "btn rounded-pill bg-blue5 hover-blue2 sm-butn fw-bold text-white"
                    }
                  >
                    <span>
                      {"Start Free Trial "}
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
  return (
    <section className={"community pt-40 style-5"}>
      <div className={"container"}>
        <div className={"section-head text-center mb-40 style-5"}>
          <h2 className={"mb-20"}>
            {" Top "}
            <span>{" Reasons "}</span>{" "}
          </h2>
          <p>{"Unify your business data in one simple ecommerce dashboard"}</p>
        </div>
        <div className={"content rounded-pill"}>
          <div className={"commun-card"}>
            <div className={"icon"}>
              <img src={"/assets/img/icons/code3d.png"} alt={""} />
            </div>
            <div className={"inf"}>
              <h5>{"Front-End Friendly"}</h5>
            </div>
          </div>
          <div className={"commun-card"}>
            <div className={"icon"}>
              <img src={"/assets/img/icons/price3d.png"} alt={""} />
            </div>
            <div className={"inf"}>
              <h5>{"Affordable Price"}</h5>
            </div>
          </div>
          <div className={"commun-card"}>
            <div className={"icon"}>
              <img src={"/assets/img/icons/message3d.png"} alt={""} />
            </div>
            <div className={"inf"}>
              <h5>{"Affordable Price"}</h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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
    <section className={"clients style-5 pb-100"}>
      <div className={"section-head text-center mb-40 style-5"}>
        <h2 className={"mb-20"}>
          {" Trusted By Thoudsands "}
          <span>{" Business "}</span>{" "}
        </h2>
        <p>{"More than 15,000 companies trust and choose Iteck"}</p>
      </div>
      <div className={"content"}>
        <div className={"clients-slider5"}>
          <div className={"swiper-container"}>
            <div className={"swiper-wrapper"}>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/7.png"} alt={""} />
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/8.png"} alt={""} />
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/9.png"} alt={""} />
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/10.png"} alt={""} />
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/11.png"} alt={""} />
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/12.png"} alt={""} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={"clients-slider5"} dir={"rtl"}>
          <div className={"swiper-container"}>
            <div className={"swiper-wrapper"}>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/13.png"} alt={""} />
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/14.png"} alt={""} />
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/15.png"} alt={""} />
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/16.png"} alt={""} />
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/17.png"} alt={""} />
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"img"}>
                  <img src={"/assets/img/logos/9.png"} alt={""} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeFeaturesSectionPaddingSection6() {
  return (
    <section className={"features section-padding style-5 bg-gray5"}>
      <div className={"container"}>
        <div className={"row justify-content-center"}>
          <div className={"col-lg-8"}>
            <div className={"section-head text-center mb-60 style-5"}>
              <h2 className={"mb-20"}>
                {" Other Awesome "}
                <span>{" Features "}</span>{" "}
              </h2>
              <p>
                {
                  "Iteck Dashboard is a powerhouse when it comes to the feature list. This ensures you have\n                                every functionality you need to build, run, and expand your marketplace\n                            "
                }
              </p>
            </div>
          </div>
        </div>
        <div className={"content"}>
          <div className={"row"}>
            <div className={"col-lg-3 col-sm-6"}>
              <a href={"#"} className={"features-card mb-30 style-5"}>
                <div className={"icon"}>
                  <img src={"/assets/img/icons/features/1.png"} alt={""} />
                </div>
                <div className={"info"}>
                  <h5 className={"card-title"}>
                    {
                      "\n                                        Store Hours and Vacation\n                                    "
                    }
                  </h5>
                  <p className={"text"}>
                    {
                      "\n                                        Ideal for businesses that are seasonal or operate between fixed hours.\n                                    "
                    }
                  </p>
                </div>
              </a>
            </div>
            <div className={"col-lg-3 col-sm-6"}>
              <a href={"#"} className={"features-card mb-30 style-5"}>
                <div className={"icon"}>
                  <img src={"/assets/img/icons/features/2.png"} alt={""} />
                </div>
                <div className={"info"}>
                  <h5 className={"card-title"}>
                    {
                      "\n                                        Coupon Management\n                                    "
                    }
                  </h5>
                  <p className={"text"}>
                    {
                      "\n                                        Set up irresistible deals and offers with flexible discount promo codes.\n                                    "
                    }
                  </p>
                </div>
              </a>
            </div>
            <div className={"col-lg-3 col-sm-6"}>
              <a href={"#"} className={"features-card mb-30 style-5"}>
                <div className={"icon"}>
                  <img src={"/assets/img/icons/features/3.png"} alt={""} />
                </div>
                <div className={"info"}>
                  <h5 className={"card-title"}>
                    {
                      "\n                                        Product Import and Export\n                                    "
                    }
                  </h5>
                  <p className={"text"}>
                    {
                      "\n                                        Import products from and export products to CSV from vendor dashboard.\n                                    "
                    }
                  </p>
                </div>
              </a>
            </div>
            <div className={"col-lg-3 col-sm-6"}>
              <a href={"#"} className={"features-card mb-30 style-5"}>
                <div className={"icon"}>
                  <img src={"/assets/img/icons/features/4.png"} alt={""} />
                </div>
                <div className={"info"}>
                  <h5 className={"card-title"}>
                    {
                      "\n                                        Inquiry and Support Ticket System\n                                    "
                    }
                  </h5>
                  <p className={"text"}>
                    {
                      "\n                                        Interaction with sellers help buyers to make better purchase decisions.\n                                    "
                    }
                  </p>
                </div>
              </a>
            </div>
            <div className={"col-lg-3 col-sm-6"}>
              <a href={"#"} className={"features-card mb-30 mb-lg-0 style-5"}>
                <div className={"icon"}>
                  <img src={"/assets/img/icons/features/5.png"} alt={""} />
                </div>
                <div className={"info"}>
                  <h5 className={"card-title"}>
                    {
                      "\n                                        Membership Subscription\n                                    "
                    }
                  </h5>
                  <p className={"text"}>
                    {
                      "\n                                        Offer membership plans for sellers, free and paid. Accept recurring fees.\n                                    "
                    }
                  </p>
                </div>
              </a>
            </div>
            <div className={"col-lg-3 col-sm-6"}>
              <a href={"#"} className={"features-card mb-30 mb-lg-0 style-5"}>
                <div className={"icon"}>
                  <img src={"/assets/img/icons/features/6.png"} alt={""} />
                </div>
                <div className={"info"}>
                  <h5 className={"card-title"}>
                    {
                      "\n                                        Invoice and Shipping Labels\n                                    "
                    }
                  </h5>
                  <p className={"text"}>
                    {
                      "\n                                        Order fulfillment made easy with store invoices and shipping labels.\n                                    "
                    }
                  </p>
                </div>
              </a>
            </div>
            <div className={"col-lg-3 col-sm-6"}>
              <a href={"#"} className={"features-card mb-30 mb-lg-0 style-5"}>
                <div className={"icon"}>
                  <img src={"/assets/img/icons/features/7.png"} alt={""} />
                </div>
                <div className={"info"}>
                  <h5 className={"card-title"}>
                    {
                      "\n                                        GEO Location and Radius Search\n                                    "
                    }
                  </h5>
                  <p className={"text"}>
                    {
                      "\n                                        Allow searching products or services near the user’s current location.\n                                    "
                    }
                  </p>
                </div>
              </a>
            </div>
            <div className={"col-lg-3 col-sm-6"}>
              <a href={"#"} className={"features-card style-5"}>
                <div className={"icon"}>
                  <img src={"/assets/img/icons/features/8.png"} alt={""} />
                </div>
                <div className={"info"}>
                  <h5 className={"card-title"}>
                    {
                      "\n                                        Shipment and Delivery\n                                    "
                    }
                  </h5>
                  <p className={"text"}>
                    {
                      "\n                                        Share tracking of deliveries, notify when shipping status changes.\n                                    "
                    }
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePricingSectionPaddingSection7() {
  return (
    <section className={"pricing section-padding style-5"}>
      <div className={"container"}>
        <div className={"section-head text-center mb-60 style-5"}>
          <h2 className={"mb-20"}>
            {" Choose Plan and "}
            <span>{" Kick-start "}</span>{" "}
          </h2>
          <p>
            {
              "\n                        Whether you’re just getting started with rapid testing or scaling across the organization, we’ve\n                        got you covered.\n                    "
            }
          </p>
        </div>
        <div className={"pricing-tabsHead text-center"}>
          <div className={"price-radios"}>
            <div className={"form-check form-check-inline"}>
              <PricingPeriodInput
                className={"form-check-input"}
                type={"radio"}
                name={"inlineRadioOptions"}
                id={"monthly-input"}
                value={"option1"}
              />
              <label className={"form-check-label"} htmlFor={"monthly-input"}>
                {
                  "\n                                Billed Monthly\n                            "
                }
              </label>
            </div>
            <div className={"form-check form-check-inline"}>
              <PricingPeriodInput
                className={"form-check-input"}
                type={"radio"}
                name={"inlineRadioOptions"}
                id={"yearly-input"}
                value={"option2"}
              />
              <label className={"form-check-label"} htmlFor={"yearly-input"}>
                {
                  "\n                                Billed yearly\n                                "
                }
                <small className={"alert-danger text-danger rounded-pill ms-1"}>
                  {"-15%"}
                </small>
              </label>
            </div>
          </div>
        </div>
        <div className={"table-responsive d-none d-lg-block"}>
          <div className={"content"}>
            <div className={"price-head"}>
              <div className={"price-headTitle"}>
                <img src={"/assets/img/icons/price_s5.png"} alt={""} />
              </div>
              <div className={"price-headItem"}>
                <h6>{"basic"}</h6>
                <h2 className={"monthly_price"}>
                  {"Free "}
                  <span>{"/mo"}</span>
                </h2>
                <h2 className={"yearly_price"}>
                  {"Free "}
                  <span>{"/yr"}</span>
                </h2>
                <small>{"Free forever.!"}</small>
                <small>{"No credit card required."}</small>
              </div>
              <div className={"price-headItem bg-gray5"}>
                <h6>{"Premium"}</h6>
                <h2 className={"monthly_price color-blue5"}>
                  {"$49 "}
                  <span>{"/mo"}</span>
                </h2>
                <h2 className={"yearly_price color-blue5"}>
                  {"$49 "}
                  <span>{"/yr"}</span>
                </h2>
                <small>{"Free forever.!"}</small>
                <small>{"No credit card required."}</small>
                <div className={"label"}>
                  {
                    "\n                                    best choice\n                                "
                  }
                </div>
              </div>
              <div className={"price-headItem"}>
                <h6>{"ultimate"}</h6>
                <h2 className={"monthly_price"}>
                  {"$99 "}
                  <span>{"/mo"}</span>
                </h2>
                <h2 className={"yearly_price"}>
                  {"$99 "}
                  <span>{"/yr"}</span>
                </h2>
                <small>{"Free forever.!"}</small>
                <small>{"No credit card required."}</small>
              </div>
            </div>
            <div className={"price-body"}>
              <div className={"price-bodyItems"}>
                <div className={"price-bodyTitle"}>
                  {
                    "\n                                    Unlimited Projects\n                                "
                  }
                </div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
                <div className={"price-item bg-gray5"}>
                  <i className={"bi bi-check2"}></i>
                </div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
              </div>
              <div className={"price-bodyItems"}>
                <div className={"price-bodyTitle"}>
                  {
                    "\n                                    Lifetime Support & SEO Experts Consult\n                                "
                  }
                </div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
                <div className={"price-item bg-gray5"}>
                  <i className={"bi bi-check2"}></i>
                </div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
              </div>
              <div className={"price-bodyItems"}>
                <div className={"price-bodyTitle"}>
                  {
                    "\n                                    Advance Dashboard\n                                "
                  }
                </div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
                <div className={"price-item bg-gray5"}>
                  <i className={"bi bi-check2"}></i>
                </div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
              </div>
              <div className={"price-bodyItems"}>
                <div className={"price-bodyTitle"}>
                  {
                    "\n                                    Data Security & Backup\n                                "
                  }
                </div>
                <div className={"price-item"}>
                  <span>{"200 GB"}</span>
                </div>
                <div className={"price-item bg-gray5"}>
                  <span>{"1 TB"}</span>
                </div>
                <div className={"price-item"}>
                  <span>{"Unlimited"}</span>
                </div>
              </div>
              <div className={"price-bodyItems"}>
                <div className={"price-bodyTitle"}>
                  {
                    "\n                                    Cloud Hosting & Domain\n                                "
                  }
                </div>
                <div className={"price-item"}></div>
                <div className={"price-item bg-gray5"}></div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
              </div>
              <div className={"price-bodyItems"}>
                <div className={"price-bodyTitle"}>
                  {
                    "\n                                    Free Google Analysis\n                                    "
                  }
                  <div className={"pop-info"}>
                    <i className={"fas fa-info-circle bttn-info"}></i>
                    <div className={"hidden_content"}>
                      <div className={"title"}>{"Free Google Analysis"}</div>
                      <small className={"small color-777 lh-5"}>
                        {
                          "\n                                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. In voluptatum,\n                                                eos ad quia sint recusandae.\n                                            "
                        }
                      </small>
                    </div>
                  </div>
                </div>
                <div className={"price-item"}>
                  <span>{"$5/Year"}</span>
                </div>
                <div className={"price-item bg-gray5"}>
                  <i className={"bi bi-check2"}></i>
                </div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
              </div>
              <div className={"price-bodyItems"}>
                <div className={"price-bodyTitle"}>
                  {
                    "\n                                    Multi-Vendor Marketplace Support\n                                "
                  }
                </div>
                <div className={"price-item"}></div>
                <div className={"price-item bg-gray5"}></div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
              </div>
              <div className={"price-bodyItems"}>
                <div className={"price-bodyTitle"}>
                  {
                    "\n                                    Seller App\n                                "
                  }
                </div>
                <div className={"price-item"}></div>
                <div className={"price-item bg-gray5"}>
                  <i className={"bi bi-check2"}></i>
                </div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
              </div>
              <div className={"price-bodyItems"}>
                <div className={"price-bodyTitle"}>
                  {
                    "\n                                    Auto Lifetime Upgrade\n                                    "
                  }
                  <div className={"pop-info"}>
                    <i className={"fas fa-info-circle bttn-info"}></i>
                    <div className={"hidden_content"}>
                      <div className={"title"}>{"Auto Lifetime Upgrade "}</div>
                      <small className={"small color-777 lh-5"}>
                        {
                          "\n                                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. In voluptatum,\n                                                eos ad quia sint recusandae.\n                                            "
                        }
                      </small>
                    </div>
                  </div>
                </div>
                <div className={"price-item"}></div>
                <div className={"price-item bg-gray5"}>
                  <i className={"bi bi-check2"}></i>
                </div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
              </div>
              <div className={"price-bodyItems"}>
                <div className={"price-bodyTitle"}>
                  {
                    "\n                                    Free SSL Certificate\n                                    "
                  }
                  <div className={"pop-info"}>
                    <i className={"fas fa-info-circle bttn-info"}></i>
                    <div className={"hidden_content"}>
                      <div className={"title"}>{"Free SSL Certificate"}</div>
                      <small className={"small color-777 lh-5"}>
                        {
                          "\n                                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. In voluptatum,\n                                                eos ad quia sint recusandae.\n                                            "
                        }
                      </small>
                    </div>
                  </div>
                </div>
                <div className={"price-item"}></div>
                <div className={"price-item bg-gray5"}></div>
                <div className={"price-item"}>
                  <i className={"bi bi-check2"}></i>
                </div>
              </div>
            </div>
            <div className={"price-foot"}>
              <div className={"price-footTitle"}></div>
              <div className={"price-footItem"}>
                <Link
                  href={"/contact"}
                  className={
                    "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"
                  }
                >
                  <span>{" Get Started Now "}</span>
                </Link>
              </div>
              <div className={"price-footItem bg-gray5"}>
                <Link
                  href={"/contact"}
                  className={
                    "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"
                  }
                >
                  <span>{" Get Started Now "}</span>
                </Link>
              </div>
              <div className={"price-footItem"}>
                <Link
                  href={"/contact"}
                  className={
                    "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"
                  }
                >
                  <span>{" Get Started Now "}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={"mob-table d-block d-lg-none mt-5"}>
          <div className={"mob-table-title"}>
            <div className={"row gx-0"}>
              <div className={"col-4"}>
                <div className={"title-item"}>
                  <h6>{" BASIC "}</h6>
                  <h4 className={"monthly_price"}>
                    {"Free "}
                    <span>{"/mo"}</span>
                  </h4>
                  <h4 className={"yearly_price"}>
                    {"Free "}
                    <span>{"/yr"}</span>
                  </h4>
                  <p>
                    {" Free forever.! "}
                    <br />
                    {" No credit card required. "}
                  </p>
                </div>
              </div>
              <div className={"col-4"}>
                <div className={"title-item"}>
                  <h6>{" PREMIUM "}</h6>
                  <h4 className={"monthly_price color-blue5"}>
                    {" $49 "}
                    <span>{"/mo"}</span>
                  </h4>
                  <h4 className={"yearly_price color-blue5"}>
                    {" $49 "}
                    <span>{"/yr"}</span>
                  </h4>
                  <p>
                    {" Free forever.! "}
                    <br />
                    {" No credit card required. "}
                  </p>
                </div>
              </div>
              <div className={"col-4"}>
                <div className={"title-item"}>
                  <h6>{" ULTIMATE "}</h6>
                  <h4 className={"monthly_price"}>
                    {" $99 "}
                    <span>{"/mo"}</span>
                  </h4>
                  <h4 className={"yearly_price"}>
                    {" $99 "}
                    <span>{"/yr"}</span>
                  </h4>
                  <p>
                    {" Free forever.! "}
                    <br />
                    {" No credit card required. "}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={"mob-table-body"}>
            <div className={"table-row"}>
              <h5>{" Unlimited Projects "}</h5>
              <div className={"row gx-0"}>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
              </div>
            </div>
            <div className={"table-row"}>
              <h5>{" Lifetime Support & SEO Experts Consult "}</h5>
              <div className={"row gx-0"}>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
              </div>
            </div>
            <div className={"table-row"}>
              <h5>{" Advance Dashboard "}</h5>
              <div className={"row gx-0"}>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
              </div>
            </div>
            <div className={"table-row"}>
              <h5>{" Data Security & Backup "}</h5>
              <div className={"row gx-0"}>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <span>{"200 GB"}</span>
                  </div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <span>{"1 TB"}</span>
                  </div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <span>{"Unlimited"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={"table-row"}>
              <h5>{" Cloud Hosting & Domain "}</h5>
              <div className={"row gx-0"}>
                <div className={"col-4"}>
                  <div className={"price-item"}></div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}></div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
              </div>
            </div>
            <div className={"table-row"}>
              <h5>{" Free Google Analysis"}</h5>
              <div className={"row gx-0"}>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <span>{" $5/Year "}</span>
                  </div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
              </div>
            </div>
            <div className={"table-row"}>
              <h5>{" Multi-Vendor Marketplace Support "}</h5>
              <div className={"row gx-0"}>
                <div className={"col-4"}>
                  <div className={"price-item"}></div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}></div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
              </div>
            </div>
            <div className={"table-row"}>
              <h5>{" Seller App "}</h5>
              <div className={"row gx-0"}>
                <div className={"col-4"}>
                  <div className={"price-item"}></div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}></div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
              </div>
            </div>
            <div className={"table-row"}>
              <h5>{" Auto Lifetime Upgrade"}</h5>
              <div className={"row gx-0"}>
                <div className={"col-4"}>
                  <div className={"price-item"}></div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
              </div>
            </div>
            <div className={"table-row"}>
              <h5>{" Free SSL Certificate"}</h5>
              <div className={"row gx-0"}>
                <div className={"col-4"}>
                  <div className={"price-item"}></div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}></div>
                </div>
                <div className={"col-4"}>
                  <div className={"price-item"}>
                    <i className={"bi bi-check2"}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"mob-table-foot"}>
            <div className={"row gx-0"}>
              <div className={"col-4"}>
                <div className={"title-item"}>
                  <h6>{" BASIC "}</h6>
                  <Link
                    href={"/contact"}
                    className={
                      "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"
                    }
                  >
                    <span>{" Get Started Now "}</span>
                  </Link>
                </div>
              </div>
              <div className={"col-4"}>
                <div className={"title-item"}>
                  <h6>{" PREMIUM "}</h6>
                  <Link
                    href={"/contact"}
                    className={
                      "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"
                    }
                  >
                    <span>{" Get Started Now "}</span>
                  </Link>
                </div>
              </div>
              <div className={"col-4"}>
                <div className={"title-item"}>
                  <h6>{" ULTIMATE "}</h6>
                  <Link
                    href={"/contact"}
                    className={
                      "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold"
                    }
                  >
                    <span>{" Get Started Now "}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeTestimonialsSectionPaddingSection8() {
  return (
    <section className={"testimonials section-padding bg-gray5 style-5"}>
      <div className={"container"}>
        <div className={"section-head text-center mb-60 style-5"}>
          <h2 className={"mb-20"}>
            {" Clients "}
            <span>{" Reviews "}</span>{" "}
          </h2>
          <p>
            {
              " Iteck loved from thoudsands customer worldwide and get trusted from big companies. "
            }
          </p>
        </div>
      </div>
      <div className={"content"}>
        <div className={"testimonial-slider position-relative style-5"}>
          <div className={"swiper-container pb-70"}>
            <div className={"swiper-wrapper"}>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"testi-card style-5"}>
                  <div className={"stars"}>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                  </div>
                  <div className={"text"}>
                    {
                      "\n                                        “Best dashboard for any your store, woo or shopify. Powerful and very flexiable.\n                                        Recommended!”\n                                    "
                    }
                  </div>
                  <div className={"user mt-40 text-center"}>
                    <div
                      className={
                        "icon-80 rounded-circle img-cover overflow-hidden m-auto"
                      }
                    >
                      <img src={"/assets/img/team/1.jpeg"} alt={""} />
                    </div>
                    <h6>{"Thomas Eristen"}</h6>
                    <small>{"Sale Director at Amazon Retail"}</small>
                  </div>
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"testi-card style-5"}>
                  <div className={"stars"}>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                  </div>
                  <div className={"text"}>
                    {
                      "\n                                        “Iteck provide very much features to help increase CRO so amazing.”\n                                    "
                    }
                  </div>
                  <div className={"user mt-40 text-center"}>
                    <div
                      className={
                        "icon-80 rounded-circle img-cover overflow-hidden m-auto"
                      }
                    >
                      <img src={"/assets/img/team/2.jpeg"} alt={""} />
                    </div>
                    <h6>{" Carlos Martinelli "}</h6>
                    <small>{" SEO & Marketing at Ebay Global "}</small>
                  </div>
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"testi-card style-5"}>
                  <div className={"stars"}>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                  </div>
                  <div className={"text"}>
                    {
                      "\n                                        “Big thank to team support of Iteck. Fast, professional and extremly friendly.\n                                        This product alway update and ehance everyday.”\n                                    "
                    }
                  </div>
                  <div className={"user mt-40 text-center"}>
                    <div
                      className={
                        "icon-80 rounded-circle img-cover overflow-hidden m-auto"
                      }
                    >
                      <img src={"/assets/img/team/3.jpeg"} alt={""} />
                    </div>
                    <h6>{" Eduard Mendy "}</h6>
                    <small>{" VP of Sale Development "}</small>
                  </div>
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a href={"#"} className={"testi-card style-5"}>
                  <div className={"stars"}>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                    <i className={"fas fa-star"}></i>
                  </div>
                  <div className={"text"}>
                    {
                      "\n                                        “10/10 for all related to Iteck E-Com Dashboard. It’s too perfect!”\n                                    "
                    }
                  </div>
                  <div className={"user mt-40 text-center"}>
                    <div
                      className={
                        "icon-80 rounded-circle img-cover overflow-hidden m-auto"
                      }
                    >
                      <img src={"/assets/img/team/4.jpeg"} alt={""} />
                    </div>
                    <h6>{" Lucas Digne "}</h6>
                    <small>{" Sale Product Management at Flipkart "}</small>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className={"swiper-pagination"}></div>
        </div>
      </div>
    </section>
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
                {
                  "Manage your ecommerce business better with an all-in-one\n                                "
                }
                <span>
                  {
                    "\n                                    dashboard\n                                    "
                  }
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
                {
                  "\n                                today\n                            "
                }
              </h2>
              <div className={"butns mt-70"}>
                <a
                  href={"https://apps.apple.com/us/genre/mac/id39?mt=12"}
                  className={
                    "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mx-1"
                  }
                  target={"_blank"}
                >
                  <span>
                    {" Download for MacOS "}
                    <i className={"bi bi-apple ms-1"}></i>{" "}
                  </span>
                </a>
                <a
                  href={"https://apps.microsoft.com/store/apps"}
                  className={
                    "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mx-1"
                  }
                  target={"_blank"}
                >
                  <span>
                    {" Download for Window "}
                    <i className={"bi bi-windows ms-1"}></i>{" "}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
