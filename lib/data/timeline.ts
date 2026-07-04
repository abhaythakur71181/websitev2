export interface TimelineEntry {
  year: number;
  title: string;
  description: string;
  kind: "work" | "oss" | "education" | "milestone";
}

export const timeline: TimelineEntry[] = [
  {
    year: 2026,
    title: "Promoted to Senior Software Developer",
    description:
      "Now leading end-to-end development and architecture of the Order Management System at Salescode.ai — owning key technical decisions, mentoring junior developers, and running code reviews.",
    kind: "work",
  },
  {
    year: 2026,
    title: "crabby_proxy",
    description:
      "Built a multi-protocol forward proxy in Rust — Tokio, Axum, SQLx, three-tier caching, RBAC, and 398 tests. The most sophisticated thing in the open-source pile so far.",
    kind: "oss",
  },
  {
    year: 2025,
    title: "Graduated from Chitkara University",
    description: "B.E. in Computer Science, CGPA 8.97/10.",
    kind: "education",
  },
  {
    year: 2025,
    title: "Software Engineer at Salescode.ai",
    description:
      "Promoted to full-time in six months. Shipped a Java report-generation engine that cut manual reporting effort by 80%, and built real-time order state pipelines on Spring Boot, Kafka, Redis, and MySQL. Lead Performer five consecutive quarters.",
    kind: "work",
  },
  {
    year: 2024,
    title: "Five crates on crates.io",
    description:
      "Went deep on Rust: published aniscraper, rust-paper, todo-rust, byteutils, and perfmode — closing in on 12k combined downloads.",
    kind: "oss",
  },
  {
    year: 2024,
    title: "Joined Salescode.ai as Full Stack Developer Trainee",
    description:
      "First industry role: backend microservices in Spring Boot and React frontends for the Distributor Management System product team.",
    kind: "work",
  },
  {
    year: 2024,
    title: "Anime-API breaks 100 stars",
    description:
      "The anime metadata REST API found a real community — 161 stars, 107 forks, mirrors, and contributors. Later rewritten in Rust (KawaiiKinetics) with 3× lower latency, then archived with honors.",
    kind: "oss",
  },
  {
    year: 2023,
    title: "The web era",
    description:
      "Forums, shopping sites, portfolios, a hostel gate-pass automation for Chitkara — the year of learning to ship web apps in JavaScript, then TypeScript.",
    kind: "milestone",
  },
  {
    year: 2021,
    title: "Started at Chitkara University — and on GitHub",
    description:
      "B.E. Computer Science begins in Patiala. First repos: small Python tools, terminal experiments, and an unreasonable amount of curiosity about how systems work under the hood.",
    kind: "education",
  },
];
