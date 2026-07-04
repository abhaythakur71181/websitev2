import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MdxContent } from "@/components/mdx-content";
import { Reactions } from "@/components/reactions";
import { Comments } from "@/components/comments";
import { ViewCounter } from "@/components/view-counter";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getPost, getRelatedPosts } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/data/site";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      publishedTime: post.frontmatter.date.toISOString(),
      url: `${site.url}/blog/${post.slug}`,
      authors: [site.name],
      tags: post.frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date.toISOString(),
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    url: `${site.url}/blog/${post.slug}`,
    keywords: post.frontmatter.tags.join(", "),
  };

  return (
    <article className="flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>
        <Link
          href="/blog"
          className="group mb-6 flex w-fit items-center gap-1.5 font-mono text-xs text-subtle transition-colors hover:text-accent"
        >
          <ArrowLeft
            className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          cd ../blog
        </Link>
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg sm:text-3xl">
          {post.frontmatter.title}
        </h1>
        <p className="mt-3 font-mono text-xs text-subtle">
          <time dateTime={post.frontmatter.date.toISOString()}>
            {formatDate(post.frontmatter.date)}
          </time>{" "}
          · {post.readingMinutes} min read <ViewCounter slug={post.slug} />
        </p>
        {post.frontmatter.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.frontmatter.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="rounded-full border border-edge px-2.5 py-0.5 font-mono text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="prose">
        <MdxContent source={post.content} />
      </div>

      <div className="border-t border-edge pt-8">
        <Reactions target={`blog:${post.slug}`} />
      </div>

      <Comments slug={post.slug} />

      {related.length > 0 && (
        <section aria-label="Related posts" className="border-t border-edge pt-8">
          <h2 className="mb-4 font-mono text-sm font-semibold text-fg">
            <span className="mr-2 text-accent" aria-hidden="true">
              ❯
            </span>
            related reading
          </h2>
          <div className="flex flex-col gap-1">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
