import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection URL"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal("")),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().or(z.literal("")),
});

let validatedEnv: z.infer<typeof envSchema>;

try {
  validatedEnv = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
    console.error(`❌ Invalid or missing environment variables: ${missingVars}`);
    throw new Error(`Invalid or missing environment variables: ${missingVars}`);
  } else {
    throw error;
  }
}

export const env = validatedEnv;
