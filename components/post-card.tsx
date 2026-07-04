import Link from "next/link";
import type { Post } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group/post -mx-3 block rounded-lg px-3 py-3 transition-colors hover:bg-accent-soft"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-mono text-sm font-semibold text-fg transition-colors group-hover/post:text-accent">
          {post.frontmatter.title}
        </h3>
        <time
          dateTime={post.frontmatter.date.toISOString()}
          className="shrink-0 font-mono text-xs text-subtle"
        >
          {formatDate(post.frontmatter.date)}
        </time>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-muted">
        {post.frontmatter.description}
      </p>
      <p className="mt-1.5 font-mono text-[11px] text-subtle">
        {post.readingMinutes} min read
        {post.frontmatter.tags.length > 0 && (
          <> · {post.frontmatter.tags.map((t) => `#${t}`).join(" ")}</>
        )}
      </p>
    </Link>
  );
}
