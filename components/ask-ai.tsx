"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, CornerDownLeft } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What does Abhay do at Salescode.ai?",
  "Tell me about crabby_proxy",
  "What Rust crates has he published?",
];

/**
 * "Ask my portfolio" — a small streaming chat grounded in the site's data.
 * Renders nothing unless the deployment has an AI key configured.
 */
export function AskAi() {
  const [enabled, setEnabled] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => setEnabled(Boolean(d.enabled)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  if (!enabled) return null;

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setError(null);
    setBusy(true);
    setInput("");
    const history: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-10) }),
      });
      if (!res.ok || !res.body) throw new Error("request failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: acc }]);
      }
    } catch {
      setError("something went wrong — try again");
      setMessages(history);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-label="Ask the portfolio assistant">
      <div className="rounded-xl border border-edge bg-elevated p-5">
        <h2 className="flex items-center gap-2 font-mono text-sm font-semibold text-fg">
          <Bot className="h-4 w-4 text-accent" aria-hidden="true" />
          ask about me
          <span className="rounded border border-edge px-1.5 py-0.5 font-mono text-[10px] font-normal text-subtle">
            AI
          </span>
        </h2>
        <p className="mt-1 font-mono text-xs text-subtle">
          grounded in this site&apos;s data — it won&apos;t make things up
        </p>

        {messages.length > 0 && (
          <div
            ref={scrollRef}
            className="mt-4 flex max-h-64 flex-col gap-3 overflow-y-auto"
          >
            {messages.map((m, i) => (
              <p
                key={i}
                className={
                  m.role === "user"
                    ? "font-mono text-sm text-fg"
                    : "whitespace-pre-wrap text-sm leading-relaxed text-muted"
                }
              >
                {m.role === "user" ? (
                  <>
                    <span className="text-accent">❯ </span>
                    {m.content}
                  </>
                ) : (
                  m.content || "…"
                )}
              </p>
            ))}
          </div>
        )}

        {messages.length === 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="rounded-full border border-edge px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-fg"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="mt-4 flex items-center gap-2"
        >
          <label htmlFor="ask-ai-input" className="sr-only">
            Ask a question about Abhay
          </label>
          <input
            id="ask-ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={500}
            placeholder="ask anything about my work…"
            className="w-full rounded-lg border border-edge bg-bg px-3 py-2 font-mono text-sm text-fg outline-none transition-colors placeholder:text-subtle focus:border-accent/50"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send question"
            className="rounded-lg bg-accent p-2 text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <CornerDownLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-2 font-mono text-xs text-red-400">
            error: {error}
          </p>
        )}
      </div>
    </section>
  );
}
