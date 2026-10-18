import type { ReactNode } from "react";
import { FooterContent, SiteFooter } from "@/components/layout/SiteChrome";
import { PageEffects } from "@/components/layout/PageEffects";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LegacySliderRuntime } from "@/components/sections/LegacySliderRuntime";
import { PricingPeriodProvider } from "@/components/sections/PricingPeriod";
import { MediaLightbox } from "@/components/sections/MediaLightbox";

type SiteLayoutProps = {
  children: ReactNode;
  activePage:
    "home" | "about" | "contact" | "portfolio" | "services" | "project";
  transparentHeader?: boolean;
  borderedFooter?: boolean;
};

export function SiteLayout({
  children,
  activePage,
  transparentHeader = false,
  borderedFooter = false,
}: SiteLayoutProps) {
  return (
    <>
      <PageEffects />
      <SiteHeader activePage={activePage} transparent={transparentHeader} />
      <PricingPeriodProvider>{children}</PricingPeriodProvider>
      <LegacySliderRuntime />
      <MediaLightbox />
      <SiteFooter bordered={borderedFooter}>
        <FooterContent />
      </SiteFooter>
      <ScrollToTop />
    </>
  );
}
