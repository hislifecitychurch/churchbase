# Naming and structure

Keep the Auth service thin around BetterAuth. Separate process lifecycle, HTTP transport, BetterAuth configuration, and database resources so each area has a clear reason to change.

## Current layout

The current source is still compact:

```text
apps/auth/
├── config/          validated environment configuration
├── db/migrate.ts    explicit BetterAuth migration command
├── lib/             shared config loading
└── src/
    ├── auth.ts      BetterAuth configuration and PostgreSQL setup
    ├── http.ts      Hono middleware, health, and BetterAuth delegation
    └── server.ts    Bun startup and shutdown
```

The files have not yet been moved into the target layout below. Keep this distinction clear in code reviews and documentation.

## Target source layout

Use this structure as the existing modules are separated or new responsibilities are added:

```text
apps/auth/src/
├── server.ts                         Bun entrypoint and resource lifecycle
├── app.ts                            Hono application composition
├── auth/
│   └── better-auth.ts                BetterAuth instance and auth policy
├── database/
│   └── postgres.ts                   PostgreSQL pool and Kysely adapter
└── http/
    ├── middleware/
    │   ├── access-log.ts             safe request metadata logging
    │   └── cors.ts                   trusted-origin CORS policy
    └── routes/
        ├── health.ts                 liveness endpoint
        └── better-auth.ts            delegate auth requests to BetterAuth
```

Keep `config/`, `lib/`, and `db/migrate.ts` at their current package-level locations. Do not create empty directories or move files only to make the tree match; make each move when it gives a real responsibility a clear home.

## Separation of concerns

- **`server.ts` owns process lifecycle.** It composes dependencies, starts `Bun.serve`, handles shutdown signals, and closes resources. It does not define routes or BetterAuth policy.
- **`app.ts` owns HTTP composition.** It registers middleware and routes and receives dependencies such as the BetterAuth handler. It does not create database clients or read `process.env`.
- **`database/postgres.ts` owns database resources.** It creates the PostgreSQL pool and Kysely adapter and exposes the resource lifecycle needed for shutdown. It contains no HTTP or identity policy.
- **`auth/better-auth.ts` owns BetterAuth setup.** It configures BetterAuth, its plugins, sessions, and credential rules using validated configuration and the database adapter. It does not register Hono routes or start the server.
- **HTTP middleware owns one transport concern each.** Keep CORS and access logging independent. Logs may include method, path, status, and duration; never log bodies, cookies, credentials, tokens, or secrets.
- **HTTP routes own transport mapping.** The health route returns liveness. The BetterAuth route forwards the request to BetterAuth; do not reimplement BetterAuth endpoints in Hono.
- **`config/` owns environment parsing and validation.** No other module reads `process.env` directly.
- **`db/migrate.ts` owns explicit schema migration execution.** Never run migrations during server startup.

The composition direction is:

```text
server → database + BetterAuth + Hono app
Hono app → middleware + routes
BetterAuth → validated config + database adapter
```

Pass dependencies at composition boundaries instead of importing the server, HTTP app, or global database pool from lower-level modules. Keep request/response details out of database code and database details out of HTTP routes.

## Keep the service small

- BetterAuth owns credential and session workflows. Do not add controller, domain, repository, or use-case layers that only wrap BetterAuth calls.
- Churchbase church, ministry, membership, and role rules belong to the Go API, not this service.
- Add a Churchbase-owned auth module only for a concrete requirement BetterAuth does not provide, such as an approved account-provisioning flow.
- Keep one file per responsibility, not one file per function. Split a module when it has distinct reasons to change or becomes hard to understand.
