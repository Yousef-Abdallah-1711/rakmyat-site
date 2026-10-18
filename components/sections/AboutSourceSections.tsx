import { ProductReasonsSection } from "@/components/sections/ProductReasonsSection";
import { aboutPageContent as content } from "@/content/about";
import { ClientLogosSection } from "@/components/sections/ClientLogosSection";
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
                {content.hero.headingLead}
                <br />
                {content.hero.headingLine}
                <span>
                  {content.hero.headingAccent}
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
                {content.hero.descriptionLead}
                <br />
                {content.hero.descriptionTail}
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
                aria-label={"Play Iteck introduction video"}
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
  return <ProductReasonsSection />;
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
                  {` ${content.philosophy.heading} `}
                  <span>{` ${content.philosophy.headingAccent} `}</span>{" "}
                </h2>
              </div>
              <p>
                {content.philosophy.description}
              </p>
              <div className={"line-links"}>
                {content.philosophy.links.map((label) => (
                  <a href="#" key={label}>{label}</a>
                ))}
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
                  {` ${content.services.heading} `}
                  <span>{` ${content.services.headingAccent} `}</span>{" "}
                </h2>
              </div>
              <div className={"text mb-50 fs-12px color-666"}>{content.services.description}</div>
              <ul>
                {content.services.items.map((service, index) => (
                  <li className={index < 2 ? "d-flex mb-40" : "d-flex"} key={service.title}>
                    <small className={"icon-50 me-4 flex-shrink-0"}>
                      <img src={service.icon} alt={""} />
                    </small>
                    <div className={"inf"}>
                      <h5>{service.title}</h5>
                      <p className={"fs-12px color-666 mt-2"}>{service.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href={"/services"}
                className={
                  "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mt-60 px-5"
                }
              >
                <span>{content.services.cta}{" "}</span>
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
    <ClientLogosSection variant="about" />
  );
}

function AboutNumbersStyle6Section7() {
  return (
    <section className={"numbers style-6"}>
      <div className={"container"}>
        <div className={"content pb-100 border-1 border-bottom brd-gray"}>
          <div className={"row"}>
            {content.statistics.map((stat, index) => (
              <div className={"col-lg-4"} key={stat.value}>
                <div className={`number-card style-6${index === 2 ? " border-0" : ""}`}>
                  <h2 className={"me-4 color-blue5"}>
                    <span className={"counter"}>{stat.value}</span>
                    {index === 0 ? " +" : null}
                  </h2>
                  <div className={"text"}>
                    {stat.firstLine}<br />{stat.secondLine}
                  </div>
                </div>
              </div>
            ))}
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
          {` ${content.culture.heading} `}
          <span>{` ${content.culture.headingAccent} `}</span>{" "}
        </h2>
        <p>{content.culture.description}</p>
      </div>
      <div className={"content"}>
        <div className={"culture-slider position-relative pb-80 style-5"}>
          <div className={"swiper-container"}>
            <div className={"swiper-wrapper"}>
              {content.culture.images.map((image, index) => (
                <div className={"swiper-slide"} key={`${image}-${index}`}>
                  <a
                    href={image}
                    className={"culture-card d-block"}
                    data-fancybox={"gallery"}
                    aria-label={`Open culture photo ${index + 1}`}
                  >
                    <img src={image} alt={""} />
                    <span className={"overlay"}></span>
                  </a>
                </div>
              ))}
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
              {` ${content.team.heading} `}
              <span>{` ${content.team.headingAccent} `}</span>{" "}
            </h2>
            <p>{content.team.description}</p>
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
            {` ${content.cta.heading} `}
            <span>{` ${content.cta.headingAccent} `}</span>{" "}
          </h2>
          <p>{content.cta.description}</p>
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
                        aria-label={"Name"}
                        className={"form-control"}
                        placeholder={"Name"}
                      />
                    </div>
                  </div>
                  <div className={"col-lg-6"}>
                    <div className={"form-group mb-20"}>
                      <input
                        type={"email"}
                        name={"email"}
                        aria-label={"Email Address"}
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
                        aria-label={"Phone Number"}
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
                        aria-label={"Your Website"}
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
                        aria-label={"How can we help you?"}
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
                        aria-label={"How can we help you?"}
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
