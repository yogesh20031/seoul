import { z } from "zod";

// Values are trimmed because dashboard copy-paste often adds a leading space or line break,
// which would otherwise fail the sk_test_ check or break the CORS origin match.
const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().default(4000),
    DATABASE_URL: z.string().trim().min(1),
    JWT_SECRET: z
      .string()
      .trim()
      .min(32, "JWT_SECRET must be at least 32 characters"),
    WEB_URL: z.string().trim().min(1).default("http://localhost:3000"),
    PAYMENTS_MODE: z.enum(["mock", "stripe"]).default("mock"),
    STRIPE_SECRET_KEY: z.string().trim().default(""),
    STRIPE_WEBHOOK_SECRET: z.string().trim().default(""),
  })
  .superRefine((env, ctx) => {
    if (
      env.PAYMENTS_MODE === "stripe" &&
      !env.STRIPE_SECRET_KEY.startsWith("sk_test_")
    ) {
      // Test keys only: this project never takes real money.
      ctx.addIssue({
        code: "custom",
        path: ["STRIPE_SECRET_KEY"],
        message: "Use a Stripe test key (sk_test_...)",
      });
    }
    if (env.NODE_ENV === "production" && env.PAYMENTS_MODE === "mock") {
      ctx.addIssue({
        code: "custom",
        path: ["PAYMENTS_MODE"],
        message: "Mock payments are not allowed in production",
      });
    }
  });

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment:\n${z.prettifyError(parsed.error)}`);
}

export const env = {
  ...parsed.data,
  webOrigins: parsed.data.WEB_URL.split(",").map((o) =>
    o.trim().replace(/\/$/, ""),
  ),
  // First origin is the canonical site, used to build Stripe return URLs.
  webUrl: parsed.data.WEB_URL.split(",")[0]!.trim().replace(/\/$/, ""),
};
