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

## Feature layout

```text
internal/domain/<feature>/
├── model.go
├── errors.go
├── service/
└── repository/                 only when feature-specific placement helps

internal/handler/<feature>/
internal/delivery/http/v1/<feature>/
```

Keep domain models separate from Ent records and transport DTOs. Keep provider payloads beside their adapter. Do not create a global utilities package; promote code only when it has a cohesive, cross-feature owner.
