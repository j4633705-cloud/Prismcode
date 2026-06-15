export type ModelPricing = {
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
};

export type SupportedProvider = "anthropic" | "openai" | "groq" | "google" | "openrouter" | "opencode";

type SupportedChatModelDefinition = {
  id: string;
  provider: SupportedProvider;
  pricing: ModelPricing;
};

export const SUPPORTED_CHAT_MODELS = [
  {
    id: "claude-sonnet-4-6",
    provider: "anthropic",
    pricing: {
      inputUsdPerMillionTokens: 3,
      outputUsdPerMillionTokens: 15,
    },
  },
  {
    id: "claude-haiku-4-5",
    provider: "anthropic",
    pricing: {
      inputUsdPerMillionTokens: 1,
      outputUsdPerMillionTokens: 5,
    },
  },
  {
    id: "claude-opus-4-6",
    provider: "anthropic",
    pricing: {
      inputUsdPerMillionTokens: 5,
      outputUsdPerMillionTokens: 25,
    },
  },
  {
    id: "gpt-5.4",
    provider: "openai",
    pricing: {
      inputUsdPerMillionTokens: 2.5,
      outputUsdPerMillionTokens: 15,
    },
  },
  {
    id: "gpt-5.4-mini",
    provider: "openai",
    pricing: {
      inputUsdPerMillionTokens: 0.75,
      outputUsdPerMillionTokens: 4.5,
    },
  },
  {
    id: "gpt-5.4-nano",
    provider: "openai",
    pricing: {
      inputUsdPerMillionTokens: 0.2,
      outputUsdPerMillionTokens: 1.25,
    },
  },
  {
    id: "llama-3.3-70b-versatile",
    provider: "groq",
    pricing: {
      inputUsdPerMillionTokens: 0.59,
      outputUsdPerMillionTokens: 0.79,
    },
  },
  {
    id: "llama-3.1-8b-instant",
    provider: "groq",
    pricing: {
      inputUsdPerMillionTokens: 0.05,
      outputUsdPerMillionTokens: 0.08,
    },
  },
  {
    id: "mixtral-8x7b-32768",
    provider: "groq",
    pricing: {
      inputUsdPerMillionTokens: 0.24,
      outputUsdPerMillionTokens: 0.24,
    },
  },
  {
    id: "gemini-2.5-flash",
    provider: "google",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    id: "gemini-2.5-flash-lite",
    provider: "google",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    id: "gemini-2.5-pro",
    provider: "google",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    id: "anthropic/claude-sonnet-4-6",
    provider: "openrouter",
    pricing: {
      inputUsdPerMillionTokens: 3,
      outputUsdPerMillionTokens: 15,
    },
  },
  {
    id: "anthropic/claude-haiku-4-5",
    provider: "openrouter",
    pricing: {
      inputUsdPerMillionTokens: 1,
      outputUsdPerMillionTokens: 5,
    },
  },
  {
    id: "anthropic/claude-opus-4-6",
    provider: "openrouter",
    pricing: {
      inputUsdPerMillionTokens: 5,
      outputUsdPerMillionTokens: 25,
    },
  },
  {
    id: "big-pickle",
    provider: "opencode",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    id: "deepseek-v4-flash-free",
    provider: "opencode",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    id: "mimo-v2.5-free",
    provider: "opencode",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    id: "qwen3.6-plus-free",
    provider: "opencode",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    id: "minimax-m3-free",
    provider: "opencode",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    id: "nemotron-3-ultra-free",
    provider: "opencode",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    id: "north-mini-code-free",
    provider: "opencode",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
] as const satisfies readonly SupportedChatModelDefinition[];

export type SupportedChatModel = (typeof SUPPORTED_CHAT_MODELS)[number];
export type SupportedChatModelId = SupportedChatModel["id"];

export function findSupportedChatModel(modelId: string) {
  return SUPPORTED_CHAT_MODELS.find((model) => model.id === modelId);
}

export const DEFAULT_CHAT_MODEL_ID: SupportedChatModelId = "gemini-2.5-flash";
