import { registerOTel } from "@vercel/otel";

export async function register() {
  const { langfuseExporter } = await import("@/observability/langfuse");

  registerOTel({
    serviceName: "yttldr",
    traceExporter: langfuseExporter,
  });
}
