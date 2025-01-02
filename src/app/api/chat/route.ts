import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { Langfuse } from "langfuse";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const langfuse = new Langfuse();

export async function POST(req: Request) {
  const { messages } = await req.json();

  const prompt = await langfuse.getPrompt("summarizer", undefined, {
    type: "chat",
  });

  const result = streamText({
    model: openai("gpt-4o-2024-11-20"),
    system: prompt.prompt[0].content,
    messages,
    experimental_telemetry: {
      isEnabled: true,
      functionId: "summarize-video",
      metadata: {
        langfusePrompt: prompt.toJSON(),
      },
    },
  });

  return result.toDataStreamResponse();
}
