import { cors } from "hono/cors"

export function createCorsMiddleware(allowedOrigins: string[]) {
  return cors({
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    maxAge: 600,
    origin: (origin) => (allowedOrigins.includes(origin) ? origin : null),
  })
}
