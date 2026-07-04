import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { comments } from "@/db/schema";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const db = getDb();
  if (!db) return NextResponse.json({ enabled: false, comments: [] });
  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.slug, slug))
    .orderBy(asc(comments.createdAt))
    .limit(200);
  return NextResponse.json({ enabled: true, comments: rows });
}

const createSchema = z.object({
  slug: z.string().trim().min(1).max(191),
  body: z.string().trim().min(1).max(2000),
});

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
  const [comment] = await db
    .insert(comments)
    .values({
      slug: parsed.data.slug,
      body: parsed.data.body,
      authorId: session.user.id,
      authorName: session.user.name ?? "Anonymous",
      authorImage: session.user.image ?? null,
    })
    .returning();
  return NextResponse.json({ comment }, { status: 201 });
}
