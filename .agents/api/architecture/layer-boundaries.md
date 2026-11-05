# Layer boundaries

The Go API uses feature-oriented delivery packages and one domain/repository boundary per persisted Ent schema:

```text
delivery/http → handler → application/domain service → repository port → adapter → Ent/PostgreSQL or external service
```

`internal/app/` is the composition root and may import concrete implementations to wire them together.

| Layer                      | Owns                                                                | Must not own                       |
| -------------------------- | ------------------------------------------------------------------- | ---------------------------------- |
| Delivery                   | Paths, methods, API versions, middleware composition                | Business rules or database queries |
| Handler                    | Fiber input, transport DTOs, principal extraction, response mapping | Ent queries or business workflows  |
| Application/domain service | Use cases, church/ministry rules, orchestration, transaction intent | Fiber, HTTP payloads, SQL, Ent     |
| Domain                     | Schema-domain models, pure rules, domain errors                     | Transport or infrastructure        |
| Repository port            | Data operations required by a use case                              | HTTP or provider-specific behavior |
| Adapter                    | Ent queries, external calls, persistence and provider error mapping | HTTP status or public wording      |
| App wiring                 | Construction and dependency injection                               | Feature behavior                   |

Every persisted Ent schema has its own domain model/repository port and a matching Postgres repository package. A repository adapter touches only its own schema; it never calls another repository adapter or imports another schema's Ent package. Domain services may coordinate related schema ports to enforce invariants atomically (for example, user creation with its profile). Use `internal/application/` for cross-feature workflows or external services. Do not add placeholder operations or layers beyond those boundaries.

When placing a function, ask whether it needs Fiber, makes a business decision, builds an Ent query, or maps a result to JSON. Each responsibility belongs in the corresponding layer above.
