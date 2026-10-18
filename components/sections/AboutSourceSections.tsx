import { TeamGrid } from "@/components/sections/TeamGrid";
import { ContactForm } from "@/components/forms/ContactForm";
import Link from "next/link";

export function AboutSourceSections() {
  return (
    <>
      <AboutAboutPageStyle5Section1 />
    </>
  );
}

function AboutAboutPageStyle5Section1() {
  return (
    <main className={"about-page style-5"}>
      <AboutAboutPageSecStyle5Section2 />
      <AboutCommunityPt40Section3 />
      <AboutAboutSectionPaddingSection4 />
      <AboutChooseUsStyle6Section5 />
      <AboutClientsSectionPaddingSection6 />
      <AboutNumbersStyle6Section7 />
      <AboutCultureSectionPaddingSection8 />
      <AboutTeamSectionPaddingSection9 />
      <AboutContactSectionPaddingSection10 />
    </main>
  );
}

function AboutAboutPageSecStyle5Section2() {
  return (
    <header className={"about-page-sec style-5"}>
      <div className={"container"}>
        <div className={"row justify-content-center"}>
          <div className={"col-lg-8"}>
            <div className={"info"}>
              <h1>
                {"We provide perfect "}
                <br />
                {
                  " IT Solutions & Technology for any\n                                "
                }
                <span>
                  {
                    "\n                                    Startups\n                                    "
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
                  "\n                                Iteck helps you unify your brand identity by collecting, storing and distributing "
                }
                <br />
                {
                  " design\n                                tokens and assets — automatically.\n                            "
                }
              </p>
            </div>
          </div>
          <div className={"col-lg-12"}>
            <div className={"main-vid"}>
              <img src={"/assets/img/vid_banner5.png"} alt={""} />
              <a
                href={"https://youtu.be/pGbIOC83-So?t=21"}
                data-lity={""}
                className={"play-icon"}
              >
                <i className={"fas fa-play"}></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <img
        src={"/assets/img/header/hand_megaphone.png"}
        alt={""}
        className={"hand-mega slide_up_down"}
      />
      <img
        src={"/assets/img/header/head6_rating.png"}
        alt={""}
        className={"head6-rating scale_up_down"}
      />
      <img
        src={"/assets/img/header/header5_linechart.png"}
        alt={""}
        className={"head6-charts scale_up_down"}
      />
      <img
        src={"/assets/img/header/rocket.png"}
        alt={""}
        className={"head6-rocket"}
      />
    </header>
  );
}

function AboutCommunityPt40Section3() {
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

function AboutAboutSectionPaddingSection4() {
  return (
    <section className={"about section-padding style-5 style-6"}>
      <div className={"content border-0 p-0"}>
        <div className={"container"}>
          <div className={"row align-items-center justify-content-between"}>
            <div className={"col-lg-4 order-2 order-lg-0"}>
              <div className={"section-head mb-30 style-5"}>
                <h2>
                  {" Iteck’s "}
                  <span>{" Philosophy "}</span>{" "}
                </h2>
              </div>
              <p>
                {
                  "\n                                Like any great agency, we are only as good as the result we deliver of our recent work. Our developers are committed to maintaining the highest web standards so that your site. \n                            "
                }
              </p>
              <div className={"line-links"}>
                <a href={"#"}>{"Become 1st in the IT industrial"}</a>
                <a href={"#"}>{"Competitive Price"}</a>
                <a href={"#"}>{"Enhance the quality of life"}</a>
              </div>
            </div>
            <div className={"col-lg-6"}>
              <div className={"img"}>
                <img src={"/assets/img/about/superman_3d.png"} alt={""} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src={"/assets/img/about/about_s6_bubbles.png"}
        alt={""}
        className={"bubbles rotate-center"}
      />
    </section>
  );
}

function AboutChooseUsStyle6Section5() {
  return (
    <section className={"choose-us style-6"}>
      <div className={"container"}>
        <div className={"row justify-content-between gx-0"}>
          <div className={"col-lg-6"}>
            <div className={"img"}>
              <img src={"/assets/img/choose_us/man_arrow.png"} alt={""} />
            </div>
          </div>
          <div className={"col-lg-4"}>
            <div className={"info"}>
              <div className={"section-head mb-30 style-5"}>
                <h2>
                  {" Our "}
                  <span>{" Services "}</span>{" "}
                </h2>
              </div>
              <div className={"text mb-50 fs-12px color-666"}>
                {
                  "\n                                With Iteck Marketplace, choose from hundreds of payment gateways for your customers. \n                            "
                }
              </div>
              <ul>
                <li className={"d-flex mb-40"}>
                  <small className={"icon-50 me-4 flex-shrink-0"}>
                    <img src={"/assets/img/icons/serv_icons/1.png"} alt={""} />
                  </small>
                  <div className={"inf"}>
                    <h5>{"IT Consultation"}</h5>
                    <p className={"fs-12px color-666 mt-2"}>
                      {
                        "\n                                            Nanotechnology immersion along the information high will close the loop on focusing solely\n                                        "
                      }
                    </p>
                  </div>
                </li>
                <li className={"d-flex mb-40"}>
                  <small className={"icon-50 me-4 flex-shrink-0"}>
                    <img src={"/assets/img/icons/serv_icons/3.png"} alt={""} />
                  </small>
                  <div className={"inf"}>
                    <h5>{"Software Design & Development"}</h5>
                    <p className={"fs-12px color-666 mt-2"}>
                      {
                        "\n                                            Our top-notch Experts with much years of experience certail will give best solutions for your business\n                                        "
                      }
                    </p>
                  </div>
                </li>
                <li className={"d-flex"}>
                  <small className={"icon-50 me-4 flex-shrink-0"}>
                    <img src={"/assets/img/icons/serv_icons/5.png"} alt={""} />
                  </small>
                  <div className={"inf"}>
                    <h5>{"Cloud Services"}</h5>
                    <p className={"fs-12px color-666 mt-2"}>
                      {
                        "\n                                            Customer support is always our number one priority.\n                                        "
                      }
                    </p>
                  </div>
                </li>
              </ul>
              <Link
                href={"/services"}
                className={
                  "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-60 px-5"
                }
              >
                <span>{"See More "}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <img
        src={"/assets/img/about/about_s6_bubbles.png"}
        alt={""}
        className={"bubbles rotate-center"}
      />
    </section>
  );
}

function AboutClientsSectionPaddingSection6() {
  return (
    <section className={"clients section-padding style-5"}>
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

function AboutNumbersStyle6Section7() {
  return (
    <section className={"numbers style-6"}>
      <div className={"container"}>
        <div className={"content pb-100 border-1 border-bottom brd-gray"}>
          <div className={"row"}>
            <div className={"col-lg-4"}>
              <div className={"number-card style-6"}>
                <h2 className={"me-4 color-blue5"}>
                  <span className={"counter"}>{"12"}</span>
                  {" +\n                                "}
                </h2>
                <div className={"text"}>
                  {"\n                                    Years "}
                  <br />
                  {" of Experience\n                                "}
                </div>
              </div>
            </div>
            <div className={"col-lg-4"}>
              <div className={"number-card style-6"}>
                <h2 className={"me-4 color-blue5"}>
                  <span className={"counter"}>{"1565"}</span>
                </h2>
                <div className={"text"}>
                  {"\n                                    Projects "}
                  <br />
                  {" completed\n                                "}
                </div>
              </div>
            </div>
            <div className={"col-lg-4"}>
              <div className={"number-card style-6 border-0"}>
                <h2 className={"me-4 color-blue5"}>
                  <span className={"counter"}>{"265"}</span>
                </h2>
                <div className={"text"}>
                  {
                    "\n                                    Satisfied clients on "
                  }
                  <br />
                  {" 24 countries\n                                "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutCultureSectionPaddingSection8() {
  return (
    <section className={"culture section-padding style-5"}>
      <div className={"section-head text-center mb-70 style-5"}>
        <h2 className={"mb-20"}>
          {" Discovery Our "}
          <span>{" Culture "}</span>{" "}
        </h2>
        <p>{"Company’s culture is a part important of any business"}</p>
      </div>
      <div className={"content"}>
        <div className={"culture-slider position-relative pb-80 style-5"}>
          <div className={"swiper-container"}>
            <div className={"swiper-wrapper"}>
              <div className={"swiper-slide"}>
                <a
                  href={"/assets/img/about/cl1.png"}
                  className={"culture-card d-block"}
                  data-fancybox={"gallery"}
                >
                  <img src={"/assets/img/about/cl1.png"} alt={""} />
                  <span className={"overlay"}></span>
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a
                  href={"/assets/img/about/cl2.png"}
                  className={"culture-card d-block"}
                  data-fancybox={"gallery"}
                >
                  <img src={"/assets/img/about/cl2.png"} alt={""} />
                  <span className={"overlay"}></span>
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a
                  href={"/assets/img/about/cl3.png"}
                  className={"culture-card d-block"}
                  data-fancybox={"gallery"}
                >
                  <img src={"/assets/img/about/cl3.png"} alt={""} />
                  <span className={"overlay"}></span>
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a
                  href={"/assets/img/about/cl1.png"}
                  className={"culture-card d-block"}
                  data-fancybox={"gallery"}
                >
                  <img src={"/assets/img/about/cl1.png"} alt={""} />
                  <span className={"overlay"}></span>
                </a>
              </div>
              <div className={"swiper-slide"}>
                <a
                  href={"/assets/img/about/cl2.png"}
                  className={"culture-card d-block"}
                  data-fancybox={"gallery"}
                >
                  <img src={"/assets/img/about/cl2.png"} alt={""} />
                  <span className={"overlay"}></span>
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

function AboutTeamSectionPaddingSection9() {
  return (
    <section className={"team section-padding style-6"}>
      <div className={"content"}>
        <div className={"container"}>
          <div className={"section-head text-center mb-70 style-5"}>
            <h2 className={"mb-20"}>
              {" Our "}
              <span>{" Leaders "}</span>{" "}
            </h2>
            <p>{"Profressional & Friendly is our slogan. Meet our leaders"}</p>
          </div>
          <TeamGrid />
        </div>
      </div>
    </section>
  );
}

function AboutContactSectionPaddingSection10() {
  return (
    <section
      className={
        "contact section-padding border-bottom border-1 brd-gray style-6"
      }
    >
      <div className={"container"}>
        <div className={"section-head text-center mb-70 style-5"}>
          <h2 className={"mb-20"}>
            {" Ready To Start A "}
            <span>{" Projects "}</span>{" "}
          </h2>
          <p>{"We will contact again after receive your request in 24h"}</p>
        </div>
        <div className={"content"}>
          <div className={"row justify-content-center"}>
            <div className={"col-lg-8"}>
              <ContactForm className={"form"}>
                <p className={"text-center text-danger fs-12px mb-30"}>
                  {"The field is required mark as *"}
                </p>
                <div className={"row"}>
                  <div className={"col-lg-6"}>
                    <div className={"form-group mb-20"}>
                      <input
                        type={"text"}
                        name={"name"}
                        className={"form-control"}
                        placeholder={"Name"}
                      />
                    </div>
                  </div>
                  <div className={"col-lg-6"}>
                    <div className={"form-group mb-20"}>
                      <input
                        type={"text"}
                        name={"email"}
                        className={"form-control"}
                        placeholder={"Email Address *"}
                      />
                    </div>
                  </div>
                  <div className={"col-lg-6"}>
                    <div className={"form-group mb-20"}>
                      <input
                        type={"text"}
                        name={"phone"}
                        className={"form-control"}
                        placeholder={"Phone Number (option)"}
                      />
                    </div>
                  </div>
                  <div className={"col-lg-6"}>
                    <div className={"form-group mb-20"}>
                      <input
                        type={"text"}
                        name={"website"}
                        className={"form-control"}
                        placeholder={"Your Website (option)"}
                      />
                    </div>
                  </div>
                  <div className={"col-lg-12"}>
                    <div className={"form-group mb-20"}>
                      <select
                        className={"form-select"}
                        name={"option"}
                        defaultValue={"How can we help you?"}
                      >
                        <option value={"How can we help you?"}>
                          {"How can we help you?"}
                        </option>
                        <option value={"option 1"}>{"option 1"}</option>
                        <option value={"option 2"}>{"option 2"}</option>
                      </select>
                    </div>
                  </div>
                  <div className={"col-lg-12"}>
                    <div className={"form-group"}>
                      <textarea
                        name={"message"}
                        rows={10}
                        className={"form-control"}
                        placeholder={"How can we help you?"}
                      ></textarea>
                    </div>
                  </div>
                  <div className={"col-lg-12 text-center"}>
                    <div className={"form-check d-inline-flex mt-30 mb-30"}>
                      <input
                        className={"form-check-input me-2 mt-0"}
                        type={"checkbox"}
                        value={""}
                        id={"flexCheckDefault"}
                      />
                      <label
                        className={"form-check-label small"}
                        htmlFor={"flexCheckDefault"}
                      >
                        {
                          "\n                                                By submitting, i’m agreed to the "
                        }
                        <a href={"#"} className={"text-decoration-underline"}>
                          {"Terms & Conditons"}
                        </a>
                      </label>
                    </div>
                  </div>
                  <div className={"col-lg-12 text-center"}>
                    <input
                      type={"submit"}
                      value={"Send Your Request"}
                      className={
                        "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold text-light"
                      }
                    />
                  </div>
                </div>
              </ContactForm>
            </div>
          </div>
          <img
            src={"/assets/img/icons/contact_a.png"}
            alt={""}
            className={"contact_a"}
          />
          <img
            src={"/assets/img/icons/contact_message.png"}
            alt={""}
            className={"contact_message"}
          />
        </div>
      </div>
    </section>
  );
}
