import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getAllTags } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on backend engineering, Rust, security, and whatever else earns a post.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const tags = getAllTags();
  const posts = getAllPosts().filter(
    (p) => !tag || p.frontmatter.tags.includes(tag),
  );

  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <SectionHeading as="h1">ls blog/</SectionHeading>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          Notes on backend engineering, Rust, security walkthroughs, and things
          I learned the hard way.
        </p>
      </Reveal>

      {tags.length > 0 && (
        <Reveal>
          <div className="flex flex-wrap gap-2" role="navigation" aria-label="Filter by tag">
            <TagLink href="/blog" active={!tag}>
              all
            </TagLink>
            {tags.map(({ tag: t, count }) => (
              <TagLink key={t} href={`/blog?tag=${encodeURIComponent(t)}`} active={tag === t}>
                #{t} <span className="text-subtle">{count}</span>
              </TagLink>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal>
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
          {posts.length === 0 && (
            <p className="font-mono text-sm text-subtle">
              # nothing here{tag ? ` for #${tag}` : ""} yet
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}

function TagLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
        active
          ? "border-accent/50 bg-accent-soft text-fg"
          : "border-edge text-muted hover:border-edge-strong hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}
