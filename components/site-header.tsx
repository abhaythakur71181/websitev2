"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/about", label: "about" },
  { href: "/projects", label: "projects" },
  { href: "/blog", label: "blog" },
  { href: "/uses", label: "uses" },
  { href: "/guestbook", label: "guestbook" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-2 px-5 sm:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-1 font-mono text-sm font-semibold text-fg"
          aria-label="Home"
        >
          <span className="text-accent">~</span>
          <span className="hidden min-[440px]:inline">/abhay</span>
          <span aria-hidden="true" className="cursor-blink text-accent">
            _
          </span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-1.5 py-1.5 font-mono text-[13px] transition-colors sm:px-2.5",
                  active
                    ? "text-accent"
                    : "text-muted hover:bg-accent-soft hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              )
            }
            className="ml-1 hidden items-center gap-1 rounded-md border border-edge px-2 py-1 font-mono text-[11px] text-subtle transition-colors hover:border-edge-strong hover:text-muted sm:flex"
            aria-label="Open command palette"
          >
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
