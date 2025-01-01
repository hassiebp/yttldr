import { z } from "zod";
import { YoutubeTranscript } from "youtube-transcript";

export function extractVideoId(url: string) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

export function isValidYouTubeUrl(url: string) {
  return Boolean(extractVideoId(url));
}

export async function getTranscript(youtubeUrl: string) {
  return YoutubeTranscript.fetchTranscript(youtubeUrl).then((res) =>
    res.map((i) => i.text.replace(/&amp;#39;/g, "'")).join(" ")
  );
}

export async function getVideoMetadata(
  youtubeUrl: string
): Promise<YoutubeVideoMetadata> {
  const result = await fetch(
    `https://www.youtube.com/oembed?url=${youtubeUrl}`
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
