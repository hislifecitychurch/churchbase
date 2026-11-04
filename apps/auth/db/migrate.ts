import { getMigrations } from "better-auth/db/migration"

import { auth, database } from "../src/auth"

async function migrate(): Promise<void> {
  try {
    await database.query("create schema if not exists auth")
    const migration = await getMigrations(auth.options, { throwOnUnsafe: true })
    await migration.runMigrations()
  } finally {
    await database.end()
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
