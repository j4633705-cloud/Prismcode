import { Polar } from "@polar-sh/sdk";

type PolarServer = "sandbox" | "production";

export function getPolarAccessToken() {
  return process.env.POLAR_ACCESS_TOKEN;
}

export function hasPolarCredentials() {
  return !!getPolarAccessToken();
}

export function getPolarProductId(planId?: string) {
  if (planId === "pro") return process.env.POLAR_PRO_PRODUCT_ID;
  if (planId === "enterprise") return process.env.POLAR_ENTERPRISE_PRODUCT_ID;
  return process.env.POLAR_PRODUCT_ID;
}

export function getPolarCreditsMeterId() {
  return process.env.POLAR_CREDITS_METER_ID;
}

export function getPolarServer(): PolarServer {
  const server = process.env.POLAR_SERVER;
  if (!server) return "sandbox";
  if (server !== "sandbox" && server !== "production") {
    throw new Error("POLAR_SERVER must be either 'sandbox' or 'production'");
  }
  return server;
}

let _polar: Polar | null = null;

function getPolar() {
  if (!_polar) {
    const token = getPolarAccessToken();
    if (!token) throw new Error("POLAR_ACCESS_TOKEN is not configured");
    _polar = new Polar({ accessToken: token, server: getPolarServer() });
  }
  return _polar;
}

function hasStatusCode(error: unknown): error is { statusCode: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  );
}

type CreateCheckoutUrlParams = {
  customerExternalId: string;
  planId?: string;
  requestUrl: string;
};

export async function createCheckoutUrl({
  customerExternalId,
  planId,
  requestUrl,
}: CreateCheckoutUrlParams) {
  const productId = getPolarProductId(planId);
  if (!productId) throw new Error(`No Polar product configured for plan: ${planId}`);

  const result = await getPolar().checkouts.create({
    products: [productId],
    successUrl: new URL("/billing/success", requestUrl).toString(),
    externalCustomerId: customerExternalId,
    metadata: { source: "Prismcode-cli" },
  });

  return result.url;
};

export async function createCustomerPortalUrl({
  customerExternalId,
  requestUrl,
}: CreateCheckoutUrlParams) {
  const result = await getPolar().customerSessions.create({
    externalCustomerId: customerExternalId,
    returnUrl: new URL("/billing/success", requestUrl).toString(),
  });

  return result.customerPortalUrl;
};

export async function getAvailableCreditsBalance(customerExternalId: string) {
  const creditsMeterId = getPolarCreditsMeterId();

  if (!creditsMeterId) return Infinity;

  try {
    const customerState = await getPolar().customers.getStateExternal({
      externalId: customerExternalId,
    });

    const matchingMeters = customerState.activeMeters.filter(
      (meter) => meter.meterId === creditsMeterId,
    );

    if (matchingMeters.length > 1) {
      throw new Error("Expected exactly one matching Polar credits meter");
    }

    const creditsMeter = matchingMeters[0];
    return creditsMeter?.balance ?? 0;
  } catch (error) {
    if (hasStatusCode(error) && error.statusCode === 404) return 0;
    throw error;
  }
};

type IngestAiUsageParams = {
  externalCustomerId: string;
  eventId: string;
  credits: number;
};

export async function ingestAiUsage({
  externalCustomerId,
  eventId,
  credits
}: IngestAiUsageParams) {
  if (credits <= 0) return;

  await getPolar().events.ingest({
    events: [
      {
        name: "Prismcode_usage",
        externalId: eventId,
        externalCustomerId,
        metadata: { credits },
      },
    ],
  });
};
