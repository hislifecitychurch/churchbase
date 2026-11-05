# Churchbase API guidance

## Scope

`apps/api/` is the Go/Fiber business API. BetterAuth in `apps/auth/` owns identity and sessions. The API owns Churchbase data and authorization: churches, ministries, memberships, roles, and ministry features. PostgreSQL is the source of truth; Ent is the API persistence model; Atlas owns versioned API migrations. Redis is connected for readiness and can support a concrete ephemeral need, not business records.

BetterAuth owns login identities, credentials, and sessions. The API's `User` is its user/principal record, linked by opaque `auth_user_id` and carrying API-owned platform authorization; personal directory data such as `first_name` and `last_name` belongs to `UserProfile`. The API must not copy credentials, sessions, or BetterAuth-owned identity fields. Do not read or migrate BetterAuth's schema from the API, and do not run schema changes during API startup.

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
│   └── cli/
│       └── user/
│           └── platform/main.go     platform-user CLI entrypoint
├── ent/schema/                      Ent source schemas
├── pkg/response/                    public HTTP response envelope and helpers
├── internal/
│   ├── app/                         startup, wiring, graceful shutdown
│   ├── config/                      environment parsing and validation
│   ├── adapter/
│   │   ├── postgres/repository/<schema>/  Ent-backed repository, one file per operation
│   │   ├── betterauth/                    BetterAuth HTTP clients
│   │   └── redis/                         Redis client
│   ├── delivery/http/               Fiber routes and versioning
│   │   └── v1/<feature>/
│   ├── handler/<feature>/           HTTP input/output mapping
│   ├── application/                 entrypoint-agnostic cross-feature use cases
│   ├── domain/<schema>/             models and repository ports; one per persisted Ent schema
│   │   └── service/                 one file per domain operation
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

- `cmd/cli/user/platform/main.go` is the platform-user CLI entrypoint; parse flags or run masked prompts, wire dependencies, and call the cross-feature workflow in `internal/application/`. Create identities only through the protected Auth operation, never by accessing Auth storage; automation must pass matching passwords via stdin, never flags or logs.
- `internal/app/` is the composition root and owns concrete wiring and process lifecycle.
- `internal/config/` parses and validates configuration; feature code does not read process environment directly.
- `internal/delivery/http/` owns Fiber route registration, versioning, and middleware composition.
- `internal/handler/` translates HTTP requests and responses; it does not query Ent or own business workflows. Keep feature DTOs local to their handler; use `pkg/response/` for the shared public JSON envelope.
- `internal/application/` composes multiple domain services for a cross-feature use case; handlers and CLI entrypoints may call it. Keep business rules in their owning schema domain.
- `internal/domain/<schema>/` owns the model and repository port for one persisted Ent schema (for example, `UserProfile` maps to `user_profile`). Put the service type/constructor in `service/service.go` and each domain operation in its own `service/<operation>.go` file; create no empty placeholders.
- Domain services own workflow invariants and may coordinate repository ports from related schema domains, but repository adapters never call each other. Keep multi-repository writes atomic at the service/use-case boundary. The `user` service must create a `user_profile` for every user, including platform admins. Services must not import Fiber, Ent, or adapter packages. Keep privileged role grants as explicit operations, separate from ordinary user creation input.
- `internal/adapter/postgres/repository/<schema>/repository.go` owns the concrete repository type and constructor. Put each Ent-backed operation in its own file in that schema's repository package. Keep adapters limited to persistence, mapping, and database error handling—no business rules.
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
