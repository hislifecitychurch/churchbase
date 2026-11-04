# Layer boundaries

The Go API is a feature-first modular monolith with a small ports-and-adapters boundary:

```text
delivery/http → handler → application/domain service → repository port → adapter → Ent/PostgreSQL or external service
```

`internal/app/` is the composition root and may import concrete implementations to wire them together.

| Layer                      | Owns                                                                | Must not own                       |
| -------------------------- | ------------------------------------------------------------------- | ---------------------------------- |
| Delivery                   | Paths, methods, API versions, middleware composition                | Business rules or database queries |
| Handler                    | Fiber input, transport DTOs, principal extraction, response mapping | Ent queries or business workflows  |
| Application/domain service | Use cases, church/ministry rules, orchestration, transaction intent | Fiber, HTTP payloads, SQL, Ent     |
| Domain                     | Feature models, pure rules, feature errors                          | Transport or infrastructure        |
| Repository port            | Data operations required by a use case                              | HTTP or provider-specific behavior |
| Adapter                    | Ent queries, external calls, persistence and provider error mapping | HTTP status or public wording      |
| App wiring                 | Construction and dependency injection                               | Feature behavior                   |

Use narrow ports at external boundaries. Avoid cross-feature imports of another feature's Ent schema or adapter; coordinate through a service contract where needed. Do not add layers or interfaces for symmetry.

When placing a function, ask whether it needs Fiber, makes a business decision, builds an Ent query, or maps a result to JSON. Each responsibility belongs in the corresponding layer above.
