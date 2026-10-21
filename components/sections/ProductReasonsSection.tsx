import type { Locale } from "@/content/i18n";

export function ProductReasonsSection({ locale = "en" }: { locale?: Locale }) {
  const content = locale === "en" ? {
    heading: "Software built around",
    headingAccent: "the work",
    description: "Bring the customer experience, business process, and supporting systems into the same conversation.",
    cards: ["Start with the workflow", "Connect the right systems", "Plan for real users"],
  } : {
    heading: "برمجيات تتمحور حول",
    headingAccent: "سير العمل",
    description: "نجمع تجربة العميل وعمليات العمل والأنظمة الداعمة في صورة واحدة.",
    cards: ["نبدأ بسير العمل", "نربط الأنظمة المناسبة", "نخطط للمستخدمين الفعليين"],
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
              <div className="inf"><h3>{title}</h3></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
