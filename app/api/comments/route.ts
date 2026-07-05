import { NextResponse } from "next/server";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { comments, reactions } from "@/db/schema";
import { commentTarget } from "@/lib/reactions";

/**
 * GET /api/comments?slug=<post>
 * Returns the post's full comment thread (flat, with parentId links) plus
 * per-comment reaction counts and the viewer's own reactions — one request
 * powers the whole comment section.
 */
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const db = getDb();
  if (!db) {
    return NextResponse.json({
      enabled: false,
      comments: [],
      reactionCounts: {},
      myReactions: {},
    });
  }

  const rows = await db
    .select({
      id: comments.id,
      parentId: comments.parentId,
      body: comments.body,
      authorName: comments.authorName,
      authorImage: comments.authorImage,
      createdAt: comments.createdAt,
    })
    .from(comments)
    .where(eq(comments.slug, slug))
    .orderBy(asc(comments.createdAt))
    .limit(500);

  const reactionCounts: Record<number, Record<string, number>> = {};
  const myReactions: Record<number, string[]> = {};

  if (rows.length > 0) {
    const targets = rows.map((r) => commentTarget(r.id));
    const targetToId = new Map(rows.map((r) => [commentTarget(r.id), r.id]));

    const counts = await db
      .select({
        target: reactions.target,
        emoji: reactions.emoji,
        count: sql<number>`count(*)::int`,
      })
      .from(reactions)
      .where(inArray(reactions.target, targets))
      .groupBy(reactions.target, reactions.emoji);

    for (const row of counts) {
      const id = targetToId.get(row.target);
      if (id === undefined) continue;
      (reactionCounts[id] ??= {})[row.emoji] = row.count;
    }

    const session = await auth();
    if (session?.user) {
      const mine = await db
        .select({ target: reactions.target, emoji: reactions.emoji })
        .from(reactions)
        .where(
          and(
            inArray(reactions.target, targets),
            eq(reactions.authorId, session.user.id),
          ),
        );
      for (const row of mine) {
        const id = targetToId.get(row.target);
        if (id === undefined) continue;
        (myReactions[id] ??= []).push(row.emoji);
      }
    }
  }

  return NextResponse.json({
    enabled: true,
    comments: rows,
    reactionCounts,
    myReactions,
  });
}

const createSchema = z.object({
  slug: z.string().trim().min(1).max(191),
  body: z.string().trim().min(1).max(2000),
  parentId: z.number().int().positive().optional(),
});

/** POST — create a comment, or a reply when parentId is given. */
export async function POST(req: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Comments are not configured" }, { status: 503 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to comment" }, { status: 401 });
  }
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Comment must be 1-2000 characters" }, { status: 400 });
  }
  const { slug, body, parentId } = parsed.data;

  if (parentId !== undefined) {
    // The parent must exist and belong to the same post.
    const [parent] = await db
      .select({ id: comments.id })
      .from(comments)
      .where(and(eq(comments.id, parentId), eq(comments.slug, slug)));
    if (!parent) {
      return NextResponse.json(
        { error: "The comment you're replying to no longer exists" },
        { status: 400 },
      );
    }
  }

  const [comment] = await db
    .insert(comments)
    .values({
      slug,
      body,
      parentId: parentId ?? null,
      authorId: session.user.id,
      authorName: session.user.name ?? "Anonymous",
      authorImage: session.user.image ?? null,
    })
    .returning();
  return NextResponse.json({ comment }, { status: 201 });
}
