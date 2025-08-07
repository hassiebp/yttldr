import { NodeSDK } from "@opentelemetry/sdk-node";
import { langfuseSpanProcessor } from "./langfuse";

const sdk = new NodeSDK({
  spanProcessors: [langfuseSpanProcessor],
});

sdk.start();
