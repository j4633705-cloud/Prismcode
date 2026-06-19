import { findSupportedChatModel, type ModelPricing } from "./models";

export const USD_PER_CREDIT = 0.01;
export const TOKENS_PER_MILLION = 1_000_000;

export function estimateTokenCount(text: string): number {
  if (text.length === 0) return 0;
  return Math.ceil(text.length / 4);
}

export function estimateCostUsd(
  inputTokens: number,
  outputTokens: number,
  pricing: ModelPricing,
): number {
  return (
    (inputTokens * pricing.inputUsdPerMillionTokens +
      outputTokens * pricing.outputUsdPerMillionTokens) /
    TOKENS_PER_MILLION
  );
}

export function convertUsdToCredits(estimatedCostUsd: number): number {
  if (estimatedCostUsd <= 0) return 0;
  return Math.max(1, Math.ceil(estimatedCostUsd / USD_PER_CREDIT));
}

export type CostPreview = {
  usd: number;
  credits: number;
};

const DEFAULT_ESTIMATED_OUTPUT_TOKENS = 500;

export function getCostPreview(
  text: string,
  modelId: string,
  estimatedOutputTokens = DEFAULT_ESTIMATED_OUTPUT_TOKENS,
): CostPreview | null {
  if (text.length === 0) return null;

  const model = findSupportedChatModel(modelId);
  if (!model) return null;

  const inputTokens = estimateTokenCount(text);
  const costUsd = estimateCostUsd(inputTokens, estimatedOutputTokens, model.pricing);
  const credits = convertUsdToCredits(costUsd);

  return { usd: costUsd, credits };
}
