"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

import { useChat } from "ai/react";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Loader2,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    handleInputChange: handleChatInputChange,
    handleSubmit: handleChatSubmit,
    setMessages,
    append,
    isLoading,
  } = useChat();
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [videoData, setVideoData] = React.useState<GetVideoDataResponse | null>(
    null,
  );

  // Auto scroll chat box when streaming
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const chatContainer = messagesEndRef.current?.parentElement;
    if (!chatContainer) return;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  async function handleVideoSubmit(formData: FormData) {
    try {
      setIsPending(true);
      setError(null);
      setMessages([]);

      const url = formData.get("url") as string;

      if (!isValidYouTubeUrl(url))
        throw new Error("Please enter a valid YouTube URL");

      const fetchResult = await fetch(`/api/video?url=${url}`);

      if (!fetchResult.ok) {
        const body = await fetchResult.json();
        const errorMessage =
          "error" in body
            ? body.error
            : "Failed to process video. Please try another.";

        throw new Error(errorMessage);
      }

      const result = (await fetchResult.json()) as GetVideoDataResponse;
      setVideoData(result);

      const message = {
        ...result.summaryUserMessage,
        id: crypto.randomUUID(),
      };

      // Trigger the summary generation
      append(message);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col gap-4 md:gap-4 max-w-7xl mx-auto">
          {!videoData ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
              <div
                className="flex items-center justify-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  setMessages([]);
                  setError(null);
                  setVideoData(null);
                }}
              >
                <Image
                  src="/yttldr-logo.webp"
                  alt="yttldr logo"
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded"
                />
                <h1 className="font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent pb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center">
                  yttldr
                </h1>
              </div>
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
                        className="w-full pr-24 sm:pr-32 h-12 text-sm sm:text-base [font-size:16px]"
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
                <div className="container mx-auto px-4 py-2 sm:py-4">
                  <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setMessages([]);
                        setError(null);
                        setVideoData(null);
                      }}
                    >
                      <Image
                        src="/yttldr-logo.webp"
                        alt="yttldr logo"
                        width={64}
                        height={64}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded"
                      />
                      <h1 className="font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent pb-1 text-xl sm:text-2xl">
                        yttldr
                      </h1>
                    </div>

                    <form
                      action={handleVideoSubmit}
                      className="flex-1 max-w-md w-full"
                    >
                      <div className="relative">
                        <Input
                          type="url"
                          name="url"
                          placeholder="Enter new YouTube URL..."
                          required
                          className="w-full h-10 pr-12 [font-size:16px]"
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
            <div className="grid lg:grid-cols-2 gap-2 sm:gap-4 md:gap-6 w-full h-[calc(100vh-7rem)] sm:h-[calc(100vh-14rem)] mt-[2rem] sm:mt-0">
              <Card className="animate-in fade-in-0 duration-300">
                <CardHeader className="bg-muted/50 px-4 py-2 sm:px-6 sm:py-4 flex flex-col justify-center h-full sm:h-auto">
                  <span className="flex items-center gap-1 sm:gap-2">
                    <Youtube className="h-4 w-4 sm:h-8 sm:w-8 text-primary" />{" "}
                    <Link
                      href={`https://www.youtube.com/watch?v=${videoData.videoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-md line-clamp-2  sm:text-lg overflow-hidden text-ellipsis w-[calc(100vw-6rem)] whitespace-nowrap bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                    >
                      {videoData.title}
                    </Link>
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
                <CardContent className="p-0 hidden sm:block">
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

              <Card className="animate-in fade-in-0 duration-300 h-[calc(100vh-14rem)]">
                <CardHeader className="px-4 py-2 pt-4 sm:px-6 sm:py-4">
                  <CardTitle className="text-base sm:text-lg">
                    Summary
                  </CardTitle>
                  <p className="text-xs text-sm text-muted-foreground">
                    Ask follow-up questions to learn more.
                  </p>
                </CardHeader>
                <CardContent className="relative h-[calc(100%-5rem)] px-4 py-2 sm:px-6 sm:py-4">
                  <div
                    className={`flex flex-col space-y-4 h-[calc(100%-4rem)] ${
                      !isLoading ? "overflow-y-auto" : "overflow-hidden"
                    } px-1`}
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
                    className="absolute bottom-2 sm:bottom-8 left-4 right-4"
                  >
                    <div className="relative">
                      <Input
                        value={input}
                        onChange={handleChatInputChange}
                        placeholder="Ask a question..."
                        className="w-full pr-20 sm:pr-24 h-10 sm:h-12 text-sm [font-size:16px]"
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

          <footer className="text-center text-xs sm:text-sm text-muted-foreground mt-0 sm:mt-4">
            <p className="flex items-center justify-center gap-1">
              Made in ~1 day with AI 🤖 —
              <a
                href="https://github.com/hassiebp/yttldr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Github className="h-3 w-3" />
                Check out the source code on Github
              </a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
