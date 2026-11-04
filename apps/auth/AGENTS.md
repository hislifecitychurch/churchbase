# Churchbase auth instructions

Read [`.agents/auth/AGENTS.md`](../../.agents/auth/AGENTS.md) and the relevant reference under [`.agents/auth/architecture/`](../../.agents/auth/architecture/_index.md) before changing identity ownership, sessions, persistence, or runtime behavior.

## Stack and boundaries

- Bun and TypeScript host the service.
- Hono owns HTTP routing and CORS; BetterAuth owns credential and session behavior.
- Kysely/pg connect BetterAuth to PostgreSQL's `auth` schema.
- The Go API owns church, ministry, membership, role, and authorization data.
- Keep API Atlas migrations away from the auth schema. Run `db:migrate` explicitly, never during startup.

## Local commands

```sh
cp apps/auth/.env.example apps/auth/.env
docker compose -f apps/api/compose.yaml up -d --wait postgres
bun run --cwd apps/auth db:migrate
bun run --cwd apps/auth dev
bun run --cwd apps/auth check-types
```

Set `AUTH_ALLOW_EMAIL_SIGN_UP=true` only in local development when creating a disposable development account. It is rejected outside development. `.env` and credentials must never be committed.

## Security

- Keep trusted browser origins explicit and use credentialed CORS only with those origins.
- Production cross-subdomain cookies require a configured parent domain; treat every matching subdomain as trusted to set cookies.
- Never log bodies, cookies, authorization headers, credentials, database URLs, or tokens.
- Do not add Churchbase roles, ministry membership, invitation rules, or duplicated user records to BetterAuth.

## Completion

Update `.env.example` and `README.md` when configuration or local operation changes. Run the narrowest relevant type/build checks. Never commit `.env`, generated output, or database state.
