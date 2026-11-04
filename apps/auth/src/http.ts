import { Hono } from "hono"
import { cors } from "hono/cors"

import { config } from "../config/_index"

export type AuthHandler = (request: Request) => Response | Promise<Response>

export function createApp(authHandler: AuthHandler): Hono {
  const app = new Hono()

  app.use("*", async (context, next) => {
    const startedAt = performance.now()
    await next()
    console.log(
      JSON.stringify({
        method: context.req.method,
        path: new URL(context.req.url).pathname,
        status: context.res.status,
        durationMs: Math.round(performance.now() - startedAt),
      }),
    )
  })

  app.use(
    "*",
    cors({
      allowHeaders: ["Authorization", "Content-Type"],
      allowMethods: ["GET", "POST", "OPTIONS"],
      credentials: true,
      maxAge: 600,
      origin: (origin) => (config.cors.allowedOrigins.includes(origin) ? origin : null),
    }),
  )

  app.get("/health", (context) => context.json({ status: "UP" }))
  app.all("/api/v1/auth", (context) => authHandler(context.req.raw))
  app.all("/api/v1/auth/*", (context) => authHandler(context.req.raw))
  app.notFound((context) => context.json({ error: "Not found" }, 404))

  return app
}
