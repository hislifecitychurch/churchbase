import { config } from "../config/_index"
import { createAuth } from "./auth/better-auth"
import { createPostgresDatabase } from "./db/postgres/client"
import { createApp } from "./app"

export function startServer() {
  const { authDatabase, postgresPool } = createPostgresDatabase(config.database.url)
  const auth = createAuth(authDatabase, config)
  const app = createApp({
    cors: config.cors,
    authHandler: (request) => auth.handler(request),
    serviceToken: config.betterAuth.serviceToken,
    provisionUser: async ({ email, name, password }) => {
      const { user } = await auth.api.createUser({ body: { email, name, password } })
      return user.id
    },
  })
  const server = Bun.serve({
    port: config.application.port,
    fetch: (request, server) =>
      app.fetch(request, { remoteAddress: server.requestIP(request)?.address }),
  })

  const shutdown = async () => {
    server.stop(true)
    await postgresPool.end()
  }
  process.once("SIGINT", () => void shutdown())
  process.once("SIGTERM", () => void shutdown())

  console.log(`[AUTH SERVER] PORT ${config.application.port}`)
  return server
}

if (import.meta.main) startServer()
