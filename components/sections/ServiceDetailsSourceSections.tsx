import { serviceDetailsContent as content } from "@/content/service-details";

export function ServiceDetailsSourceSections() {
  return (
    <>
      <ServiceDetailsInnerHeaderStyle5Section1 />
      <ServiceDetailsServicesDetailsPageStyle5Section2 />
    </>
  );
}

function ServiceDetailsInnerHeaderStyle5Section1() {
  return (
    <section className={"inner-header style-5"}>
      <div className={"container"}>
        <div className={"content"}>
          <div className={"links"}>
            <a href={"#"}>{content.breadcrumbs[0]}</a>
            <a href={"#"}>{content.breadcrumbs[1]}</a>
          </div>
          <h2>{` ${content.title} `}</h2>
          <img
            src={"/assets/img/header/head7_rock.png"}
            alt={""}
            className={"side-img slide_up_down"}
          />
        </div>
      </div>
    </section>
  );
}

function ServiceDetailsServicesDetailsPageStyle5Section2() {
  return (
    <main className={"services-details-page style-5"}>
      <h1 className="visually-hidden">{content.title}</h1>
      <ServiceDetailsSerDetailsSectionPaddingSection3 />
      <ServiceDetailsContactStyle5Section4 />
    </main>
  );
}

function ServiceDetailsSerDetailsSectionPaddingSection3() {
  return (
    <section className={"ser-details section-padding overflow-hidden"}>
      <div className={"container"}>
        <div className={"content"}>
          <div className={"row gx-5"}>
            <div className={"col-lg-8"}>
              <div className={"main-info"}>
                <div className={"main-img img-cover"}>
                  <img src={"/assets/img/services/services2.png"} alt={""} />
                </div>
                <h3 className={"text-capitalize mb-20"}>
                  {` ${content.overviewHeading} `}
                </h3>
                <p className={"mb-10"}>{content.overview[0]}</p>
                <p className={"pb-50"}>{content.overview[1]}</p>
                <div
                  className={
                    "imgs-items border-1 border-bottom border-top brd-gray"
                  }
                >
                  <div className={"img-item my-5"}>
                    <div className={"row align-items-center"}>
                      <div className={"col-lg-2"}>
                        <div className={"icon mb-3 mb-lg-0"}>
                          <img
                            src={"/assets/img/icons/serv_icons/34.png"}
                            alt={""}
                          />
                        </div>
                      </div>
                      <div className={"col-lg-10"}>
                        <h5 className={"fw-bold mb-2"}>
                          {` ${content.process[0].heading} `}
                        </h5>
                        <p>{` ${content.process[0].description} `}</p>
                      </div>
                    </div>
                  </div>
                  <div className={"img-item my-5"}>
                    <div className={"row align-items-center"}>
                      <div className={"col-lg-2"}>
                        <div className={"icon mb-3 mb-lg-0"}>
                          <img
                            src={"/assets/img/icons/serv_icons/35.png"}
                            alt={""}
                          />
                        </div>
                      </div>
                      <div className={"col-lg-10"}>
                        <h5 className={"fw-bold mb-2"}>
                          {` ${content.process[1].heading} `}
                        </h5>
                        <p>{` ${content.process[1].description} `}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 className={"mt-5 mb-4"}>{` ${content.benefitsHeading} `}</h4>
                <p className={"mt-10"}>
                  {" "}
                  <i
                    className={"fas fa-check-circle color-blue5 me-2"}
                  ></i>{" "}
                  <strong className={"color-000"}>
                    {` ${content.benefits[0].label} `}
                  </strong>
                  {` ${content.benefits[0].description} `}
                </p>
                <p className={"mt-10"}>
                  {" "}
                  <i
                    className={"fas fa-check-circle color-blue5 me-2"}
                  ></i>{" "}
                  <strong className={"color-000"}>
                    {` ${content.benefits[1].label} `}
                  </strong>
                  {` ${content.benefits[1].description} `}
                </p>
                <p className={"mt-10"}>
                  {" "}
                  <i
                    className={"fas fa-check-circle color-blue5 me-2"}
                  ></i>{" "}
                  <strong className={"color-000"}>
                    {` ${content.benefits[2].label} `}
                  </strong>
                  {` ${content.benefits[2].description} `}
                </p>
                <div className={"testi-card mt-60"}>
                  <div className={"icon"}>
                    <img src={"/assets/img/testimonials/qout.png"} alt={""} />
                  </div>
                  <div className={"text"}>
                    {
                      content.testimonial.quoteLead
                    }
                    <br />
                    {
                      content.testimonial.quoteTail
                    }
                  </div>
                  <div className={"author"}>
                    <div
                      className={
                        "img icon-60 rounded-circle overflow-hidden img-cover me-3 flex-shrink-0"
                      }
                    >
                      <img
                        src={"/assets/img/testimonials/user8.png"}
                        alt={""}
                      />
                    </div>
                    <div className={"inf"}>
                      <p>{` ${content.testimonial.role} `}</p>
                      <h6>{` ${content.testimonial.author} `}</h6>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "last-next-serv d-flex align-items-center justify-content-between mt-60"
                  }
                >
                  <a href={"#"} className={"item"}>
                    <p>{content.previousLabel}</p>
                    <h5 className={"fw-bold"}>{` ${content.previousService} `}</h5>
                  </a>
                  <a href={"#"} className={"item text-end"}>
                    <p>{content.nextLabel}</p>
                    <h5 className={"fw-bold"}>{` ${content.nextService} `}</h5>
                  </a>
                </div>
              </div>
            </div>
            <div className={"col-lg-4"}>
              <div className={"side-links mt-5 mt-lg-0"}>
                <div className={"links-card mb-40"}>
                  <h5>{` ${content.categoryHeading} `}</h5>
                  <ul>
                    <li>
                      <a href={"#"}>
                        {" "}
                        <i className={"far fa-angle-right icon"}></i>
                        {` ${content.categories[0]} `}
                      </a>
                    </li>
                    <li>
                      <a href={"#"}>
                        {" "}
                        <i className={"far fa-angle-right icon"}></i>
                        {` ${content.categories[1]} `}
                      </a>
                    </li>
                    <li>
                      <a href={"#"}>
                        {" "}
                        <i className={"far fa-angle-right icon"}></i>
                        {` ${content.previousService} `}
                      </a>
                    </li>
                    <li>
                      <a href={"#"}>
                        {" "}
                        <i className={"far fa-angle-right icon"}></i>
                        {` ${content.title} `}
                      </a>
                    </li>
                    <li>
                      <a href={"#"}>
                        {" "}
                        <i className={"far fa-angle-right icon"}></i>
                        {` ${content.nextService} `}
                      </a>
                    </li>
                    <li>
                      <a href={"#"}>
                        {" "}
                        <i className={"far fa-angle-right icon"}></i>
                        {` ${content.categories[5]} `}
                      </a>
                    </li>
                  </ul>
                </div>
                <div className={"banner1"}>
                  <div className={"title"}>
                    <h6>{` ${content.callout.eyebrow} `}</h6>
                    <h3>{` ${content.callout.heading} `}</h3>
                  </div>
                  <a
                    href={"#"}
                    className={"butn bg-white rounded-pill hover-blue5"}
                  >
                    <span>
                      {` ${content.callout.link} `}
                      <i className={"far fa-long-arrow-right ms-2"}></i>{" "}
                    </span>
                  </a>
                  <img
                    src={"/assets/img/mob1.png"}
                    alt={""}
                    className={"mob"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceDetailsContactStyle5Section4() {
  return (
    <section className={"contact style-5 section-padding"}>
      <div className={"container"}>
        <div className={"section-head text-center mb-80 style-5"}>
          <h2>
            {` ${content.contact.headingLead} `}
            <span>{` ${content.contact.headingAccent} `}</span>{" "}
          </h2>
          <p>
            {
              content.contact.description
            }
          </p>
        </div>
        <div className={"contact-form"}>
          <div className={"row"}>
            <div className={"col-lg-4"}>
              <div className={"form-group"}>
                <input
                  type={"text"}
                  aria-label={content.contact.fields.name}
                  className={"form-control"}
                  placeholder={content.contact.fields.name}
                />
                <span className={"icon"}>
                  {" "}
                  <i className={"fas fa-user"}></i>{" "}
                </span>
              </div>
            </div>
            <div className={"col-lg-4"}>
              <div className={"form-group"}>
                <input
                  type={"text"}
                  aria-label={content.contact.fields.phone}
                  className={"form-control"}
                  placeholder={content.contact.fields.phone}
                />
                <span className={"icon"}>
                  {" "}
                  <i className={"fas fa-phone"}></i>{" "}
                </span>
              </div>
            </div>
            <div className={"col-lg-4"}>
              <div className={"form-group"}>
                <input
                  type={"email"}
                  aria-label={content.contact.fields.email}
                  className={"form-control"}
                  placeholder={content.contact.fields.email}
                />
                <span className={"icon"}>
                  {" "}
                  <i className={"fas fa-envelope"}></i>{" "}
                </span>
              </div>
            </div>
            <div className={"col-lg-12"}>
              <div className={"form-group"}>
                <textarea
                  rows={6}
                  aria-label={content.contact.fields.message}
                  placeholder={content.contact.fields.message}
                  className={"form-control"}
                ></textarea>
                <span className={"icon"}>
                  {" "}
                  <i className={"fas fa-pen"}></i>{" "}
                </span>
              </div>
            </div>
          </div>
          <div className={"text-center"}>
            <a
              href={"#"}
              className={"butn bg-blue5 rounded-3 mt-20 py-3 text-white"}
            >
              <span>
                {` ${content.contact.button} `}
                <i className={"far fa-long-arrow-right ms-2"}></i>{" "}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
