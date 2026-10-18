import { PortfolioSourceSections } from "@/components/sections/PortfolioSourceSections";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata = { title: "Our Projects | Iteck" };
export default function PortfolioPage() {
  return (
    <SiteLayout activePage="portfolio" borderedFooter>
      <PortfolioSourceSections />
    </SiteLayout>
  );
}
