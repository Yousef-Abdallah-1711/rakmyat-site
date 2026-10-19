import type { Locale } from "@/content/i18n";
import { getServices } from "@/content/services";

export function ServicesCarousel({ locale = "en" }: { locale?: Locale }) {
  const icons = [14, 15, 16, 17, 18];
  const services = getServices(locale);
  return <div className="services-slider position-relative style-6"><div className="swiper-container"><div className="swiper-wrapper">{services.map((service, index) => <div className="swiper-slide" key={service.id}><article className="service-card style-6"><div className="icon"><img src={`/assets/img/icons/serv_icons/${icons[index]}.png`} alt="" /></div><div className="info"><h5>{service.title}</h5><div className="text">{service.summary}</div><ul>{service.capabilities.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></div></article></div>)}</div></div></div>;
}
