import { ArchiveIcon, Download, GitFork, Star } from "lucide-react";
import type { LiveProject } from "@/lib/projects-live";

export function TechPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-edge bg-accent-soft px-2.5 py-0.5 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <span
      className="flex items-center gap-1 font-mono text-xs text-subtle"
      aria-label={`${value.toLocaleString()} ${label}`}
    >
      {icon}
      {value.toLocaleString()}
    </span>
  );
}

/**
 * Featured project card. The whole card is the link target; on group hover
 * the parent list dims siblings (see usage) for the spotlight effect.
 */
export function ProjectCard({ project }: { project: LiveProject }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/card flex h-full flex-col gap-3 rounded-xl border border-edge bg-elevated p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_0_24px_-8px_var(--accent)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-mono text-base font-semibold text-fg group-hover/card:text-accent">
          {project.name}
          {project.archived ? (
            <span className="ml-2 inline-flex items-center gap-1 rounded border border-edge px-1.5 py-0.5 align-middle font-mono text-[10px] font-normal text-subtle">
              <ArchiveIcon className="h-3 w-3" aria-hidden="true" /> archived
            </span>
          ) : null}
        </h3>
        <div className="flex shrink-0 items-center gap-3">
          {project.stars !== null && project.stars > 0 ? (
            <Stat
              icon={<Star className="h-3.5 w-3.5" aria-hidden="true" />}
              value={project.stars}
              label="stars"
            />
          ) : null}
          {project.forks !== null && project.forks > 0 ? (
            <Stat
              icon={<GitFork className="h-3.5 w-3.5" aria-hidden="true" />}
              value={project.forks}
              label="forks"
            />
          ) : null}
        </div>
      </div>
      <p className="text-sm font-medium text-muted">{project.tagline}</p>
      <p className="flex-1 text-sm leading-relaxed text-subtle">
        {project.description}
      </p>
      {project.downloads ? (
        <p className="flex items-center gap-1.5 font-mono text-xs text-muted">
          <Download className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          {project.downloads.toLocaleString()} downloads on crates.io
        </p>
      ) : null}
      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <TechPill key={t}>{t}</TechPill>
        ))}
      </div>
    </a>
  );
}

/** Compact row for the categorized project index. */
export function ProjectRow({ project }: { project: LiveProject }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/row -mx-3 flex items-baseline gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent-soft"
    >
      <span className="shrink-0 font-mono text-sm font-medium text-fg group-hover/row:text-accent">
        {project.name}
      </span>
      <span className="hidden flex-1 truncate text-sm text-subtle sm:block">
        {project.tagline}
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-3">
        {project.downloads ? (
          <Stat
            icon={<Download className="h-3 w-3" aria-hidden="true" />}
            value={project.downloads}
            label="downloads"
          />
        ) : null}
        {project.stars !== null && project.stars > 0 ? (
          <Stat
            icon={<Star className="h-3 w-3" aria-hidden="true" />}
            value={project.stars}
            label="stars"
          />
        ) : null}
      </span>
    </a>
  );
}
