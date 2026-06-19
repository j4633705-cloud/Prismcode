import type { SkillManifest, SkillTool } from "./manifest";

export type SkillID = string;
export type SkillVersion = string;

export type SkillDefinition = {
  manifest: SkillManifest;
  instructions: string;
  templates: Map<string, string>;
  installPath: string;
};

export type SkillToolHandler = {
  tool: SkillTool;
  execute: (input: unknown) => Promise<unknown>;
};

export type SkillRuntime = {
  skills: SkillDefinition[];
  getActiveSkills(): SkillDefinition[];
  getCombinedInstructions(): string;
  getToolHandlers(): SkillToolHandler[];
  getTriggers(): Map<SkillID, string[]>;
};

export type SkillRegistryEntry = {
  name: string;
  version: string;
  displayName: string;
  description: string;
  author?: string;
  homepage?: string;
  icon?: string;
  downloads?: number;
  rating?: number;
  tags?: string[];
};

export type SkillRegistryResponse = {
  skills: SkillRegistryEntry[];
  total: number;
  page: number;
};

export const SKILL_DIR_NAME = "skills";
export const SKILL_MANIFEST_FILE = "skill.json";
export const SKILL_INSTRUCTIONS_FILE = "instructions.md";
export const SKILL_TOOLS_DIR = "tools";
export const SKILL_TEMPLATES_DIR = "templates";
export const SKILL_ENABLED_FILE = ".enabled";
