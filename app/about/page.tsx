import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { AskAi } from "@/components/ask-ai";
import { timeline } from "@/lib/data/timeline";
import { skillGroups } from "@/lib/data/skills";
import { experience, education } from "@/lib/data/experience";
import { site } from "@/lib/data/site";
import { TechPill } from "@/components/project-card";
import profilePic from "@/public/images/profile.jpg";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who is Abhay Thakur — backend engineer at Salescode.ai, Rust open-sourcerer, NixOS user, and FOSS believer.",
  alternates: { canonical: "/about" },
};

const kindColor: Record<string, string> = {
  work: "bg-accent",
  oss: "bg-sky-500",
  education: "bg-amber-500",
  milestone: "bg-fuchsia-500",
};

export default function AboutPage() {
  const years = [...new Set(timeline.map((t) => t.year))].sort((a, b) => b - a);

  return (
    <div className="flex flex-col gap-16">
      <section>
        <Reveal>
          <SectionHeading as="h1">cat about.md</SectionHeading>
          <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:justify-between">
            <div className="prose max-w-xl">
              <p>
                Hi, I&apos;m <strong>Abhay Thakur</strong> — also known as{" "}
                <a href={site.links.github} target="_blank" rel="noopener noreferrer">
                  {site.alias}
                </a>{" "}
                (and in a former life, <em>{site.formerAlias}</em>). I&apos;m a{" "}
                {site.role} at{" "}
                <a href={site.companyUrl} target="_blank" rel="noopener noreferrer">
                  {site.company}
                </a>{" "}
                in Gurugram, where I lead the architecture of the Order
                Management System inside a Distributor Management System used at
                enterprise scale — Java, Spring Boot, Kafka, Redis, MySQL, and a
                healthy respect for systems that must not fall over.
              </p>
              <p>
                After hours I write <strong>Rust</strong>. Five crates on{" "}
                <a href={site.links.crates} target="_blank" rel="noopener noreferrer">
                  crates.io
                </a>{" "}
                (~12k downloads), a{" "}
                <a
                  href="https://github.com/abhaythakur71181/crabby_proxy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  multi-protocol proxy
                </a>{" "}
                with 398 tests, and an anime-metadata API that somehow collected{" "}
                <a
                  href="https://github.com/abhaythakur71181/Anime-API"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  161 stars and a community
                </a>{" "}
                before I archived it.
              </p>
              <p>
                I run <strong>NixOS</strong> (previously Arch, btw), live inside{" "}
                <strong>Neovim</strong> and tmux, and strongly support the Free
                Software Movement — software should be open and free, with no
                shady data selling behind the scenes. Originally from Hamirpur,
                Himachal Pradesh.
              </p>
            </div>
            <Image
              src={profilePic}
              alt={`Portrait of ${site.name}`}
              width={120}
              height={120}
              className="rounded-xl border-2 border-edge-strong"
              priority
            />
          </div>
        </Reveal>
      </section>

      <section>
        <Reveal>
          <SectionHeading>experience</SectionHeading>
          <div className="flex flex-col gap-8">
            {experience.map((job) => (
              <article key={job.role} className="grid gap-2 sm:grid-cols-[160px_1fr] sm:gap-6">
                <p className="font-mono text-xs leading-6 text-subtle">{job.period}</p>
                <div>
                  <h3 className="font-mono text-sm font-semibold text-fg">
                    {job.role} ·{" "}
                    <a
                      href={job.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {job.company}
                    </a>
                  </h3>
                  <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4 text-sm leading-relaxed text-muted marker:text-subtle">
                    {job.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.tech.map((t) => (
                      <TechPill key={t}>{t}</TechPill>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section>
        <Reveal>
          <SectionHeading>journey</SectionHeading>
          <div className="flex flex-col gap-8">
            {years.map((year) => (
              <div key={year} className="grid gap-2 sm:grid-cols-[160px_1fr] sm:gap-6">
                <p className="font-mono text-sm font-semibold text-accent">{year}</p>
                <div className="flex flex-col gap-4 border-l border-edge pl-5">
                  {timeline
                    .filter((t) => t.year === year)
                    .map((entry) => (
                      <div key={entry.title} className="relative">
                        <span
                          className={`absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full ${kindColor[entry.kind]}`}
                          aria-hidden="true"
                        />
                        <h3 className="text-sm font-semibold text-fg">{entry.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          {entry.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section>
        <Reveal>
          <SectionHeading>skills</SectionHeading>
          <div className="flex flex-col gap-5">
            {skillGroups.map((group) => (
              <div key={group.label} className="grid gap-2 sm:grid-cols-[160px_1fr] sm:gap-6">
                <p className="font-mono text-xs leading-6 text-subtle">{group.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((s) => (
                    <TechPill key={s}>{s}</TechPill>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section>
        <Reveal>
          <SectionHeading>education</SectionHeading>
          <div className="flex flex-col gap-4">
            {education.map((e) => (
              <div key={e.school} className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-6">
                <p className="font-mono text-xs leading-6 text-subtle">{e.period}</p>
                <div>
                  <h3 className="font-mono text-sm font-semibold text-fg">{e.school}</h3>
                  <p className="mt-0.5 text-sm text-muted">
                    {e.degree} · {e.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <AskAi />
    </div>
  );
}
