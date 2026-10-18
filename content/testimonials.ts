export type Testimonial = {
  id: string;
  quote: string;
  image: string;
  name: string;
  role: string;
  href: string;
  rating: number;
};

export const testimonialsContent = {
  heading: "Clients",
  headingAccent: "Reviews",
  description:
    "Iteck loved from thoudsands customer worldwide and get trusted from big companies.",
};

export const testimonials: Testimonial[] = [
  {
    id: "thomas-eristen",
    quote:
      "\u201cBest dashboard for any your store, woo or shopify. Powerful and very flexiable. Recommended!\u201d",
    image: "/assets/img/team/1.jpeg",
    name: "Thomas Eristen",
    role: "Sale Director at Amazon Retail",
    href: "#",
    rating: 5,
  },
  {
    id: "carlos-martinelli",
    quote:
      "\u201cIteck provide very much features to help increase CRO so amazing.\u201d",
    image: "/assets/img/team/2.jpeg",
    name: "Carlos Martinelli",
    role: "SEO & Marketing at Ebay Global",
    href: "#",
    rating: 5,
  },
  {
    id: "eduard-mendy",
    quote:
      "\u201cBig thank to team support of Iteck. Fast, professional and extremly friendly. This product alway update and ehance everyday.\u201d",
    image: "/assets/img/team/3.jpeg",
    name: "Eduard Mendy",
    role: "VP of Sale Development",
    href: "#",
    rating: 5,
  },
  {
    id: "lucas-digne",
    quote:
      "\u201c10/10 for all related to Iteck E-Com Dashboard. It\u2019s too perfect!\u201d",
    image: "/assets/img/team/4.jpeg",
    name: "Lucas Digne",
    role: "Sale Product Management at Flipkart",
    href: "#",
    rating: 5,
  },
];
