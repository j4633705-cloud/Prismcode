import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  API_URL: z.string().url().default("http://localhost:3000"),
  
  // AI Keys (at least one should be present for core functionality, but let's keep them optional in schema and handle at runtime)
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),

  // Clerk
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  CLERK_PUBLISHABLE_KEY: z.string().min(1, "CLERK_PUBLISHABLE_KEY is required"),
  
  // JWT
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error("\n❌ Invalid environment variables:");
    Object.entries(errors).forEach(([field, messages]) => {
      console.error(`  - ${field}: ${messages?.join(", ")}`);
    });
    console.error("\nPlease check your .env file.\n");
    process.exit(1);
  }

  return result.data;
}
