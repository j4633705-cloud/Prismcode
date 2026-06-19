# Troubleshooting

## "unable to connect" error (CLI → Server)
- **Cause 1:** Server not running yet when CLI starts (race condition)
- **Cause 2:** Bun --hot on Windows has a bug — `Bun.serve()` is called again on reload, causing `EADDRINUSE`
- **Fix:** Run server WITHOUT `--hot` flag: `bun run packages/server/src/index.ts`
- **Fix:** If port 3001 is stuck, find and kill the process:
  ```powershell
  Get-NetTCPConnection -LocalPort 3001 | ForEach-Object { taskkill /F /PID $_.OwningProcess }
  ```

## "Invalid schema for function '...': schema must be a JSON Schema of 'type: \"object\"', got 'type: null'"
- **Cause:** MCP tools with empty parameters (`{}`) — the `@ai-sdk/mcp` returns `inputSchema` as `{ jsonSchema: { type: "object", properties: {} } }`, but `jsonSchema()` in the server was being called on the wrapper object instead of extracting the inner `jsonSchema` key.
- **Fix:** Extract the raw schema before passing to `jsonSchema()`:
  ```ts
  const rawSchema = mt.inputSchema as Record<string, unknown> | undefined;
  const schema = rawSchema && typeof rawSchema.jsonSchema === "object"
    ? (rawSchema.jsonSchema as Record<string, unknown>)
    : rawSchema;
  inputSchema: jsonSchema(schema ?? { type: "object", properties: {} }),
  ```
- **File:** `packages/server/src/routes/chat.ts` — the `mcpAiTools` reducer

## Server won't start (EADDRINUSE on 3001)
- Previous process didn't die cleanly
- **Fix:** Kill it manually (see first item), then restart
- **Prevention:** `dev:server` script no longer uses `--hot` (Bun --hot on Windows has a bug that causes EADDRINUSE on reload)

## Polar.sh billing errors (401 invalid_token)
- The server no longer crashes if Polar is misconfigured. Billing endpoints return friendly error messages.
- **Fix:** Update your `POLAR_ACCESS_TOKEN` in `.env`. Or remove all `POLAR_*` vars to disable billing entirely.
