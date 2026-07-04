import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

/**
 * SSO via Auth.js v5 with JWT sessions — no database adapter required.
 * Providers register themselves only when their env vars are present, so
 * the site works with GitHub-only, Google-only, both, or neither.
 */
const providers = [
  ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
    ? [GitHub({ clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET })]
    : []),
  ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET })]
    : []),
];

export const authEnabled = providers.length > 0;

export const availableProviders = providers.map((p) => p.id);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  // Deployed behind a trusted proxy (Vercel); host header is reliable there.
  trustHost: true,
  // With no providers configured, sign-in is impossible and no tokens are
  // ever issued — the placeholder only stops /api/auth/session from throwing
  // on unconfigured deployments. Set AUTH_SECRET before enabling providers.
  secret:
    process.env.AUTH_SECRET ??
    (providers.length === 0 ? "unconfigured-placeholder-secret" : undefined),
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, account, profile }) {
      // Stable per-provider user id so reactions/comments dedupe correctly.
      if (account && profile) {
        token.uid = `${account.provider}:${account.providerAccountId}`;
      }
      return token;
    },
    session({ session, token }) {
      if (token.uid && session.user) {
        session.user.id = token.uid as string;
      }
      return session;
    },
  },
});
