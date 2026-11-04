import { z } from "zod"

import { loadConfig } from "../lib/load-config"
import type { DatabaseConfig, Environment } from "./_types"
import { environment } from "./env"

const databaseSchema = z.object({
  AUTH_DATABASE_URL: z
    .string()
    .url()
    .refine((value) => ["postgres:", "postgresql:"].includes(new URL(value).protocol)),
})

export function loadDatabaseConfig(env: Environment = environment): DatabaseConfig {
  const values = loadConfig(databaseSchema, env)
  return { url: values.AUTH_DATABASE_URL }
}
