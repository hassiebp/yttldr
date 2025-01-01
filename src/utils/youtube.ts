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
  return YoutubeTranscript.fetchTranscript(youtubeUrl);
}
