import { clientLogoRows, clientsContent } from "@/content/clients";

export function ClientLogosSection({
  variant,
}: {
  variant: "home" | "about";
}) {
  const sectionClass =
    variant === "home" ? "clients style-5 pb-100" : "clients section-padding style-5";
  return (
    <section className={sectionClass}>
      <div className="section-head text-center mb-40 style-5">
        <h2 className="mb-20">
          {` ${clientsContent.heading} `}
          <span>{` ${clientsContent.headingAccent} `}</span>{" "}
        </h2>
        <p>{clientsContent.description}</p>
      </div>
      <div className="content">
        {clientLogoRows.map((row, index) => (
          <div
            className="clients-slider5"
            dir={index === 1 ? "rtl" : undefined}
            key={`row-${index}`}
          >
            <div className="swiper-container">
              <div className="swiper-wrapper">
                {row.map((logo) => (
                  <div className="swiper-slide" key={logo.id}>
                    <a
                      href={logo.href}
                      className="img"
                      aria-label={`Client logo ${logo.id}`}
                    >
                      <img src={logo.image} alt={logo.alt} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
