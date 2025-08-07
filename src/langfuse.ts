import { LangfuseClient } from "@langfuse/client";
import { configureGlobalLogger } from "@langfuse/core";
import { LangfuseSpanProcessor, ShouldExportSpan } from "@langfuse/otel";

configureGlobalLogger({ level: 0 });

const shouldExportSpan: ShouldExportSpan = ({ otelSpan }) =>
  otelSpan.instrumentationScope.name !== "next.js";

export const langfuseSpanProcessor = new LangfuseSpanProcessor({
  shouldExportSpan,
});

export const langfuseClient = new LangfuseClient();
