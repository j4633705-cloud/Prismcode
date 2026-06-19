import { createClerkClient } from "@clerk/backend";

function getClerk() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
  if (!secretKey || !publishableKey) return null;
  return createClerkClient({ secretKey, publishableKey });
}

export async function authenticateOAuthRequest(request: Request) {
  const clerkClient = getClerk();
  if (!clerkClient) return null;

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
