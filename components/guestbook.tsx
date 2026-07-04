"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  SignInButtons,
  SignedInAs,
  useLightSession,
} from "@/components/auth-buttons";

interface Entry {
  id: number;
  body: string;
  authorName: string;
  authorImage: string | null;
  createdAt: string;
}

export function Guestbook() {
  const { user, providers, loading } = useLightSession();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((data) => {
        setEnabled(Boolean(data.enabled));
        setEntries(data.entries ?? []);
      })
      .catch(() => setEnabled(false));
  }, []);

  useEffect(load, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || busy) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim() }),
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

  if (enabled === false) {
    return (
      <p className="font-mono text-xs text-subtle">
        # the guestbook database isn&apos;t wired up on this deployment yet —
        check back soon
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        {loading || enabled === null ? null : user ? (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <label htmlFor="guestbook-body" className="sr-only">
              Sign the guestbook
            </label>
            <input
              id="guestbook-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={500}
              placeholder="Leave your mark…"
              className="w-full rounded-lg border border-edge bg-elevated px-3 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-subtle focus:border-accent/50"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SignedInAs user={user} />
              <button
                type="submit"
                disabled={busy || !body.trim()}
                className="rounded-lg bg-accent px-4 py-1.5 font-mono text-xs font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {busy ? "signing…" : "sign guestbook"}
              </button>
            </div>
            {error && (
              <p role="alert" className="font-mono text-xs text-red-400">
                error: {error}
              </p>
            )}
          </form>
        ) : (
          <SignInButtons providers={providers} action="sign the guestbook" />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <article key={entry.id} className="flex gap-3">
            {entry.authorImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={entry.authorImage}
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
                {entry.authorName.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="font-mono text-xs text-subtle">
                <span className="font-semibold text-muted">{entry.authorName}</span>{" "}
                · {formatDate(entry.createdAt)}
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted">
                {entry.body}
              </p>
            </div>
          </article>
        ))}
        {enabled && entries.length === 0 && (
          <p className="font-mono text-xs text-subtle"># empty. you could be first.</p>
        )}
      </div>
    </div>
  );
}
