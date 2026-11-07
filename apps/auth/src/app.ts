import { Hono } from "hono"

import type { CorsConfig } from "../config/_types"
import { accessLog } from "./http/middleware/access-log"
import { createCorsMiddleware } from "./http/middleware/cors"
import { registerHealthRoutes } from "./http/routes/health"
import { registerV1Routes, type AuthHandler } from "./http/routes/v1/routes"
import { registerProvisionUserRoute } from "./http/routes/v1/user/provision"
import type { ProvisionUser } from "./http/routes/v1/user/provision"

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
  registerV1Routes(app, authHandler)

  app.notFound((context) => context.json({ error: "Not found" }, 404))

  return app
}
