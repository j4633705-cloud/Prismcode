export const config = {
  port: parseInt(process.env.PORT ?? "3001", 10),
  apiUrl: process.env.API_URL ?? "http://localhost:3001",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV ?? "development",

  get isProduction() {
    return this.nodeEnv === "production";
  },

  get isCloud() {
    return this.apiUrl !== "http://localhost:3001";
  },

  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY ?? "",
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY ?? "",
    frontendDomain: process.env.CLERK_FRONTEND_DOMAIN ?? "",
    oauthClientId: process.env.CLERK_OAUTH_CLIENT_ID ?? "",
    oauthClientSecret: process.env.CLERK_OAUTH_CLIENT_SECRET ?? "",
  },

  database: {
    url: process.env.DATABASE_URL ?? "file:./prisma/prismcode.db",
    get provider() {
      return config.database.url.startsWith("postgres") ? "postgresql" : "sqlite";
    },
  },

  polar: {
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: process.env.POLAR_SERVER ?? "sandbox",
    creditsMeterId: process.env.POLAR_CREDITS_METER_ID,
    freeProductId: process.env.POLAR_FREE_PRODUCT_ID,
    proProductId: process.env.POLAR_PRO_PRODUCT_ID,
  },
};
