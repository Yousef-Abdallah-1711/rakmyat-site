export type NavigationItem = { label: string; href: string };

export const siteSettings = {
  name: "Iteck",
  email: "contact@Itecksolution.co",
  phone: "+031 5689 89 98",
  address: "223 Thatcher Road St, Brookly, Manhattan, NY 10463, US",
  copyrightYear: 2023,
} as const;

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
