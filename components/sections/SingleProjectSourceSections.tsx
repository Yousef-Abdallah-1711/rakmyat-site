import { noteroProject } from "@/content/projects";
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
                  {noteroProject.challenge.headingLead}
                  <br /> <span>{noteroProject.challenge.headingAccent}</span>{" "}
                </h2>
              </div>
            </div>
            <div className={"col-lg-8"}>
              <div className={"inf"}>
                <div className={"text color-666 mb-20"}>
                  {
                    noteroProject.challenge.description
                  }
                </div>
                <ul className={"color-000"}>
                  <li className={"d-flex mb-10"}>
                    <i className={"bi bi-dot fs-6 me-2"}></i>
                    {
                      noteroProject.challenge.bullets[0]
                    }
                  </li>
                  <li className={"d-flex mb-10"}>
                    <i className={"bi bi-dot fs-6 me-2"}></i>
                    {
                      noteroProject.challenge.bullets[1]
                    }
                    <br />
                    {
                      noteroProject.challenge.followUp
                    }
                  </li>
                  <li className={"d-flex mb-10"}>
                    <i className={"bi bi-dot fs-6 me-2"}></i>
                    {
                      noteroProject.challenge.bullets[2]
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
                  <img src={noteroProject.assets.challenge[0]} alt={""} />
                </div>
              </div>
              <div className={"col-lg-6"}>
                <div className={"img img-cover rounded-3 overflow-hidden"}>
                  <img src={noteroProject.assets.challenge[1]} alt={""} />
                </div>
              </div>
            </div>
          </div>
          <div className={"row gx-5"}>
            <div className={"col-lg-4"}>
              <div className={"section-head style-5"}>
                <h2 className={""}>
                  {noteroProject.solution.headingLead}
                  <br /> <span>{noteroProject.solution.headingAccent}</span>{" "}
                </h2>
              </div>
            </div>
            <div className={"col-lg-8"}>
              <div className={"inf"}>
                <div className={"text color-666 mb-10"}>
                  {
                    noteroProject.solution.description
                  }
                </div>
                <div className={"text color-666 mb-20"}>
                  {
                    noteroProject.solution.resultDescription
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
                          noteroProject.solution.highlights[0]
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
                          noteroProject.solution.highlights[1]
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
                          noteroProject.solution.highlights[2]
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
                          noteroProject.solution.highlights[3]
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
                  <img src={noteroProject.assets.screenshots[0]} alt={""} />
                </div>
              </div>
              <div className={"swiper-slide"}>
                <div className={"img"}>
                  <img src={noteroProject.assets.screenshots[1]} alt={""} />
                </div>
              </div>
              <div className={"swiper-slide"}>
                <div className={"img"}>
                  <img src={noteroProject.assets.screenshots[2]} alt={""} />
                </div>
              </div>
              <div className={"swiper-slide"}>
                <div className={"img"}>
                  <img src={noteroProject.assets.screenshots[3]} alt={""} />
                </div>
              </div>
              <div className={"swiper-slide"}>
                <div className={"img"}>
                  <img src={noteroProject.assets.screenshots[4]} alt={""} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          src={noteroProject.assets.screenshotsHand}
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
          <h1 className={"color-000 mb-50"}>{noteroProject.title}</h1>
          <div className={"about-cards border-bottom brd-gray"}>
            <div className={"row"}>
              <div className={"col-lg-3 col-sm-6"}>
                <div className={"about-card mb-30 mb-lg-0"}>
                  <small className={"d-block"}>
                    {
                      noteroProject.metadata.clientLabel
                    }
                  </small>
                  <h6>
                    {
                      noteroProject.metadata.client
                    }
                    <br />
                    {noteroProject.metadata.location}
                  </h6>
                </div>
              </div>
              <div className={"col-lg-3 col-sm-6"}>
                <div className={"about-card mb-30 mb-lg-0"}>
                  <small className={"d-block"}>
                    {
                      noteroProject.metadata.servicesLabel
                    }
                  </small>
                  <h6>
                    {
                      noteroProject.metadata.services
                    }
                  </h6>
                </div>
              </div>
              <div className={"col-lg-3 col-sm-6"}>
                <div className={"about-card mb-30 mb-lg-0"}>
                  <small className={"d-block"}>
                    {
                      noteroProject.metadata.dateLabel
                    }
                  </small>
                  <h6>
                    {
                      noteroProject.metadata.date
                    }
                  </h6>
                </div>
              </div>
              <div className={"col-lg-3 col-sm-6"}>
                <div className={"about-card mb-30 mb-lg-0"}>
                  <small className={"d-block"}>
                    {
                      noteroProject.metadata.teamLabel
                    }
                  </small>
                  <h6>
                    {
                      noteroProject.metadata.team[0]
                    }
                    <br />
                    {
                      noteroProject.metadata.team[1]
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
                    src={noteroProject.assets.product[0]}
                    alt={""}
                    className={"main-img"}
                  />
                  <img
                    src={noteroProject.assets.product[1]}
                    alt={""}
                    className={"bubbls"}
                  />
                  <img
                    src={noteroProject.assets.product[2]}
                    alt={""}
                    className={"circle"}
                  />
                </div>
                <div className={"info mt-30"}>
                  <h5 className={"lh-4"}>
                    {
                      noteroProject.summary
                    }
                  </h5>
                  <a href={"#"} className={"color-blue5 mt-60"}>
                    {noteroProject.productUrl}
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
                    {noteroProject.testimonial.quoteLead}
                    <a href={"#"} className={"color-blue5"}>
                      {noteroProject.testimonial.brand}
                    </a>
                    {
                      noteroProject.testimonial.quoteTail
                    }
                  </h5>
                  <a
                    href={"#"}
                    className={"mt-60 color-666 fs-12px text-uppercase"}
                  >
                    {"- "}
                    <strong className={"color-000"}>{noteroProject.testimonial.author}</strong>
                    {noteroProject.testimonial.role}
                  </a>
                  <div className={"share mt-100"}>
                    <span
                      className={"color-999 fs-12px text-uppercase d-block"}
                    >
                      {noteroProject.shareLabel}
                    </span>
                    <a href={"#"} className={"social-icon"} aria-label={"Share on Twitter"}>
                      <i className={"fab fa-twitter"}></i>
                    </a>
                    <a href={"#"} className={"social-icon"} aria-label={"Share on Facebook"}>
                      <i className={"fab fa-facebook-f"}></i>
                    </a>
                    <a href={"#"} className={"social-icon"} aria-label={"Share on Pinterest"}>
                      <i className={"fab fa-pinterest"}></i>
                    </a>
                    <a href={"#"} className={"social-icon"} aria-label={"Share on Goodreads"}>
                      <i className={"fab fa-goodreads-g"}></i>
                    </a>
                    <a href={"#"} className={"social-icon"} aria-label={"Share on LinkedIn"}>
                      <i className={"fab fa-linkedin-in"}></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"next-prog section-padding"}>
            <h5 className={"color-999 text-uppercase fw-light"}>
              {noteroProject.nextProjectLabel}
            </h5>
            <a href={"#"} className={"color-000 fs-1 fw-bold mt-20"}>
              {noteroProject.nextProject}
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
              {noteroProject.related.headingLead}
              <span>{noteroProject.related.headingAccent}</span>{" "}
            </h2>
            <p>
              {
                noteroProject.related.description
              }
            </p>
          </div>
          <div className={"slider-3items slider-style-6"}>
            <div className={"swiper-container pb-0"}>
              <div className={"swiper-wrapper"}>
                <div className={"swiper-slide"}>
                  <div className={"project-card style-6"}>
                    <div className={"img"}>
                      <img src={noteroProject.assets.related[0]} alt={""} />
                    </div>
                    <div className={"info"}>
                      <h3 className={"title"}>
                        <Link href={"/projects/notero"}>
                          {noteroProject.related.cards[0].title}
                        </Link>
                      </h3>
                      <small className={"color-blue6"}>
                        <a href={"#"}>{noteroProject.related.cards[0].type}</a>
                      </small>
                      <div className={"text"}>
                        {
                          noteroProject.related.cardDescription
                        }
                      </div>
                      <div className={"tags"}>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[0].tags[0]}</a>
                        </span>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[0].tags[1]}</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"swiper-slide"}>
                  <div className={"project-card style-6"}>
                    <div className={"img"}>
                      <img src={noteroProject.assets.related[1]} alt={""} />
                    </div>
                    <div className={"info"}>
                      <h3 className={"title"}>
                        <a href={"#"}>{noteroProject.related.cards[1].title}</a>
                      </h3>
                      <small className={"color-blue6"}>
                        <a href={"#"}>{noteroProject.related.cards[1].type}</a>
                        {" & "}
                        <a href={"#"}>{noteroProject.related.cards[1].typeTail}</a>
                      </small>
                      <div className={"text"}>
                        {
                          noteroProject.related.cardDescription
                        }
                      </div>
                      <div className={"tags"}>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[1].tags[0]}</a>
                        </span>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[1].tags[1]}</a>
                        </span>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[1].tags[2]}</a>
                        </span>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[1].tags[3]}</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"swiper-slide"}>
                  <div className={"project-card style-6"}>
                    <div className={"img"}>
                      <img src={noteroProject.assets.related[2]} alt={""} />
                    </div>
                    <div className={"info"}>
                      <h3 className={"title"}>
                        <a href={"#"}>{noteroProject.related.cards[2].title}</a>
                      </h3>
                      <small className={"color-blue6"}>
                        <a href={"#"}>{noteroProject.related.cards[2].type}</a>
                      </small>
                      <div className={"text"}>
                        {
                          noteroProject.related.cardDescription
                        }
                      </div>
                      <div className={"tags"}>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[2].tags[0]}</a>
                        </span>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[2].tags[1]}</a>
                        </span>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[2].tags[2]}</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"swiper-slide"}>
                  <div className={"project-card style-6"}>
                    <div className={"img"}>
                      <img src={noteroProject.assets.related[1]} alt={""} />
                    </div>
                    <div className={"info"}>
                      <h3 className={"title"}>
                        <a href={"#"}>{noteroProject.related.cards[1].title}</a>
                      </h3>
                      <small className={"color-blue6"}>
                        <a href={"#"}>{noteroProject.related.cards[1].type}</a>
                        {" & "}
                        <a href={"#"}>{noteroProject.related.cards[1].typeTail}</a>
                      </small>
                      <div className={"text"}>
                        {
                          noteroProject.related.cardDescription
                        }
                      </div>
                      <div className={"tags"}>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[1].tags[0]}</a>
                        </span>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[1].tags[1]}</a>
                        </span>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[1].tags[2]}</a>
                        </span>
                        <span>
                          <a href={"#"}>{noteroProject.related.cards[1].tags[3]}</a>
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
