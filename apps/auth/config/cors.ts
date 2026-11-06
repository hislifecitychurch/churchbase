import { z } from "zod"

import { loadConfig } from "../lib/load-config"
import type { CorsConfig, Environment } from "./_types"
import { environment } from "./env"

const commaSeparatedValues = z.string().transform((value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
)

const corsSchema = z
  .object({
    CORS_ALLOWED_ORIGINS: commaSeparatedValues.pipe(z.array(z.string().url()).min(1)),
    CORS_ALLOWED_METHODS: commaSeparatedValues.pipe(z.array(z.string().min(1)).min(1)),
    CORS_ALLOWED_HEADERS: commaSeparatedValues.pipe(z.array(z.string().min(1)).min(1)),
    CORS_EXPOSE_HEADERS: commaSeparatedValues,
    CORS_ALLOW_CREDENTIALS: z
      .string()
      .trim()
      .pipe(z.enum(["true", "false"]))
      .transform((value) => value === "true"),
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
  return {
    allowedHeaders: values.CORS_ALLOWED_HEADERS,
    allowedMethods: values.CORS_ALLOWED_METHODS,
    allowedOrigins: values.CORS_ALLOWED_ORIGINS,
    allowCredentials: values.CORS_ALLOW_CREDENTIALS,
    exposedHeaders: values.CORS_EXPOSE_HEADERS,
  }
}
