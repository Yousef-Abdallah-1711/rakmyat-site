import { productReasonsContent } from "@/content/reasons";

export function ProductReasonsSection() {
  return (
    <section className="community pt-40 style-5">
      <div className="container">
        <div className="section-head text-center mb-40 style-5">
          <h2 className="mb-20">
            {` ${productReasonsContent.heading} `}
            <span>{` ${productReasonsContent.headingAccent} `}</span>{" "}
          </h2>
          <p>{productReasonsContent.description}</p>
        </div>
        <div className="content rounded-pill">
          {productReasonsContent.cards.map((card, index) => (
            <div className="commun-card" key={`${card.title}-${index}`}>
              <div className="icon">
                <img src={card.image} alt="" />
              </div>
              <div className="inf">
                <h5>{card.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
