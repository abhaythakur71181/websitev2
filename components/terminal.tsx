"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/lib/data/site";
import { featuredProjects } from "@/lib/data/projects";

interface Line {
  id: number;
  kind: "cmd" | "out";
  text: string;
}

const PROMPT = "abhay@nixos:~$";

const FILES = [
  "about.md",
  "blog/",
  "projects/",
  "guestbook/",
  "uses.md",
  "resume.pdf",
];

const HELP = `available commands:
  help        show this list
  whoami      who is this guy
  neofetch    system info
  ls          list files
  cat <file>  read a file
  cd <dir>    go somewhere (blog, projects, about, uses, guestbook)
  contact     ways to reach me
  clear       clear the screen
  …and a few undocumented ones. it's a terminal, poke around.`;

const NEOFETCH = `        ▗▄▄▖        abhay@nixos
      ▗▛▀▀▀▜▄       ───────────────
     ▐▌  ❄  ▐▌      os        NixOS (previously Arch, btw)
      ▜▄▄▄▄▛▘       editor    Neovim (own Lua config)
        ▝▀▘         mux       tmux
                    role      ${site.role} @ ${site.company}
                    day       Java · Spring Boot · Kafka · Redis
                    night     Rust · Tokio · Axum
                    crates    5 published · ~12k downloads
                    location  ${site.jokeLocation}`;

function output(cmd: string, router: (path: string) => void): string {
  const [name, ...args] = cmd.trim().split(/\s+/);
  const arg = args.join(" ").toLowerCase();

  switch (name.toLowerCase()) {
    case "help":
      return HELP;
    case "whoami":
      return `${site.name} — ${site.role} @ ${site.company}.\nBackend engineer by day, Rust gremlin by night.`;
    case "neofetch":
      return NEOFETCH;
    case "ls":
      return FILES.join("  ");
    case "pwd":
      return "/home/abhay";
    case "date":
      return new Date().toString();
    case "echo":
      return args.join(" ");
    case "cat": {
      if (!arg) return "cat: missing file operand";
      if (arg.includes("about")) {
        return "I build order-management backends at Salescode.ai and open-source Rust things after hours.\nFull story at ./about — try `cd about`.";
      }
      if (arg.includes("resume")) {
        window.open("/resume.pdf", "_blank");
        return "resume.pdf is a binary file — opening it properly…";
      }
      if (arg.includes("uses")) {
        return "NixOS · Neovim · tmux · JetBrains Mono. Full list: `cd uses`.";
      }
      if (FILES.some((f) => arg.startsWith(f.replace("/", "")))) {
        return `cat: ${arg}: Is a directory`;
      }
      return `cat: ${arg}: No such file or directory`;
    }
    case "cd": {
      const routes: Record<string, string> = {
        blog: "/blog",
        projects: "/projects",
        about: "/about",
        uses: "/uses",
        guestbook: "/guestbook",
        now: "/now",
        "~": "/",
        "..": "/",
      };
      const target = routes[arg.replace(/\/$/, "")];
      if (target) {
        router(target);
        return `cd: entering ${target}`;
      }
      return arg ? `cd: no such directory: ${arg}` : "cd: usage: cd <dir>";
    }
    case "projects":
      return featuredProjects
        .map((p) => `${p.name.padEnd(14)} ${p.tagline}`)
        .join("\n");
    case "contact":
      return `email     ${site.email}\ngithub    ${site.links.github}\nlinkedin  ${site.links.linkedin}`;
    case "sudo":
      if (arg.includes("hire")) {
        window.open("/resume.pdf", "_blank");
        return "[sudo] permission granted. Excellent decision — opening resume…";
      }
      return `[sudo] password for guest: \nSorry, try again. (hint: try \`sudo hire-me\`)`;
    case "rm":
      return "rm: permission denied — nice try though.";
    case "vim":
    case "nvim":
      return "opening nvim… just kidding, you'd never find the way out. :q!";
    case "exit":
      return "there is no escape. this is a website.";
    case "nix":
      return "nix: rebuilding system… done in 0.02s (this joke is cached)";
    default:
      return `command not found: ${name} — try \`help\``;
  }
}

export function Terminal() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([
    { id: 0, kind: "cmd", text: "whoami" },
    {
      id: 1,
      kind: "out",
      text: `${site.name} — ${site.role} @ ${site.company}.\nBackend engineer by day, Rust gremlin by night. Type \`help\` to explore.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const nextId = useRef(2);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = () => {
    const cmd = input.trim();
    setInput("");
    setHistIdx(-1);
    if (!cmd) return;
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    setHistory((h) => [cmd, ...h].slice(0, 50));
    const out = output(cmd, router.push);
    setLines((prev) =>
      [
        ...prev,
        { id: nextId.current++, kind: "cmd" as const, text: cmd },
        ...(out ? [{ id: nextId.current++, kind: "out" as const, text: out }] : []),
      ].slice(-60),
    );
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      if (history[idx]) {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = histIdx - 1;
      setHistIdx(idx);
      setInput(idx >= 0 ? history[idx] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const cmds = ["help", "whoami", "neofetch", "ls", "cat ", "cd ", "contact", "clear", "projects"];
      const match = cmds.find((c) => c.startsWith(input) && c !== input);
      if (match) setInput(match);
    }
  };

  return (
    <div
      className="overflow-hidden rounded-xl border border-edge-strong bg-terminal shadow-xl"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-white/40">
          abhay@nixos: ~
        </span>
      </div>
      <div
        ref={scrollRef}
        className="max-h-72 min-h-56 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
        role="log"
        aria-label="Interactive terminal — type help for commands"
      >
        {lines.map((line) =>
          line.kind === "cmd" ? (
            <p key={line.id} className="text-white/90">
              <span className="text-emerald-400">{PROMPT}</span>{" "}
              <span>{line.text}</span>
            </p>
          ) : (
            <pre
              key={line.id}
              className="mb-1 whitespace-pre-wrap break-words text-white/60"
            >
              {line.text}
            </pre>
          ),
        )}
        <div className="flex items-center gap-2 text-white/90">
          <span className="shrink-0 text-emerald-400">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full bg-transparent font-mono text-[13px] text-white/90 caret-emerald-400 outline-none placeholder:text-white/25"
            placeholder="type `help`…"
            aria-label="Terminal input"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
