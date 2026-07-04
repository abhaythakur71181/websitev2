"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/** Icon visibility is pure CSS (dark: variants) — no mounted-state dance. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-md p-2 text-muted transition-colors hover:bg-accent-soft hover:text-fg"
      aria-label="Toggle color theme"
    >
      <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
      <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
    </button>
  );
}
