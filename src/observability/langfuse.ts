import { Langfuse } from "langfuse";
import { LangfuseExporter } from "langfuse-vercel";

export const langfuseClient = new Langfuse();
export const langfuseExporter = new LangfuseExporter();
