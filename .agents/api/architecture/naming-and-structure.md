# Naming and structure

Use names that identify the resource and operation. Avoid generic `manager`, `helper`, or `utils` packages when ownership is unclear.

## Application layout

```text
apps/api/
├── cmd/
│   ├── api/                    API executable entrypoint
│   └── cli/
│       └── user/
│           └── platform/       platform-user CLI executable
├── ent/schema/                 Ent source schemas
├── internal/
│   ├── app/                    bootstrap and dependency composition
│   ├── config/                 environment parsing and validation
│   ├── adapter/
│   │   ├── postgres/repository/<schema>/  Ent-backed repository per schema
│   │   ├── betterauth/                    BetterAuth integrations
│   │   └── redis/                         Redis integration
│   ├── delivery/http/v1/       versioned route registration
│   ├── handler/<feature>/      HTTP handlers and transport mapping
│   ├── application/            cross-feature use-case composition
│   ├── domain/<schema>/        model and repository port per persisted Ent schema
│   │   └── service/            one file per domain operation
│   ├── middleware/             cross-cutting request behavior
│   └── shared/                 cross-feature contracts, including actor and response
└── test/                       unit, integration, and end-to-end tests
```

This is a placement guide. Do not add empty directories or placeholder files just to match it. Add a feature directory with its first real file.

## Where feature code belongs

| Concern                    | Location                                         | Responsibility                                                                                                                                                                                                                                                      |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API entrypoint             | `cmd/api/main.go`                                | Load configuration, handle process signals, and call `app.New` / `Run`.                                                                                                                                                                                             |
| API response contract     | `internal/shared/response/`                     | Define the API-wide HTTP JSON envelope and helpers; keep feature-specific data DTOs beside their handlers.                                                                                                                                                            |
| Operator CLI entrypoint    | `cmd/cli/<feature>/<scope>/main.go`              | Parse CLI input, wire dependencies, and call domain/application services; keep business rules out of the CLI. Platform-user bootstrapping belongs in `cmd/cli/user/platform/` and provisions identities through the protected Auth operation.                       |
| Composition root           | `internal/app/app.go`                            | Construct concrete dependencies, connect handlers and routes, and own shutdown. Wire dependencies directly here; add a generator only if the graph becomes hard to maintain.                                                                                        |
| Domain model and service   | `internal/domain/<schema>/`                      | Give each persisted Ent schema its own domain model and repository port. Put the service type/constructor in `service/service.go` and each operation in `service/<operation>.go`; services own business invariants and coordinate related schema ports when needed. |
| Repository port            | `internal/domain/<schema>/repository.go`         | Declare only the operations needed for that schema; keep the interface beside its domain model.                                                                                                                                                                     |
| Repository implementation  | `internal/adapter/postgres/repository/<schema>/` | Put the concrete repository type and constructor in `repository.go`; put each Ent-backed operation in its own file. Map records/errors here, keep business rules out, and coordinate transaction scope at the service/use-case boundary.                            |
| Ent persistence schema     | `ent/schema/`                                    | Define database entities, fields, edges, indexes, and reusable schema mixins. Atlas migrations live under `ent/migrate/migrations/`.                                                                                                                                |
| Handler and transport DTOs | `internal/handler/<feature>/`                    | Parse HTTP input, define request/response types, call application or domain services, and map results and errors to HTTP.                                                                                                                                           |
| Feature routes             | `internal/delivery/http/v1/<feature>/`           | Register the feature's versioned paths, methods, middleware, and handlers.                                                                                                                                                                                          |
| Cross-feature use case     | `internal/application/`                          | Compose multiple domain services or external operations; keep it entrypoint-agnostic so HTTP handlers and CLI commands can reuse it.                                                                                                                                |

## Dependency direction

```text
delivery/http → handler ─┐
cmd/CLI ──────────────────┴→ application (only when composing features) → domain service → repository port
handler/middleware → internal/shared/response
adapter/postgres/repository implements the repository port → Ent/PostgreSQL
```

Each persisted Ent schema has one matching domain package and Postgres repository package, named in snake_case (for example, `UserProfile` → `user_profile`). A repository adapter operates only on its own schema and never calls another repository adapter. Domain services coordinate related schema repository ports when a business invariant spans them; for example, the `user` service creates both the user and its `user_profile` atomically. Keep privileged role grants as explicit operations, separate from ordinary create inputs. Domain code must not import Ent or adapter packages. Use `internal/application/` for cross-feature workflows or external operations, not as a pass-through for every call.

Keep one-off request validation beside its request DTO in `internal/handler/<feature>/`. Put business validation in the owning schema-domain model or service; put invariants spanning related schemas in the coordinating domain service. Put database invariants in Ent schema constraints and Atlas migrations. Add a shared validation package only after multiple domains need the same rule.

## Feature layout

```text
internal/domain/<schema>/
├── model.go
├── repository.go                repository port
├── errors.go                    only when the feature needs its own errors
└── service/
    ├── service.go               service type and constructor
    ├── create.go
    ├── create_platform_admin.go   explicit privileged user creation
    ├── get_all.go
    ├── get_by_id.go
    ├── update_by_id.go
    └── delete_by_id.go

internal/adapter/postgres/repository/<schema>/
├── repository.go                concrete repository type and constructor
├── create.go
├── create_platform_admin.go      when the schema has a privileged create operation
├── get_all.go
├── get_by_id.go
├── update_by_id.go
└── delete_by_id.go

internal/handler/<feature>/
├── handler.go
├── request.go                   when request DTOs need a separate file
└── response.go                  when response DTOs need a separate file

internal/delivery/http/v1/<feature>/
```

Use the per-operation service and repository layout shown above, but create files only for operations being implemented—never add empty placeholders. Domain services may coordinate repository ports from related schema domains and must keep multi-repository writes atomic. Use `internal/application/` for cross-feature workflows or external operations. Keep domain models separate from Ent records and transport DTOs. Keep provider payloads beside their adapter. Do not create a global validator/utilities package for one-off code.
