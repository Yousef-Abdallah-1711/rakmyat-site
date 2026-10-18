export type PricingPlan = {
  id: "basic" | "premium" | "ultimate";
  desktopName: string;
  mobileName: string;
  monthlyPrice: string;
  yearlyPrice: string;
  caption: string;
  note: string;
  featured?: boolean;
};

export type PricingValue = boolean | string | null;

export type PricingFeature = {
  id: string;
  label: string;
  values: [PricingValue, PricingValue, PricingValue];
  tooltip?: string;
};

export const pricingCopy = {
  heading: "Choose Plan and",
  headingAccent: "Kick-start",
  description:
    "Whether you\u2019re just getting started with rapid testing or scaling across the organization, we\u2019ve got you covered.",
  monthlyLabel: "Billed Monthly",
  yearlyLabel: "Billed yearly",
  yearlyDiscount: "-15%",
  planCta: "Get Started Now",
} as const;

export const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    desktopName: "basic",
    mobileName: "BASIC",
    monthlyPrice: "Free",
    yearlyPrice: "Free",
    caption: "Free forever.!",
    note: "No credit card required.",
  },
  {
    id: "premium",
    desktopName: "Premium",
    mobileName: "PREMIUM",
    monthlyPrice: "$49",
    yearlyPrice: "$49",
    caption: "Free forever.!",
    note: "No credit card required.",
    featured: true,
  },
  {
    id: "ultimate",
    desktopName: "ultimate",
    mobileName: "ULTIMATE",
    monthlyPrice: "$99",
    yearlyPrice: "$99",
    caption: "Free forever.!",
    note: "No credit card required.",
  },
];

export const pricingFeatures: PricingFeature[] = [
  { id: "projects", label: "Unlimited Projects", values: [true, true, true] },
  {
    id: "support",
    label: "Lifetime Support & SEO Experts Consult",
    values: [true, true, true],
  },
  {
    id: "dashboard",
    label: "Advance Dashboard",
    values: [true, true, true],
  },
  {
    id: "security",
    label: "Data Security & Backup",
    values: ["200 GB", "1 TB", "Unlimited"],
  },
  {
    id: "hosting",
    label: "Cloud Hosting & Domain",
    values: [null, null, true],
  },
  {
    id: "analysis",
    label: "Free Google Analysis",
    values: ["$5/Year", true, true],
    tooltip:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. In voluptatum, eos ad quia sint recusandae.",
  },
  {
    id: "marketplace",
    label: "Multi-Vendor Marketplace Support",
    values: [null, null, true],
  },
  { id: "seller-app", label: "Seller App", values: [null, true, true] },
  {
    id: "upgrade",
    label: "Auto Lifetime Upgrade",
    values: [null, true, true],
    tooltip:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. In voluptatum, eos ad quia sint recusandae.",
  },
  {
    id: "ssl",
    label: "Free SSL Certificate",
    values: [null, null, true],
    tooltip:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. In voluptatum, eos ad quia sint recusandae.",
  },
];
