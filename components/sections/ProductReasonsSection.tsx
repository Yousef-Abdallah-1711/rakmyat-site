import type { Locale } from "@/content/i18n";

export function ProductReasonsSection({ locale = "en" }: { locale?: Locale }) {
  const content = locale === "en" ? {
    heading: "A project",
    headingAccent: "conversation",
    description: "Start with the business need and the questions you want to resolve.",
    cards: ["Understand the need", "Clarify the scope", "Discuss next steps"],
  } : {
    heading: "مناقشة",
    headingAccent: "المشروع",
    description: "ابدأ باحتياج العمل والأسئلة التي تريد الإجابة عنها.",
    cards: ["فهم الاحتياج", "توضيح النطاق", "مناقشة الخطوات التالية"],
  };
  const images = ["/assets/img/icons/code3d.png", "/assets/img/icons/price3d.png", "/assets/img/icons/message3d.png"];
  return (
    <section className="community pt-40 style-5">
      <div className="container">
        <div className="section-head text-center mb-40 style-5">
          <h2 className="mb-20">{` ${content.heading} `}<span>{` ${content.headingAccent} `}</span></h2>
          <p>{content.description}</p>
        </div>
        <div className="content rounded-pill">
          {content.cards.map((title, index) => (
            <div className="commun-card" key={title}>
              <div className="icon"><img src={images[index]} alt="" /></div>
              <div className="inf"><h5>{title}</h5></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
