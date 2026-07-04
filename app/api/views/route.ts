import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { pageViews } from "@/db/schema";

const schema = z.object({
  slug: z.string().trim().min(1).max(191),
  increment: z.boolean().default(true),
});

/** Privacy-friendly view counter: anonymous totals only, no visitor data. */
export async function POST(req: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ enabled: false, count: null });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }
  const { slug, increment } = parsed.data;

  if (!increment) {
    const [row] = await db
      .select({ count: pageViews.count })
      .from(pageViews)
      .where(eq(pageViews.slug, slug));
    return NextResponse.json({ enabled: true, count: row?.count ?? 0 });
  }

  const [row] = await db
    .insert(pageViews)
    .values({ slug, count: 1 })
    .onConflictDoUpdate({
      target: pageViews.slug,
      set: { count: sql`${pageViews.count} + 1` },
    })
    .returning({ count: pageViews.count });
  return NextResponse.json({ enabled: true, count: row.count });
}
