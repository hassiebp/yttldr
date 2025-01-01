"use server";

import { OpenAI } from "openai";
import { extractVideoId, getTranscript } from "@/utils/youtube";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type SummaryLength = "brief" | "balanced" | "thorough";

export async function summarizeVideo(formData: FormData) {
  const url = formData.get("url") as string;
  const summaryLength =
    (formData.get("summaryLength") as SummaryLength) || "balanced";

  if (!url) {
    return { error: "Please provide a YouTube URL" };
  }

  const videoId = extractVideoId(url);

  if (!videoId) {
    return { error: "Invalid YouTube URL" };
  }

  try {
    const lengthInstructions = {
      brief: "Provide a very concise summary in 2-3 sentences.",
      balanced:
        "Provide a balanced summary with key points. Aim for 4-5 sentences.",
      thorough:
        "Provide a comprehensive summary covering all major points. Use 6-8 sentences.",
    };

    const transcript = (await getTranscript(url)).map((i) => i.text).join(" ");
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides concise summaries of YouTube videos.",
        },
        {
          role: "user",
          content: `Please provide a summary of the YouTube video with the following transcript. ${lengthInstructions[summaryLength]} Focus on the main points and key takeaways. 

Transcript:
${transcript}
`,
        },
      ],
      model: "gpt-4o-mini",
    });

    return {
      success: true,
      summary: completion.choices[0].message.content,
      videoId,
    };
  } catch (error) {
    return { error: "Failed to generate summary" };
  }
}
