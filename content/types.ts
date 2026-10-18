export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type SocialLink = LinkItem & {
  icon: string;
};

export type FooterContentModel = {
  brandTitle: string;
  descriptionLead: string;
  descriptionTail: string;
  informationTitle: string;
  usefulLinksTitle: string;
  resourceLinksTitle: string;
  usefulLinks: LinkItem[];
  resourceLinks: LinkItem[];
  socialLinks: SocialLink[];
  copyrightCompany: string;
  copyrightLabel: string;
  designedBy: LinkItem;
};

export type PromotionContent = {
  badge: string;
  lead: string;
  discount: string;
  audience: string;
  cta: LinkItem;
};
