import { createMCPClient, type MCPClient } from "@ai-sdk/mcp";
import { Experimental_StdioMCPTransport } from "@ai-sdk/mcp/mcp-stdio";
import type { PrismCodeConfig } from "@prismcode543/shared";

export type McpToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

export class McpManager {
  private servers: Map<string, { client: MCPClient; executeTool: (name: string, args: unknown) => Promise<unknown>; definitions: McpToolDefinition[] }> = new Map();

  async init(config: PrismCodeConfig): Promise<void> {
    const serverConfigs = config.mcpServers ?? [];
    for (const cfg of serverConfigs) {
      try {
        const transport = new Experimental_StdioMCPTransport({
          command: cfg.command,
          args: cfg.args ?? [],
          env: cfg.env as Record<string, string> | undefined,
        });
        const client = await createMCPClient({ transport });
        const toolSet = (await client.tools()) as Record<string, any>;
        const definitions: McpToolDefinition[] = [];
        const toolMap = new Map<string, (args: unknown) => Promise<unknown>>();

        for (const [name, tool] of Object.entries(toolSet)) {
          definitions.push({
            name,
            description: tool.description ?? "",
            inputSchema: tool.parameters ?? tool.inputSchema ?? {},
          });
          if (typeof tool.execute === "function") {
            toolMap.set(name, (args: unknown) => tool.execute(args, { toolCallId: "", messages: [] }));
          }
        }

        this.servers.set(cfg.name, {
          client,
          executeTool: async (name: string, args: unknown) => {
            const fn = toolMap.get(name);
            if (!fn) throw new Error(`MCP tool "${name}" not found in server "${cfg.name}"`);
            return fn(args);
          },
          definitions,
        });
      } catch (err) {
        console.error(`Failed to connect MCP server "${cfg.name}":`, err);
      }
    }
  }

  getDefinitions(): McpToolDefinition[] {
    const all: McpToolDefinition[] = [];
    for (const entry of this.servers.values()) {
      all.push(...entry.definitions);
    }
    return all;
  }

  isMcpTool(name: string): boolean {
    for (const entry of this.servers.values()) {
      if (entry.definitions.some((d) => d.name === name)) return true;
    }
    return false;
  }

  async executeTool(name: string, args: unknown): Promise<unknown> {
    for (const entry of this.servers.values()) {
      try {
        return await entry.executeTool(name, args);
      } catch {}
    }
    throw new Error(`MCP tool "${name}" not found in any connected server`);
  }

  async close(): Promise<void> {
    for (const entry of this.servers.values()) {
      try { await entry.client.close(); } catch {}
    }
    this.servers.clear();
  }
}
