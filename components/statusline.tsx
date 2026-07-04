"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Rss } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { site } from "@/lib/data/site";

/**
 * Vim-statusline footer: mode indicator, current "file" (route), and scroll
 * position as a line percentage — plus a conventional footer row above it.
 */
export function Statusline() {
  const pathname = usePathname();
  const [scrollPct, setScrollPct] = useState(0);
  const [mode, setMode] = useState<"NORMAL" | "INSERT">("NORMAL");

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrollPct(max <= 0 ? 100 : Math.round((window.scrollY / max) * 100));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const isEditable = (el: EventTarget | null) =>
      el instanceof HTMLElement &&
      (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
    const onFocusIn = (e: FocusEvent) => {
      if (isEditable(e.target)) setMode("INSERT");
    };
    const onFocusOut = () => setMode("NORMAL");
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const file =
    !pathname || pathname === "/" ? "~/index.tsx" : `~${pathname}.tsx`;
  const position = scrollPct <= 0 ? "Top" : scrollPct >= 100 ? "Bot" : `${scrollPct}%`;

  return (
    <footer className="mt-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono text-xs text-subtle">
          © {new Date().getFullYear()} {site.name} ·{" "}
          <a
            href={site.repoUrl}
            className="underline decoration-edge-strong underline-offset-2 transition-colors hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            source for nerds
          </a>
        </p>
        <div className="flex items-center gap-1">
          <FooterIcon href={site.links.github} label="GitHub">
            <GitHubIcon className="h-4 w-4" />
          </FooterIcon>
          <FooterIcon href={site.links.linkedin} label="LinkedIn">
            <LinkedInIcon className="h-4 w-4" />
          </FooterIcon>
          <FooterIcon href={`mailto:${site.email}`} label="Email">
            <Mail className="h-4 w-4" aria-hidden="true" />
          </FooterIcon>
          <FooterIcon href="/rss.xml" label="RSS feed">
            <Rss className="h-4 w-4" aria-hidden="true" />
          </FooterIcon>
        </div>
      </div>
      <div
        className="border-t border-edge bg-elevated font-mono text-[11px]"
        aria-hidden="true"
      >
        <div className="mx-auto flex w-full max-w-3xl items-stretch justify-between px-5 sm:px-6">
          <div className="flex items-stretch">
            <span
              className={`flex items-center px-2 py-1 font-semibold ${
                mode === "INSERT" ? "bg-accent/80 text-bg" : "bg-accent text-bg"
              }`}
            >
              {mode}
            </span>
            <span className="hidden items-center px-2 py-1 text-subtle sm:flex">
              main
            </span>
            {/* 404 routes prerender as /_not-found, so the path legitimately
                differs between server HTML and the client's real URL */}
            <span
              suppressHydrationWarning
              className="flex items-center truncate px-2 py-1 text-muted"
            >
              {file}
            </span>
          </div>
          <div className="flex items-stretch">
            <span className="hidden items-center px-2 py-1 text-subtle sm:flex">
              utf-8 · unix
            </span>
            <span className="flex items-center bg-accent-soft px-2 py-1 text-accent">
              {position}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        aria-label={label}
        className="rounded-md p-2 text-muted transition-colors hover:bg-accent-soft hover:text-accent"
      >
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      aria-label={label}
      className="rounded-md p-2 text-muted transition-colors hover:bg-accent-soft hover:text-accent"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
