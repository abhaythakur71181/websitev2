export const site = {
  name: "Abhay Thakur",
  alias: "abhaythakur71181",
  formerAlias: "falcon71181",
  role: "Senior Software Developer",
  company: "Salescode.ai",
  companyUrl: "https://salescode.ai",
  location: "Gurugram, India",
  jokeLocation: "127.0.0.1",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://abhaythakur71181.vercel.app",
  title: "Abhay Thakur — Senior Software Developer",
  description:
    "Backend engineer building distributed, event-driven systems in Java and Spring Boot by day — Rust CLIs, crates, and open-source APIs by night. NixOS, Neovim, and a terminal somewhere in between.",
  tagline: "I build backends that don't fall over — and Rust things for fun.",
  email: "abhaythakur71181@gmail.com",
  links: {
    github: "https://github.com/abhaythakur71181",
    linkedin: "https://www.linkedin.com/in/abhay-thakur-81a3952bb",
    instagram: "https://www.instagram.com/abhaythakur71181",
    leetcode: "https://leetcode.com/u/falcon71181/",
    crates: "https://crates.io/users/abhaythakur71181",
    discord: "falcon_clutch71",
  },
  repoUrl: "https://github.com/abhaythakur71181/websitev2",
} as const;

export type Site = typeof site;
