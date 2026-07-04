import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Now",
  description: "What Abhay Thakur is focused on right now.",
  alternates: { canonical: "/now" },
};

const nowItems = [
  {
    title: "Leading the OMS at Salescode.ai",
    body: "Owning architecture for the Order Management System — designing for reliability under real enterprise load, mentoring juniors, and reviewing more code than I write.",
  },
  {
    title: "Building crabby_proxy",
    body: "The multi-protocol Rust proxy keeps growing: protocol auto-detection, tiered caching, RBAC, metrics. Current test count: 398 and climbing.",
  },
  {
    title: "Living the Nix life",
    body: "Slowly making the NixOS config reproducible enough that a laptop loss would cost me an afternoon, not a week.",
  },
  {
    title: "Writing more",
    body: "Trying to turn the things I debug at 2am into blog posts, starting with security walkthroughs and Rust deep-dives.",
  },
];

export default function NowPage() {
  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <SectionHeading as="h1">now</SectionHeading>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          What I&apos;m focused on at this point in my life — inspired by{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg underline decoration-accent underline-offset-4 hover:text-accent"
          >
            nownownow.com
          </a>
          .
        </p>
      </Reveal>
      <Reveal>
        <div className="flex flex-col gap-6">
          {nowItems.map((item) => (
            <div key={item.title} className="border-l-2 border-accent/40 pl-5">
              <h2 className="font-mono text-sm font-semibold text-fg">{item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal>
        <p className="font-mono text-xs text-subtle">
          # last updated: July 2026
        </p>
      </Reveal>
    </div>
  );
}
