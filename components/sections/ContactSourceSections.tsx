import { ContactForm } from "@/components/forms/ContactForm";
import { contactPageContent as content } from "@/content/contact";

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
      <h1 className="visually-hidden">Contact Us</h1>
      <ContactContactSectionPaddingSection2 />
      <div className={"map"}>
        <iframe
          src={content.mapEmbedUrl}
          title="Map location in Brooklyn, New York"
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
            {content.heading.lead}
            <span>{content.heading.emphasis}</span>{" "}
          </h2>
          <p>{content.introduction}</p>
        </div>
        <div className={"text-center mb-100"}>
          <h2
            className={
              "ltspc-20 text-uppercase fs-1 lh-1 mb-50 mt-30 color-blue5"
            }
          >
            {content.phone}
          </h2>
          <h4 className={"fw-normal mb-20 color-000"}>
            {content.email}
          </h4>
          <h4 className={"fw-normal mb-10 color-000"}>
            {content.address}
          </h4>
        </div>
        <div className={"content"}>
          <div className={"row justify-content-center"}>
            <div className={"col-lg-8"}>
              <ContactForm className={"form"}>
                <p className={"text-center text-danger fs-12px mb-30"}>
                  {content.requiredHint}
                </p>
                <div className={"row"}>
                  <div className={"col-lg-6"}>
                    <div className={"form-group mb-20"}>
                      <input
                        type={"text"}
                        name={"name"}
                        aria-label={content.fields.name.label}
                        className={"form-control"}
                        placeholder={content.fields.name.placeholder}
                      />
                    </div>
                  </div>
                  <div className={"col-lg-6"}>
                    <div className={"form-group mb-20"}>
                      <input
                        type={"email"}
                        name={"email"}
                        aria-label={content.fields.email.label}
                        className={"form-control"}
                        placeholder={content.fields.email.placeholder}
                        required={true}
                      />
                    </div>
                  </div>
                  <div className={"col-lg-6"}>
                    <div className={"form-group mb-20"}>
                      <input
                        type={"text"}
                        name={"phone"}
                        aria-label={content.fields.phone.label}
                        className={"form-control"}
                        placeholder={content.fields.phone.placeholder}
                      />
                    </div>
                  </div>
                  <div className={"col-lg-6"}>
                    <div className={"form-group mb-20"}>
                      <input
                        type={"text"}
                        name={"website"}
                        aria-label={content.fields.website.label}
                        className={"form-control"}
                        placeholder={content.fields.website.placeholder}
                      />
                    </div>
                  </div>
                  <div className={"col-lg-12"}>
                    <div className={"form-group mb-20"}>
                      <select
                        name={"option"}
                        aria-label={content.fields.help.label}
                        className={"form-select"}
                        defaultValue={content.helpOptions[0].value}
                      >
                        {content.helpOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={"col-lg-12"}>
                    <div className={"form-group"}>
                      <textarea
                        rows={10}
                        name={"message"}
                        aria-label={content.fields.message.label}
                        className={"form-control"}
                        placeholder={content.fields.message.placeholder}
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
                        {content.termsCopy}
                        <a href={"#"} className={"text-decoration-underline"}>
                          {content.termsLabel}
                        </a>
                      </label>
                    </div>
                  </div>
                  <div className={"col-lg-12 text-center"}>
                    <input
                      type={"submit"}
                      value={content.submitLabel}
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
