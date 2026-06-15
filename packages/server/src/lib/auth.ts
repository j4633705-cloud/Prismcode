import { createClerkClient } from "@clerk/backend";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY environment variable is required");
}

if (!process.env.CLERK_PUBLISHABLE_KEY) {
  throw new Error("CLERK_PUBLISHABLE_KEY environment variable is required");
}

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

export async function authenticateOAuthRequest(request: Request) {
  const requestState = await clerkClient.authenticateRequest(request, {
    acceptsToken: ["session_token", "oauth_token"],
  });

  if (!requestState.isAuthenticated) {
    console.error("Auth failed. Reason:", requestState.reason, "Message:", requestState.message);
    return null;
  }

  const auth = requestState.toAuth();

  if (!auth.userId) {
    console.error("Auth failed: no userId in token. Token type:", auth.tokenType);
    return null;
  }

  return { userId: auth.userId };
};
