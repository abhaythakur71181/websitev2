"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CornerDownRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { COMMENT_EMOJI, commentTarget } from "@/lib/reactions";
import {
  SignInButtons,
  SignedInAs,
  useLightSession,
  type SessionUser,
} from "@/components/auth-buttons";

interface Comment {
  id: number;
  parentId: number | null;
  body: string;
  authorName: string;
  authorImage: string | null;
  createdAt: string;
}

type Counts = Record<number, Record<string, number>>;
type Mine = Record<number, string[]>;

export function Comments({ slug }: { slug: string }) {
  const { user, providers, loading } = useLightSession();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactionCounts, setReactionCounts] = useState<Counts>({});
  const [myReactions, setMyReactions] = useState<Mine>({});
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [authHintFor, setAuthHintFor] = useState<number | null>(null);

  const load = useCallback(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        setEnabled(Boolean(data.enabled));
        setComments(data.comments ?? []);
        setReactionCounts(data.reactionCounts ?? {});
        setMyReactions(data.myReactions ?? {});
      })
      .catch(() => setEnabled(false));
  }, [slug]);

  useEffect(load, [load]);

  /** id → direct children, preserving chronological order. */
  const childrenOf = useMemo(() => {
    const map = new Map<number | null, Comment[]>();
    for (const c of comments) {
      const key = c.parentId ?? null;
      const list = map.get(key);
      if (list) list.push(c);
      else map.set(key, [c]);
    }
    return map;
  }, [comments]);

  if (enabled === null || enabled === false) return null;

  const toggleReaction = async (commentId: number, emoji: string) => {
    const active = (myReactions[commentId] ?? []).includes(emoji);
    // optimistic update, reconciled by reload on failure
    setMyReactions((m) => ({
      ...m,
      [commentId]: active
        ? (m[commentId] ?? []).filter((e) => e !== emoji)
        : [...(m[commentId] ?? []), emoji],
    }));
    setReactionCounts((c) => ({
      ...c,
      [commentId]: {
        ...c[commentId],
        [emoji]: Math.max(0, (c[commentId]?.[emoji] ?? 0) + (active ? -1 : 1)),
      },
    }));
    const res = await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: commentTarget(commentId), emoji }),
    });
    if (res.status === 401) {
      setAuthHintFor(commentId);
      load();
    } else if (!res.ok) {
      load();
    }
  };

  const roots = childrenOf.get(null) ?? [];

  return (
    <section aria-label="Comments" className="border-t border-edge pt-8">
      <h2 className="mb-6 font-mono text-base font-semibold text-fg">
        <span className="mr-2 text-accent" aria-hidden="true">
          ❯
        </span>
        comments{comments.length > 0 && ` (${comments.length})`}
      </h2>

      <div className="flex flex-col gap-6">
        {roots.map((comment) => (
          <CommentNode
            key={comment.id}
            comment={comment}
            childrenOf={childrenOf}
            depth={0}
            user={user}
            providers={providers}
            counts={reactionCounts}
            mine={myReactions}
            replyTo={replyTo}
            authHintFor={authHintFor}
            onToggleReaction={toggleReaction}
            onReplyToggle={(id) =>
              setReplyTo((current) => (current === id ? null : id))
            }
            onReplied={() => {
              setReplyTo(null);
              load();
            }}
            slug={slug}
          />
        ))}
        {comments.length === 0 && (
          <p className="font-mono text-xs text-subtle">
            # no comments yet — be the first
          </p>
        )}
      </div>

      <div className="mt-8">
        {loading ? null : user ? (
          <CommentForm slug={slug} user={user} onPosted={load} />
        ) : (
          <SignInButtons providers={providers} action="comment" />
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function CommentNode({
  comment,
  childrenOf,
  depth,
  user,
  providers,
  counts,
  mine,
  replyTo,
  authHintFor,
  onToggleReaction,
  onReplyToggle,
  onReplied,
  slug,
}: {
  comment: Comment;
  childrenOf: Map<number | null, Comment[]>;
  depth: number;
  user: SessionUser | null;
  providers: string[];
  counts: Counts;
  mine: Mine;
  replyTo: number | null;
  authHintFor: number | null;
  onToggleReaction: (id: number, emoji: string) => void;
  onReplyToggle: (id: number) => void;
  onReplied: () => void;
  slug: string;
}) {
  const replies = childrenOf.get(comment.id) ?? [];
  const isReplying = replyTo === comment.id;

  return (
    <article className="flex gap-3">
      <Avatar name={comment.authorName} image={comment.authorImage} />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs text-subtle">
          <span className="font-semibold text-muted">{comment.authorName}</span>{" "}
          · {formatDate(comment.createdAt)}
        </p>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted">
          {comment.body}
        </p>

        {/* reactions + reply actions */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {COMMENT_EMOJI.map((emoji) => {
            const active = (mine[comment.id] ?? []).includes(emoji);
            const count = counts[comment.id]?.[emoji] ?? 0;
            return (
              <button
                key={emoji}
                type="button"
                onClick={() => onToggleReaction(comment.id, emoji)}
                aria-pressed={active}
                aria-label={`React to ${comment.authorName}'s comment with ${emoji}`}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-xs transition-colors",
                  active
                    ? "border-accent/50 bg-accent-soft text-fg"
                    : "border-edge text-subtle hover:border-edge-strong hover:text-muted",
                )}
              >
                <span aria-hidden="true">{emoji}</span>
                {count > 0 && <span>{count}</span>}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => onReplyToggle(comment.id)}
            aria-expanded={isReplying}
            className={cn(
              "ml-1 flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs transition-colors",
              isReplying ? "text-accent" : "text-subtle hover:text-accent",
            )}
          >
            <CornerDownRight className="h-3 w-3" aria-hidden="true" />
            {isReplying ? "cancel" : "reply"}
          </button>
        </div>

        {authHintFor === comment.id && (
          <div className="mt-2">
            <SignInButtons providers={providers} action="react" />
          </div>
        )}

        {isReplying && (
          <div className="mt-3">
            {user ? (
              <CommentForm
                slug={slug}
                user={user}
                parentId={comment.id}
                replyingTo={comment.authorName}
                onPosted={onReplied}
              />
            ) : (
              <SignInButtons providers={providers} action="reply" />
            )}
          </div>
        )}

        {replies.length > 0 && (
          <div
            className={cn(
              "mt-4 flex flex-col gap-4",
              // indent the first few levels; deeper threads stay flat so
              // narrow screens don't run out of horizontal room
              depth < 3 && "border-l border-edge pl-3 sm:pl-4",
            )}
          >
            {replies.map((reply) => (
              <CommentNode
                key={reply.id}
                comment={reply}
                childrenOf={childrenOf}
                depth={depth + 1}
                user={user}
                providers={providers}
                counts={counts}
                mine={mine}
                replyTo={replyTo}
                authHintFor={authHintFor}
                onToggleReaction={onToggleReaction}
                onReplyToggle={onReplyToggle}
                onReplied={onReplied}
                slug={slug}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

function CommentForm({
  slug,
  user,
  parentId,
  replyingTo,
  onPosted,
}: {
  slug: string;
  user: SessionUser;
  parentId?: number;
  replyingTo?: string;
  onPosted: () => void;
}) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fieldId = parentId ? `reply-${parentId}` : "comment-body";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || busy) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        body: body.trim(),
        ...(parentId ? { parentId } : {}),
      }),
    });
    setBusy(false);
    if (res.ok) {
      setBody("");
      onPosted();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label htmlFor={fieldId} className="sr-only">
        {replyingTo ? `Reply to ${replyingTo}` : "Write a comment"}
      </label>
      <textarea
        id={fieldId}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={parentId ? 2 : 3}
        maxLength={2000}
        autoFocus={Boolean(parentId)}
        placeholder={
          replyingTo ? `Reply to ${replyingTo}…` : "Thoughts, corrections, hot takes…"
        }
        className="w-full resize-y rounded-lg border border-edge bg-elevated p-3 text-sm text-fg outline-none transition-colors placeholder:text-subtle focus:border-accent/50"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SignedInAs user={user} />
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="rounded-lg bg-accent px-4 py-1.5 font-mono text-xs font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {busy ? "posting…" : parentId ? "post reply" : "post comment"}
        </button>
      </div>
      {error && (
        <p role="alert" className="font-mono text-xs text-red-400">
          error: {error}
        </p>
      )}
    </form>
  );
}

function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full border border-edge"
      />
    );
  }
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-edge bg-elevated font-mono text-xs text-muted"
      aria-hidden="true"
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
