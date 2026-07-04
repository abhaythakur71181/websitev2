"use client";

import { useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

const EMOJI = ["❤️", "🚀", "🔥", "👏", "🦀"] as const;

/**
 * Emoji reactions bar for a target ("blog:slug"). Anyone can see counts;
 * reacting requires SSO. Hidden entirely when the DB isn't configured.
 */
export function Reactions({ target }: { target: string }) {
  const [enabled, setEnabled] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<string[]>([]);
  const [needsAuth, setNeedsAuth] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/reactions?target=${encodeURIComponent(target)}`)
      .then((r) => r.json())
      .then((data) => {
        setEnabled(Boolean(data.enabled));
        setCounts(data.counts ?? {});
        setMine(data.mine ?? []);
      })
      .catch(() => {});
  }, [target]);

  useEffect(load, [load]);

  const toggle = async (emoji: string) => {
    const active = mine.includes(emoji);
    // optimistic update
    setMine((m) => (active ? m.filter((e) => e !== emoji) : [...m, emoji]));
    setCounts((c) => ({ ...c, [emoji]: Math.max(0, (c[emoji] ?? 0) + (active ? -1 : 1)) }));
    const res = await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target, emoji }),
    });
    if (res.status === 401) {
      setNeedsAuth(true);
      load();
    } else if (!res.ok) {
      load();
    }
  };

  if (!enabled) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Reactions">
        {EMOJI.map((emoji) => {
          const active = mine.includes(emoji);
          const count = counts[emoji] ?? 0;
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => toggle(emoji)}
              aria-pressed={active}
              aria-label={`React with ${emoji}`}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-sm transition-all hover:-translate-y-0.5",
                active
                  ? "border-accent/50 bg-accent-soft text-fg"
                  : "border-edge text-muted hover:border-edge-strong",
              )}
            >
              <span aria-hidden="true">{emoji}</span>
              {count > 0 && <span className="text-xs">{count}</span>}
            </button>
          );
        })}
      </div>
      {needsAuth && (
        <p className="mt-2 font-mono text-xs text-subtle">
          #{" "}
          <button
            type="button"
            onClick={() => signIn()}
            className="underline decoration-accent underline-offset-2 hover:text-accent"
          >
            sign in
          </button>{" "}
          to react
        </p>
      )}
    </div>
  );
}
