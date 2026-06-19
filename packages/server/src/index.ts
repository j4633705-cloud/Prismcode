import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { requireAuth } from "./middleware/require-auth";
import sessions from "./routes/sessions";
import chat from "./routes/chat";
import auth from "./routes/auth";
import billing from "./routes/billing";

const app = new Hono()
  .onError((error, c) => {
    if (error instanceof HTTPException) {
      return c.json({ 
        error: error.message || "Request failed",
      }, error.status);
    };

    console.error("Unhandled server error", error);
    return c.json({ error: "Internal server error" }, 500);
  })
  .use("/sessions/*", requireAuth)
  .use("/chat/*", requireAuth)
  .use("/billing/checkout", requireAuth)
  .use("/billing/portal", requireAuth)
  .route("/auth", auth)
  .route("/billing", billing)
  .route("/sessions", sessions)
  .route("/chat", chat);

export type AppType = typeof app;
// idleTimeout must be high, otherwise LLM tool calls might not complete
export default { port: 3001, fetch: app.fetch, idleTimeout: 255 };
