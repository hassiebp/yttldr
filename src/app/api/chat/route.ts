import { langfuseClient, langfuseSpanProcessor } from "@/langfuse";
import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { waitUntil } from "@vercel/functions";
import z from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const MetadataSchema = z.object({ sessionId: z.string() });

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const prompt = await langfuseClient.prompt.get("summarizer", {
    type: "chat",
  });

  const sessionId = messages.reduce(
    (acc, m) => {
      const parsed = MetadataSchema.safeParse(m.metadata);
      if (parsed.success) return parsed.data.sessionId;

      return acc;
    },
    null as string | null,
  );

  const flush = async () => {
    console.log("🚨 Flush requested. Waiting 100ms...");
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    console.log("🚨 Flushing...");
    await langfuseSpanProcessor.forceFlush();
    console.log("🚨Flushed.");
  };

  const result = streamText({
    model: openai("gpt-4o-2024-11-20"),
    system: prompt.compile()[0].content,
    messages: convertToModelMessages(messages),
    onFinish: flush,
    experimental_telemetry: {
      isEnabled: true,
      functionId: "summarize-video",
      metadata: {
        langfusePrompt: prompt.toJSON(),
        updateLangfuseTrace: true,
        ...(sessionId ? { sessionId } : {}),
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
