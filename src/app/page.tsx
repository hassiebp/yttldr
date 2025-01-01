"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

import { useChat } from "ai/react";
import { ArrowRight, ArrowUpRight, Loader2, Youtube } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GetVideoDataResponse } from "@/types";
import { isValidYouTubeUrl } from "@/utils/youtube";

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleChatSubmit,
    setMessages,
    append,
    isLoading,
  } = useChat();
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [videoData, setVideoData] = React.useState<GetVideoDataResponse | null>(
    null
  );
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleVideoSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    setMessages([]);

    const url = formData.get("url") as string;

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      setIsPending(false);

      return;
    }

    const result = (await (
      await fetch(`/api/video?url=${url}`)
    ).json()) as GetVideoDataResponse;

    if ("error" in result) {
      setError(result.error ?? null);
    } else {
      setVideoData(result);
      const message = {
        ...result.summaryUserMessage,
        id: Math.floor(Math.random() * 100000).toString(),
      };

      // Triggers the summary generation
      append(message);
    }

    setIsPending(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col gap-4 md:gap-8 max-w-7xl mx-auto">
          {!videoData ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
              <h1
                onClick={() => {
                  setMessages([]);
                  setError(null);
                  setVideoData(null);
                }}
                className="font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent pb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl cursor-pointer hover:opacity-80 transition-opacity text-center"
              >
                yttldr
              </h1>
              <p className="mt-3 mb-6 md:mt-4 md:mb-8 text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-xl mx-auto text-center px-4">
                Get instant YouTube video summaries. Ask questions to learn
                more.
              </p>
              <Card className="shadow-lg w-full max-w-2xl mx-4">
                <CardContent className="pt-6">
                  <form action={handleVideoSubmit}>
                    <div className="relative">
                      <Input
                        type="url"
                        name="url"
                        id="youtube-url"
                        placeholder="https://youtube.com/watch?v=..."
                        required
                        aria-label="YouTube video URL"
                        autoComplete="off"
                        spellCheck="false"
                        className="w-full pr-24 sm:pr-32 h-12 text-sm sm:text-base"
                        disabled={isPending}
                      />
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="absolute right-0 top-0 h-12 px-3 sm:px-6 rounded-l-none bg-primary hover:bg-primary/90"
                      >
                        {isPending ? (
                          <div className="flex items-center">
                            <Loader2 className="mr-1 sm:mr-2 h-4 w-4 animate-spin" />
                            <span className="hidden sm:inline">Loading</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="hidden sm:inline">Summarize</span>
                            <ArrowRight className="h-4 w-4 sm:ml-2" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="mx-auto w-full">
              <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-none">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <h1
                        onClick={() => {
                          setMessages([]);
                          setError(null);
                          setVideoData(null);
                        }}
                        className="font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent pb-2 text-xl sm:text-2xl cursor-pointer hover:opacity-80 transition-opacity text-center sm:text-left"
                      >
                        yttldr
                      </h1>
                    </div>

                    <form
                      action={handleVideoSubmit}
                      className="flex-1 sm:ml-6 max-w-md w-full"
                    >
                      <div className="relative">
                        <Input
                          type="url"
                          name="url"
                          placeholder="Enter new YouTube URL..."
                          required
                          className="w-full h-10 pr-12"
                          disabled={isPending}
                        />
                        <Button
                          type="submit"
                          disabled={isPending}
                          className="absolute right-0 top-0 h-10 px-3 rounded-l-none bg-primary hover:bg-primary/90"
                        >
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ArrowRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <Alert
              variant="destructive"
              className="animate-in fade-in-0 duration-300 max-w-2xl mx-auto w-full"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {videoData && (
            <div className="grid lg:grid-cols-2 gap-4 md:gap-6 w-full mt-[100px] sm:mt-0">
              <Card className="animate-in fade-in-0 duration-300">
                <CardHeader className="bg-muted/50">
                  <span className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-primary" />{" "}
                    <h2 className="font-semibold text-base sm:text-lg line-clamp-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      {videoData.title}
                    </h2>
                  </span>
                  <a
                    href={videoData.authorUrl}
                    rel="noreferrer"
                    target="_blank"
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mt-2 group"
                  >
                    {videoData.authorName}
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video bg-black">
                    <iframe
                      title="YouTube video player"
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoData.videoId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-in fade-in-0 duration-300">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Summary
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Get an AI-generated summary, then ask follow-up questions to
                    learn more.
                  </p>
                </CardHeader>
                <CardContent className="relative">
                  <div
                    className={`flex flex-col space-y-4 h-[300px] sm:h-[400px] ${
                      !isLoading ? "overflow-y-auto" : "overflow-hidden"
                    } mb-16 px-1`}
                  >
                    {messages.slice(1).map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${
                          m.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[90%] sm:max-w-[85%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-sm whitespace-pre-wrap ${
                            m.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <form
                    onSubmit={handleChatSubmit}
                    className="absolute bottom-4 left-4 right-4"
                  >
                    <div className="relative">
                      <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask a question..."
                        className="w-full pr-20 sm:pr-24 h-10 sm:h-12 text-sm"
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        className="absolute right-0 top-0 h-10 sm:h-12 px-4 sm:px-6 rounded-l-none bg-primary hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <div className="flex items-center">
                            <span className="hidden sm:inline">Send</span>
                            <ArrowRight className="h-4 w-4 sm:ml-2" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          <footer className="text-center text-xs sm:text-sm text-muted-foreground mt-4">
            <p>Made in 1 day with AI 😃</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
