import { langfuseClient, langfuseSpanProcessor } from "@/langfuse";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { waitUntil } from "@vercel/functions";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const prompt = await langfuseClient.prompt.get("summarizer", {
    type: "chat",
  });

  const result = streamText({
    model: openai("gpt-4o-2024-11-20"),
    system: prompt.compile()[0].content,
    messages,
    experimental_telemetry: {
      isEnabled: true,
      functionId: "summarize-video",
      metadata: {
        langfusePrompt: prompt.toJSON(),
      },
    },
  });

  waitUntil(langfuseSpanProcessor.forceFlush());
  return result.toDataStreamResponse();
}
