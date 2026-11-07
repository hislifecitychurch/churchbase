# Churchbase Auth

Bun/Hono service for BetterAuth identity and sessions. BetterAuth owns its PostgreSQL tables in the `auth` schema; `apps/api/` owns Churchbase business data and authorization.

## Local development

The example defaults to local development at port 36081 and includes exact CORS origins for Identity and App. Before running the migration or service, set `RL_DB_URL` and a 32+ character `BETTER_AUTH_SECRET`. Keep `AUTH_ALLOW_EMAIL_SIGN_UP=false` unless creating disposable local accounts. CORS origins, methods, and headers are comma-separated; session-cookie requests require `CORS_ALLOW_CREDENTIALS=true`. For deployment, use exact browser origins and an HTTPS `BETTER_AUTH_URL`. To enable the protected provisioning route, also set `AUTH_SERVICE_TOKEN` to the same 32+ character value used by `apps/api/`. PostgreSQL must already be available at `RL_DB_URL`; this repository does not provide a Docker bootstrap.

```sh
cp apps/auth/.env.example apps/auth/.env
bun run --cwd apps/auth db:migrate
bun run --cwd apps/auth dev
```

The service listens on `http://localhost:36081`. Liveness is `GET /health`; BetterAuth endpoints are mounted at `/api/v1/auth`. Sign in with `POST /api/v1/auth/sign-in/email` or `POST /api/v1/auth/sign-in/username`. To create a disposable local account through BetterAuth, set `AUTH_ALLOW_EMAIL_SIGN_UP=true` in `apps/auth/.env` and call `POST /api/v1/auth/sign-up/email` with `name`, `email`, `password`, and optionally `username`. Sign-up is rejected in staging and production.

Run `bun run --cwd apps/auth check-types` for the package type check. `db:migrate` requires PostgreSQL and must be run explicitly; service startup never changes the schema.

## API documentation

The native Postman collection in [`postman/collections/-v1/`](../../postman/collections/-v1/) documents the email and username sign-in request bodies, session-cookie flow, and response examples. Follow the shared [Postman authoring guide](../../.agents/postman-api-documentation.md) when changing Auth endpoints.

## Current scope

Email-or-username/password sign-in and sessions are configured with BetterAuth's username and admin plugins; `apps/identity` calls BetterAuth and returns to an allowlisted app origin. The App then loads its Churchbase user through `GET /api/v1/users/me`; API authorization remains server-side. The API CLI may provision a new identity through the service-token-protected `POST /internal/provision-user` route; this creates only a BetterAuth identity with its default Auth role, while the Go API separately grants Churchbase `platform_role=admin`. The route is unavailable when `AUTH_SERVICE_TOKEN` is unset. After enabling the plugins on an existing database, run `bun run --cwd apps/auth db:migrate` to add their schema fields. Public email sign-up remains disabled in staging and production. Email verification, password-reset delivery, and account invitations are not implemented.

Production deployments must set `ENVIRONMENT=production`, an HTTPS `BETTER_AUTH_URL`, a strong `BETTER_AUTH_SECRET`, exact `CORS_ALLOWED_ORIGINS`, `RL_DB_URL`, and the narrow shared cookie domain required by sibling apps. Every subdomain covered by that cookie domain is in the session-cookie trust boundary.
