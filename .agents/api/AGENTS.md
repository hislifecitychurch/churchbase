# Churchbase API guidance

## Scope

`apps/api/` is the Go/Fiber business API. BetterAuth in `apps/auth/` owns identity and sessions. The API owns Churchbase data and authorization: churches, ministries, memberships, roles, and ministry features. PostgreSQL is the source of truth; Ent is the API persistence model; Atlas owns versioned API migrations. Redis is connected for readiness and can support a concrete ephemeral need, not business records.

BetterAuth owns login identities, credentials, and sessions. The API's `User` is a Churchbase business/directory record with optional `first_name` and `last_name` fields and an opaque `auth_user_id` link; it must not copy credentials, sessions, or BetterAuth-owned identity fields. Do not read or migrate BetterAuth's schema from the API, and do not run schema changes during API startup.

## Required references

- Read the relevant [architecture reference](architecture/_index.md) before changing API boundaries, routes, authentication, persistence, errors, configuration, or tests.
- Read a [feature guide](guides/) when one exists for the business rules being changed.
- Keep feature guides factual; do not describe planned behavior as implemented.
- Rate limiting is deferred pending algorithm research; do not add rate-limit configuration or middleware yet.

## Recommended structure

```text
apps/api/
├── cmd/
│   ├── api/                         process entrypoint
│   └── <operator-command>/          CLI entrypoint when needed
├── ent/schema/                      Ent source schemas
├── internal/
│   ├── app/                         startup, wiring, graceful shutdown
│   ├── config/                      environment parsing and validation
│   ├── adapter/
│   │   ├── postgres/repository/     Ent-backed repository implementations
│   │   ├── betterauth/              BetterAuth HTTP clients
│   │   └── redis/                   Redis client
│   ├── delivery/http/               Fiber routes and versioning
│   │   └── v1/<feature>/
│   ├── handler/<feature>/           HTTP input/output mapping
│   ├── application/                 entrypoint-agnostic cross-feature use cases
│   ├── domain/<feature>/            business rules and repository ports
│   ├── middleware/                  auth, request ID, CORS
│   └── shared/                      small cross-feature contracts
└── test/
    ├── unit/
    ├── integration/
    └── e2e/
```

This is a placement guide, not a checklist of folders to create. Add a directory with its first real file. Do not create empty folders or placeholder features for symmetry.

## Dependency direction

```text
delivery/http → handler ─┐
cmd/CLI ──────────────────┴→ application (when composing features) → domain service → repository port
adapter/postgres/repository implements the repository port → Ent/PostgreSQL
```

- `internal/app/` is the composition root and owns concrete wiring and process lifecycle.
- `internal/config/` parses and validates configuration; feature code does not read process environment directly.
- `internal/delivery/http/` owns Fiber route registration, versioning, and middleware composition.
- `internal/handler/` translates HTTP requests and responses; it does not query Ent or own business workflows.
- `internal/application/` composes multiple domain services for a cross-feature use case; handlers and CLI entrypoints may call it. Keep business rules in their owning domain feature.
- `internal/domain/<feature>/` owns business models, rules, services, and repository ports. A feature service may coordinate its own repository ports; it must not import Fiber, Ent, or provider clients.
- `internal/adapter/postgres/repository/` implements domain repository ports with Ent. Keep it limited to persistence, mapping, and database error handling—no business rules.
- Other `internal/adapter/` packages own Redis, BetterAuth HTTP calls, and provider-specific error mapping.
- Keep Ent-generated types inside adapters and map them to domain models at the repository boundary.

## Church and ministry access

- A church is the tenant. A ministry is a scope inside that church.
- Ministry membership and ministry roles are Churchbase business data owned by the API, not BetterAuth identity data.
- Derive the actor from the validated BetterAuth session, then check church and ministry access on the server for every protected operation.
- Never treat a selected ministry, hidden menu item, or client-supplied ministry ID as authorization.
- Keep pastoral care data behind explicit permissions; ministry leadership alone does not grant access.

## Tests and data

- Keep Go tests under `apps/api/test/`, organized by unit, integration, and end-to-end responsibility.
- Keep real PostgreSQL/Redis/auth-service coverage in explicit integration tests. Unit tests use fakes and do not need developer credentials.
- Treat church, member, attendance, care, and ministry records as sensitive. Never log request bodies, cookies, authorization headers, or service tokens.
- Never commit `.env`, credentials, generated Ent output, build output, or local database state.
