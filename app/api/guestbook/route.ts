import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { guestbookEntries } from "@/db/schema";

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ enabled: false, entries: [] });
  const entries = await db
    .select()
    .from(guestbookEntries)
    .orderBy(desc(guestbookEntries.createdAt))
    .limit(100);
  return NextResponse.json({ enabled: true, entries });
}

const createSchema = z.object({
  body: z.string().trim().min(1).max(500),
});

export async function POST(req: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Guestbook is not configured" }, { status: 503 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to sign the guestbook" }, { status: 401 });
  }
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Message must be 1-500 characters" }, { status: 400 });
  }
  const [entry] = await db
    .insert(guestbookEntries)
    .values({
      body: parsed.data.body,
      authorId: session.user.id,
      authorName: session.user.name ?? "Anonymous",
      authorImage: session.user.image ?? null,
    })
    .returning();
  return NextResponse.json({ entry }, { status: 201 });
}
