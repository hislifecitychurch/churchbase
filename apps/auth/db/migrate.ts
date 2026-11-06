import { getMigrations } from "better-auth/db/migration"

import { config } from "../config/_index"
import { createAuth } from "../src/auth/better-auth"
import { createPostgresDatabase } from "../src/db/postgres/client"

async function migrate(): Promise<void> {
  const { authDatabase, postgresPool } = createPostgresDatabase(config.database.url)

  try {
    await postgresPool.query("create schema if not exists auth")
    const { rows } = await postgresPool.query<{
      camel_case_exists: boolean
      snake_case_exists: boolean
    }>(
      `select
        exists(select 1 from information_schema.tables where table_schema = $1 and table_name = $2) as camel_case_exists,
        exists(select 1 from information_schema.tables where table_schema = $1 and table_name = $3) as snake_case_exists`,
      ["auth", "rateLimit", "rate_limit"],
    )

    if (rows[0]?.camel_case_exists && rows[0].snake_case_exists) {
      throw new Error(
        "Both BetterAuth rate-limit table names exist; reconcile them before migrating",
      )
    }
    if (rows[0]?.camel_case_exists) {
      await postgresPool.query('alter table "auth"."rateLimit" rename to "rate_limit"')
    }

    const auth = createAuth(authDatabase, config)
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
