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

Authentication middleware attaches a small principal to request context; it does not make ministry authorization decisions based on client state.

## Handler and service

The handler reads path/query/body and principal values, parses transport types, calls one service operation, maps stable errors, and converts results to transport DTOs. The service owns business decisions, church/ministry authorization, and transaction intent.

## Adapter and shutdown

Repository ports expose only the operations a use case needs. Adapters own Ent queries, external requests, context timeouts, and provider-specific error mapping. `internal/app/` owns graceful shutdown and closes clients it constructs.
