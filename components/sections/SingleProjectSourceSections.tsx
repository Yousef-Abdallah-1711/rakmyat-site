import Link from "next/link";

export function SingleProjectSourceSections() {
  return (
    <>
      <SingleProjectSingleProjectPt50Section1 />
    </>
  );
}

function SingleProjectSingleProjectPt50Section1() {
  return (
    <main className={"single-project pt-50 style-5"}>
      <SingleProjectAboutAppStyle5Section2 />
      <div className={"challenge section-padding style-5 overflow-hidden"}>
        <div className={"container"}>
          <div className={"row gx-5"}>
            <div className={"col-lg-4"}>
              <div className={"section-head style-5"}>
                <h2 className={""}>
                  {" Our "}
                  <br /> <span>{" Challenge "}</span>{" "}
                </h2>
              </div>
            </div>
            <div className={"col-lg-8"}>
              <div className={"inf"}>
                <div className={"text color-666 mb-20"}>
                  {
                    '\n                                Create an unconventional yet user-friendly website – innovative, with a clean & simple design that communicates and showcases multi-media content. Site that spreads the message: "It’s stories your love.”\n                            '
                  }
                </div>
                <ul className={"color-000"}>
                  <li className={"d-flex mb-10"}>
                    <i className={"bi bi-dot fs-6 me-2"}></i>
                    {
                      "\n                                    Develop easy-to-find and easy-to-navigate mobile friendly website\n                                "
                    }
                  </li>
                  <li className={"d-flex mb-10"}>
                    <i className={"bi bi-dot fs-6 me-2"}></i>
                    {
                      "\n                                    Showcase each type of content: interactive books, animated stories and picture books, audio stories. "
                    }
                    <br />
                    {
                      " Create an experience people want to share with others\n                                "
                    }
                  </li>
                  <li className={"d-flex mb-10"}>
                    <i className={"bi bi-dot fs-6 me-2"}></i>
                    {
                      "\n                                    Persuade to download app and subscribe\n                                "
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={"imgs mt-60 mb-100"}>
            <div className={"row"}>
              <div className={"col-lg-6"}>
                <div
                  className={
                    "img img-cover rounded-3 overflow-hidden mb-30 mb-lg-0"
                  }
                >
                  <img src={"/assets/img/single_project/ch_1.png"} alt={""} />
                </div>
              </div>
              <div className={"col-lg-6"}>
                <div className={"img img-cover rounded-3 overflow-hidden"}>
                  <img src={"/assets/img/single_project/ch_2.png"} alt={""} />
                </div>
              </div>
            </div>
          </div>
          <div className={"row gx-5"}>
            <div className={"col-lg-4"}>
              <div className={"section-head style-5"}>
                <h2 className={""}>
                  {" Solution & "}
                  <br /> <span>{" Result "}</span>{" "}
                </h2>
              </div>
            </div>
            <div className={"col-lg-8"}>
              <div className={"inf"}>
                <div className={"text color-666 mb-10"}>
                  {
                    "\n                                Our approach was to present the site as a visual editorial platform with quarterly features based on events and occasions the brand was focused on. Each quarterly focus would be marked by the hero and custom tags that filter content.                            \n                            "
                  }
                </div>
                <div className={"text color-666 mb-20"}>
                  {
                    "\n                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.\n                            "
                  }
                </div>
                <div className={"color-000 mt-50"}>
                  <div className={"row"}>
                    <div className={"col-lg-6"}>
                      <div className={"d-flex mb-20 fw-bold"}>
                        <div
                          className={
                            "icon-20 d-inline-flex justify-content-center align-items-center rounded-circle overflow-hidden bg-blue5 text-white flex-shrink-0 me-3"
                          }
                        >
                          <i className={"bi bi-check"}></i>
                        </div>
                        {
                          "\n                                            Create & Save your notes with multi-media\n                                        "
                        }
                      </div>
                    </div>
                    <div className={"col-lg-6"}>
                      <div className={"d-flex mb-20 fw-bold"}>
                        <div
                          className={
                            "icon-20 d-inline-flex justify-content-center align-items-center rounded-circle overflow-hidden bg-blue5 text-white flex-shrink-0 me-3"
                          }
                        >
                          <i className={"bi bi-check"}></i>
                        </div>
                        {
                          "\n                                            Complete note editor with rich text options\n                                        "
                        }
                      </div>
                    </div>
                    <div className={"col-lg-6"}>
                      <div className={"d-flex mb-20 mb-lg-0 fw-bold"}>
                        <div
                          className={
                            "icon-20 d-inline-flex justify-content-center align-items-center rounded-circle overflow-hidden bg-blue5 text-white flex-shrink-0 me-3"
                          }
                        >
                          <i className={"bi bi-check"}></i>
                        </div>
                        {
                          "\n                                            Web Clipper Extension\n                                        "
                        }
                      </div>
                    </div>
                    <div className={"col-lg-6"}>
                      <div className={"d-flex mb-0 fw-bold"}>
                        <div
                          className={
                            "icon-20 d-inline-flex justify-content-center align-items-center rounded-circle overflow-hidden bg-blue5 text-white flex-shrink-0 me-3"
                          }
                        >
                          <i className={"bi bi-check"}></i>
                        </div>
                        {
                          "\n                                            Automatically sync in real time\n                                        "
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"screenshots style-4"}>
        <div className={"screenshots-slider style-4"}>
          <div className={"swiper-container"}>
            <div className={"swiper-wrapper"}>
              <div className={"swiper-slide"}>
                <div className={"img"}>
                  <img src={"/assets/img/screenshots/1.png"} alt={""} />
                </div>
              </div>
              <div className={"swiper-slide"}>
                <div className={"img"}>
                  <img src={"/assets/img/screenshots/2.png"} alt={""} />
                </div>
              </div>
              <div className={"swiper-slide"}>
                <div className={"img"}>
                  <img src={"/assets/img/screenshots/3.jpg"} alt={""} />
                </div>
              </div>
              <div className={"swiper-slide"}>
                <div className={"img"}>
                  <img src={"/assets/img/screenshots/4.png"} alt={""} />
                </div>
              </div>
              <div className={"swiper-slide"}>
                <div className={"img"}>
                  <img src={"/assets/img/screenshots/5.png"} alt={""} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          src={"/assets/img/screenshots/hand.png"}
          alt={""}
          className={"mob-hand"}
        />
      </div>
      <SingleProjectAboutAppStyle5Section3 />
      <SingleProjectProjectsStyle6Section4 />
    </main>
  );
}

function SingleProjectAboutAppStyle5Section2() {
  return (
    <section className={"about-app style-5"}>
      <div className={"container"}>
        <div className={"content text-center"}>
          <h1 className={"color-000 mb-50"}>{"Notero - Easy Notes App"}</h1>
          <div className={"about-cards border-bottom brd-gray"}>
            <div className={"row"}>
              <div className={"col-lg-3 col-sm-6"}>
                <div className={"about-card mb-30 mb-lg-0"}>
                  <small className={"d-block"}>
                    {
                      "\n                                        client\n                                    "
                    }
                  </small>
                  <h6>
                    {
                      "\n                                        Micosoft Holding Ltd, "
                    }
                    <br />
                    {" Australia Area\n                                    "}
                  </h6>
                </div>
              </div>
              <div className={"col-lg-3 col-sm-6"}>
                <div className={"about-card mb-30 mb-lg-0"}>
                  <small className={"d-block"}>
                    {
                      "\n                                        services\n                                    "
                    }
                  </small>
                  <h6>
                    {
                      "\n                                        IT Consultation, UI/UX Design, Cloud Service\n                                    "
                    }
                  </h6>
                </div>
              </div>
              <div className={"col-lg-3 col-sm-6"}>
                <div className={"about-card mb-30 mb-lg-0"}>
                  <small className={"d-block"}>
                    {
                      "\n                                        date\n                                    "
                    }
                  </small>
                  <h6>
                    {
                      "\n                                        Feburary 25th, 2023\n                                    "
                    }
                  </h6>
                </div>
              </div>
              <div className={"col-lg-3 col-sm-6"}>
                <div className={"about-card mb-30 mb-lg-0"}>
                  <small className={"d-block"}>
                    {
                      "\n                                        team\n                                    "
                    }
                  </small>
                  <h6>
                    {
                      "\n                                        Logan Cee - Designer "
                    }
                    <br />
                    {
                      " Martin Moussa - iOS Developer\n                                    "
                    }
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "img-content pt-70 pb-70 border-bottom brd-gray overflow-hidden"
            }
          >
            <div className={"row justify-content-center"}>
              <div className={"col-lg-7"}>
                <div className={"img text-center"}>
                  <img
                    src={"/assets/img/single_project/2mobs.png"}
                    alt={""}
                    className={"main-img"}
                  />
                  <img
                    src={"/assets/img/single_project/bubbls.png"}
                    alt={""}
                    className={"bubbls"}
                  />
                  <img
                    src={"/assets/img/single_project/circle.png"}
                    alt={""}
                    className={"circle"}
                  />
                </div>
                <div className={"info mt-30"}>
                  <h5 className={"lh-4"}>
                    {
                      "\n                                        Stay focused and productive with a clean and clutter-free note space. The flexible ways to organize your notes: hashtags, nested notebooks, pinning notes to the top of the note list, etc\n                                    "
                    }
                  </h5>
                  <a href={"#"} className={"color-blue5 mt-60"}>
                    {"https://example.domain"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SingleProjectAboutAppStyle5Section3() {
  return (
    <section className={"about-app style-5"}>
      <div className={"container"}>
        <div className={"content text-center"}>
          <div className={"img-content pt-70 pb-100 border-bottom brd-gray"}>
            <div className={"row justify-content-center"}>
              <div className={"col-lg-6"}>
                <div className={"info mt-30"}>
                  <h5 className={"lh-4"}>
                    {"\n                                        “The team at "}
                    <a href={"#"} className={"color-blue5"}>
                      {"@iteck"}
                    </a>
                    {
                      " is incredibly dedicated, knowledgeable, and helpful. The finished product was beautiful, and worth every penny. I would absolutely recommend Moonex Labs.”\n                                    "
                    }
                  </h5>
                  <a
                    href={"#"}
                    className={"mt-60 color-666 fs-12px text-uppercase"}
                  >
                    {"- "}
                    <strong className={"color-000"}>{"Jhon henry "}</strong>
                    {" , ceo at notero jsc - "}
                  </a>
                  <div className={"share mt-100"}>
                    <span
                      className={"color-999 fs-12px text-uppercase d-block"}
                    >
                      {" share this project  "}
                    </span>
                    <a href={"#"} className={"social-icon"}>
                      <i className={"fab fa-twitter"}></i>
                    </a>
                    <a href={"#"} className={"social-icon"}>
                      <i className={"fab fa-facebook-f"}></i>
                    </a>
                    <a href={"#"} className={"social-icon"}>
                      <i className={"fab fa-pinterest"}></i>
                    </a>
                    <a href={"#"} className={"social-icon"}>
                      <i className={"fab fa-goodreads-g"}></i>
                    </a>
                    <a href={"#"} className={"social-icon"}>
                      <i className={"fab fa-linkedin-in"}></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"next-prog section-padding"}>
            <h5 className={"color-999 text-uppercase fw-light"}>
              {"next project"}
            </h5>
            <a href={"#"} className={"color-000 fs-1 fw-bold mt-20"}>
              {"Criftocy Landing Page"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SingleProjectProjectsStyle6Section4() {
  return (
    <section className={"projects style-6 p-0"}>
      <div className={"content section-padding rounded-0"}>
        <div className={"container"}>
          <div className={"section-head text-center mb-60 style-5"}>
            <h2 className={"mb-20"}>
              {" Related "}
              <span>{" Projects "}</span>{" "}
            </h2>
            <p>
              {
                "We have an experienced team of production and inspection personnel to ensure quality."
              }
            </p>
          </div>
          <div className={"slider-3items slider-style-6"}>
            <div className={"swiper-container pb-0"}>
              <div className={"swiper-wrapper"}>
                <div className={"swiper-slide"}>
                  <div className={"project-card style-6"}>
                    <div className={"img"}>
                      <img src={"/assets/img/projects/4.png"} alt={""} />
                    </div>
                    <div className={"info"}>
                      <h3 className={"title"}>
                        <Link href={"/projects/notero"}>
                          {"Okpay E-Wallet Optimized"}
                        </Link>
                      </h3>
                      <small className={"color-blue6"}>
                        <a href={"#"}>{"SEO analysis"}</a>
                      </small>
                      <div className={"text"}>
                        {
                          "\n                                                Trust our top minds to eliminate workflow pain points, implement new\n                                                tech & app.\n                                            "
                        }
                      </div>
                      <div className={"tags"}>
                        <span>
                          <a href={"#"}>{"SEO Analysis"}</a>
                        </span>
                        <span>
                          <a href={"#"}>{"Content Strategy"}</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"swiper-slide"}>
                  <div className={"project-card style-6"}>
                    <div className={"img"}>
                      <img src={"/assets/img/projects/5.png"} alt={""} />
                    </div>
                    <div className={"info"}>
                      <h3 className={"title"}>
                        <a href={"#"}>{"e-Commerce Dashboard"}</a>
                      </h3>
                      <small className={"color-blue6"}>
                        <a href={"#"}>{"website design"}</a>
                        {" & "}
                        <a href={"#"}>{"develoment"}</a>
                      </small>
                      <div className={"text"}>
                        {
                          "\n                                                Trust our top minds to eliminate workflow pain points, implement new\n                                                tech & app.\n                                            "
                        }
                      </div>
                      <div className={"tags"}>
                        <span>
                          <a href={"#"}>{"WordPress"}</a>
                        </span>
                        <span>
                          <a href={"#"}>{"PHP"}</a>
                        </span>
                        <span>
                          <a href={"#"}>{"HTML/CSS"}</a>
                        </span>
                        <span>
                          <a href={"#"}>{"Figma"}</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"swiper-slide"}>
                  <div className={"project-card style-6"}>
                    <div className={"img"}>
                      <img src={"/assets/img/projects/7.png"} alt={""} />
                    </div>
                    <div className={"info"}>
                      <h3 className={"title"}>
                        <a href={"#"}>{"MLB Store Instagram"}</a>
                      </h3>
                      <small className={"color-blue6"}>
                        <a href={"#"}>{"social media"}</a>
                      </small>
                      <div className={"text"}>
                        {
                          "\n                                                Trust our top minds to eliminate workflow pain points, implement new\n                                                tech & app.\n                                            "
                        }
                      </div>
                      <div className={"tags"}>
                        <span>
                          <a href={"#"}>{"Social"}</a>
                        </span>
                        <span>
                          <a href={"#"}>{"Instagram"}</a>
                        </span>
                        <span>
                          <a href={"#"}>{"Followers"}</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"swiper-slide"}>
                  <div className={"project-card style-6"}>
                    <div className={"img"}>
                      <img src={"/assets/img/projects/5.png"} alt={""} />
                    </div>
                    <div className={"info"}>
                      <h3 className={"title"}>
                        <a href={"#"}>{"e-Commerce Dashboard"}</a>
                      </h3>
                      <small className={"color-blue6"}>
                        <a href={"#"}>{"website design"}</a>
                        {" & "}
                        <a href={"#"}>{"develoment"}</a>
                      </small>
                      <div className={"text"}>
                        {
                          "\n                                                Trust our top minds to eliminate workflow pain points, implement new\n                                                tech & app.\n                                            "
                        }
                      </div>
                      <div className={"tags"}>
                        <span>
                          <a href={"#"}>{"WordPress"}</a>
                        </span>
                        <span>
                          <a href={"#"}>{"PHP"}</a>
                        </span>
                        <span>
                          <a href={"#"}>{"HTML/CSS"}</a>
                        </span>
                        <span>
                          <a href={"#"}>{"Figma"}</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={"swiper-button-next"}></div>
            <div className={"swiper-button-prev"}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
