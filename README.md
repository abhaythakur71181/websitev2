# website-v2

Personal website of **Abhay Thakur** ([@abhaythakur71181](https://github.com/abhaythakur71181)) —
Senior Software Developer at Salescode.ai, Rust open-sourcerer, NixOS user.

A dark-first, terminal-flavored portfolio: interactive shell on the homepage,
⌘K command palette, vim keybindings, a statusline for a footer, SSO-powered
guestbook + threaded comments (nested replies, per-comment emoji reactions),
live GitHub + crates.io stats, an MDX blog, and an AI assistant grounded in
the site's own data.

Full product/design/engineering rationale lives in [`docs/PLAN.md`](docs/PLAN.md).

## Stack

Next.js 16 (App Router, RSC, ISR) · React 19 · TypeScript · Tailwind CSS 4 ·
motion · next-mdx-remote + shiki · Auth.js v5 (GitHub + Google SSO) ·
Drizzle ORM + Neon Postgres · Vercel AI SDK · cmdk · lucide-react

## Local development

```bash
npm install
cp .env.example .env.local   # everything in it is optional
npm run dev
```

The site is fully functional with **zero** environment variables — social
features (guestbook, comments, reactions, views), the AI assistant, and
analytics each enable themselves only when their env vars exist. See
[`.env.example`](.env.example) for the full menu.

### Enabling the social layer (SSO + database)

1. Create a free [Neon](https://neon.tech) Postgres database, set `DATABASE_URL`.
2. Push the schema: `npx drizzle-kit push`
3. Set `AUTH_SECRET` (`npx auth secret`) and create OAuth apps:
   - GitHub: callback `https://<your-domain>/api/auth/callback/github`
   - Google: callback `https://<your-domain>/api/auth/callback/google`

### Content

Blog posts are MDX files in `content/blog/` with zod-validated frontmatter:

```yaml
---
title: "Post title"
description: "One-sentence hook."
date: "2026-07-03"
tags: ["rust", "backend"]
draft: false # optional
---
```

Projects, experience, skills, timeline, and uses data live in `lib/data/` —
edit those files to update the About/Projects/Resume pages.

## Deployment

Built for Vercel: push, import, set env vars, done. GitHub/crates.io stats
revalidate hourly; blog pages are fully static; OG images are generated at
the edge per page.

## Keyboard

- `⌘K` / `Ctrl+K` — command palette
- `j` / `k` — scroll, `gg` / `G` — top/bottom
- ↑↑↓↓←→←→BA — you know what to do
