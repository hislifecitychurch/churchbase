# Go API architecture references

[`AGENTS.md`](../AGENTS.md) is the active API guidance. Read the reference relevant to the change; these documents explain the boundaries and decisions behind it.

## References

- [Layer boundaries](layer-boundaries.md) — ownership and dependency direction.
- [Naming and structure](naming-and-structure.md) — feature layout and file placement.
- [Request lifecycle](request-lifecycle.md) — route-to-response flow.
- [Configuration and infrastructure](configuration-and-infrastructure.md) — configuration, clients, and shutdown.
- [HTTP conventions](http-conventions.md) — Fiber routes, handlers, and public contracts.
- [Authentication and authorization](authentication-and-authorization.md) — BetterAuth sessions and church/ministry access.
- [Persistence and migrations](persistence-and-migrations.md) — Ent, PostgreSQL, and migration ownership.
- [Error handling](error-handling.md) — domain errors and safe HTTP mapping.
- [Testing](testing.md) — test placement and verification.

## Feature guides

Feature guides describe stable product rules, not code layout. Read a relevant guide in addition to the architecture reference when one exists. Create new guides from [`../guides/_template.md`](../guides/_template.md) once the feature rules are stable enough to preserve.
