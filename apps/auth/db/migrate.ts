import { getMigrations } from "better-auth/db/migration"

import { config } from "../config/_index"
import { createAuth } from "../src/auth/better-auth"
import { createPostgresDatabase } from "../src/database/postgres"

async function migrate(): Promise<void> {
  const { authDatabase, postgresPool } = createPostgresDatabase(config.database.url)
  const auth = createAuth(authDatabase, config)

  try {
    await postgresPool.query("create schema if not exists auth")
    const migration = await getMigrations(auth.options, { throwOnUnsafe: true })
    await migration.runMigrations()
  } finally {
    await postgresPool.end()
  }
}

if (import.meta.main) {
  migrate().catch((error: unknown) => {
    console.error(
      `BetterAuth migration failed (${error instanceof Error ? error.name : "unknown error"})`,
    )
    process.exitCode = 1
  })
}
