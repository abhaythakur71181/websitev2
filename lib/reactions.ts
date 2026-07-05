/**
 * Reaction emoji sets. Posts and comments use different (overlapping) sets;
 * the API accepts the union so both surfaces share one endpoint and table.
 */
export const POST_EMOJI = ["❤️", "🚀", "🔥", "👏", "🦀"] as const;

export const COMMENT_EMOJI = ["👍", "❤️", "😂", "🚀"] as const;

export const ALL_EMOJI = [
  "❤️",
  "🚀",
  "🔥",
  "👏",
  "🦀",
  "👍",
  "😂",
] as const;

export type ReactionEmoji = (typeof ALL_EMOJI)[number];

/** Reaction target for a blog post. */
export const postTarget = (slug: string) => `blog:${slug}`;

/** Reaction target for a single comment. */
export const commentTarget = (commentId: number) => `comment:${commentId}`;
