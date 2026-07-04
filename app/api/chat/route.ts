import { NextResponse } from "next/server";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { buildPortfolioContext } from "@/lib/ai-context";
import { site } from "@/lib/data/site";

export const maxDuration = 30;

function getModel() {
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(process.env.AI_MODEL ?? "claude-haiku-4-5");
  }
  if (process.env.OPENAI_API_KEY) {
    return openai(process.env.AI_MODEL ?? "gpt-4o-mini");
  }
  return null;
}

const aiEnabled = () =>
  Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);

/** Feature probe for the client widget. */
export async function GET() {
  return NextResponse.json({ enabled: aiEnabled() });
}

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
});

export async function POST(req: Request) {
  const model = getModel();
  if (!model) {
    return NextResponse.json(
      { error: "The AI assistant isn't configured on this deployment." },
      { status: 503 },
    );
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = streamText({
    model,
    system: `You are the portfolio assistant on ${site.name}'s personal website. Answer questions about Abhay — his experience, projects, skills, and background — using ONLY the context below. Be concise, friendly, and a little dry-humored (terminal culture). If something isn't in the context, say you don't know and suggest emailing him at ${site.email}. Never invent facts. Keep answers under 150 words.\n\n<context>\n${buildPortfolioContext()}\n</context>`,
    messages: parsed.data.messages,
  });

  return result.toTextStreamResponse();
}
