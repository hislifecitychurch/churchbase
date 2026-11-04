# Runtime

Environment parsing belongs under `apps/auth/config/`; only that boundary reads `process.env`. Keep `.env` local and commit only safe placeholders in `.env.example`.

The auth service reads its PostgreSQL connection string from `RL_DB_URL`.

```text
GET /health                         → liveness response
/api/v1/auth and /api/v1/auth/*     → BetterAuth handler
```

- Hono registers CORS before the BetterAuth routes. `config/cors.ts` parses the comma-separated origins, methods, allowed headers, exposed headers, and credential flag from the environment.
- Credentialed CORS uses an exact origin allowlist; the same origins are trusted by BetterAuth. Do not use wildcard origins with credentials.
- Log only method, path, status, and duration. Do not log request or response contents, cookies, tokens, IP addresses, or secrets.
- Health is a liveness check and does not expose database state.
- Bun owns process startup and closes the PostgreSQL pool on shutdown.
- Migrations run as an explicit command, never on startup.
- Shared production cookies use the narrowest configured parent domain. Every matching subdomain is within that cookie trust boundary.

Email delivery, verification, password reset, and account invitations are not configured yet. Add them only with an approved Churchbase flow and a concrete sender.
