"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  SignInButtons,
  SignedInAs,
  useLightSession,
} from "@/components/auth-buttons";

interface Comment {
  id: number;
  body: string;
  authorName: string;
  authorImage: string | null;
  createdAt: string;
}

export function Comments({ slug }: { slug: string }) {
  const { user, providers, loading } = useLightSession();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        setEnabled(Boolean(data.enabled));
        setComments(data.comments ?? []);
      })
      .catch(() => setEnabled(false));
  }, [slug]);

  useEffect(load, [load]);

  if (enabled === null || enabled === false) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || busy) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, body: body.trim() }),
    });
    setBusy(false);
    if (res.ok) {
      setBody("");
      load();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong");
    }
  };

  return (
    <section aria-label="Comments" className="border-t border-edge pt-8">
      <h2 className="mb-6 font-mono text-base font-semibold text-fg">
        <span className="mr-2 text-accent" aria-hidden="true">
          ❯
        </span>
        comments{comments.length > 0 && ` (${comments.length})`}
      </h2>

      <div className="flex flex-col gap-5">
        {comments.map((c) => (
          <article key={c.id} className="flex gap-3">
            {c.authorImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.authorImage}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-full border border-edge"
              />
            ) : (
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-edge bg-elevated font-mono text-xs text-muted"
                aria-hidden="true"
              >
                {c.authorName.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="font-mono text-xs text-subtle">
                <span className="font-semibold text-muted">{c.authorName}</span>{" "}
                · {formatDate(c.createdAt)}
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted">
                {c.body}
              </p>
            </div>
          </article>
        ))}
        {comments.length === 0 && (
          <p className="font-mono text-xs text-subtle">
            # no comments yet — be the first
          </p>
        )}
      </div>

      <div className="mt-8">
        {loading ? null : user ? (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <label htmlFor="comment-body" className="sr-only">
              Write a comment
            </label>
            <textarea
              id="comment-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Thoughts, corrections, hot takes…"
              className="w-full resize-y rounded-lg border border-edge bg-elevated p-3 text-sm text-fg outline-none transition-colors placeholder:text-subtle focus:border-accent/50"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SignedInAs user={user} />
              <button
                type="submit"
                disabled={busy || !body.trim()}
                className="rounded-lg bg-accent px-4 py-1.5 font-mono text-xs font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {busy ? "posting…" : "post comment"}
              </button>
            </div>
            {error && (
              <p role="alert" className="font-mono text-xs text-red-400">
                error: {error}
              </p>
            )}
          </form>
        ) : (
          <SignInButtons providers={providers} action="comment" />
        )}
      </div>
    </section>
  );
}
