# Churchbase Auth

Bun/Hono service for BetterAuth identity and sessions. BetterAuth owns its PostgreSQL tables in the `auth` schema; `apps/api/` owns Churchbase business data and authorization.

## Local development

The example intentionally leaves values blank. Before running the migration or service, set `PORT`, `ENVIRONMENT`, `RL_DB_URL`, `AUTH_ALLOW_EMAIL_SIGN_UP`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `CORS_ALLOWED_ORIGINS`, `CORS_ALLOWED_METHODS`, `CORS_ALLOWED_HEADERS`, and `CORS_ALLOW_CREDENTIALS`. `CORS_EXPOSE_HEADERS` may be empty. CORS list values are comma-separated. To enable the protected provisioning route, also set `AUTH_SERVICE_TOKEN` to the same 32+ character value used by `apps/api/`. The local database container is optional when `RL_DB_URL` points to a managed PostgreSQL service.

```sh
cp apps/auth/.env.example apps/auth/.env
docker compose -f apps/api/compose.yaml up -d --wait postgres # optional local database
bun run --cwd apps/auth db:migrate
bun run --cwd apps/auth dev
```

The service listens on `http://localhost:36081`. Liveness is `GET /health`; BetterAuth endpoints are mounted at `/api/v1/auth`. Sign in with `POST /api/v1/auth/sign-in/email` or `POST /api/v1/auth/sign-in/username`. To create a disposable local account through BetterAuth, set `AUTH_ALLOW_EMAIL_SIGN_UP=true` in `apps/auth/.env` and call `POST /api/v1/auth/sign-up/email` with `name`, `email`, `password`, and optionally `username`. Sign-up is rejected in staging and production.

Run `bun run --cwd apps/auth check-types` for the package type check. `db:migrate` requires PostgreSQL and must be run explicitly; service startup never changes the schema.

## Current scope

Email-or-username/password sign-in and sessions are configured with BetterAuth's username and admin plugins. The API CLI may provision a new identity through the service-token-protected `POST /internal/provision-user` route; this creates only a BetterAuth identity with its default Auth role, while the Go API separately grants Churchbase `platform_role=admin`. The route is unavailable when `AUTH_SERVICE_TOKEN` is unset. After enabling the plugins on an existing database, run `bun run --cwd apps/auth db:migrate` to add their schema fields. Public email sign-up remains disabled in staging and production. Email verification, password reset delivery, account invitations, and the app login client are not implemented.

Production deployments must set `ENVIRONMENT=production`, an HTTPS `BETTER_AUTH_URL`, a strong `BETTER_AUTH_SECRET`, exact `CORS_ALLOWED_ORIGINS`, `RL_DB_URL`, and the narrow shared cookie domain required by sibling apps. Every subdomain covered by that cookie domain is in the session-cookie trust boundary.
