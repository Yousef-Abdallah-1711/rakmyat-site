import { serviceSummaries } from "@/content/services";

export function ServicesCarousel() {
  return (
    <div className="services-slider position-relative style-6">
      <div className="swiper-container">
        <div className="swiper-wrapper">
          {serviceSummaries.map((service) => (
            <div className="swiper-slide" key={service.title}>
              <a href="#" className="service-card style-6">
                <div className="icon">
                  <img src={service.icon} alt="" />
                </div>
                <div className="info">
                  <h5>{service.title}</h5>
                  <div className="text">{service.description}</div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
