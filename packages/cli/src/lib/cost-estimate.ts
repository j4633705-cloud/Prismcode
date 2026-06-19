import { findSupportedChatModel } from "@prismcode543/shared";

const CHARS_PER_TOKEN = 4;

export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export function estimateCostForMessage(text: string, modelId: string, imageCount: number = 0) {
  const model = findSupportedChatModel(modelId);
  if (!model) return null;

  const inputTokens = estimateTokenCount(text) + imageCount * 1000;
  const outputTokens = estimateTokenCount(text) * 2;

  const inputCost = (inputTokens * model.pricing.inputUsdPerMillionTokens) / 1_000_000;
  const outputCost = (outputTokens * model.pricing.outputUsdPerMillionTokens) / 1_000_000;
  const totalCost = inputCost + outputCost;

  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    inputCost,
    outputCost,
    totalCost,
    isFree: model.pricing.inputUsdPerMillionTokens === 0 && model.pricing.outputUsdPerMillionTokens === 0,
  };
}
