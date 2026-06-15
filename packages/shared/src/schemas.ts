import { z } from "zod";
import { tool } from "ai";

export const Mode = {
  BUILD: "BUILD",
  PLAN: "PLAN",
} as const;

export const modeSchema = z.enum([Mode.BUILD, Mode.PLAN]);

export type ModeType = (typeof Mode)[keyof typeof Mode];

export const toolInputSchemas = {
  readFile: z.object({
    path: z.string().describe("Relative path to the file to read"),
  }),
  listDirectory: z.object({
    path: z.string().default(".").describe("Relative directory path to list"),
  }),
  glob: z.object({
    pattern: z.string().describe("Glob pattern to match files"),
    path: z.string().default(".").describe("Directory to search from"),
  }),
  grep: z.object({
    pattern: z.string().describe("Regex pattern to search for"),
    path: z.string().default(".").describe("Directory to search from"),
    include: z.string().optional().describe("Optional glob for files to include"),
  }),
  writeFile: z.object({
    path: z.string().describe("Relative path to write"),
    content: z.string().describe("File contents"),
  }),
  editFile: z.object({
    path: z.string().describe("Relative path to edit"),
    oldString: z.string().describe("Exact text to replace; must be unique"),
    newString: z.string().describe("Replacement text"),
  }),
  bash: z.object({
    command: z.string().describe("Shell command to run"),
    description: z.string().optional().describe("Short description of the command"),
    timeout: z.number().optional().describe("Timeout in milliseconds"),
  }),
  webSearch: z.object({
    query: z.string().describe("Web search query"),
    numResults: z.number().default(5).describe("Number of search results to return (max 10)"),
  }),
  gitStatus: z.object({}).describe("Show the working tree status"),
  gitLog: z.object({
    maxCount: z.number().default(10).describe("Maximum number of commits to show"),
  }),
  gitDiff: z.object({
    path: z.string().optional().describe("Optional file path to show diff for"),
    staged: z.boolean().default(false).describe("Show staged changes instead of unstaged"),
  }),
  gitCommit: z.object({
    message: z.string().describe("Commit message"),
    addAll: z.boolean().default(false).describe("Stage all changes before committing"),
  }),
} as const;

export const readOnlyToolContracts = {
  readFile: tool({
    description: "Read a file from the current project directory.",
    inputSchema: toolInputSchemas.readFile,
  }),
  listDirectory: tool({
    description: "List entries in a directory under the current project directory.",
    inputSchema: toolInputSchemas.listDirectory,
  }),
  glob: tool({
    description: "Find files matching a glob pattern under the current project directory.",
    inputSchema: toolInputSchemas.glob,
  }),
  grep: tool({
    description:
      "Search file contents with a regular expression under the current project directory.",
    inputSchema: toolInputSchemas.grep,
  }),
  webSearch: tool({
    description: "Search the web for current information. Use this when you need up-to-date data, documentation, or answers to questions outside the local codebase.",
    inputSchema: toolInputSchemas.webSearch,
  }),
  gitStatus: tool({
    description: "Show the working tree status using git status --short.",
    inputSchema: toolInputSchemas.gitStatus,
  }),
  gitLog: tool({
    description: "Show recent commit history using git log --oneline.",
    inputSchema: toolInputSchemas.gitLog,
  }),
  gitDiff: tool({
    description: "Show changes in the working tree or staged changes using git diff.",
    inputSchema: toolInputSchemas.gitDiff,
  }),
} as const;

export const buildToolContracts = {
  ...readOnlyToolContracts,
  writeFile: tool({
    description: "Create or overwrite a file under the current project directory.",
    inputSchema: toolInputSchemas.writeFile,
  }),
  editFile: tool({
    description: "Replace exact text in a file under the current project directory.",
    inputSchema: toolInputSchemas.editFile,
  }),
  bash: tool({
    description: "Run a shell command in the current project directory.",
    inputSchema: toolInputSchemas.bash,
  }),
  webSearch: tool({
    description: "Search the web for current information. Use this when you need up-to-date data, documentation, or answers to questions outside the local codebase.",
    inputSchema: toolInputSchemas.webSearch,
  }),
  gitCommit: tool({
    description: "Stage and commit changes to the git repository.",
    inputSchema: toolInputSchemas.gitCommit,
  }),
} as const;

export type ToolContracts = typeof buildToolContracts;

export function getToolContracts(mode: ModeType) {
  return mode === Mode.PLAN 
    ? readOnlyToolContracts 
    : buildToolContracts;
};
