import { describe, it, expect } from "vitest";
import {
  SUPPORTED_CHAT_MODELS,
  DEFAULT_CHAT_MODEL_ID,
  findSupportedChatModel,
} from "../models";

describe("SUPPORTED_CHAT_MODELS", () => {
  it("is a non-empty array", () => {
    expect(SUPPORTED_CHAT_MODELS.length).toBeGreaterThan(0);
  });

  it("each model has required fields", () => {
    for (const model of SUPPORTED_CHAT_MODELS) {
      expect(typeof model.id).toBe("string");
      expect(typeof model.provider).toBe("string");
      expect(typeof model.pricing.inputUsdPerMillionTokens).toBe("number");
      expect(typeof model.pricing.outputUsdPerMillionTokens).toBe("number");
    }
  });

  it("includes models from all providers", () => {
    const providers = new Set(SUPPORTED_CHAT_MODELS.map((m) => m.provider));
    expect(providers.has("anthropic")).toBe(true);
    expect(providers.has("openai")).toBe(true);
    expect(providers.has("google")).toBe(true);
    expect(providers.has("groq")).toBe(true);
    expect(providers.has("openrouter")).toBe(true);
    expect(providers.has("opencode")).toBe(true);
  });

  it("has unique ids", () => {
    const ids = SUPPORTED_CHAT_MODELS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("DEFAULT_CHAT_MODEL_ID", () => {
  it("is gemini-2.5-flash", () => {
    expect(DEFAULT_CHAT_MODEL_ID).toBe("gemini-2.5-flash");
  });

  it("exists in SUPPORTED_CHAT_MODELS", () => {
    expect(findSupportedChatModel(DEFAULT_CHAT_MODEL_ID)).toBeDefined();
  });
});

describe("findSupportedChatModel", () => {
  it("finds a model by id", () => {
    const model = findSupportedChatModel("gpt-5.4");
    expect(model).toBeDefined();
    expect(model!.provider).toBe("openai");
  });

  it("returns undefined for unknown id", () => {
    expect(findSupportedChatModel("non-existent-model")).toBeUndefined();
  });
});
