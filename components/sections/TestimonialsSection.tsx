import type { Locale } from "@/content/i18n";
import { getPageCopy } from "@/content/page-copy";

export function TestimonialsSection({ locale = "en" }: { locale?: Locale }) {
  const content = getPageCopy(locale).home;
  const cards = locale === "en"
    ? [
        { title: "Customer question", body: content.reviews[0] },
        { title: "Selected information", body: content.reviews[1] },
        { title: "Organized request", body: content.reviews[2] },
        { title: "Human review", body: content.reviews[3] },
      ]
    : [
        { title: "سؤال العميل", body: content.reviews[0] },
        { title: "معلومات محددة", body: content.reviews[1] },
        { title: "طلب منظم", body: content.reviews[2] },
        { title: "مراجعة بشرية", body: content.reviews[3] },
      ];
  return (
    <section className="testimonials section-padding bg-gray5 style-5">
      <div className="container">
        <div className="section-head text-center mb-60 style-5">
          <h2 className="mb-20">{content.reviewsHeading}</h2>
          <p>{content.reviewsDescription}</p>
        </div>
      </div>
      <div className="content"><div className="testimonial-slider position-relative style-5"><div className="swiper-container pb-70"><div className="swiper-wrapper">
        {cards.map((item, index) => <div className="swiper-slide" key={item.title}>
          <article className="testi-card style-5">
            <div className="text">{item.body}</div>
            <div className="user mt-40 text-center"><h6>{String(index + 1).padStart(2, "0")} · {item.title}</h6></div>
          </article>
        </div>)}
      </div></div><div className="swiper-pagination" /></div></div>
    </section>
  );
}
