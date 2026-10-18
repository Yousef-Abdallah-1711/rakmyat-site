export type NavigationItem = { label: string; href: string };

import type { FooterContentModel, PromotionContent } from "./types";

export const siteSettings = {
  name: "Iteck",
  headerLogo: "/assets/img/logo_home5.png",
  footerLogo: "/assets/img/logo_foot_home5.png",
  email: "contact@Itecksolution.co",
  phone: "+031 5689 89 98",
  address: "223 Thatcher Road St, Brookly, Manhattan, NY 10463, US",
  addressLines: [
    "223 Thatcher Road St, Brookly,",
    "Manhattan, NY 10463, US",
  ],
  copyrightYear: 2023,
} as const;

export const promotionContent: PromotionContent = {
  badge: "Special",
  lead: "Get",
  discount: "20% Discount",
  audience: "Get for New Account",
  cta: { label: "Register Now", href: "/contact" },
};

export const footerContent: FooterContentModel = {
  brandTitle: "Iteck - 1st eCommerce Dashboard",
  descriptionLead:
    "Over 25 years working in IT services developing software applications and mobile apps for clients all over the world. For your very specific industry,",
  descriptionTail: "we have highly-tailored IT solutions.",
  informationTitle: "Information",
  usefulLinksTitle: "Useful Links",
  resourceLinksTitle: "Resource",
  usefulLinks: [
    { label: "Home", href: "/" },
    { label: "About Iteck", href: "/about" },
    { label: "Projects", href: "/portfolio" },
    { label: "product", href: "/services/details" },
    { label: "Blog", href: "/portfolio" },
    { label: "Contact", href: "/contact" },
  ],
  resourceLinks: [
    { label: "Online Documentation", href: "#" },
    { label: "Roadmap", href: "#" },
    { label: "Intergrations", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Help Center", href: "#" },
  ],
  socialLinks: [
    { label: "Twitter", href: "https://twitter.com/", icon: "twitter" },
    { label: "Facebook", href: "https://facebook.com/", icon: "facebook-f" },
    {
      label: "Instagram",
      href: "https://instagram.com/",
      icon: "instagram",
    },
  ],
  copyrightCompany: "Iteck Co.",
  copyrightLabel: "© 2023 Copyrights by",
  designedBy: {
    label: "ThemesCamp",
    href: "https://themeforest.net/user/themescamp",
    external: true,
  },
};

export const homeMenu: NavigationItem[] = [
  { label: "Landing Preview", href: "/" },
  { label: "Creative It Solutions", href: "/" },
  { label: "Data Analysis", href: "/" },
  { label: "App Landing", href: "/" },
  { label: "Saas Technology", href: "/" },
  { label: "Marketing Startup", href: "/" },
  { label: "It Solution", href: "/" },
  { label: "Software Company", href: "/" },
  { label: "Digital Agency", href: "/" },
  { label: "Modern Shop", href: "/" },
];

export const pageMenu: NavigationItem[] = [
  { label: "about", href: "/about" },
  { label: "product", href: "/services/details" },
  { label: "services", href: "/services" },
  { label: "shop", href: "/portfolio" },
  { label: "single project", href: "/projects/notero" },
];

export const mainNavigation: NavigationItem[] = [
  { label: "portfolio", href: "/portfolio" },
  { label: "blog", href: "/portfolio" },
  { label: "contact us", href: "/contact" },
];
