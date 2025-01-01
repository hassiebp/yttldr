export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GetVideoDataResponse = {
  title: string;
  authorName: string;
  authorUrl: string;
  videoId: string;
  summaryUserMessage: ChatMessage;
};
