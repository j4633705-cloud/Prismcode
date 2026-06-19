import { homedir } from "node:os";
import { join } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { logger } from "./logger";

export type McpServer = {
  name: string;
  url: string;
};

export type McpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

function getServersPath(): string {
  return join(homedir(), ".prismcode", "mcp-servers.json");
}

function loadMcpServers(): McpServer[] {
  try {
    const path = getServersPath();
    if (!existsSync(path)) return [];
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw) as McpServer[];
  } catch {
    return [];
  }
}

export function getMcpServers(): McpServer[] {
  return loadMcpServers();
}

export async function fetchMcpTools(server: McpServer): Promise<McpTool[]> {
  try {
    const response = await fetch(server.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {},
      }),
    });
    if (!response.ok) {
      logger.warn(`MCP server ${server.name} returned ${response.status}`);
      return [];
    }
    const data = (await response.json()) as { result?: { tools?: McpTool[] } };
    return data.result?.tools ?? [];
  } catch (error) {
    logger.warn(`Failed to fetch tools from MCP server ${server.name}:`, error);
    return [];
  }
}

export async function callMcpTool(
  server: McpServer,
  toolName: string,
  input: Record<string, unknown>,
): Promise<unknown> {
  const response = await fetch(server.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: input,
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`MCP call failed: ${response.statusText}`);
  }
  const data = (await response.json()) as { result?: unknown; error?: { message: string } };
  if (data.error) throw new Error(`MCP error: ${data.error.message}`);
  return data.result;
}
