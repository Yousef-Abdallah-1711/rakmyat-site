import { HomeSourceSections } from "@/components/sections/HomeSourceSections";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata = { title: "Saas Technology | Iteck" };

export default function HomePage() {
  return (
    <SiteLayout activePage="home" borderedFooter>
      <HomeSourceSections />
    </SiteLayout>
  );
}
