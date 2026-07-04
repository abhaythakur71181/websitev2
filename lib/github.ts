/**
 * GitHub data layer — plain fetch against the public REST/GraphQL APIs with
 * Next.js ISR caching. Works unauthenticated; set GITHUB_TOKEN to raise rate
 * limits and enable the exact contribution calendar via GraphQL.
 */

export const GITHUB_USERNAME = "abhaythakur71181";

const REVALIDATE_SECONDS = 3600;

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function ghFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: headers(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  created_at: string;
}

export async function getProfile(): Promise<GitHubProfile | null> {
  return ghFetch<GitHubProfile>(`https://api.github.com/users/${GITHUB_USERNAME}`);
}

export async function getRepos(): Promise<GitHubRepo[]> {
  const repos = await ghFetch<GitHubRepo[]>(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
  );
  return repos ?? [];
}

export async function getRepo(name: string): Promise<GitHubRepo | null> {
  return ghFetch<GitHubRepo>(`https://api.github.com/repos/${GITHUB_USERNAME}/${name}`);
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  total: number;
  days: ContributionDay[];
}

/**
 * Contribution calendar. Prefers the official GraphQL API when GITHUB_TOKEN
 * is set; falls back to the public jogruber mirror otherwise.
 */
export async function getContributions(): Promise<ContributionCalendar | null> {
  if (process.env.GITHUB_TOKEN) {
    const gql = await graphqlContributions();
    if (gql) return gql;
  }
  return fallbackContributions();
}

async function graphqlContributions(): Promise<ContributionCalendar | null> {
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks { contributionDays { date contributionCount contributionLevel } }
              }
            }
          }
        }`,
        variables: { login: GITHUB_USERNAME },
      }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const calendar =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;
    const levelMap: Record<string, ContributionDay["level"]> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };
    const days: ContributionDay[] = calendar.weeks.flatMap(
      (w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: levelMap[d.contributionLevel] ?? 0,
        })),
    );
    return { total: calendar.totalContributions, days };
  } catch {
    return null;
  }
}

async function fallbackContributions(): Promise<ContributionCalendar | null> {
  const data = await ghFetchExternal<{
    total: Record<string, number>;
    contributions: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
  }>(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`);
  if (!data) return null;
  return {
    total: Object.values(data.total).reduce((a, b) => a + b, 0),
    days: data.contributions.map((c) => ({
      date: c.date,
      count: c.count,
      level: c.level,
    })),
  };
}

async function ghFetchExternal<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Aggregate language byte counts across original repos. */
export async function getLanguageStats(): Promise<{ name: string; share: number }[]> {
  const repos = (await getRepos()).filter((r) => !r.fork && !r.archived);
  const totals = new Map<string, number>();
  const top = repos.slice(0, 20);
  await Promise.all(
    top.map(async (repo) => {
      const langs = await ghFetch<Record<string, number>>(
        `https://api.github.com/repos/${repo.full_name}/languages`,
      );
      if (!langs) return;
      for (const [lang, bytes] of Object.entries(langs)) {
        totals.set(lang, (totals.get(lang) ?? 0) + bytes);
      }
    }),
  );
  const sum = [...totals.values()].reduce((a, b) => a + b, 0);
  if (sum === 0) return [];
  return [...totals.entries()]
    .map(([name, bytes]) => ({ name, share: bytes / sum }))
    .sort((a, b) => b.share - a.share)
    .slice(0, 8);
}
