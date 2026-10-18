import { AboutSourceSections } from "@/components/sections/AboutSourceSections";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata = { title: "About Us | Iteck" };
export default function AboutPage() {
  return (
    <SiteLayout activePage="about">
      <AboutSourceSections />
    </SiteLayout>
  );
}
