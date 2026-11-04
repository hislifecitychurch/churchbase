import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"

export function createPostgresDatabase(connectionString: string) {
  const postgresPool = new Pool({ connectionString })
  const authDatabase = new Kysely({
    dialect: new PostgresDialect({ pool: postgresPool }),
  })

  return { authDatabase, postgresPool }
}
