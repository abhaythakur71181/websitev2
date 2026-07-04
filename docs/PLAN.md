# website-v2 — Product & Engineering Plan

The definitive plan behind this rebuild. Every decision below is grounded in
research over Abhay's resume, GitHub (all 55 public repos), crates.io, LeetCode,
LinkedIn (public data), the previous website's full source, and ten
world-class developer portfolios.

---

## 1. Research summary

**Professional identity.** Abhay Thakur — Senior Software Developer at
Salescode.ai (Gurugram). Owns end-to-end architecture of the Order Management
System inside a Distributor Management System: Java, Spring Boot, Spring Data
JPA, Apache Kafka, Redis, MySQL, with React/TypeScript frontends. Promoted
twice in two years (Trainee → SWE in 6 months → Senior in 15 more); Lead
Performer five consecutive quarters. Chitkara University B.E. CS, CGPA 8.97.

**Open-source identity.** Formerly `falcon71181`, now `abhaythakur71181`.
- **Anime-API** — flagship: 161★ / 107 forks, TypeScript anime-metadata REST
  API via web scraping, community contributors, now archived.
- **crabby_proxy** — his most sophisticated engineering: multi-protocol
  (HTTP/HTTPS/SOCKS4/4a/5) forward proxy in Rust: Tokio, Axum, SQLx, 3-tier
  caching, Argon2+JWT, geo-blocking, Prometheus metrics, **398 tests**.
- **Five published crates, ~11.7k downloads**: aniscraper (3.7k), rust-paper
  (2.9k), todo-rust (2.6k), byteutils (1.8k), perfmode (0.8k).
- Ecosystem pattern: aniscraper (lib) → KawaiiKinetics (Rust/Axum API) →
  Anime-API (TS) — same domain, three languages.
- Daily driver: NixOS (ex-Arch), Neovim (own Lua config), Tmux. FOSS believer.

**Career arc (evidence from repo timestamps).** 2021–23: Python scripting and
security curiosity → 2023–24: TypeScript web era culminating in Anime-API →
2024–26: Rust systems era + enterprise Java at Salescode.ai. The story is
"script kid → web dev → systems engineer who ships".

**Voice.** Casual, meme-literate, self-aware ("I make stuffs", location
`127.0.0.1`), but professionally serious where it counts (docs, tests).
The site keeps the humor dry and textual — never at the cost of clarity.

**LeetCode**: 284 solved. **No** Medium/Dev.to/npm/Codeforces presence —
so the blog here is the single home for writing (no empty-state sections).

## 2. Competitor research → decisions

Studied brittanychiang.com, leerob.com, antfu.me, joshwcomeau.com,
kentcdodds.com, rauchg.com, t3.gg, onur.dev, delba.dev, craftz.dog.

Adopted: one-sentence identity hero; opacity-based hierarchy on near-black;
categorized project index with one-liners + live stats; whole-card hover with
sibling dimming; year-grouped journey timeline; inline-linked prose bio;
editorial hooks on posts; colophon footer; keyboard-first navigation +
command palette; one signature flourish; curated selected work vs full
archive; live data touches (GitHub heatmap, crate downloads); consistent
scroll-reveal motion.

Rejected (anti-patterns): Brittany-clone layout, heavy WebGL hero, whimsy
transplant (sounds/confetti), link-tree hollowness, empty-state sections,
over-engineered content platform, terminal cosplay that gates content,
client-side rendering of core content.

**Signature flourish: an interactive terminal in the hero** — genuine overlap
between Abhay's identity (NixOS/Neovim/CLI crates) and real UX. It seasons
the UI; it never gates it. Second signature: a **Vim statusline** as the
site-wide footer (mode, current "file" = route, scroll % as line position).

## 3. Product strategy

- **Mission**: convert visitors (recruiters, hiring managers, fellow
  engineers) into contact/follow within 60 seconds of proof-of-work.
- **Personas**: (1) recruiter — needs role, company, stack, resume in 10s;
  (2) hiring manager/senior engineer — needs evidence of depth: OMS
  ownership, crabby_proxy, tests, crates; (3) fellow OSS dev — needs
  projects, blog, dotfiles, guestbook.
- **Conversion goals**: resume download, email/LinkedIn click, GitHub follow,
  guestbook entry.
- **Brand voice**: terminal-literate, dry humor, evidence-first. Feeling:
  "a craftsman's workshop, lights off, one green cursor blinking."
- **Emotional arc**: land → recognize craft (terminal, motion restraint) →
  scan proof (projects, heatmap, timeline) → trust (writing, guestbook) → act.

## 4. Design system

- **Color**: dark-first. Base `#0a0a0b`; text at 92/64/40% white opacity
  tiers; single accent **terminal green** `#34d399` family (WCAG AA on base);
  syntax-meaningful secondary hues only inside code/terminal. Light mode:
  warm paper `#faf9f7` with `#1a1a1a` ink, same accent darkened for contrast.
- **Type**: Inter (variable) for prose; JetBrains Mono for headings-accents,
  labels, code, statusline. Mono is seasoning, never body text.
- **Spacing/layout**: single centered column `max-w-3xl`, 8-pt rhythm,
  generous whitespace; content readable at 65–75ch.
- **Motion**: one system — fade + 8px rise, 0.35s ease-out, staggered
  children; `prefers-reduced-motion` disables all non-essential motion.
- **States**: visible focus rings (accent, 2px offset); hover = sibling
  dimming + border glow; loading = skeleton pulse; error/success = inline
  mono-labeled text.

## 5. Information architecture

```
/            Hero + interactive terminal + selected projects + latest posts
             + GitHub heatmap + now-strip
/about       Prose bio (inline links) + journey timeline + skills matrix + experience
/projects    Categorized index (Flagship / Rust & Systems / Web & Full-stack /
             Tooling & Dotfiles) with live GitHub + crates.io stats + full archive
/blog        MDX index: tags, search-filter, reading time, views
/blog/[slug] Post: TOC, syntax highlighting, comments (SSO), reactions, related
/uses        NixOS / Neovim / Tmux / hardware / services
/guestbook   SSO (GitHub/Google) signed entries
/now         Current focus; changelog-style
/resume      Structured resume + PDF download
* 404        Terminal-styled "command not found"
API: /api/auth, /api/guestbook, /api/comments, /api/reactions, /api/views,
     /api/chat (AI, env-gated), /rss.xml, /sitemap.xml, /robots.txt, OG images
```

## 6. Feature list (shipped)

Content: MDX blog, shiki syntax highlighting, tags, client search-filter,
reading time, related posts, RSS, dynamic OG images, view counts.
Projects: categorized index, live GitHub stars/forks (ISR), crates.io
download badges, tech pills, archive table of every original repo.
Social/SSO: Auth.js v5 (GitHub + Google), guestbook, per-post comments,
emoji reactions (❤️ 🚀 🔥 👏 🦀), all gracefully disabled without env.
Interactive: hero terminal (help/whoami/ls/cat/neofetch/sudo hire-me/…),
⌘K command palette, keyboard shortcuts, vim statusline footer with scroll
position, GitHub contribution heatmap, Konami code easter egg.
AI: /api/chat — "ask my portfolio" assistant grounded in a compiled profile
context (Vercel AI SDK; Anthropic or OpenAI key, env-gated; hidden without).
SEO: metadataBase, canonical, per-page metadata, JSON-LD (Person,
BlogPosting), sitemap, robots, OG/Twitter cards, RSS.
A11y: skip link, semantic landmarks, single h1/page, focus-visible,
reduced-motion, alt text, AA contrast.
Analytics: GoatCounter (privacy-friendly, FOSS-aligned), env-gated.

## 7. Tech stack (justified)

- **Next.js 16 / React 19 / TypeScript** — RSC/streaming/ISR; zero-JS static
  content by default; the industry-standard portfolio stack he already knows.
- **Tailwind CSS 4** — design tokens as CSS vars, no runtime.
- **motion (Framer Motion)** — one shared reveal system; tree-shaken.
- **Radix primitives + cmdk** — accessible dialog/dropdown/tooltip/palette
  without a component-kit look.
- **next-mdx-remote + shiki (rehype-pretty-code) + gray-matter + zod** —
  filesystem MDX with validated frontmatter; no CMS to maintain.
- **Auth.js v5 (JWT sessions)** — SSO without a user table; providers
  register only when env vars exist.
- **Drizzle + Neon serverless Postgres** — typed SQL for guestbook/comments/
  reactions/views; free tier; the entire DB layer is optional at runtime.
- **Vercel AI SDK** — provider-agnostic chat endpoint, env-gated.
- **Resend** — contact endpoint, env-gated. No other runtime deps.

Explicitly avoided: Three.js (anti-pattern for this brand), CMS, tRPC,
Redis (nothing here needs it), analytics SDKs (GoatCounter is a script tag).

## 8. Database schema

`guestbook_entries(id, body, author_id, author_name, author_image, created_at)`
`comments(id, slug, body, author_id, author_name, author_image, created_at)`
`reactions(id, target, emoji, author_id, created_at, unique(target,emoji,author))`
`page_views(slug pk, count)`
Identity snapshot pattern (no FK user table) because sessions are JWT.

## 9. Performance & quality targets

Lighthouse 100/100/100/100 on static pages. Server components everywhere;
client islands only: terminal, palette, theme toggle, statusline scroll,
reactions/comments/guestbook forms, chat. `next/font` (self-hosted, no CLS),
`next/image` everywhere, ISR (1h) for GitHub data, static generation for all
content pages, streaming for DB-backed sections.

## 10. Security considerations

All write APIs: session-gated, zod-validated, length-capped, plain-text
stored, output rendered as text (no dangerouslySetInnerHTML on user input).
No secrets in repo — `.env.example` documents everything. OAuth callback
URLs documented in README. Old site's README exposed a GitHub token —
flagged to owner; token should be revoked.

## 11. Future roadmap

- Case-study MDX pages for crabby_proxy and the OMS (writing task)
- Newsletter (Resend audiences) once post cadence exists
- `/bookmarks` via Raindrop sync if the habit exists
- Semantic search over posts once >20 posts
- Playwright a11y/visual CI; Lighthouse CI budget enforcement
