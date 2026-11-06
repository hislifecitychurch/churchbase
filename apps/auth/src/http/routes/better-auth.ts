import type { Hono } from "hono"

export type AuthHandler = (request: Request) => Response | Promise<Response>

export function registerBetterAuthRoutes(app: Hono, authHandler: AuthHandler): void {
  app.all("/api/v1/auth", (context) => authHandler(context.req.raw))
  app.all("/api/v1/auth/*", (context) => authHandler(context.req.raw))
}
