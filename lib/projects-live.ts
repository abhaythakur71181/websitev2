import { getRepos, type GitHubRepo } from "@/lib/github";
import { getCrateDownloads } from "@/lib/crates";
import { projects, type Project } from "@/lib/data/projects";

export interface LiveProject extends Project {
  stars: number | null;
  forks: number | null;
  downloads: number | null;
  url: string;
}

/** Merge curated project data with live GitHub stats and crate downloads. */
export async function getLiveProjects(): Promise<LiveProject[]> {
  const repos = await getRepos();
  const byName = new Map<string, GitHubRepo>(
    repos.map((r) => [r.name.toLowerCase(), r]),
  );

  return Promise.all(
    projects.map(async (p) => {
      const repo = byName.get(p.repo.toLowerCase());
      const downloads = p.crate ? await getCrateDownloads(p.crate) : null;
      return {
        ...p,
        stars: repo?.stargazers_count ?? null,
        forks: repo?.forks_count ?? null,
        downloads,
        url: `https://github.com/abhaythakur71181/${p.repo}`,
      };
    }),
  );
}

/** Every original public repo not already curated — for the archive table. */
export async function getArchiveRepos(): Promise<GitHubRepo[]> {
  const curated = new Set(projects.map((p) => p.repo.toLowerCase()));
  const repos = await getRepos();
  return repos
    .filter((r) => !r.fork && !curated.has(r.name.toLowerCase()))
    .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.pushed_at) - +new Date(a.pushed_at));
}
