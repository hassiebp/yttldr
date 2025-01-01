"use client";

import { useState } from "react";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { summarizeVideo } from "./actions";
import { isValidYouTubeUrl } from "@/utils/youtube";
import { SettingsMenu } from "@/components/SettingsMenu";

type SummaryLength = "brief" | "balanced" | "thorough";

export default function Home() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("balanced");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    setSummary(null);

    const url = formData.get("url") as string;

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      setIsPending(false);
      return;
    }

    formData.append("summaryLength", summaryLength);
    const result = await summarizeVideo(formData);

    if ("error" in result) {
      setError(result.error ?? null);
    } else {
      setSummary(result.summary);
      setVideoId(result.videoId);
    }

    setIsPending(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <main className="container max-w-3xl mx-auto p-4 py-16 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">yttldr</h1>
          <p className="text-muted-foreground text-center text-lg">
            Get instant AI-powered summaries of any YouTube video
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl">Enter YouTube URL</CardTitle>
              <CardDescription>
                Paste the URL of the video you want to summarize
              </CardDescription>
            </div>
            <SettingsMenu onLengthChange={setSummaryLength} />
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="flex gap-2">
              <Input
                type="url"
                name="url"
                placeholder="https://www.youtube.com/watch?v=..."
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isPending} size="lg">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing
                  </>
                ) : (
                  <>
                    Summarize
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert
            variant="destructive"
            className="animate-in fade-in slide-in-from-top-2"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {summary && videoId && (
          <Card className="animate-in fade-in slide-in-from-bottom-2 border-2 overflow-hidden">
            <CardHeader className="bg-muted">
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle2 className="text-green-500" />
                Video Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-b"
                />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Key Points</h3>
                <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
                  {summary.split("\n").map((point, index) => (
                    <div key={index} className="flex items-start gap-2 mb-2">
                      <div className="mt-1 bg-primary/10 text-primary text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full flex items-center justify-center h-5 w-5">
                        {index + 1}
                      </div>
                      <p className="leading-relaxed text-muted-foreground flex-1">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <footer className="text-center text-sm text-muted-foreground"></footer>
      </main>
    </div>
  );
}
