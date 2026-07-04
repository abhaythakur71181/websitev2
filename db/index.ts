import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Database access is optional: every social feature (guestbook, comments,
 * reactions, view counts) degrades gracefully when DATABASE_URL is unset,
 * so the site builds and runs as a fully static portfolio out of the box.
 */
let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> | null {
  if (!process.env.DATABASE_URL) return null;
  if (!_db) {
    _db = drizzle(neon(process.env.DATABASE_URL), { schema });
  }
  return _db;
}

export const dbEnabled = () => Boolean(process.env.DATABASE_URL);
