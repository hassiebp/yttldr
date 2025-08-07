import { NodeSDK } from "@opentelemetry/sdk-node";
import { configureGlobalLogger } from "@langfuse/core";
import { LangfuseSpanProcessor, ShouldExportSpan } from "@langfuse/otel";

configureGlobalLogger({ level: 0 });

const shouldExportSpan: ShouldExportSpan = ({ otelSpan }) =>
  otelSpan.instrumentationScope.name !== "next.js";

const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor({ shouldExportSpan })],
});

sdk.start();
