import { Hono } from "hono"

import type { CorsConfig } from "../config/_types"
import { accessLog } from "./http/middleware/access-log"
import { createCorsMiddleware } from "./http/middleware/cors"
import { registerBetterAuthRoutes } from "./http/routes/better-auth"
import { registerHealthRoutes } from "./http/routes/health"
import { registerProvisionUserRoute } from "./http/routes/provision-user"
import type { AuthHandler } from "./http/routes/better-auth"
import type { ProvisionUser } from "./http/routes/provision-user"

type AppDependencies = {
  cors: CorsConfig
  authHandler: AuthHandler
  serviceToken: string | undefined
  provisionUser: ProvisionUser
}

export function createApp({
  cors,
  authHandler,
  serviceToken,
  provisionUser,
}: AppDependencies): Hono {
  const app = new Hono()

  app.use("*", accessLog)
  app.use("*", createCorsMiddleware(cors))

  registerHealthRoutes(app)
  registerProvisionUserRoute(app, serviceToken, provisionUser)
  registerBetterAuthRoutes(app, authHandler)

  app.notFound((context) => context.json({ error: "Not found" }, 404))

  return app
}
