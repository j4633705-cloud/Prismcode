import { anthropic } from "@ai-sdk/anthropic";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  findSupportedChatModel,
  type SupportedChatModel,
  type SupportedChatModelId,
  type SupportedProvider,
} from "@prismcode/shared";
import type { ProviderOptions } from "@ai-sdk/provider-utils";
import type { LanguageModel } from "ai";

type AnthropicModelId = Extract<SupportedChatModel, { provider: "anthropic" }>["id"];
type OpenAIModelId = Extract<SupportedChatModel, { provider: "openai" }>["id"];
type GroqModelId = Extract<SupportedChatModel, { provider: "groq" }>["id"];
type GoogleModelId = Extract<SupportedChatModel, { provider: "google" }>["id"];
type OpenRouterModelId = Extract<SupportedChatModel, { provider: "openrouter" }>["id"];
type OpenCodeModelId = Extract<SupportedChatModel, { provider: "opencode" }>["id"];

export type ResolvedModel = {
  model: LanguageModel;
  provider: SupportedProvider;
  modelId: SupportedChatModelId;
  providerOptions?: ProviderOptions;
};

const ANTHROPIC_PROVIDER_OPTIONS: Partial<Record<AnthropicModelId, ProviderOptions>> = {
  "claude-opus-4-6": {
    anthropic: {
      thinking: {
        type: "enabled",
        budgetTokens: 10000,
      }
    },
  },
  "claude-sonnet-4-6": {
    anthropic: {
      thinking: {
        type: "enabled",
        budgetTokens: 10000,
      },
    },
  },
};

const OPENAI_PROVIDER_OPTIONS: Partial<Record<OpenAIModelId, ProviderOptions>> = {
  "gpt-5.4": {
    openai: {
      thinking: {
        reasoningSummary: "detailed",
      }
    },
  },
};

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  name: "openrouter",
});

const opencode = createOpenAICompatible({
  baseURL: "https://opencode.ai/zen/v1",
  name: "opencode",
  apiKey: process.env.OPENCODE_API_KEY,
});

function assertUnsupportedProvider(provider: never): never {
  throw new Error(`Unsupported provider: ${provider}`);
};

function resolveAnthropicModel(modelId: AnthropicModelId): ResolvedModel {
  return {
    model: anthropic(modelId),
    provider: "anthropic",
    modelId,
    providerOptions: ANTHROPIC_PROVIDER_OPTIONS[modelId],
  };
};

function resolveOpenAIModel(modelId: OpenAIModelId): ResolvedModel {
  return {
    model: openai(modelId),
    provider: "openai",
    modelId,
    providerOptions: OPENAI_PROVIDER_OPTIONS[modelId],
  };
};

function resolveGroqModel(modelId: GroqModelId): ResolvedModel {
  return {
    model: createGroq(modelId),
    provider: "groq",
    modelId,
  };
};

function resolveGoogleModel(modelId: GoogleModelId): ResolvedModel {
  return {
    model: google(modelId),
    provider: "google",
    modelId,
  };
};

function resolveOpenRouterModel(modelId: OpenRouterModelId): ResolvedModel {
  return {
    model: openrouter(modelId),
    provider: "openrouter",
    modelId,
  };
};

function resolveOpenCodeModel(modelId: OpenCodeModelId): ResolvedModel {
  return {
    model: opencode(modelId),
    provider: "opencode",
    modelId,
  };
};

function resolveSupportedChatModel(model: SupportedChatModel): ResolvedModel {
  const provider = model.provider;

  switch (provider) {
    case "anthropic":
      return resolveAnthropicModel(model.id);
    case "openai":
      return resolveOpenAIModel(model.id);
    case "groq":
      return resolveGroqModel(model.id);
    case "google":
      return resolveGoogleModel(model.id);
    case "openrouter":
      return resolveOpenRouterModel(model.id);
    case "opencode":
      return resolveOpenCodeModel(model.id);
    default:
      return assertUnsupportedProvider(provider);
  }
};

export function isSupportedChatModel(modelId: string): modelId is SupportedChatModelId {
  return findSupportedChatModel(modelId) != null;
};

export function resolveChatModel(modelId: string): ResolvedModel {
  const model = findSupportedChatModel(modelId);
  if (!model) {
    throw new Error(`Unsupported model: ${modelId}`);
  }

  return resolveSupportedChatModel(model);
};

