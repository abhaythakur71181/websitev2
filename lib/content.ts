import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { readingTime } from "@/lib/utils";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  cover: z.string().optional(),
});

export type PostFrontmatter = z.infer<typeof frontmatterSchema>;

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingMinutes: number;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => loadPost(file))
    .filter((p): p is Post => p !== null && !p.frontmatter.draft)
    .sort(
      (a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime(),
    );
}

export function getPost(slug: string): Post | null {
  const safe = slug.replace(/[^a-zA-Z0-9-_]/g, "");
  const post = loadPost(`${safe}.mdx`);
  return post && !post.frontmatter.draft ? post : null;
}

function loadPost(file: string): Post | null {
  const fullPath = path.join(BLOG_DIR, file);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    console.warn(`Invalid frontmatter in ${file}:`, parsed.error.message);
    return null;
  }
  return {
    slug: file.replace(/\.mdx$/, ""),
    frontmatter: parsed.data,
    content,
    readingMinutes: readingTime(content),
  };
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.frontmatter.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** Related posts by shared-tag overlap, excluding the post itself. */
export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const current = getPost(slug);
  if (!current) return [];
  const currentTags = new Set(current.frontmatter.tags);
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      overlap: p.frontmatter.tags.filter((t) => currentTags.has(t)).length,
    }))
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        b.post.frontmatter.date.getTime() - a.post.frontmatter.date.getTime(),
    )
    .slice(0, limit)
    .map((r) => r.post);
}
