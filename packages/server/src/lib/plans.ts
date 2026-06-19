import { db } from "@prismcode/database/client";
import { getPlan, getRemainingMessages, type PlanId } from "@prismcode/shared";

type PlanResult = {
  planId: PlanId;
  planName: string;
  remainingMessages: number;
  isUnlimited: boolean;
};

export async function getUserPlan(userId: string): Promise<PlanResult> {
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return { planId: "free", planName: "Free", remainingMessages: 20, isUnlimited: false };
  }
  const plan = getPlan(user.planId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usage = await db.usageRecord.findFirst({
    where: { userId: user.id, date: { gte: today } },
  });

  const messagesToday = usage?.messages ?? 0;
  const remaining = getRemainingMessages(messagesToday, user.planId as PlanId);

  return {
    planId: user.planId as PlanId,
    planName: plan.name,
    remainingMessages: remaining,
    isUnlimited: plan.limits.messagesPerDay === null,
  };
}

export async function trackUsage(
  userId: string,
  tokensIn: number,
  tokensOut: number,
  credits: number,
): Promise<void> {
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await db.usageRecord.findFirst({
    where: { userId: user.id, date: { gte: today } },
  });

  if (existing) {
    await db.usageRecord.update({
      where: { id: existing.id },
      data: {
        messages: { increment: 1 },
        tokensIn: { increment: tokensIn },
        tokensOut: { increment: tokensOut },
        credits: { increment: credits },
      },
    });
  } else {
    await db.usageRecord.create({
      data: {
        userId: user.id,
        date: today,
        messages: 1,
        tokensIn,
        tokensOut,
        credits,
      },
    });
  }
}

export async function syncUser(clerkId: string, email?: string, name?: string): Promise<void> {
  const existing = await db.user.findUnique({ where: { clerkId } });
  if (existing) {
    await db.user.update({
      where: { id: existing.id },
      data: { email, name },
    });
  } else {
    await db.user.create({
      data: { clerkId, email, name, planId: "free" },
    });
  }
}

export async function ensureUser(clerkId: string): Promise<{ id: string; planId: string }> {
  let user = await db.user.findUnique({ where: { clerkId } });
  if (!user) {
    user = await db.user.create({
      data: { clerkId, planId: "free" },
    });
  }
  return { id: user.id, planId: user.planId };
}

export async function getUsageStats(userId: string) {
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayUsage, totalUsage, sessionCount] = await Promise.all([
    db.usageRecord.findFirst({ where: { userId: user.id, date: { gte: today } } }),
    db.usageRecord.aggregate({ where: { userId: user.id }, _sum: { credits: true, tokensIn: true, tokensOut: true } }),
    db.session.count({ where: { userId: user.id } }),
  ]);

  return {
    planId: user.planId,
    messagesToday: todayUsage?.messages ?? 0,
    creditsUsed: totalUsage._sum.credits ?? 0,
    tokensInTotal: Number(totalUsage._sum.tokensIn ?? 0),
    tokensOutTotal: Number(totalUsage._sum.tokensOut ?? 0),
    sessionCount,
  };
}
