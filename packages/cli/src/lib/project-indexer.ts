import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, basename } from "node:path";

const MAX_FILES = 500;
const MAX_DEPTH = 8;

const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".ico",
  ".woff", ".woff2", ".ttf", ".eot",
  ".zip", ".gz", ".tar", ".rar", ".7z",
  ".mp3", ".mp4", ".wav", ".ogg",
  ".pdf", ".doc", ".docx", ".xls", ".xlsx",
  ".exe", ".dll", ".so", ".dylib", ".wasm",
  ".svg",
]);

const KEY_CONFIG_FILES = new Set([
  "package.json", "tsconfig.json", "tsconfig.base.json",
  "prismcode.json", ".env.example", "Dockerfile",
  "docker-compose.yml", "docker-compose.yaml",
  ".eslintrc", ".eslintrc.json", ".eslintrc.js",
  ".prettierrc", ".prettierrc.json", ".prettierrc.js",
  "bun.lock", "pnpm-lock.yaml", "yarn.lock", "package-lock.json",
  "turbo.json", "nx.json", "lerna.json",
  "README.md", "CONTRIBUTING.md",
]);

type FileEntry = {
  path: string;
  size: number;
  isDir: boolean;
};

type ConfigFile = {
  path: string;
  content: string;
};

export type ProjectIndex = {
  root: string;
  files: FileEntry[];
  totalFiles: number;
  totalDirs: number;
  configFiles: ConfigFile[];
  languages: Record<string, number>;
  tree: string;
  generatedAt: number;
};

function getLanguage(ext: string): string {
  const map: Record<string, string> = {
    ".ts": "TypeScript", ".tsx": "TypeScript React", ".js": "JavaScript",
    ".jsx": "JavaScript React", ".json": "JSON", ".md": "Markdown",
    ".css": "CSS", ".scss": "SCSS", ".html": "HTML", ".py": "Python",
    ".rs": "Rust", ".go": "Go", ".java": "Java", ".rb": "Ruby",
    ".php": "PHP", ".c": "C", ".cpp": "C++", ".h": "C Header",
    ".yaml": "YAML", ".yml": "YAML", ".toml": "TOML", ".xml": "XML",
    ".sh": "Shell", ".bash": "Shell", ".ps1": "PowerShell",
    ".sql": "SQL", ".graphql": "GraphQL", ".proto": "Protobuf",
    ".svelte": "Svelte", ".vue": "Vue", ".astro": "Astro",
  };
  return map[ext] ?? "";
}

function isIgnored(name: string, ignorePatterns: string[]): boolean {
  return ignorePatterns.some((p) => {
    if (p.endsWith("/")) return name === p.slice(0, -1);
    return name === p || name.startsWith(p + "/") || name.endsWith("/" + p);
  });
}

async function scanDir(
  dir: string,
  relativeDir: string,
  ignorePatterns: string[],
  depth: number,
  files: FileEntry[],
  configFiles: ConfigFile[],
  languages: Record<string, number>,
): Promise<void> {
  if (depth > MAX_DEPTH || files.length > MAX_FILES) return;

  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return;
  }

  for (const name of entries) {
    if (name.startsWith(".")) continue;
    const fullPath = join(dir, name);
    const relPath = relativeDir ? `${relativeDir}/${name}` : name;

    if (isIgnored(name, ignorePatterns) || isIgnored(relPath, ignorePatterns)) continue;

    let stats;
    try {
      stats = await stat(fullPath);
    } catch {
      continue;
    }

    if (stats.isDirectory()) {
      const isWorkspace = name.startsWith("packages") || name === "src" || name === "apps" || name === "lib";
      files.push({ path: relPath + "/", size: 0, isDir: true });
      await scanDir(fullPath, relPath, ignorePatterns, isWorkspace ? depth : depth + 1, files, configFiles, languages);
    } else if (stats.isFile()) {
      files.push({ path: relPath, size: stats.size, isDir: false });

      const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
      if (ext && !BINARY_EXTENSIONS.has(ext)) {
        const lang = getLanguage(ext);
        if (lang) languages[lang] = (languages[lang] ?? 0) + 1;
      }

      if (KEY_CONFIG_FILES.has(name)) {
        try {
          const content = await readFile(fullPath, "utf-8");
          configFiles.push({ path: relPath, content: content.slice(0, 2000) });
        } catch {}
      }
    }
  }
}

function buildTree(files: FileEntry[]): string {
  const lines: string[] = [];
  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));

  for (const f of sorted) {
    const depth = f.path.split("/").length - 1;
    const prefix = "  ".repeat(depth) + (f.isDir ? "📁 " : "📄 ");
    const size = f.isDir ? "" : ` (${formatSize(f.size)})`;
    lines.push(prefix + f.path + size);
  }

  return lines.join("\n");
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export async function buildProjectIndex(cwd: string, ignorePatterns: string[] = []): Promise<ProjectIndex> {
  const defaults = ["node_modules", ".git", "dist", "build", ".next", ".cache", ".turbo", "coverage"];
  const allIgnore = [...new Set([...defaults, ...ignorePatterns])];

  const files: FileEntry[] = [];
  const configFiles: ConfigFile[] = [];
  const languages: Record<string, number> = {};

  await scanDir(cwd, "", allIgnore, 0, files, configFiles, languages);

  const totalFiles = files.filter((f) => !f.isDir).length;
  const totalDirs = files.filter((f) => f.isDir).length;

  return {
    root: cwd,
    files,
    totalFiles,
    totalDirs,
    configFiles,
    languages,
    tree: buildTree(files),
    generatedAt: Date.now(),
  };
}

function formatIndexSummary(index: ProjectIndex): string {
  const langSummary = Object.entries(index.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([lang, count]) => `${lang} (${count} files)`)
    .join(", ");

  const parts: string[] = [
    `## Project Index\n`,
    `Root: \`${index.root}\``,
    `Total: ${index.totalFiles} files, ${index.totalDirs} directories`,
    langSummary ? `Languages: ${langSummary}` : "",
    ``,
    `### File Tree`,
    "```",
    index.tree,
    "```",
  ];

  if (index.configFiles.length > 0) {
    parts.push(``, `### Key Configuration Files`);
    for (const cf of index.configFiles) {
      parts.push(``, `**${cf.path}**:`, "```", cf.content, "```");
    }
  }

  return parts.filter(Boolean).join("\n");
}

export function buildProjectContext(index: ProjectIndex): string {
  return `You are working in the project at \`${index.root}\`. Below is the project structure and configuration to help you understand the codebase without the user needing to explain it.\n\n${formatIndexSummary(index)}`;
}

let cachedIndex: { index: ProjectIndex; cwd: string; mtime: number } | null = null;

export async function getProjectIndex(cwd: string, ignorePatterns: string[] = [], forceRefresh = false): Promise<ProjectIndex> {
  if (!forceRefresh && cachedIndex && cachedIndex.cwd === cwd && Date.now() - cachedIndex.mtime < 30000) {
    return cachedIndex.index;
  }
  const index = await buildProjectIndex(cwd, ignorePatterns);
  cachedIndex = { index, cwd, mtime: Date.now() };
  return index;
}
