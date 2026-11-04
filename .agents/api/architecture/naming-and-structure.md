# Naming and structure

Use names that identify the resource and operation. Avoid generic `manager`, `helper`, or `utils` packages when ownership is unclear.

## Application layout

```text
apps/api/
├── cmd/api/                    executable entrypoint
├── ent/schema/                 Ent source schemas
├── internal/
│   ├── app/                    bootstrap and dependency composition
│   ├── config/                 environment parsing and validation
│   ├── adapter/                PostgreSQL, Redis, BetterAuth integrations
│   ├── delivery/http/v1/       versioned route registration
│   ├── handler/<feature>/      HTTP handlers and transport mapping
│   ├── application/            thin handler-facing composition
│   ├── domain/<feature>/       feature rules and repository ports
│   ├── middleware/             cross-cutting request behavior
│   └── shared/                 small cross-feature contracts
└── test/                       unit, integration, and end-to-end tests
```

This is a placement guide. Do not add empty directories or placeholder files just to match it. Add a feature directory with its first real file.

## Where feature code belongs

| Concern                    | Location                                  | Responsibility                                                                                                                                                               |
| -------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Executable entrypoint      | `cmd/api/main.go`                         | Load configuration, handle process signals, and call `app.New` / `Run`.                                                                                                      |
| Composition root           | `internal/app/app.go`                     | Construct concrete dependencies, connect handlers and routes, and own shutdown. Wire dependencies directly here; add a generator only if the graph becomes hard to maintain. |
| Domain model and service   | `internal/domain/<feature>/`              | Own feature models, business rules, and use cases without importing Fiber, Ent, or provider clients.                                                                         |
| Repository port            | `internal/domain/<feature>/repository.go` | Declare only the persistence operations the feature service needs.                                                                                                           |
| Repository implementation  | `internal/adapter/postgres/`              | Implement domain repository ports with Ent, map Ent records to domain models, and own persistence errors and transactions.                                                   |
| Ent persistence schema     | `ent/schema/`                             | Define database entities, fields, edges, indexes, and reusable schema mixins. Atlas migrations live under `ent/migrate/migrations/`.                                         |
| Handler and transport DTOs | `internal/handler/<feature>/`             | Parse HTTP input, define request/response types, call application or domain services, and map results and errors to HTTP.                                                    |
| Feature routes             | `internal/delivery/http/v1/<feature>/`    | Register the feature's versioned paths, methods, middleware, and handlers.                                                                                                   |
| Cross-feature facade       | `internal/application/`                   | Expose a thin handler-facing facade when it composes multiple domain services; don't duplicate a single feature service without a need.                                      |

Keep one-off request validation beside its request DTO in `internal/handler/<feature>/`. Put business validation in the feature's domain model or service, and database invariants in Ent schema constraints and Atlas migrations. Add a shared validation package only after multiple features need the same rule.

## Feature layout

```text
internal/domain/<feature>/
├── model.go
├── service.go
├── repository.go
└── errors.go                    only when the feature needs its own errors

internal/handler/<feature>/
├── handler.go
├── request.go                   when request DTOs need a separate file
└── response.go                  when response DTOs need a separate file

internal/delivery/http/v1/<feature>/
```

Start with files in the feature package; split into subpackages only when a real boundary or size makes that clearer. Keep domain models separate from Ent records and transport DTOs. Keep provider payloads beside their adapter. Do not create empty files or a global validator/utilities package for one-off code.
