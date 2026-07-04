import type { Metadata } from "next";
import { FileDown } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { experience, education } from "@/lib/data/experience";
import { skillGroups } from "@/lib/data/skills";
import { TechPill } from "@/components/project-card";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name} — ${site.role} at ${site.company}.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="flex flex-col gap-10">
      <Reveal>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <SectionHeading as="h1">resume</SectionHeading>
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              The structured version lives below; the PDF is always current.
            </p>
          </div>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            download PDF
          </a>
        </div>
      </Reveal>

      <Reveal>
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-subtle">
            {"// Experience"}
          </h2>
          <div className="flex flex-col gap-6">
            {experience.map((job) => (
              <article key={job.role}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-mono text-sm font-semibold text-fg">
                    {job.role} · {job.company}
                  </h3>
                  <p className="font-mono text-xs text-subtle">{job.period}</p>
                </div>
                <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-sm leading-relaxed text-muted marker:text-subtle">
                  {job.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-subtle">
            {"// Skills"}
          </h2>
          <div className="flex flex-col gap-3">
            {skillGroups.map((g) => (
              <div key={g.label} className="flex flex-wrap items-baseline gap-2">
                <span className="w-36 shrink-0 font-mono text-xs text-subtle">{g.label}</span>
                <div className="flex flex-wrap gap-1.5">
                  {g.skills.map((s) => (
                    <TechPill key={s}>{s}</TechPill>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-subtle">
            {"// Education"}
          </h2>
          <div className="flex flex-col gap-3">
            {education.map((e) => (
              <div key={e.school} className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono text-sm text-fg">
                  {e.school} — <span className="text-muted">{e.degree}</span>
                </p>
                <p className="font-mono text-xs text-subtle">
                  {e.period} · {e.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
