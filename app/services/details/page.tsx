import { ServiceDetailsSourceSections } from "@/components/sections/ServiceDetailsSourceSections";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata = { title: "Email Marketing | Iteck" };
export default function ServiceDetailsPage() {
  return (
    <SiteLayout activePage="services" transparentHeader borderedFooter>
      <ServiceDetailsSourceSections />
    </SiteLayout>
  );
}
