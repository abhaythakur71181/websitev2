import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Terminal-prompt section heading: `❯ heading` with an optional "see all" link. */
export function SectionHeading({
  children,
  href,
  hrefLabel,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  href?: string;
  hrefLabel?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <Tag className="font-mono text-lg font-semibold tracking-tight text-fg">
        <span className="mr-2 text-accent" aria-hidden="true">
          ❯
        </span>
        {children}
      </Tag>
      {href ? (
        <Link
          href={href}
          className="group flex shrink-0 items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          {hrefLabel ?? "see all"}
          <ArrowRight
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </div>
  );
}
