import { z } from "zod"

import { loadConfig } from "../lib/load-config"
import type { ApplicationConfig, Environment } from "./_types"
import { environment } from "./env"

const applicationSchema = z
  .object({
    PORT: z.coerce.number().int().min(1).max(65535).default(34081),
    ENVIRONMENT: z.enum(["development", "staging", "production"]),
    AUTH_ALLOW_EMAIL_SIGN_UP: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
  })
  .superRefine((values, context) => {
    if (values.AUTH_ALLOW_EMAIL_SIGN_UP && values.ENVIRONMENT !== "development") {
      context.addIssue({
        code: "custom",
        path: ["AUTH_ALLOW_EMAIL_SIGN_UP"],
        message: "Email sign-up can only be enabled in development",
      })
    }
  })

export function loadApplicationConfig(env: Environment = environment): ApplicationConfig {
  const values = loadConfig(applicationSchema, env)

  return {
    allowEmailSignUp: values.AUTH_ALLOW_EMAIL_SIGN_UP,
    environment: values.ENVIRONMENT,
    port: values.PORT,
  }
}
