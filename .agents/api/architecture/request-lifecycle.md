# Request lifecycle

A request moves in one direction:

```text
HTTP request
  → Fiber route and middleware
  → handler parses transport input and principal
  → application/domain service validates and orchestrates
  → repository port
  → adapter executes Ent or external work
  → handler maps result and safe error
  → HTTP response
```

## Route and middleware

The route registers method, path, middleware, and handler. Middleware owns cross-cutting transport concerns such as request IDs, CORS, session validation, and access logging. Keep request logs useful without recording cookies, authorization headers, service tokens, or request bodies.

Authentication middleware attaches the validated opaque BetterAuth user ID to request context; it does not make ministry authorization decisions based on client state.

## Handler and service

The handler reads path/query/body and principal values, parses transport types, calls one service operation, maps stable errors, and converts results to transport DTOs. Keep request and response DTOs in `internal/handler/<feature>/`, beside the handler that owns their HTTP contract.

### Validation ownership

- Validate HTTP shape and syntax in the feature handler package: required request fields, UUID or timestamp parsing, string limits, and query parameter ranges. For a one-off rule, use a private helper or a `valid`/`Validate` method beside that request DTO; add a feature-local `validation.go` only when the validation logic warrants its own file.
- Validate business invariants in the owning schema domain under `internal/domain/<schema>/` so they apply regardless of whether a request came from HTTP, a CLI, or another service. Put invariants spanning related schemas in the coordinating domain service.
- Enforce database invariants in Ent fields, indexes, and annotations, with the corresponding versioned Atlas migration.
- Do not pass HTTP DTOs into domain services or make domain code depend on handlers. Do not create a shared `validator/` package for a rule used by one feature; extract one only when multiple features share the same rule and semantics.

The service owns business decisions, church/ministry authorization, and transaction intent.

## Adapter and shutdown

Repository ports expose only the operations a use case needs. Adapters own Ent queries, external requests, context timeouts, and provider-specific error mapping. `internal/app/` owns graceful shutdown and closes clients it constructs.
