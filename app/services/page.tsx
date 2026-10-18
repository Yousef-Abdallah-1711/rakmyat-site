import { ServicesSourceSections } from "@/components/sections/ServicesSourceSections";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata = { title: "Our Services | Iteck" };
export default function ServicesPage() {
  return (
    <SiteLayout activePage="services">
      <ServicesSourceSections />
    </SiteLayout>
  );
}
