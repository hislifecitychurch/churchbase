# Naming and structure

Keep the Auth service thin around BetterAuth. Separate process lifecycle, HTTP transport, BetterAuth configuration, user schema mapping, and database resources so each area has a clear reason to change.

## Layout

```text
apps/auth/
├── config/                          validated environment configuration
├── db/
│   └── migrate.ts                   explicit BetterAuth migration command
├── lib/                             shared config loading
└── src/
    ├── server.ts                   Bun entrypoint, composition, and shutdown
    ├── app.ts                      Hono application composition
    ├── auth/
    │   └── better-auth.ts          BetterAuth instance and auth policy
    ├── db/
    │   └── postgres/
    │       └── client.ts            PostgreSQL pool and Kysely adapter
    ├── http/
    │   ├── middleware/
    │   │   ├── access-log.ts        safe request metadata logging
    │   │   └── cors.ts              trusted-origin CORS policy
    │   └── routes/
    │       ├── health.ts            liveness endpoint
    │       ├── better-auth.ts       delegate auth requests to BetterAuth
    │       └── provision-user.ts    service-token-protected identity creation
    └── models/
        └── user.ts                  BetterAuth user field mapping and extensions
```

Each directory has a distinct owner:

- **`server.ts` owns process lifecycle and composition.** It creates the database resource, BetterAuth instance, and Hono app, starts `Bun.serve`, handles shutdown signals, and closes resources. It does not define routes or auth policy.
- **`app.ts` owns HTTP composition.** It registers middleware and route modules and receives dependencies such as the BetterAuth handler and allowed origins. It does not create database clients or read `process.env`.
- **`auth/better-auth.ts` owns BetterAuth setup.** It configures BetterAuth, plugins, sessions, cookies, and credential rules using validated configuration, the database adapter, and the user model. It does not register Hono routes or start the server.
- **`src/db/postgres/client.ts` owns PostgreSQL resources.** It creates the PostgreSQL pool and Kysely adapter. The server owns closing the pool.
- **`http/middleware/` owns one transport concern per module.** Keep CORS and access logging independent. Logs may include method, path, status, and duration; never log bodies, cookies, credentials, tokens, or secrets.
- **`http/routes/` owns transport mapping.** The health route returns liveness. The BetterAuth route forwards requests to BetterAuth; the internal provisioning route authenticates the shared service token and delegates identity creation to BetterAuth's server API.
- **`models/user.ts` owns the BetterAuth user schema configuration.** Keep BetterAuth field mappings and approved identity/profile fields here; do not duplicate BetterAuth's user model in another ORM or a hand-maintained SQL schema.
- **`config/` owns environment parsing and validation.** No other module reads `process.env` directly.
- **`db/migrate.ts` owns explicit schema migration execution.** Never run migrations during server startup.

The composition direction is:

```text
server → database + BetterAuth + Hono app
Hono app → middleware + routes
BetterAuth → validated config + database adapter + user model
```

Pass dependencies at composition boundaries instead of importing the server, HTTP app, or global database pool from lower-level modules. Keep request/response details out of database code and database details out of HTTP routes.

## User schema changes

BetterAuth supports extending its user schema through `user.additionalFields`. Put approved BetterAuth user field configuration in `src/models/user.ts` and pass it to the `user` option in `src/auth/better-auth.ts`. `userModel` maps BetterAuth fields, including the admin plugin's internal fields, to the existing database column naming convention; it adds no Churchbase authorization fields.

Before adding a field, establish that it belongs to authentication identity/profile data. Church, ministry, membership, and role data belong to the Go API and must not be copied into BetterAuth's user table. Mark server-managed additional fields with `input: false` so clients cannot set them. After changing the BetterAuth schema, run `bun run --cwd apps/auth db:migrate` explicitly and review the schema changes; never migrate on service startup. See [Better Auth user and account fields](https://better-auth.com/docs/concepts/users-accounts) and [additional field typing](https://better-auth.com/docs/concepts/typescript).

## Keep the service small

- BetterAuth owns credential and session workflows. Do not add controller, domain, repository, or use-case layers that only wrap BetterAuth calls.
- Churchbase church, ministry, membership, and role rules belong to the Go API, not this service.
- Add a Churchbase-owned auth module only for a concrete requirement BetterAuth does not provide, such as an approved account-provisioning flow.
- Keep one file per responsibility, not one file per function. Split a module when it has distinct reasons to change or becomes hard to understand.
- Do not create empty directories or modules to match the tree; add each when its first responsibility is implemented.
