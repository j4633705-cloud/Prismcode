import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { Mode } from "./schemas";

export const prismCodeConfigSchema = z.object({
  model: z.string().optional().describe("Default AI model ID"),
  mode: z.enum([Mode.BUILD, Mode.PLAN]).optional().describe("Default mode"),
  maxSteps: z.number().min(1).max(50).optional().default(10).describe("Max autonomous agent steps"),
  toolConfirmation: z.boolean().optional().default(true).describe("Require confirmation for destructive tools"),
  costEstimation: z.boolean().optional().default(true).describe("Show cost estimation before execution"),
  timeout: z.object({
    bash: z.number().optional().default(30000),
    readFile: z.number().optional().default(10000),
  }).optional(),
  systemPrompt: z.string().optional().describe("Custom system prompt override"),
  providers: z.object({
    anthropic: z.object({ apiKey: z.string().optional() }).optional(),
    openai: z.object({ apiKey: z.string().optional() }).optional(),
    google: z.object({ apiKey: z.string().optional() }).optional(),
    groq: z.object({ apiKey: z.string().optional() }).optional(),
    openrouter: z.object({ apiKey: z.string().optional() }).optional(),
    opencode: z.object({ apiKey: z.string().optional() }).optional(),
  }).optional(),
  mcpServers: z.array(z.object({
    name: z.string(),
    command: z.string(),
    args: z.array(z.string()).optional(),
    env: z.record(z.string(), z.string()).optional(),
  })).optional(),
  ignore: z.array(z.string()).optional().default(["node_modules", ".git", "dist", "build", ".next"]),
});

export type PrismCodeConfig = z.infer<typeof prismCodeConfigSchema>;

export const DEFAULT_CONFIG: PrismCodeConfig = {
  maxSteps: 10,
  toolConfirmation: true,
  costEstimation: true,
  timeout: {
    bash: 30000,
    readFile: 10000,
  },
  ignore: ["node_modules", ".git", "dist", "build", ".next", ".cache"],
};

export function loadConfig(cwd: string): PrismCodeConfig {
  try {
    const path = join(cwd, "prismcode.json");
    const content = readFileSync(path, "utf-8");
    const parsed = JSON.parse(content);
    const result = prismCodeConfigSchema.safeParse(parsed);
    if (result.success) {
      return { ...DEFAULT_CONFIG, ...result.data };
    }
    console.warn("prismcode.json has invalid config, using defaults:", result.error.message);
    return { ...DEFAULT_CONFIG };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
