import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { reactions } from "@/db/schema";

export const ALLOWED_EMOJI = ["❤️", "🚀", "🔥", "👏", "🦀"] as const;

export async function GET(req: Request) {
  const target = new URL(req.url).searchParams.get("target");
  if (!target) return NextResponse.json({ error: "target required" }, { status: 400 });
  const db = getDb();
  if (!db) return NextResponse.json({ enabled: false, counts: {}, mine: [] });

  const session = await auth();
  const counts = await db
    .select({ emoji: reactions.emoji, count: sql<number>`count(*)::int` })
    .from(reactions)
    .where(eq(reactions.target, target))
    .groupBy(reactions.emoji);

  let mine: string[] = [];
  if (session?.user) {
    const rows = await db
      .select({ emoji: reactions.emoji })
      .from(reactions)
      .where(and(eq(reactions.target, target), eq(reactions.authorId, session.user.id)));
    mine = rows.map((r) => r.emoji);
  }

  return NextResponse.json({
    enabled: true,
    counts: Object.fromEntries(counts.map((c) => [c.emoji, c.count])),
    mine,
  });
}

const toggleSchema = z.object({
  target: z.string().trim().min(1).max(191),
  emoji: z.enum(ALLOWED_EMOJI),
});

export async function POST(req: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Reactions are not configured" }, { status: 503 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to react" }, { status: 401 });
  }
  const parsed = toggleSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reaction" }, { status: 400 });
  }
  const { target, emoji } = parsed.data;
  const existing = await db
    .select({ id: reactions.id })
    .from(reactions)
    .where(
      and(
        eq(reactions.target, target),
        eq(reactions.emoji, emoji),
        eq(reactions.authorId, session.user.id),
      ),
    );

  if (existing.length > 0) {
    await db.delete(reactions).where(eq(reactions.id, existing[0].id));
    return NextResponse.json({ toggled: "off" });
  }
  await db.insert(reactions).values({ target, emoji, authorId: session.user.id });
  return NextResponse.json({ toggled: "on" }, { status: 201 });
}
