export interface SkillGroup {
  label: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    skills: ["Java", "TypeScript", "Rust", "JavaScript", "SQL", "Lua", "Shell"],
  },
  {
    label: "Backend",
    skills: [
      "Spring Boot",
      "Spring Data JPA",
      "Hibernate",
      "Express.js",
      "Axum",
      "Tokio",
      "REST APIs",
      "WebSocket",
    ],
  },
  {
    label: "Data & Messaging",
    skills: ["MySQL", "PostgreSQL", "Redis", "Apache Kafka", "SQLite", "MongoDB"],
  },
  {
    label: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "Vite", "Socket.io"],
  },
  {
    label: "Cloud & DevOps",
    skills: ["AWS (S3, EB, CloudWatch)", "Docker", "Vercel", "Shuttle", "GitHub Actions"],
  },
  {
    label: "Environment",
    skills: ["NixOS", "GNU/Linux", "Neovim", "Tmux", "Git", "Jira", "Confluence"],
  },
];
