import type { Locale } from "@/content/i18n";

export function ServicesCarousel({ locale = "en" }: { locale?: Locale }) {
  const items = locale === "en"
    ? ["Business need", "Project scope", "User needs", "Requirements", "Current systems", "Project questions", "Next steps"]
    : ["احتياج العمل", "نطاق المشروع", "احتياجات المستخدمين", "المتطلبات", "الأنظمة الحالية", "أسئلة المشروع", "الخطوات التالية"];
  const icons = [16, 15, 14, 17, 18, 19, 20];
  return <div className="services-slider position-relative style-6"><div className="swiper-container"><div className="swiper-wrapper">{items.map((label, index) => <div className="swiper-slide" key={label}><div className="service-card style-6"><div className="icon"><img src={`/assets/img/icons/serv_icons/${icons[index]}.png`} alt="" /></div><div className="info"><h5>{label}</h5><div className="text">{locale === "en" ? "A topic to clarify during a project discussion." : "موضوع للتوضيح أثناء مناقشة المشروع."}</div></div></div></div>)}</div></div></div>;
}
