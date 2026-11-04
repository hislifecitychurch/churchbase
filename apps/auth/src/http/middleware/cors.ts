import { cors } from "hono/cors"

import type { CorsConfig } from "../../../config/_types"

export function createCorsMiddleware(config: CorsConfig) {
  return cors({
    allowHeaders: config.allowedHeaders,
    allowMethods: config.allowedMethods,
    credentials: config.allowCredentials,
    exposeHeaders: config.exposedHeaders,
    maxAge: 600,
    origin: (origin) => (config.allowedOrigins.includes(origin) ? origin : null),
  })
}
