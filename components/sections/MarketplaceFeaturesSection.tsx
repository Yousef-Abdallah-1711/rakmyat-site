import {
  marketplaceFeatures,
  marketplaceFeaturesContent,
} from "@/content/features";

export function MarketplaceFeaturesSection({
  variant,
}: {
  variant: "home" | "services";
}) {
  const content = marketplaceFeaturesContent[variant];
  return (
    <section className={content.sectionClass}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="section-head text-center mb-60 style-5">
              <h2 className="mb-20">
                {` ${content.heading} `}
                <span>{` ${content.accent} `}</span>{" "}
              </h2>
              <p>{content.description}</p>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="row">
            {marketplaceFeatures.map((feature, index) => (
              <div className="col-lg-3 col-sm-6" key={feature.title}>
                <a
                  href={feature.href}
                  className={`features-card ${index < 4 ? "mb-30 style-5" : index < 7 ? "mb-30 mb-lg-0 style-5" : "style-5"}`}
                >
                  <div className="icon">
                    <img src={feature.image} alt="" />
                  </div>
                  <div className="info">
                    <h5 className="card-title">{feature.title}</h5>
                    <p className="text">{feature.description}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
