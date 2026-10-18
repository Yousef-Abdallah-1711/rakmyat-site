export type ClientLogo = {
  id: string;
  image: string;
  href: string;
  alt: string;
};

export const clientsContent = {
  heading: "Trusted By Thoudsands",
  headingAccent: "Business",
  description: "More than 15,000 companies trust and choose Iteck",
};

export const clientLogoRows: ClientLogo[][] = [
  [7, 8, 9, 10, 11, 12].map((number) => ({
    id: `client-${number}`,
    image: `/assets/img/logos/${number}.png`,
    href: "#",
    alt: "",
  })),
  [13, 14, 15, 16, 17, 9].map((number, index) => ({
    id: `partner-${number}-${index}`,
    image: `/assets/img/logos/${number}.png`,
    href: "#",
    alt: "",
  })),
];
