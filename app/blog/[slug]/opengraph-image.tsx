import { ImageResponse } from "next/og";
import { getAllPosts, getPost } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.frontmatter.title ?? "Blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0a0a0b",
          color: "#ececee",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#34d399" }}>
          abhay@nixos:~$ cat blog/{slug}.md
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 40 ? 52 : 64,
            fontWeight: 700,
            marginTop: 28,
            letterSpacing: -1,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 24,
            color: "#9c9ca4",
            marginTop: 28,
          }}
        >
          <span>{site.name}</span>
          {post ? <span>· {formatDate(post.frontmatter.date)}</span> : null}
          {post ? <span>· {post.readingMinutes} min read</span> : null}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            display: "flex",
            fontSize: 22,
            color: "#34d399",
          }}
        >
          {site.url.replace("https://", "")}/blog
        </div>
      </div>
    ),
    size,
  );
}
