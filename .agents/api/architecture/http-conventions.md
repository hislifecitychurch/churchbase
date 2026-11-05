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

Wrap JSON responses from API handlers, including health and middleware failures, with `pkg/response.Envelope` and its `Success`, `Failure`, `FailureWithError`, and `JSON` helpers. Keep feature-specific `data` DTOs beside their handlers. The envelope carries `success`, `message`, `data`, `filters`, `errors`, `pagination`, `metadata` (request ID and UTC timestamp), and `log` (event, optional API user ID, status).

Preserve the HTTP status code independently of the envelope. Use stable error codes and safe public messages; never return SQL, stack traces, provider payloads, BetterAuth IDs, or credentials. Do not put sensitive member data in `log`. Update the frontend client and API contract documentation alongside contract changes.
