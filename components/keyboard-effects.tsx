"use client";

import { useEffect, useState } from "react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Global keyboard layer: vim-style navigation (j/k scroll, gg top, G bottom)
 * and the Konami code easter egg. Never intercepts keys while typing.
 */
export function KeyboardEffects() {
  const [konami, setKonami] = useState(false);

  useEffect(() => {
    let konamiIdx = 0;
    let lastG = 0;

    const isEditable = (el: EventTarget | null) =>
      el instanceof HTMLElement &&
      (el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.isContentEditable ||
        el.closest("[cmdk-root]") !== null);

    const onKey = (e: KeyboardEvent) => {
      // Konami tracking works everywhere except editable fields
      if (!isEditable(e.target)) {
        const expected = KONAMI[konamiIdx];
        if (e.key === expected) {
          konamiIdx += 1;
          if (konamiIdx === KONAMI.length) {
            konamiIdx = 0;
            setKonami(true);
            setTimeout(() => setKonami(false), 4200);
          }
        } else {
          konamiIdx = e.key === KONAMI[0] ? 1 : 0;
        }
      }

      if (isEditable(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case "j":
          window.scrollBy({ top: 80, behavior: "auto" });
          break;
        case "k":
          window.scrollBy({ top: -80, behavior: "auto" });
          break;
        case "g": {
          const now = Date.now();
          if (now - lastG < 400) {
            window.scrollTo({ top: 0 });
            lastG = 0;
          } else {
            lastG = now;
          }
          break;
        }
        case "G":
          window.scrollTo({ top: document.documentElement.scrollHeight });
          break;
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!konami) return null;

  return (
    <div
      role="status"
      className="fixed bottom-14 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-accent/40 bg-terminal px-4 py-3 font-mono text-sm text-accent shadow-2xl"
    >
      <p className="font-semibold">⭑ ACHIEVEMENT UNLOCKED</p>
      <p className="text-xs text-white/70">
        30 extra lives granted. Konami code accepted — you&apos;re clearly one of us.
      </p>
    </div>
  );
}
