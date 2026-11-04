import { config } from "../config/_index"
import { createAuth } from "./auth/better-auth"
import { createPostgresDatabase } from "./database/postgres"
import { createApp } from "./app"

export function startServer() {
  const { authDatabase, postgresPool } = createPostgresDatabase(config.database.url)
  const auth = createAuth(authDatabase, config)
  const app = createApp({
    allowedOrigins: config.cors.allowedOrigins,
    authHandler: (request) => auth.handler(request),
  })
  const server = Bun.serve({
    port: config.application.port,
    fetch: (request) => app.fetch(request),
  })

  const shutdown = async () => {
    server.stop(true)
    await postgresPool.end()
  }
  process.once("SIGINT", () => void shutdown())
  process.once("SIGTERM", () => void shutdown())

  console.log(JSON.stringify({ event: "auth.server.started", port: config.application.port }))
  return server
}

if (import.meta.main) startServer()
