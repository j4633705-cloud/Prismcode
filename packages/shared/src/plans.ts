export type PlanId = "free" | "pro" | "enterprise";

export type PlanTier = {
  id: PlanId;
  name: string;
  description: string;
  priceUsd: number;
  polarProductIdEnv: string;
  limits: {
    messagesPerDay: number | null;
    maxSessions: number | null;
    maxTokensPerMessage: number | null;
    allowedProviders: string[] | null;
    allowedModels: string[] | null;
    teamSeats: number | null;
  };
  features: string[];
  highlight: boolean;
};

export const PLANS: Record<PlanId, PlanTier> = {
  free: {
    id: "free",
    name: "Free",
    description: "Para começar com IA no terminal",
    priceUsd: 0,
    polarProductIdEnv: "POLAR_FREE_PRODUCT_ID",
    limits: {
      messagesPerDay: 20,
      maxSessions: 2,
      maxTokensPerMessage: 100_000,
      allowedProviders: ["anthropic", "google", "ollama"],
      allowedModels: ["claude-haiku-4-5", "gemini-2.5-flash", "ollama"],
      teamSeats: 1,
    },
    features: [
      "20 mensagens/dia",
      "Claude Haiku, Gemini Flash, Ollama",
      "2 sessões simultâneas",
      "Suporte via Discord",
      "BYOK disponível",
    ],
    highlight: false,
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "Para uso profissional ilimitado",
    priceUsd: 20,
    polarProductIdEnv: "POLAR_PRO_PRODUCT_ID",
    limits: {
      messagesPerDay: null,
      maxSessions: null,
      maxTokensPerMessage: 500_000,
      allowedProviders: null,
      allowedModels: null,
      teamSeats: 1,
    },
    features: [
      "Mensagens ilimitadas",
      "Todos os modelos (Opus, GPT-5, Gemini Pro)",
      "Sessões ilimitadas",
      "Suporte prioritário",
      "BYOK incluso",
      "Fila prioritária",
    ],
    highlight: true,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "Para equipes e organizações",
    priceUsd: 100,
    polarProductIdEnv: "POLAR_ENTERPRISE_PRODUCT_ID",
    limits: {
      messagesPerDay: null,
      maxSessions: null,
      maxTokensPerMessage: null,
      allowedProviders: null,
      allowedModels: null,
      teamSeats: 10,
    },
    features: [
      "Tudo do Pro",
      "10 membros da equipe",
      "Workspaces organizacionais",
      "SSO / SAML",
      "Modelos customizados",
      "Suporte dedicado",
      "SLA garantido",
      "Onboarding assistido",
    ],
    highlight: false,
  },
};

export function getPlan(planId: string): PlanTier {
  const plan = PLANS[planId as PlanId];
  if (!plan) return PLANS.free;
  return plan;
}

export function getPlanByPrice(priceUsd: number): PlanTier {
  return Object.values(PLANS).find((p) => p.priceUsd === priceUsd) ?? PLANS.free;
}

export function isModelAllowed(planId: PlanId, modelId: string): boolean {
  const plan = getPlan(planId);
  if (!plan.limits.allowedModels) return true;
  return plan.limits.allowedModels.includes(modelId);
}

export function isProviderAllowed(planId: PlanId, provider: string): boolean {
  const plan = getPlan(planId);
  if (!plan.limits.allowedProviders) return true;
  return plan.limits.allowedProviders.includes(provider);
}

export function getRemainingMessages(messagesToday: number, planId: PlanId): number {
  const plan = getPlan(planId);
  if (plan.limits.messagesPerDay === null) return -1;
  return Math.max(0, plan.limits.messagesPerDay - messagesToday);
}

export const PLAN_ORDER: PlanId[] = ["free", "pro", "enterprise"];
