import { db } from "@prismcode/database/client";
import { logger } from "@prismcode/shared";

export type PlanMapping = {
  free: string | null;
  pro: string;
  enterprise: string;
};

function getPlanMapping(): PlanMapping {
  return {
    free: null,
    pro: process.env.POLAR_PRO_PRODUCT_ID || "",
    enterprise: process.env.POLAR_ENTERPRISE_PRODUCT_ID || "",
  };
}

export function resolvePlanFromProduct(productId: string): string {
  const mapping = getPlanMapping();
  if (productId === mapping.pro) return "pro";
  if (productId === mapping.enterprise) return "enterprise";
  return "free";
}

export type SyncSubscriptionParams = {
  polarSubscriptionId: string;
  customerExternalId: string;
  productId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
};

export async function syncSubscription(params: SyncSubscriptionParams) {
  const planId = resolvePlanFromProduct(params.productId);
  const user = await db.user.findUnique({ where: { clerkId: params.customerExternalId } });
  if (!user) {
    logger.warn(`Webhook: user not found for externalId ${params.customerExternalId}`);
    return;
  }

  await db.user.update({
    where: { id: user.id },
    data: { planId },
  });

  const existing = await db.subscription.findUnique({ where: { userId: user.id } });
  const subData = {
    planId,
    polarSubscriptionId: params.polarSubscriptionId,
    status: params.status,
    currentPeriodStart: new Date(params.currentPeriodStart),
    currentPeriodEnd: new Date(params.currentPeriodEnd),
    cancelAtPeriodEnd: params.cancelAtPeriodEnd,
  };

  if (existing) {
    await db.subscription.update({ where: { id: existing.id }, data: subData });
  } else {
    await db.subscription.create({ data: { userId: user.id, ...subData } });
  }

  logger.info(`Subscription synced for user ${params.customerExternalId}: ${planId} (${params.status})`);
}

export async function cancelSubscription(customerExternalId: string) {
  const user = await db.user.findUnique({ where: { clerkId: customerExternalId } });
  if (!user) return;

  await db.user.update({
    where: { id: user.id },
    data: { planId: "free" },
  });

  await db.subscription.updateMany({
    where: { userId: user.id },
    data: { status: "canceled" },
  });

  logger.info(`Subscription canceled for user ${customerExternalId}`);
}
