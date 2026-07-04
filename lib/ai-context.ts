import { site } from "@/lib/data/site";
import { projects } from "@/lib/data/projects";
import { experience, education } from "@/lib/data/experience";
import { timeline } from "@/lib/data/timeline";
import { skillGroups } from "@/lib/data/skills";

/**
 * Compiles the whole portfolio into a grounded context block for the
 * "ask my portfolio" assistant. Everything here is public information
 * already rendered on the site.
 */
export function buildPortfolioContext(): string {
  return [
    `# ${site.name} (${site.alias}, formerly ${site.formerAlias})`,
    `${site.role} at ${site.company}, ${site.location}. ${site.description}`,
    `Email: ${site.email} · GitHub: ${site.links.github} · LinkedIn: ${site.links.linkedin}`,
    ``,
    `## Experience`,
    ...experience.map(
      (job) =>
        `- ${job.role} @ ${job.company} (${job.period}): ${job.points.join(" ")} [${job.tech.join(", ")}]`,
    ),
    ``,
    `## Education`,
    ...education.map((e) => `- ${e.school}, ${e.degree}, ${e.period}, ${e.detail}`),
    ``,
    `## Projects`,
    ...projects.map(
      (p) =>
        `- ${p.name} (${p.category}${p.crate ? `, crates.io: ${p.crate}` : ""}${p.archived ? ", archived" : ""}): ${p.description} [${p.tech.join(", ")}]${p.highlights ? ` Highlights: ${p.highlights.join("; ")}` : ""}`,
    ),
    ``,
    `## Timeline`,
    ...timeline.map((t) => `- ${t.year}: ${t.title} — ${t.description}`),
    ``,
    `## Skills`,
    ...skillGroups.map((g) => `- ${g.label}: ${g.skills.join(", ")}`),
    ``,
    `## Extras`,
    `- LeetCode: 284 problems solved (${site.links.leetcode})`,
    `- 5 crates published on crates.io, ~12k combined downloads`,
    `- Daily driver: NixOS (previously Arch Linux), Neovim (own Lua config), Tmux`,
    `- Supports the Free Software Movement`,
  ].join("\n");
}
