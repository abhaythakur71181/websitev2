export interface Experience {
  company: string;
  companyUrl: string;
  role: string;
  period: string;
  location: string;
  points: string[];
  tech: string[];
}

export const experience: Experience[] = [
  {
    company: "Salescode.ai",
    companyUrl: "https://salescode.ai",
    role: "Senior Software Developer",
    period: "Apr 2026 — Present",
    location: "Gurugram, India",
    points: [
      "Lead end-to-end development and architecture of the Order Management System (OMS) within the Distributor Management System, owning key technical decisions.",
      "Mentor junior developers, run code reviews, and drive cross-module architectural decisions.",
      "Partner with cross-functional stakeholders to ship high-impact features while ensuring system reliability and performance.",
    ],
    tech: ["Java", "Spring Boot", "Apache Kafka", "Redis", "MySQL", "React"],
  },
  {
    company: "Salescode.ai",
    companyUrl: "https://salescode.ai",
    role: "Software Engineer",
    period: "Jan 2025 — Mar 2026",
    location: "Gurugram, India",
    points: [
      "Engineered a Java-based report generation engine converting raw CSV into complex XLSX reports, cutting manual reporting effort by 80%.",
      "Built and shipped RESTful APIs with Spring Boot, Spring Data JPA, Redis, Apache Kafka, and MySQL, handling real-time order state transitions at scale.",
      "Delivered responsive full-stack OMS modules in React.js, integrated with backend services via REST and WebSocket.",
      "Recognized as Lead Performer for five consecutive quarters with multiple Spot Awards.",
    ],
    tech: ["Java", "Spring Boot", "Spring Data JPA", "Kafka", "Redis", "MySQL", "React", "TypeScript"],
  },
  {
    company: "Salescode.ai",
    companyUrl: "https://salescode.ai",
    role: "Full Stack Developer Trainee",
    period: "Jul 2024 — Dec 2024",
    location: "Gurugram, India",
    points: [
      "Built backend microservices in Spring Boot and frontend components in React.js for the DMS product team.",
      "Promoted to full-time Software Engineer within 6 months for high-impact, consistent delivery.",
    ],
    tech: ["Java", "Spring Boot", "React"],
  },
];

export const education = [
  {
    school: "Chitkara University",
    degree: "B.E. in Computer Science",
    period: "2021 — 2025",
    detail: "CGPA 8.97/10 · Patiala, Punjab",
  },
  {
    school: "D.A.V. Public School",
    degree: "Class XII, PCM",
    period: "2019 — 2020",
    detail: "89.4% · Hamirpur, Himachal Pradesh",
  },
];
