import { z } from "zod"

import { loadConfig } from "../lib/load-config"
import type { BetterAuthConfig, Environment } from "./_types"
import { environment } from "./env"

const betterAuthSchema = z
  .object({
    ENVIRONMENT: z.enum(["development", "staging", "production"]),
    BETTER_AUTH_SECRET: z.string().trim().min(32),
    BETTER_AUTH_URL: z.string().url(),
    BETTER_AUTH_COOKIE_DOMAIN: z
      .string()
      .trim()
      .toLowerCase()
      .optional()
      .transform((value) => value || undefined),
  })
  .superRefine((values, context) => {
    const hostname = new URL(values.BETTER_AUTH_URL).hostname
    const cookieDomain = values.BETTER_AUTH_COOKIE_DOMAIN?.replace(/^\./, "")

    if (values.ENVIRONMENT === "production") {
      if (new URL(values.BETTER_AUTH_URL).protocol !== "https:") {
        context.addIssue({
          code: "custom",
          path: ["BETTER_AUTH_URL"],
          message: "Production auth URL must use HTTPS",
        })
      }
      if (!cookieDomain) {
        context.addIssue({
          code: "custom",
          path: ["BETTER_AUTH_COOKIE_DOMAIN"],
          message: "Required in production for sibling application sessions",
        })
      }
    }

    if (cookieDomain && hostname !== cookieDomain && !hostname.endsWith(`.${cookieDomain}`)) {
      context.addIssue({
        code: "custom",
        path: ["BETTER_AUTH_COOKIE_DOMAIN"],
        message: "Must match the auth hostname or one of its parent domains",
      })
    }
  })

export function loadBetterAuthConfig(env: Environment = environment): BetterAuthConfig {
  const values = loadConfig(betterAuthSchema, env)

  return {
    cookieDomain: values.BETTER_AUTH_COOKIE_DOMAIN,
    secret: values.BETTER_AUTH_SECRET,
    url: values.BETTER_AUTH_URL.replace(/\/$/, ""),
  }
}
