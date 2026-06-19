import { Hono } from "hono";
// import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@prismcode543/database/client";

import type { AuthenticatedEnv } from "../middleware/require-auth";
import { requireCreditsBalance } from "../middleware/require-credits-balance";


const createSessionSchema = z.object({
  title: z.string(),
});

const createSessionValidator = zValidator(
  "json", createSessionSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

const searchSchema = z.object({
  q: z.string().min(1),
});

const searchValidator = zValidator("query", searchSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: "Missing search query" }, 400);
  }
});

const app = new Hono<AuthenticatedEnv>()
  .get("/", async (c) => {
    const userId = c.get("userId");

    const sessions = await db.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    return c.json(sessions);
  })
  .get("/search", searchValidator, async (c) => {
    const userId = c.get("userId");
    const { q } = c.req.valid("query");
    const query = q.toLowerCase();

    const sessions = await db.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        messages: true,
      },
    });

    const results: {
      sessionId: string;
      sessionTitle: string;
      createdAt: string;
      matchCount: number;
      matches: { role: string; preview: string }[];
    }[] = [];

    for (const session of sessions) {
      const messages = (session.messages as unknown as { role: string; parts: { type: string; text?: string }[] }[]) ?? [];
      const matches: { role: string; preview: string }[] = [];

      for (const msg of messages) {
        const text = msg.parts
          ?.filter((p) => p.type === "text")
          .map((p) => p.text ?? "")
          .join(" ") ?? "";

        if (text.toLowerCase().includes(query)) {
          const idx = text.toLowerCase().indexOf(query);
          const start = Math.max(0, idx - 60);
          const end = Math.min(text.length, idx + query.length + 60);
          const preview = (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");
          matches.push({ role: msg.role, preview });
        }
      }

      if (matches.length > 0) {
        results.push({
          sessionId: session.id,
          sessionTitle: session.title,
          createdAt: session.createdAt.toISOString(),
          matchCount: matches.length,
          matches: matches.slice(0, 3),
        });
      }
    }

    return c.json(results);
  })
  .get("/:id", async (c) => {
    // MOCK: Uncomment to simulate slow session loading
    // await new Promise((r) => setTimeout(r, 5000))

    // MOCK: Uncomment to simulate session loading error
    // throw new HTTPException(
    //   500, 
    //   { message: "Mock error: session loading failed" }
    // )

    const id = c.req.param("id");
    const userId = c.get("userId");
    
    const session = await db.session.findUnique({
      where: { id, userId },
    });

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    return c.json(session);
  })
  .post("/", requireCreditsBalance, createSessionValidator, async (c) => {
    // MOCK: Uncomment to simulate slow session loading
    // await new Promise((r) => setTimeout(r, 5000))

    // MOCK: Uncomment to simulate session loading error
    // throw new HTTPException(
    //   500, 
    //   { message: "Mock error: session loading failed" }
    // )

    const userId = c.get("userId");
    const data = c.req.valid("json");

    const session = await db.session.create({
      data: {
        ...data,
        userId,
      },
    });

    return c.json(session, 201);
  });

export default app;

