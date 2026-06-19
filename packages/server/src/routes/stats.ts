import { Hono } from "hono";
import type { AuthenticatedEnv } from "../middleware/require-auth";
import { db } from "@prismcode543/database/client";
import { getUserPlan, getUsageStats } from "../lib/plans";

const app = new Hono<AuthenticatedEnv>();

app.get("/stats", async (c) => {
  const clerkId = c.get("userId");

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return c.json({ error: "User not found" }, 404);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalSessions, todaySessions, plan, stats, usageRecords] = await Promise.all([
    db.session.count({ where: { userId: user.id } }),
    db.session.count({ where: { userId: user.id, createdAt: { gte: todayStart } } }),
    getUserPlan(clerkId),
    getUsageStats(clerkId),
    db.usageRecord.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 90,
    }),
  ]);

  const totalCredits = usageRecords.reduce((sum, r) => sum + r.credits, 0);
  const totalTokensIn = usageRecords.reduce((sum, r) => sum + Number(r.tokensIn), 0);
  const totalTokensOut = usageRecords.reduce((sum, r) => sum + Number(r.tokensOut), 0);
  const totalMessages = usageRecords.reduce((sum, r) => sum + r.messages, 0);

  const daily = usageRecords
    .filter((r) => {
      const d = new Date(r.date);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    })
    .map((r) => ({
      date: r.date.toISOString(),
      messages: r.messages,
      credits: r.credits,
      tokensIn: Number(r.tokensIn),
      tokensOut: Number(r.tokensOut),
    }));

  return c.json({
    plan,
    stats,
    totals: {
      sessions: totalSessions,
      sessionsToday: todaySessions,
      messages: totalMessages,
      credits: totalCredits,
      tokensIn: totalTokensIn,
      tokensOut: totalTokensOut,
    },
    daily: daily.reverse(),
  });
});

export default app;
