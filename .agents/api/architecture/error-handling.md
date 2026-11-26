# Error handling

Preserve an error's meaning from the adapter to the HTTP boundary:

```text
adapter error → repository/domain error → service result/error → handler status and safe message
```

## Domain and repository errors

Define stable errors in the owning feature when callers need to distinguish invalid input, not found, forbidden, conflict, or unavailable. Wrap errors without losing identity. Do not import Fiber or response packages into domain code.

Adapters translate Ent, database, Redis, and BetterAuth failures into errors the service can understand. Do not match error strings in handlers.

## Services and handlers

Services enforce business invariants and return domain errors; they do not choose HTTP status codes or public wording. Handlers map known errors to the API contract and safe messages. Unknown errors produce a generic internal response and are logged with a request ID.

Never expose SQL, stack traces, credentials, or raw provider responses. Preserve the distinction between invalid sessions (`401`) and unavailable auth dependencies (`503`).
