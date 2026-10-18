import { PortfolioProjects } from "@/components/sections/PortfolioProjects";
import Link from "next/link";

export function PortfolioSourceSections() {
  return (
    <>
      <PortfolioPortfolioPageStyle1Section1 />
    </>
  );
}

function PortfolioPortfolioPageStyle1Section1() {
  return (
    <main className={"portfolio-page style-1"}>
      <PortfolioPortfolioProjectsSectionPaddingSection2 />
      <PortfolioDownloadSectionPaddingSection3 />
    </main>
  );
}

function PortfolioPortfolioProjectsSectionPaddingSection2() {
  return (
    <section className={"portfolio-projects section-padding pt-50 style-1"}>
      <div className={"container"}>
        <div className={"section-head text-center mb-60 style-5"}>
          <h2 className={"mb-20"}>
            {" Our "}
            <span>{" Projects "}</span>{" "}
          </h2>
          <p>
            {
              " We have an experienced team of production and inspection personnel to ensure quality. "
            }
          </p>
        </div>
        <PortfolioProjects />
      </div>
    </section>
  );
}

function PortfolioDownloadSectionPaddingSection3() {
  return (
    <section className={"download section-padding style-5"}>
      <div className={"container"}>
        <div className={"row justify-content-center"}>
          <div className={"col-lg-9"}>
            <div className={"content text-center"}>
              <h2>
                {
                  "Access your business potentials today & find opportunity for \n                                "
                }
                <span>
                  {
                    "\n                                    bigger success \n                                    "
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
              </h2>
              <div className={"butns mt-70"}>
                <Link
                  href={"/contact"}
                  className={
                    "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mx-1"
                  }
                >
                  <span>{" Start A Project Now "}</span>
                </Link>
                <Link
                  href={"/about"}
                  className={
                    "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mx-1"
                  }
                >
                  <span>{" See Pricing & Plan "}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src={"/assets/img/contact_globe.svg"}
        alt={""}
        className={"contact_globe"}
      />
    </section>
  );
}
