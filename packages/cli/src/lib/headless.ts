import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { loadConfig, getByokKey } from "@prismcode543/shared";
import { getAuth } from "./auth";

type Provider = "anthropic" | "openai" | "google" | "groq" | "openrouter" | "ollama";

function resolveLocalModel(provider: Provider, modelId: string) {
  switch (provider) {
    case "anthropic": {
      const byokKey = getByokKey("anthropic");
      return anthropic(modelId, byokKey ? { apiKey: byokKey } : undefined);
    }
    case "openai": {
      const byokKey = getByokKey("openai");
      if (!byokKey && !process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not configured. Set OPENAI_API_KEY in .env or use prismcode config set openai_api_key <key>");
      }
      return createOpenAI({ apiKey: byokKey })(modelId);
    }
    case "google": {
      const byokKey = getByokKey("google") || process.env.GOOGLE_API_KEY;
      if (!byokKey) {
        throw new Error("Google API key not configured. Set GOOGLE_API_KEY in .env");
      }
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = byokKey;
      return google(modelId, { apiKey: byokKey });
    }
    case "groq": {
      const byokKey = getByokKey("groq") || process.env.GROQ_API_KEY;
      if (!byokKey) {
        throw new Error("Groq API key not configured. Set GROQ_API_KEY in .env");
      }
      process.env.OPENAI_API_KEY = byokKey;
      return createOpenAI({ baseURL: "https://api.groq.com/openai/v1", apiKey: byokKey })("llama-3.3-70b-versatile");
    }
    case "openrouter": {
      const byokKey = getByokKey("openrouter") || process.env.OPENROUTER_API_KEY;
      if (!byokKey) {
        throw new Error("OpenRouter API key not configured. Set OPENROUTER_API_KEY in .env");
      }
      process.env.OPENAI_API_KEY = byokKey;
      return createOpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey: byokKey })(modelId);
    }
    case "ollama": {
      const config = loadConfig();
      const baseUrl = config.ollama?.baseUrl ?? process.env.OLLAMA_URL ?? "http://localhost:11434";
      const modelName = config.ollama?.defaultModel ?? "codellama";
      return createOpenAI({ baseURL: `${baseUrl}/v1` })(modelName);
    }
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

function getDefaultModel(): { provider: Provider; modelId: string } {
  const config = loadConfig();
  if (config.defaultModel) {
    const modelId = config.defaultModel;
    if (modelId.startsWith("claude")) return { provider: "anthropic", modelId };
    if (modelId.startsWith("gpt")) return { provider: "openai", modelId };
    if (modelId.startsWith("gemini")) return { provider: "google", modelId };
    if (modelId.startsWith("groq")) return { provider: "groq", modelId };
    if (modelId.startsWith("openrouter")) return { provider: "openrouter", modelId };
    if (modelId === "ollama") return { provider: "ollama", modelId };
  }

  const providers: { provider: Provider; modelId: string }[] = [
    { provider: "groq", modelId: "groq-llama-3.3-70b" },
    { provider: "openrouter", modelId: "openrouter-auto" },
    { provider: "google", modelId: "gemini-2.5-flash" },
    { provider: "openai", modelId: "gpt-5.4-mini" },
    { provider: "anthropic", modelId: "claude-sonnet-4-6" },
    { provider: "ollama", modelId: "ollama" },
  ];

  for (const p of providers) {
    if (hasLocalKey(p.provider)) return p;
  }

  return { provider: "anthropic", modelId: "claude-sonnet-4-6" };
}

function hasLocalKey(provider: Provider): boolean {
  const byok = getByokKey(provider);
  if (byok) return true;
  switch (provider) {
    case "groq": return !!process.env.GROQ_API_KEY;
    case "openrouter": return !!process.env.OPENROUTER_API_KEY;
    case "ollama": return true;
    case "google": return !!process.env.GOOGLE_API_KEY;
    default: return !!process.env[`${provider.toUpperCase()}_API_KEY`];
  }
}

export async function runHeadless(prompt: string) {
  const auth = getAuth();

  // Try server mode first (if authenticated and server is running)
  if (auth) {
    try {
      const apiUrl = process.env.API_URL ?? "http://localhost:3000";
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          messages: [{ id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: prompt }] }],
          mode: "plan",
          model: "claude-sonnet-4-6",
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            process.stdout.write(decoder.decode(value));
          }
          process.stdout.write("\n");
          return;
        }
      }
    } catch {
      // Server unavailable, fall through to local mode
    }
  }

  // Local mode (offline, BYOK)
  const { provider, modelId } = getDefaultModel();

  if (!hasLocalKey(provider)) {
    console.error(`No API key found for ${provider}. Configure one via:\n  prismcode config set ${provider}_api_key <key>`);
    process.exit(1);
  }

  try {
    const model = resolveLocalModel(provider, modelId);
    const result = streamText({ model, system: "You are PrismCode, a terminal AI coding assistant. Answer concisely and accurately.", messages: [{ role: "user", content: prompt }] });

    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }
    process.stdout.write("\n");
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
