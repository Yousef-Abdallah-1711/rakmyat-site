import { testimonials, testimonialsContent } from "@/content/testimonials";

export function TestimonialsSection() {
  return (
    <section className="testimonials section-padding bg-gray5 style-5">
      <div className="container">
        <div className="section-head text-center mb-60 style-5">
          <h2 className="mb-20">
            {` ${testimonialsContent.heading} `}
            <span>{` ${testimonialsContent.headingAccent} `}</span>{" "}
          </h2>
          <p>{` ${testimonialsContent.description} `}</p>
        </div>
      </div>
      <div className="content">
        <div className="testimonial-slider position-relative style-5">
          <div className="swiper-container pb-70">
            <div className="swiper-wrapper">
              {testimonials.map((testimonial) => (
                <div className="swiper-slide" key={testimonial.id}>
                  <a href={testimonial.href} className="testi-card style-5">
                    <div className="stars">
                      {Array.from({ length: testimonial.rating }, (_, star) => (
                        <i className="fas fa-star" key={star}></i>
                      ))}
                    </div>
                    <div className="text">{testimonial.quote}</div>
                    <div className="user mt-40 text-center">
                      <div className="icon-80 rounded-circle img-cover overflow-hidden m-auto">
                        <img src={testimonial.image} alt="" />
                      </div>
                      <h6>{testimonial.name}</h6>
                      <small>{testimonial.role}</small>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  );
}
