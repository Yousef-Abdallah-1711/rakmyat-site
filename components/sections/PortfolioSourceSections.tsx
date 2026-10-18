import { PortfolioProjects } from "@/components/sections/PortfolioProjects";
import Link from "next/link";
import { portfolioPageContent } from "@/content/portfolio";

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
      <h1 className="visually-hidden">{`${portfolioPageContent.heading} ${portfolioPageContent.headingAccent}`}</h1>
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
            {` ${portfolioPageContent.heading} `}
            <span>{` ${portfolioPageContent.headingAccent} `}</span>{" "}
          </h2>
          <p>
            {` ${portfolioPageContent.description} `}
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
                  portfolioPageContent.download.headingLead
                }
                <span>
                  {
                    portfolioPageContent.download.headingAccent
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
                  href={portfolioPageContent.download.actions[0].href}
                  className={
                    "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mx-1"
                  }
                >
                  <span>{portfolioPageContent.download.actions[0].label}</span>
                </Link>
                <Link
                  href={portfolioPageContent.download.actions[1].href}
                  className={
                    "btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold mx-1"
                  }
                >
                  <span>{portfolioPageContent.download.actions[1].label}</span>
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
