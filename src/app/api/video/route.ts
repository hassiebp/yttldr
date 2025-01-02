import { ChatMessage, GetVideoDataResponse } from "@/types";
import {
  extractVideoId,
  getTranscript,
  getVideoMetadata,
} from "@/utils/youtube";
import { NextRequest, NextResponse } from "next/server";
import { Langfuse } from "langfuse";

export const maxDuration = 30;

const langfuse = new Langfuse();

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) throw new Error("Missing url");

    // Extract video id
    const videoId = extractVideoId(url);
    if (!videoId) throw new Error("Invalid YouTube URL");

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Get video metadata
    const {
      title,
      author_name: authorName,
      author_url: authorUrl,
    } = await getVideoMetadata(videoUrl);

    // Get transcript
    const transcript = await getTranscript(videoId);
    if (!transcript) throw new Error("Could not get transcript");

    // Get initial summmarization user message
    const prompt = await langfuse.getPrompt("summarizer", undefined, {
      type: "chat",
    });
    const initialMessages = prompt.compile({
      title,
      author: authorName,
      transcript,
    }) as ChatMessage[];

    const response: GetVideoDataResponse = {
      title,
      authorName,
      authorUrl,
      videoId,
      summaryUserMessage: initialMessages[1],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: `Failed to process video: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
