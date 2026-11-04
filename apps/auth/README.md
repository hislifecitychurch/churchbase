# Churchbase Auth

Bun/Hono service for BetterAuth identity and sessions. BetterAuth owns its PostgreSQL tables in the `auth` schema; `apps/api/` owns Churchbase business data and authorization.

## Local development

```sh
cp apps/auth/.env.example apps/auth/.env
docker compose -f apps/api/compose.yaml up -d --wait postgres
bun run --cwd apps/auth db:migrate
bun run --cwd apps/auth dev
```

The service listens on `http://localhost:34081`. Liveness is `GET /health`; BetterAuth endpoints are mounted at `/api/v1/auth`. To create a disposable local account through BetterAuth, set `AUTH_ALLOW_EMAIL_SIGN_UP=true` in `apps/auth/.env` and call `POST /api/v1/auth/sign-up/email` with `name`, `email`, and `password`. Sign-up is rejected in staging and production.

Run `bun run --cwd apps/auth check-types` for the package type check. `db:migrate` requires PostgreSQL and must be run explicitly; service startup never changes the schema.

## Current scope

Email/password sign-in and sessions are configured. Email verification, password reset delivery, account invitations/provisioning, and the app login client are not implemented yet. Production account creation stays closed until Churchbase defines its invitation or administrator-provisioning flow.

Production deployments must set `ENVIRONMENT=production`, an HTTPS `BETTER_AUTH_URL`, a strong `BETTER_AUTH_SECRET`, exact `CORS_ALLOWED_ORIGINS`, `AUTH_DATABASE_URL`, and the narrow shared cookie domain required by sibling apps. Every subdomain covered by that cookie domain is in the session-cookie trust boundary.
