"use client";

import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { GitHubIcon, GoogleIcon } from "@/components/icons";

export interface SessionUser {
  id?: string;
  name?: string | null;
  image?: string | null;
}

/** Lightweight session hook — reads Auth.js endpoints directly, no provider needed. */
export function useLightSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/session").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/auth/providers").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([session, provs]) => {
        setUser(session?.user ?? null);
        setProviders(provs && typeof provs === "object" ? Object.keys(provs) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { user, providers, loading };
}

export function SignInButtons({ providers, action }: { providers: string[]; action: string }) {
  if (providers.length === 0) {
    return (
      <p className="font-mono text-xs text-subtle">
        # sign-in is not configured on this deployment yet
      </p>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xs text-muted">sign in to {action}:</span>
      {providers.includes("github") && (
        <button
          type="button"
          onClick={() => signIn("github")}
          className="flex items-center gap-2 rounded-lg border border-edge px-3 py-1.5 font-mono text-xs text-fg transition-colors hover:border-accent/40 hover:bg-accent-soft"
        >
          <GitHubIcon className="h-4 w-4" /> GitHub
        </button>
      )}
      {providers.includes("google") && (
        <button
          type="button"
          onClick={() => signIn("google")}
          className="flex items-center gap-2 rounded-lg border border-edge px-3 py-1.5 font-mono text-xs text-fg transition-colors hover:border-accent/40 hover:bg-accent-soft"
        >
          <GoogleIcon className="h-4 w-4" /> Google
        </button>
      )}
    </div>
  );
}

export function SignedInAs({ user }: { user: SessionUser }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-subtle">
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.image}
          alt=""
          width={20}
          height={20}
          className="rounded-full border border-edge"
        />
      ) : null}
      <span>
        signed in as <span className="text-muted">{user.name ?? "anonymous"}</span>
      </span>
      <button
        type="button"
        onClick={() => signOut()}
        className="flex items-center gap-1 rounded px-1.5 py-0.5 text-subtle transition-colors hover:text-fg"
        aria-label="Sign out"
      >
        <LogOut className="h-3 w-3" aria-hidden="true" /> sign out
      </button>
    </div>
  );
}
