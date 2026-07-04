"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Command } from "cmdk";
import {
  BookOpen,
  Copy,
  FileDown,
  FolderGit2,
  Home,
  MessageSquare,
  Moon,
  PenLine,
  Sun,
  TerminalSquare,
  User,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { site } from "@/lib/data/site";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(site.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      contentClassName="fixed left-1/2 top-[20%] z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-edge-strong bg-elevated shadow-2xl"
      overlayClassName="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
    >
      <div className="flex items-center gap-2 border-b border-edge px-4">
        <span className="font-mono text-sm text-accent" aria-hidden="true">
          ❯
        </span>
        <Command.Input
          placeholder="Type a command or search…"
          className="h-12 w-full bg-transparent font-mono text-sm text-fg outline-none placeholder:text-subtle"
        />
        <kbd className="rounded border border-edge px-1.5 py-0.5 font-mono text-[10px] text-subtle">
          esc
        </kbd>
      </div>
      <Command.List className="max-h-80 overflow-y-auto p-2">
        <Command.Empty className="px-3 py-8 text-center font-mono text-sm text-subtle">
          command not found
        </Command.Empty>

        <Group heading="Navigate">
          <Item icon={<Home />} onSelect={() => run(() => router.push("/"))}>
            Home
          </Item>
          <Item icon={<User />} onSelect={() => run(() => router.push("/about"))}>
            About
          </Item>
          <Item icon={<FolderGit2 />} onSelect={() => run(() => router.push("/projects"))}>
            Projects
          </Item>
          <Item icon={<PenLine />} onSelect={() => run(() => router.push("/blog"))}>
            Blog
          </Item>
          <Item icon={<TerminalSquare />} onSelect={() => run(() => router.push("/uses"))}>
            Uses
          </Item>
          <Item icon={<MessageSquare />} onSelect={() => run(() => router.push("/guestbook"))}>
            Guestbook
          </Item>
          <Item icon={<BookOpen />} onSelect={() => run(() => router.push("/now"))}>
            Now
          </Item>
        </Group>

        <Group heading="Actions">
          <Item
            icon={resolvedTheme === "dark" ? <Sun /> : <Moon />}
            onSelect={() =>
              run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))
            }
          >
            Toggle theme
          </Item>
          <Item icon={<Copy />} onSelect={copyEmail}>
            {copied ? "Copied!" : "Copy email"}
          </Item>
          <Item
            icon={<FileDown />}
            onSelect={() => run(() => window.open("/resume.pdf", "_blank"))}
          >
            Download resume
          </Item>
        </Group>

        <Group heading="Elsewhere">
          <Item
            icon={<GitHubIcon />}
            onSelect={() => run(() => window.open(site.links.github, "_blank"))}
          >
            GitHub
          </Item>
          <Item
            icon={<LinkedInIcon />}
            onSelect={() => run(() => window.open(site.links.linkedin, "_blank"))}
          >
            LinkedIn
          </Item>
        </Group>
      </Command.List>
    </Command.Dialog>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-subtle"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  icon,
  onSelect,
  children,
}: {
  icon: React.ReactNode;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-sm text-muted transition-colors data-[selected=true]:bg-accent-soft data-[selected=true]:text-fg [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-subtle data-[selected=true]:[&_svg]:text-accent"
    >
      {icon}
      {children}
    </Command.Item>
  );
}
