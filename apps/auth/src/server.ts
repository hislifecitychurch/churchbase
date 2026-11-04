import { config } from "../config/_index"
import { auth, database } from "./auth"
import { createApp } from "./http"

export function startServer() {
  const app = createApp((request) => auth.handler(request))
  const server = Bun.serve({
    port: config.application.port,
    fetch: (request) => app.fetch(request),
  })

  const shutdown = async () => {
    server.stop(true)
    await database.end()
  }
  process.once("SIGINT", () => void shutdown())
  process.once("SIGTERM", () => void shutdown())

  console.log(JSON.stringify({ event: "auth.server.started", port: config.application.port }))
  return server
}

if (import.meta.main) startServer()
