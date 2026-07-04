import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // OAuth avatars in guestbook/comments render via plain <img>; these
    // patterns cover any future next/image use of the same hosts.
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
