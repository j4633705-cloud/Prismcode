import { Hono } from "hono";
import type { AuthenticatedEnv } from "../middleware/require-auth";
import { createCheckoutUrl, createCustomerPortalUrl, hasPolarCredentials } from "../lib/polar";
import { getPlan, getRemainingMessages, PLANS, type PlanId } from "@prismcode543/shared";
import { db } from "@prismcode543/database/client";

const app = new Hono<AuthenticatedEnv>()
  .get("/plans", async (c) => {
    const plans = Object.values(PLANS).map((p) => ({
      id: p.id,
      name: p.name,
      priceUsd: p.priceUsd,
      highlight: p.highlight,
      features: p.features,
      limits: p.limits,
    }));
    return c.json({ plans });
  })
  .get("/plan", async (c) => {
    const clerkId = c.get("userId");
    const user = await db.user.findUnique({ where: { clerkId } });
    const planId = (user?.planId ?? "free") as PlanId;
    const plan = getPlan(planId);
    return c.json({
      planId: plan.id,
      planName: plan.name,
      isUnlimited: plan.limits.messagesPerDay === null,
    });
  })
  .post("/checkout", async (c) => {
    const userId = c.get("userId");
    const body = await c.req.json().catch(() => ({}));
    const planId = body?.plan ?? "pro";

    const validPlans = Object.keys(PLANS);
    if (!validPlans.includes(planId)) {
      return c.json({ error: `Invalid plan. Valid plans: ${validPlans.join(", ")}` }, 400);
    }

    if (planId === "free") {
      return c.json({ url: null, message: "Free plan is already active. No checkout needed." });
    }

    if (!hasPolarCredentials()) {
      return c.json({ error: "Billing is not configured. Contact support to upgrade." }, 500);
    }

    try {
      const url = await createCheckoutUrl({ customerExternalId: userId, planId, requestUrl: c.req.url });
      return c.json({ url });
    } catch (err) {
      console.error("Checkout error:", err);
      return c.json({ error: "Unable to create checkout URL. Try again later." }, 500);
    }
  })
  .post("/portal", async (c) => {
    const userId = c.get("userId");

    if (!hasPolarCredentials()) {
      return c.json({ error: "Billing is not configured." }, 501);
    }

    try {
      const url = await createCustomerPortalUrl({ customerExternalId: userId, requestUrl: c.req.url });
      return c.json({ url });
    } catch (err) {
      console.error("Portal error:", err);
      return c.json({ error: "Unable to create portal URL." }, 500);
    }
  })
  .get("/success", (c) => c.text("Done. You can close this tab and return to Prismcode."));

export default app;
