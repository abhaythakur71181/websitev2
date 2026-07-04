import type { Metadata } from "next";
import { Suspense } from "react";
import { Star } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard, ProjectRow } from "@/components/project-card";
import { getLiveProjects, getArchiveRepos } from "@/lib/projects-live";
import { projectCategories } from "@/lib/data/projects";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Open-source work by Abhay Thakur: Rust crates, TypeScript APIs, systems tooling — with live GitHub and crates.io stats.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-14">
      <Reveal>
        <SectionHeading as="h1">ls projects/</SectionHeading>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          Things I&apos;ve built and shipped — stars, forks, and crate downloads
          are live from GitHub and crates.io. The flagship gets a spotlight; the
          rest are grouped by what they are.
        </p>
      </Reveal>
      <Suspense fallback={<Skeleton />}>
        <ProjectSections />
      </Suspense>
    </div>
  );
}

async function ProjectSections() {
  const [projects, archive] = await Promise.all([
    getLiveProjects(),
    getArchiveRepos(),
  ]);

  return (
    <>
      {projectCategories.map((category) => {
        const items = projects.filter((p) => p.category === category);
        if (items.length === 0) return null;
        const featured = items.filter((p) => p.featured);
        const rest = items.filter((p) => !p.featured);
        return (
          <section key={category}>
            <Reveal>
              <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-subtle">
                {"// "}
                {category}
              </h2>
              {featured.length > 0 && (
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 [&:has(a:hover)_a:not(:hover)]:opacity-60">
                  {featured.map((p) => (
                    <ProjectCard key={p.repo} project={p} />
                  ))}
                </div>
              )}
              {rest.length > 0 && (
                <div className="flex flex-col">
                  {rest.map((p) => (
                    <ProjectRow key={p.repo} project={p} />
                  ))}
                </div>
              )}
            </Reveal>
          </section>
        );
      })}

      {archive.length > 0 && (
        <section>
          <Reveal>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-subtle">
              {"// Full archive"}
            </h2>
            <p className="mb-4 max-w-xl text-sm text-muted">
              Everything else public on GitHub — the learning years included.
              History is history.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-edge text-left font-mono text-xs text-subtle">
                    <th className="py-2 pr-4 font-normal">repo</th>
                    <th className="py-2 pr-4 font-normal">lang</th>
                    <th className="py-2 pr-4 font-normal">
                      <Star className="inline h-3 w-3" aria-label="stars" />
                    </th>
                    <th className="py-2 font-normal">last push</th>
                  </tr>
                </thead>
                <tbody>
                  {archive.map((repo) => (
                    <tr key={repo.name} className="border-b border-edge/50 transition-colors hover:bg-accent-soft">
                      <td className="py-2 pr-4">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-fg hover:text-accent"
                        >
                          {repo.name}
                        </a>
                      </td>
                      <td className="py-2 pr-4 font-mono text-xs text-muted">
                        {repo.language ?? "—"}
                      </td>
                      <td className="py-2 pr-4 font-mono text-xs text-muted">
                        {repo.stargazers_count}
                      </td>
                      <td className="py-2 font-mono text-xs text-subtle">
                        {formatDate(repo.pushed_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>
      )}
    </>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-xl bg-elevated" />
      ))}
    </div>
  );
}
