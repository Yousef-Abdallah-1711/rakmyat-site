export type ServiceSummary = {
  title: string;
  description: string;
  icon: string;
};

export const serviceSummaries: ServiceSummary[] = [
  {
    title: "Content Strategy",
    description:
      "You can provide the answers that your potential customers are trying to find, so you can become the industry.",
    icon: "/assets/img/icons/serv_icons/16.png",
  },
  {
    title: "Google/FB Ads",
    description:
      "Get more website traffic, more customers & more online visibility with powerful SEO services.",
    icon: "/assets/img/icons/serv_icons/15.png",
  },
  {
    title: "Email Marketing",
    description:
      "Your website has to impress your visitors within just a few seconds",
    icon: "/assets/img/icons/serv_icons/14.png",
  },
  {
    title: "Social Media",
    description:
      "Get more website traffic, more customers for your social chanel",
    icon: "/assets/img/icons/serv_icons/17.png",
  },
  {
    title: "Website Design and Development",
    description:
      "Your website has to impress your visitors within just a few seconds. If it runs slow, if it feels outdated",
    icon: "/assets/img/icons/serv_icons/18.png",
  },
  {
    title: "TVC/ Viral Clip",
    description: "Optimized your website on google result with PPC Marketing",
    icon: "/assets/img/icons/serv_icons/19.png",
  },
  {
    title: "PPC Ads",
    description: "Optimized your website on google result with PPC Marketing",
    icon: "/assets/img/icons/serv_icons/20.png",
  },
];

export const servicesPageContent = {
  pageHeading: "Our Services",
  sectionHeading: "Our Top Services",
  sectionDescription:
    "Iteck Dashboard is a powerhouse when it comes to the feature list. This ensures you have every functionality you need to build, run, and expand your marketplace",
  optimizedHeadingLead: "Optimized User",
  optimizedHeadingAccent: "Experiences",
  optimizedDescription:
    "The uploading and updating processes made by suppliers can be streamlined through front-end dashboards that create better ease of access.",
  optimizedLinks: [
    "Sales Breakdown & Funnel",
    "Abadoned Carts",
    "Revenue by Channel & Devices",
    "Sales Forecast",
  ],
  payment: {
    headingLead: "100+ Payment",
    headingAccent: "Gateways",
    description:
      "With Iteck Marketplace, choose from hundreds of payment gateways for your customers. From PayPal to Stripe to Skrill, Visa Debit, Master Card, etc",
    benefits: [
      "100% Guarantee Secure Payment",
      "1% Extra Fees For All",
      "Support Dispute & Refund 24/7",
    ],
    button: "Book A Free Demo",
  },
  customization: {
    headingLead: "Easy To",
    headingAccent: "Customizable",
    paragraphs: [
      "Dashboards are meant to be personal tools for website managers and suppliers to enjoy, and are therefore largely modifiable.",
      "When it comes to customer actions, website administrators can choose the permissions of each supplier, allowing them to limit or empower commerce activity as needed.",
    ],
    statistic: "42,500+",
    statisticLabel: "Marketplace Owners Trust Us",
  },
} as const;
