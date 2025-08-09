import { langfuseClient, langfuseSpanProcessor } from "@/langfuse";
import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { waitUntil } from "@vercel/functions";
import z from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const MetadataSchema = z.object({ sessionId: z.string() })

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const prompt = await langfuseClient.prompt.get("summarizer", {
    type: "chat",
  });

  const sessionId = messages.reduce((acc, m) => {
    const parsed = MetadataSchema.safeParse(m.metadata)
    if (parsed.success) return parsed.data.sessionId

    return acc
  }, null as string | null)

  const result = streamText({
    model: openai("gpt-4o-2024-11-20"),
    system: prompt.compile()[0].content,
    messages: convertToModelMessages(messages),
    experimental_telemetry: {
      isEnabled: true,
      functionId: "summarize-video",
      metadata: {
        langfusePrompt: prompt.toJSON(),
        ...(sessionId ? { sessionId } : {})
      },
    },
  });

  waitUntil(langfuseSpanProcessor.forceFlush());
  return result.toUIMessageStreamResponse();
}
