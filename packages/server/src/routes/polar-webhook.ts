import { Hono } from "hono";
import { validateEvent } from "@polar-sh/sdk/webhooks";
import { syncSubscription, cancelSubscription } from "../lib/subscription";
import { logger } from "@prismcode543/shared";

const app = new Hono();

app.post("/polar/webhook", async (c) => {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    return c.json({ error: "POLAR_WEBHOOK_SECRET not configured" }, 500);
  }

  const body = await c.req.text();
  const headers: Record<string, string> = {};
  for (const [key, value] of c.req.raw.headers.entries()) {
    headers[key] = value;
  }

  let event: ReturnType<typeof validateEvent>;
  try {
    event = validateEvent(body, headers, secret);
  } catch {
    return c.json({ error: "Invalid webhook signature" }, 401);
  }

  try {
    switch (event.type) {
      case "subscription.active":
      case "subscription.created":
      case "subscription.updated":
      case "subscription.past_due":
      case "subscription.uncanceled": {
        const sub = event.data;
        await syncSubscription({
          polarSubscriptionId: sub.id,
          customerExternalId: sub.customer.externalId || sub.customer.id,
          productId: sub.product.id,
          status: sub.status,
          currentPeriodStart: sub.currentPeriodStart.toISOString(),
          currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        });
        break;
      }

      case "subscription.canceled":
      case "subscription.revoked": {
        const sub = event.data;
        await cancelSubscription(sub.customer.externalId || sub.customer.id);
        break;
      }

      case "order.paid": {
        const order = event.data;
        const customerExternalId = order.customer.externalId || order.customer.id;
        if (order.subscription) {
          await syncSubscription({
            polarSubscriptionId: order.subscription.id,
            customerExternalId,
            productId: order.product?.id ?? "",
            status: "active",
            currentPeriodStart: order.subscription.currentPeriodStart.toISOString(),
            currentPeriodEnd: order.subscription.currentPeriodEnd.toISOString(),
            cancelAtPeriodEnd: order.subscription.cancelAtPeriodEnd,
          });
        }
        break;
      }

      default:
        logger.debug(`Unhandled webhook event type: ${event.type}`);
    }
  } catch (error) {
    logger.error("Webhook handler error", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }

  return c.json({ ok: true });
});

export default app;
