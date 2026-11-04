import { z } from "zod"

import { loadConfig } from "../lib/load-config"
import type { CorsConfig, Environment } from "./_types"
import { environment } from "./env"

const corsSchema = z
  .object({
    CORS_ALLOWED_ORIGINS: z
      .string()
      .transform((value) =>
        value
          .split(",")
          .map((origin) => origin.trim())
          .filter(Boolean),
      )
      .pipe(z.array(z.string().url()).min(1)),
  })
  .superRefine((values, context) => {
    values.CORS_ALLOWED_ORIGINS.forEach((origin, index) => {
      if (new URL(origin).origin !== origin) {
        context.addIssue({
          code: "custom",
          path: ["CORS_ALLOWED_ORIGINS", index],
          message: "Each value must be an exact origin without a path or trailing slash",
        })
      }
    })
  })

export function loadCorsConfig(env: Environment = environment): CorsConfig {
  const values = loadConfig(corsSchema, env)
  return { allowedOrigins: values.CORS_ALLOWED_ORIGINS }
}
