export type PortfolioProject = {
  title: string;
  type: string;
  image: string;
  categories: string[];
  tags: string[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    title: "Infrastructure Upgrade",
    type: "IT Consultation",
    image: "/assets/img/projects/prog/1.jpeg",
    categories: ["security", "consultation"],
    tags: ["Consultation", "Management"],
  },
  {
    title: "Criftocy Landing Page",
    type: "Website Development, UI/UX Design",
    image: "/assets/img/projects/prog/2.png",
    categories: ["design", "security"],
    tags: ["WordPress", "PHP", "HTML/CSS", "Figma"],
  },
  {
    title: "AR/VR War 1986 Game",
    type: "Game Developemnt",
    image: "/assets/img/projects/prog/3.jpeg",
    categories: ["website", "development"],
    tags: ["VR/AR", "iOS & Android", "Unity 2D/3D"],
  },
  {
    title: "Okpay E-Wallet Optimized",
    type: "SEO analysis",
    image: "/assets/img/projects/4.png",
    categories: ["cloud", "design"],
    tags: ["SEO Analysis", "Content Strategy"],
  },
  {
    title: "e-Commerce Dashboard",
    type: "website design & develoment",
    image: "/assets/img/projects/5.png",
    categories: ["website", "development", "cloud"],
    tags: ["WordPress", "PHP", "HTML/CSS", "Figma"],
  },
  {
    title: "Crypto Blockchain",
    type: "Data security",
    image: "/assets/img/projects/7.png",
    categories: ["design", "consultation"],
    tags: ["Security", "Management", "Backup & Recovery"],
  },
  {
    title: "Car Rental Dashboard",
    type: "UI/UX Design",
    image: "/assets/img/projects/1.png",
    categories: ["cloud", "design"],
    tags: ["HTML/CSS", "Figma"],
  },
  {
    title: "Encrypt Blockchain",
    type: "Data security, it consultation",
    image: "/assets/img/projects/2.png",
    categories: ["security", "cloud"],
    tags: ["Data Security", "Python", "Data Backup"],
  },
  {
    title: "Robotchat AI Development",
    type: "machine learning",
    image: "/assets/img/projects/6.png",
    categories: ["development", "consultation"],
    tags: ["AI", "Machine Learning"],
  },
];
