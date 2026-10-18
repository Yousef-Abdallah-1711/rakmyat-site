export type TeamMember = {
  name: string;
  role: string;
  image: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Michael Edwards",
    role: "CEO Founder",
    image: "/assets/img/team/1.jpeg",
  },
  { name: "Bobby Kane", role: "CTO", image: "/assets/img/team/5.jpeg" },
  {
    name: "Robert Downey Jr",
    role: "Project Manager",
    image: "/assets/img/team/3.jpeg",
  },
  {
    name: "Andrew Robertson",
    role: "Marketing Leader",
    image: "/assets/img/team/4.jpeg",
  },
];

export const teamSocialLinks = [
  "twitter",
  "facebook-f",
  "linkedin-in",
  "github",
] as const;
