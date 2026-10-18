import { ContactForm } from "@/components/forms/ContactForm";

export function ContactSourceSections() {
  return (
    <>
      <ContactContactPageStyle5Section1 />
    </>
  );
}

function ContactContactPageStyle5Section1() {
  return (
    <main className={"contact-page style-5"}>
      <ContactContactSectionPaddingSection2 />
      <div className={"map"}>
        <iframe
          src={
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24219.60999175365!2d-73.9764341314902!3d40.64198229194528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25b400c94a227%3A0x18e2a4d3fb21f0ec!2sFlatbush%2C%20Brooklyn%2C%20NY%2C%20USA!5e0!3m2!1sen!2seg!4v1651361759450!5m2!1sen!2seg"
          }
          height={"500"}
          style={{ border: "0" }}
          allowFullScreen={true}
          loading={"lazy"}
          referrerPolicy={"no-referrer-when-downgrade"}
        ></iframe>
      </div>
    </main>
  );
}

function ContactContactSectionPaddingSection2() {
  return (
    <section className={"contact section-padding pt-50 style-6"}>
      <div className={"container"}>
        <div className={"section-head text-center mb-100 style-5"}>
          <h2 className={"mb-20"}>
            {" Get In "}
            <span>{" Touch "}</span>{" "}
          </h2>
          <p>{"We will contact again after receive your request in 24h"}</p>
        </div>
        <div className={"text-center mb-100"}>
          <h2
            className={
              "ltspc-20 text-uppercase fs-1 lh-1 mb-50 mt-30 color-blue5"
            }
          >
            {"(+23) 5535 68 68"}
          </h2>
          <h4 className={"fw-normal mb-20 color-000"}>
            {"contact@Itecksolution.com"}
          </h4>
          <h4 className={"fw-normal mb-10 color-000"}>
            {"58 Howard St, San Francisco, CA 941"}
          </h4>
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
                        required={true}
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
                        name={"option"}
                        className={"form-select"}
                        defaultValue={"how can we help"}
                      >
                        <option value={"how can we help"}>
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
                        rows={10}
                        name={"message"}
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
