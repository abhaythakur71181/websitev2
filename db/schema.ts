import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

/**
 * Signed guestbook entries. Identity comes from the OAuth session (JWT),
 * so we snapshot the display fields instead of joining a users table.
 */
export const guestbookEntries = pgTable(
  "guestbook_entries",
  {
    id: serial("id").primaryKey(),
    body: varchar("body", { length: 500 }).notNull(),
    authorId: varchar("author_id", { length: 191 }).notNull(),
    authorName: varchar("author_name", { length: 191 }).notNull(),
    authorImage: text("author_image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("guestbook_created_idx").on(t.createdAt)],
);

/**
 * Comments attached to a blog post (by slug). Replies reference their parent
 * comment via parent_id (NULL = top-level), enabling arbitrarily deep threads.
 */
export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 191 }).notNull(),
    parentId: integer("parent_id").references((): AnyPgColumn => comments.id, {
      onDelete: "cascade",
    }),
    body: varchar("body", { length: 2000 }).notNull(),
    authorId: varchar("author_id", { length: 191 }).notNull(),
    authorName: varchar("author_name", { length: 191 }).notNull(),
    authorImage: text("author_image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("comments_slug_idx").on(t.slug),
    index("comments_parent_idx").on(t.parentId),
  ],
);

/**
 * Emoji reactions on any reactable target ("blog:slug", "project:name").
 * One row per (target, emoji, author) — toggled on/off.
 */
export const reactions = pgTable(
  "reactions",
  {
    id: serial("id").primaryKey(),
    target: varchar("target", { length: 191 }).notNull(),
    emoji: varchar("emoji", { length: 16 }).notNull(),
    authorId: varchar("author_id", { length: 191 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("reactions_unique_idx").on(t.target, t.emoji, t.authorId),
    index("reactions_target_idx").on(t.target),
  ],
);

/** Anonymous page view counters (privacy-friendly, no visitor data stored). */
export const pageViews = pgTable("page_views", {
  slug: varchar("slug", { length: 191 }).primaryKey(),
  count: integer("count").default(0).notNull(),
});
