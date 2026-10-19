import type { Locale } from "@/content/i18n";

export function TestimonialsSection({ locale = "en" }: { locale?: Locale }) {
  const copy = locale === "en" ? {
    heading: "Questions to",
    accent: "discuss",
    description: "These prompts replace unverified testimonials; no client statements or endorsements are shown.",
    cards: ["What does the software need to do?", "Which workflows should it support?", "What systems or data are involved?", "What should be decided first?"],
    label: "Project prompt",
  } : {
    heading: "أسئلة",
    accent: "للنقاش",
    description: "تحل هذه الأسئلة محل الشهادات غير المعتمدة؛ لا نعرض أقوالًا أو تزكيات من عملاء.",
    cards: ["ما الذي ينبغي أن ينجزه النظام؟", "ما سير العمل الذي ينبغي دعمه؟", "ما الأنظمة أو البيانات ذات الصلة؟", "ما أول قرار ينبغي اتخاذه؟"],
    label: "سؤال للمشروع",
  };
  return (
    <section className="testimonials section-padding bg-gray5 style-5">
      <div className="container">
        <div className="section-head text-center mb-60 style-5">
          <h2 className="mb-20">{` ${copy.heading} `}<span>{` ${copy.accent} `}</span></h2>
          <p>{copy.description}</p>
        </div>
      </div>
      <div className="content"><div className="testimonial-slider position-relative style-5"><div className="swiper-container pb-70"><div className="swiper-wrapper">
        {copy.cards.map((question) => (
          <div className="swiper-slide" key={question}>
            <article className="testi-card style-5">
              <div className="text">{question}</div>
              <div className="user mt-40 text-center"><h6>{copy.label}</h6></div>
            </article>
          </div>
        ))}
      </div></div><div className="swiper-pagination" /></div></div>
    </section>
  );
}
