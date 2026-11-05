# BetterAuth architecture guidance

This is the active architecture guidance for `apps/auth/`. Runtime instructions are in [`apps/auth/AGENTS.md`](../../apps/auth/AGENTS.md); architecture details are indexed in [architecture/_index.md](architecture/_index.md).

## Identity ownership

BetterAuth owns Churchbase login identities, credential hashes, sessions, verification records, and opaque user IDs. The Go API owns Churchbase users/directory records, churches, ministries, memberships, roles, and authorization. API `User` records may link to an Auth user by opaque ID, but must not copy authentication identity fields or credentials; auth must not own church or ministry business rules.

## Request and persistence boundaries

```text
Browser → Bun server → Hono/CORS → BetterAuth → Kysely/pg → PostgreSQL auth schema
```

Follow [naming and structure](architecture/naming-and-structure.md) for file placement and separation rules. Do not create empty folders just to match the documented tree.

- `src/server.ts` owns Bun startup, dependency composition, and shutdown.
- `src/app.ts` assembles the Hono application from transport middleware and routes.
- `src/auth/better-auth.ts` configures BetterAuth and its auth policy.
- `src/db/postgres/client.ts` owns the PostgreSQL pool and Kysely adapter.
- `src/http/middleware/` owns independent HTTP middleware; `src/http/routes/` owns health and BetterAuth delegation.
- `src/models/user.ts` owns BetterAuth user field mappings and approved user-schema extensions.
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
