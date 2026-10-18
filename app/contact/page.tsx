import { ContactSourceSections } from "@/components/sections/ContactSourceSections";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata = { title: "Contact Us | Iteck" };
export default function ContactPage() {
  return (
    <SiteLayout activePage="contact" transparentHeader>
      <ContactSourceSections />
    </SiteLayout>
  );
}
