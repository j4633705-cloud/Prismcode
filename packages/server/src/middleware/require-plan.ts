import { createMiddleware } from "hono/factory";
import { getUserPlan, ensureUser } from "../lib/plans";

export type PlanEnv = {
  Variables: {
    userId: string;
    planId: string;
    planName: string;
    remainingMessages: number;
  };
};

export const requirePlan = createMiddleware<PlanEnv>(async (c, next) => {
  const userId = c.get("userId");
  await ensureUser(userId);
  const plan = await getUserPlan(userId);

  if (!plan.isUnlimited && plan.remainingMessages <= 0) {
    return c.json({
      error: "Você atingiu o limite diário de mensagens do plano Free.",
      upgradeUrl: "/billing/checkout?plan=pro",
      remainingMessages: 0,
      planId: plan.planId,
    }, 429);
  }

  c.set("planId", plan.planId);
  c.set("planName", plan.planName);
  c.set("remainingMessages", plan.remainingMessages);
  await next();
});
