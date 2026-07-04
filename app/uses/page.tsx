import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { uses } from "@/lib/data/uses";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The tools Abhay Thakur actually uses: NixOS, Neovim, Tmux, and the rest of the stack.",
  alternates: { canonical: "/uses" },
};

export default function UsesPage() {
  return (
    <div className="flex flex-col gap-10">
      <Reveal>
        <SectionHeading as="h1">cat uses.md</SectionHeading>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          The tools I actually use, not the ones that look good in a list.
          Config-as-code where possible — most of this is reproducible from my
          dotfiles.
        </p>
      </Reveal>

      {uses.map((group) => (
        <Reveal key={group.label}>
          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-subtle">
              {"// "}
              {group.label}
            </h2>
            <ul className="flex flex-col gap-4">
              {group.items.map((item) => (
                <li key={item.name} className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <span className="font-mono text-sm font-semibold text-fg">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent"
                      >
                        {item.name} ↗
                      </a>
                    ) : (
                      item.name
                    )}
                  </span>
                  <span className="text-sm leading-relaxed text-muted">{item.note}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      ))}
    </div>
  );
}
