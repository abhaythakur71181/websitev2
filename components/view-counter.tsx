"use client";

import { useEffect, useState } from "react";

/**
 * Increments the anonymous view counter once per browser session and shows
 * the total. Renders nothing when the database isn't configured.
 */
export function ViewCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const key = `viewed:${slug}`;
    const increment = !sessionStorage.getItem(key);
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, increment }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.enabled && typeof data.count === "number") {
          setCount(data.count);
          sessionStorage.setItem(key, "1");
        }
      })
      .catch(() => {});
  }, [slug]);

  if (count === null) return null;
  return (
    <span className="font-mono text-xs text-subtle">
      · {count.toLocaleString()} views
    </span>
  );
}
