export type MarketplaceFeature = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export const marketplaceFeaturesContent = {
  home: {
    heading: "Other Awesome",
    accent: "Features",
    description:
      "Iteck Dashboard is a powerhouse when it comes to the feature list. This ensures you have every functionality you need to build, run, and expand your marketplace",
    sectionClass: "features section-padding style-5 bg-gray5",
  },
  services: {
    heading: "Our",
    accent: "Services",
    description: "We provide perfect IT Solutions for your business",
    sectionClass: "features section-padding pt-50 style-5",
  },
} as const;

export const marketplaceFeatures: MarketplaceFeature[] = [
  {
    title: "Store Hours and Vacation",
    description:
      "Ideal for businesses that are seasonal or operate between fixed hours.",
    image: "/assets/img/icons/features/1.png",
    href: "#",
  },
  {
    title: "Coupon Management",
    description:
      "Set up irresistible deals and offers with flexible discount promo codes.",
    image: "/assets/img/icons/features/2.png",
    href: "#",
  },
  {
    title: "Product Import and Export",
    description:
      "Import products from and export products to CSV from vendor dashboard.",
    image: "/assets/img/icons/features/3.png",
    href: "#",
  },
  {
    title: "Inquiry and Support Ticket System",
    description:
      "Interaction with sellers help buyers to make better purchase decisions.",
    image: "/assets/img/icons/features/4.png",
    href: "#",
  },
  {
    title: "Membership Subscription",
    description:
      "Offer membership plans for sellers, free and paid. Accept recurring fees.",
    image: "/assets/img/icons/features/5.png",
    href: "#",
  },
  {
    title: "Invoice and Shipping Labels",
    description:
      "Order fulfillment made easy with store invoices and shipping labels.",
    image: "/assets/img/icons/features/6.png",
    href: "#",
  },
  {
    title: "GEO Location and Radius Search",
    description:
      "Allow searching products or services near the user’s current location.",
    image: "/assets/img/icons/features/7.png",
    href: "#",
  },
  {
    title: "Shipment and Delivery",
    description:
      "Share tracking of deliveries, notify when shipping status changes.",
    image: "/assets/img/icons/features/8.png",
    href: "#",
  },
];
