# HTTP conventions

## Routes

- Version public API routes under `/api/v1`.
- Keep route registration under `internal/delivery/http/`; add a feature router when its first endpoint exists.
- Keep health checks cheap and unauthenticated.
- Route files register methods, paths, middleware, and handlers only. They do not query persistence or implement business rules.
- Do not publish a menu destination or API path without implementing it or explicitly marking it as a planned contract.

## Handlers and input

Handlers are HTTP adapters. They may depend on Fiber, transport DTOs, response helpers, and service interfaces. They must not depend on Ent-generated types or concrete repositories.

Parse and bound path, query, and body values at the transport boundary. Services still enforce business rules because handlers are not the only possible caller. Keep request and response DTOs beside the operation until another handler genuinely shares them.

## Church and ministry scope

Use explicit church and ministry resource identifiers in routes when an operation is scoped. Resolve the authenticated principal and authorize that scope server-side before reading or changing data. Do not infer access from a frontend route or switcher selection.

## Responses

Define a consistent JSON envelope and status semantics with the first public endpoint, then preserve them. Public messages must be safe and stable. Never return SQL, stack traces, provider payloads, or credentials. Update the frontend client and API contract documentation alongside approved contract changes.
