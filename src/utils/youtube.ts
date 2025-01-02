import { z } from "zod";
import { Innertube } from "youtubei.js/web";

export function extractVideoId(url: string) {
  const regExp =
    /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*)|youtu\.be\/([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

export function isValidYouTubeUrl(url: string) {
  return Boolean(extractVideoId(url));
}

export async function getTranscript(videoId: string) {
  try {
    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });

    const info = await youtube.getInfo(videoId);
    const transcriptData = await info.getTranscript();
    const transcript =
      transcriptData?.transcript?.content?.body?.initial_segments
        .map((segment) => segment.snippet.text)
        .join(" ");

    return transcript;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error;
  }
}

export async function getVideoMetadata(
  youtubeUrl: string,
): Promise<YoutubeVideoMetadata> {
  const result = await fetch(
    `https://www.youtube.com/oembed?url=${youtubeUrl}`,
  );
  const data = await result.json();

  return YoutubeVideoMetadataSchema.parse(data);
}

export const YoutubeVideoMetadataSchema = z.object({
  title: z.string(),
  author_name: z.string(),
  author_url: z.string(),
  type: z.string(),
  height: z.number(),
  width: z.number(),
  version: z.string(),
  provider_name: z.string(),
  provider_url: z.string(),
  thumbnail_height: z.number(),
  thumbnail_width: z.number(),
  thumbnail_url: z.string(),
  html: z.string(),
});

export type YoutubeVideoMetadata = z.infer<typeof YoutubeVideoMetadataSchema>;
