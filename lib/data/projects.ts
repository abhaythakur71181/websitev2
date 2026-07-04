/**
 * Curated project data. Static facts (descriptions, categories, highlights)
 * live here; live stats (stars, forks) are fetched from the GitHub API at
 * render time and merged by repo name. Crate download counts are fetched
 * from crates.io. Numbers in `highlights` are point-in-time research facts,
 * phrased so they age gracefully.
 */

export type ProjectCategory =
  | "Flagship"
  | "Rust & Systems"
  | "Web & Full-stack"
  | "Tooling & Dotfiles";

export interface Project {
  /** GitHub repo name under abhaythakur71181 (used to merge live stats). */
  repo: string;
  name: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  tech: string[];
  highlights?: string[];
  crate?: string;
  demo?: string;
  featured?: boolean;
  archived?: boolean;
}

export const projects: Project[] = [
  {
    repo: "Anime-API",
    name: "Anime-API",
    tagline: "The anime metadata REST API that found its community.",
    description:
      "Open-source anime metadata REST API built on web scraping, aggregating search, episodes, servers, and stream metadata from multiple sources with layered caching. Grew organically to 160+ stars and 100+ forks with active community contributors and mirrors — now archived, succeeded by the Rust rewrite.",
    category: "Flagship",
    tech: ["TypeScript", "Express.js", "Node.js", "Cheerio", "Docker", "Vercel"],
    highlights: [
      "161 stars, 107 forks, community-run mirrors and docs",
      "Multi-source aggregation with 30min–1mo cache tiers",
      "Succeeded by a Rust/Axum rewrite (KawaiiKinetics) with 3× lower latency",
    ],
    featured: true,
    archived: true,
  },
  {
    repo: "crabby_proxy",
    name: "crabby_proxy",
    tagline: "A multi-protocol forward proxy, taken unreasonably seriously.",
    description:
      "HTTP, HTTPS, SOCKS4/4a and SOCKS5 on a single port with automatic protocol detection. Tokio + Axum, SQLx/SQLite persistence, a three-tier cache (DashMap → LRU → optional Redis), Argon2 + JWT auth with role-based access control, GeoLite2 geo-blocking, quota enforcement, reverse tunnels, Prometheus metrics — and 398 tests.",
    category: "Rust & Systems",
    tech: ["Rust", "Tokio", "Axum", "SQLx", "SQLite", "Redis", "Prometheus"],
    highlights: [
      "398 tests against in-memory SQLite",
      "Auto-detects 5 proxy protocols on one port",
      "RBAC, audit logging, quotas, geo-blocking",
    ],
    featured: true,
  },
  {
    repo: "rust-paper",
    name: "rust-paper",
    tagline: "Wallpapers, managed from the terminal.",
    description:
      "A Linux/UNIX wallpaper manager CLI integrating the Wallhaven.cc API: concurrent downloads, SHA256 integrity verification, search with color filters, and random selection. Sub-10ms startup, <5 MB static binary. Published on crates.io.",
    category: "Rust & Systems",
    tech: ["Rust", "CLI", "Wallhaven API"],
    crate: "rust-paper",
    featured: true,
  },
  {
    repo: "LiveXpanse",
    name: "LiveXpanse",
    tagline: "Real-time streaming platform with a community pulse.",
    description:
      "Collaborative streaming platform: LiveKit for peer video, Socket.io for live event sync and global chat, threaded community forum, JWT auth with role-based access, and a normalized PostgreSQL schema behind fully type-safe TypeScript/Express APIs.",
    category: "Web & Full-stack",
    tech: ["React", "TypeScript", "Express.js", "PostgreSQL", "LiveKit", "Socket.io"],
    featured: true,
  },
  {
    repo: "perfmode",
    name: "perfmode",
    tagline: "Fan control for ASUS TUF laptops, in Rust.",
    description:
      "CLI performance and thermal control for ASUS TUF Gaming laptops via asus-nb-wmi/faustus sysfs: fan modes, thermal policies, keyboard backlight, battery charge limits. Packaged for NixOS via flake and published on crates.io.",
    category: "Rust & Systems",
    tech: ["Rust", "Linux", "sysfs", "Nix"],
    crate: "perfmode",
  },
  {
    repo: "aniscraper",
    name: "aniscraper",
    tagline: "The scraping engine behind the anime APIs.",
    description:
      "Rust library for anime web scraping and data extraction — Tokio + Reqwest with SOCKS/HTTP proxy support, retry logic, and webhook error notifications. Extracted from the Anime-API ecosystem and published as a crate; powers KawaiiKinetics.",
    category: "Rust & Systems",
    tech: ["Rust", "Tokio", "Reqwest"],
    crate: "aniscraper",
  },
  {
    repo: "ToDo-rust",
    name: "todo-rust",
    tagline: "A blazingly fast todo CLI (yes, blazingly).",
    description:
      "Terminal todo-list manager in Rust, published on crates.io. Small, fast, and exactly as over-engineered as a todo app should be.",
    category: "Rust & Systems",
    tech: ["Rust", "CLI"],
    crate: "todo-rust",
  },
  {
    repo: "gigasay",
    name: "gigasay",
    tagline: "cowsay, but Gigachad.",
    description: "A cowsay clone in Rust with considerably more jawline. 🗿",
    category: "Rust & Systems",
    tech: ["Rust", "CLI"],
  },
  {
    repo: "Post-It",
    name: "Post-It",
    tagline: "Community-driven forum.",
    description:
      "A community forum with threads and discussions, built with TypeScript and React.",
    category: "Web & Full-stack",
    tech: ["TypeScript", "React", "Express.js"],
  },
  {
    repo: "TaskSync",
    name: "TaskSync",
    tagline: "Full-stack task manager.",
    description:
      "CRUD task manager with JWT auth — Next.js + TypeScript frontend, Express + MongoDB backend, deployed on Vercel.",
    category: "Web & Full-stack",
    tech: ["Next.js", "TypeScript", "Express.js", "MongoDB"],
  },
  {
    repo: "hianime-data-fetcher",
    name: "hianime-data-fetcher",
    tagline: "Scrape → PostgreSQL data pipeline in Rust.",
    description:
      "Data pipeline that scrapes anime metadata at scale and persists it into a normalized PostgreSQL schema.",
    category: "Rust & Systems",
    tech: ["Rust", "PostgreSQL"],
  },
  {
    repo: "nix-dots",
    name: "nix-dots",
    tagline: "NixOS, declared.",
    description:
      "Declarative NixOS system and home configuration — the current daily driver.",
    category: "Tooling & Dotfiles",
    tech: ["Nix", "Shell"],
  },
  {
    repo: "nvim",
    name: "nvim",
    tagline: "The editor config, in Lua.",
    description: "Personal Neovim configuration, written in Lua.",
    category: "Tooling & Dotfiles",
    tech: ["Lua", "Neovim"],
  },
  {
    repo: "Arch-Dots",
    name: "Arch-Dots",
    tagline: "The Arch era, preserved (btw).",
    description:
      "Hyprland rice and dotfiles from the Arch Linux days — 13 stars of aesthetic.",
    category: "Tooling & Dotfiles",
    tech: ["Shell", "Hyprland", "Arch Linux"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const projectCategories: ProjectCategory[] = [
  "Flagship",
  "Rust & Systems",
  "Web & Full-stack",
  "Tooling & Dotfiles",
];
