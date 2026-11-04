# BetterAuth architecture guidance

This is the active architecture guidance for `apps/auth/`. Runtime instructions are in [`apps/auth/AGENTS.md`](../../apps/auth/AGENTS.md); architecture details are indexed in [architecture/_index.md](architecture/_index.md).

## Identity ownership

BetterAuth owns Churchbase identities, credential hashes, sessions, verification records, and opaque user IDs. The Go API owns churches, ministries, memberships, roles, and authorization. The API must not duplicate auth users or credentials, and auth must not own ministry business rules.

## Request and persistence boundaries

```text
Browser → Bun server → Hono/CORS → BetterAuth → Kysely/pg → PostgreSQL auth schema
```

- `src/server.ts` owns Bun startup and shutdown.
- `src/http.ts` owns health, CORS, access logging, and delegation to BetterAuth.
- `src/auth.ts` composes BetterAuth and PostgreSQL.
- `config/` validates environment values.
- `db/` owns the explicit BetterAuth migration command.

Do not add API business layers or custom identity workflows until Churchbase owns behavior BetterAuth does not provide.

## Configuration and security

- Keep local values in `apps/auth/.env` and safe placeholders in `.env.example`.
- Require a 32-character BetterAuth secret and explicit trusted browser origins.
- Keep email/password sign-up disabled outside development until account provisioning is defined.
- Production sibling-host session cookies require `BETTER_AUTH_COOKIE_DOMAIN`; that domain is a trust boundary shared by every subdomain that can set cookies.
- Never log request bodies, cookies, authorization headers, credentials, tokens, database URLs, or secrets.

## Persistence

BetterAuth owns its tables in PostgreSQL's `auth` schema. Run `bun run --cwd apps/auth db:migrate` explicitly before starting against a new database. Never manage these tables with API Atlas migrations or run migrations during service startup.

## Reference routing

- Read the relevant reference under `architecture/` before changing auth boundaries, persistence, or runtime behavior.
- Add guides only when Churchbase auth product rules are stable enough to preserve.
- Do not copy Mnemora-specific invitations, platform access, OTP, or email delivery without a Churchbase product requirement.
