import { z } from "zod";

export const skillToolSchema = z.object({
  name: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/),
  description: z.string().min(1),
  inputSchema: z.record(z.string(), z.unknown()).optional(),
  implementation: z.string().optional(),
  destructive: z.boolean().optional().default(false),
});

export const skillConstraintSchema = z.object({
  modes: z.array(z.enum(["BUILD", "PLAN"])).optional(),
  models: z.array(z.string()).optional(),
  filePatterns: z.array(z.string()).optional(),
});

export const skillTriggerSchema = z.object({
  files: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  events: z.array(z.enum(["pre-commit", "post-commit", "pre-build", "post-build"])).optional(),
});

export const skillManifestSchema = z.object({
  name: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  displayName: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  author: z.string().optional(),
  license: z.string().optional(),
  homepage: z.string().url().optional(),
  icon: z.string().optional(),

  instructions: z.string().min(1),
  tools: z.array(skillToolSchema).optional().default([]),
  templates: z.array(z.string()).optional().default([]),

  dependencies: z.array(z.string()).optional().default([]),
  constraints: skillConstraintSchema.optional(),
  triggers: skillTriggerSchema.optional(),

  enabled: z.boolean().optional().default(true),
});

export type SkillManifest = z.infer<typeof skillManifestSchema>;
export type SkillTool = z.infer<typeof skillToolSchema>;
export type SkillConstraint = z.infer<typeof skillConstraintSchema>;
export type SkillTrigger = z.infer<typeof skillTriggerSchema>;
