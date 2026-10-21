import type { ReactNode } from "react";
import { FooterContent, SiteFooter } from "@/components/layout/SiteChrome";
import { PageEffects } from "@/components/layout/PageEffects";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LegacySliderRuntime } from "@/components/sections/LegacySliderRuntime";
import { PricingPeriodProvider } from "@/components/sections/PricingPeriod";
import { MediaLightbox } from "@/components/sections/MediaLightbox";
import type { Locale } from "@/content/i18n";

type SiteLayoutProps = {
  children: ReactNode;
  activePage:
    "home" | "about" | "contact" | "portfolio" | "services" | "howWeWork" | "project";
  transparentHeader?: boolean;
  borderedFooter?: boolean;
  locale?: Locale;
};

export function SiteLayout({
  children,
  activePage,
  transparentHeader = false,
  borderedFooter = false,
  locale = "en",
}: SiteLayoutProps) {
  return (
    <>
      <PageEffects />
      <SiteHeader activePage={activePage} transparent={transparentHeader} locale={locale} />
      <PricingPeriodProvider>{children}</PricingPeriodProvider>
      {activePage === "home" && <LegacySliderRuntime />}
      {activePage === "project" && <MediaLightbox />}
      <SiteFooter bordered={borderedFooter}>
        <FooterContent locale={locale} />
        <ScrollToTop locale={locale} />
      </SiteFooter>
    </>
  );
}
