export interface UsesGroup {
  label: string;
  items: { name: string; note: string; url?: string }[];
}

export const uses: UsesGroup[] = [
  {
    label: "Operating System",
    items: [
      {
        name: "NixOS",
        note: "Declarative, reproducible, occasionally infuriating — the whole system lives in nix-dots.",
        url: "https://github.com/abhaythakur71181/nix-dots",
      },
      {
        name: "Arch Linux (retired)",
        note: "The previous era. The Hyprland rice is preserved in Arch-Dots for posterity. I used Arch, btw.",
        url: "https://github.com/abhaythakur71181/Arch-Dots",
      },
    ],
  },
  {
    label: "Editor & Terminal",
    items: [
      {
        name: "Neovim",
        note: "Own Lua config, no distribution. The config repo is the real dotfile flex.",
        url: "https://github.com/abhaythakur71181/nvim",
      },
      { name: "Tmux", note: "Sessions survive everything. Prefix-key muscle memory is permanent now." },
      { name: "JetBrains Mono", note: "The font this site's headings are set in." },
    ],
  },
  {
    label: "Daily Stack",
    items: [
      { name: "Java + Spring Boot", note: "The day job: OMS backends, Kafka pipelines, Redis caches." },
      { name: "Rust", note: "The night job: CLIs, proxies, crates. Fast, correct, and fun to argue about." },
      { name: "TypeScript", note: "For everything with a browser attached." },
    ],
  },
  {
    label: "Tools & Services",
    items: [
      { name: "Git + GitHub", note: "55+ public repos and counting." },
      { name: "Docker", note: "Containers for everything that refuses to be a static binary." },
      { name: "Postman", note: "API poking, professional grade." },
      { name: "Jira + Confluence", note: "Where sprints live." },
    ],
  },
  {
    label: "Hardware",
    items: [
      {
        name: "Mac M4",
        note: "For office work.",
      },
      {
        name: "Custom PC build",
        note: "Ryzen 5 3600, RTX 2060, 16GB RAM for gaming and stuff.",
      },
      {
        name: "ASUS TUF Gaming laptop",
        note: "Fan curves controlled by perfmode — my own Rust CLI, because the vendor tool doesn't run on Linux.",
        url: "https://github.com/abhaythakur71181/perfmode",
      },
    ],
  },
];
