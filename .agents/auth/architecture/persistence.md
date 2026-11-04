# Persistence

BetterAuth is the only owner of identity persistence. Its PostgreSQL tables and non-development rate-limit records live in the `auth` schema through the Kysely PostgreSQL dialect. The API's Ent/Atlas migrations own business tables only.

Run BetterAuth's explicit migration command before the service uses a new database:

```sh
bun run --cwd apps/auth db:migrate
```

Do not run schema changes during startup, hand-edit generated BetterAuth schema, or add auth tables to API Atlas migrations. The migration command requires a reachable PostgreSQL database and the configured `AUTH_DATABASE_URL`.
