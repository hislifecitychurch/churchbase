# Auth architecture references

The active instructions are in [`.agents/auth/AGENTS.md`](../AGENTS.md) and [`apps/auth/AGENTS.md`](../../../apps/auth/AGENTS.md).

- [Identity and boundaries](identity-and-boundaries.md) — ownership between BetterAuth and the business API.
- [Naming and structure](naming-and-structure.md) — service layout and responsibilities.
- [Persistence](persistence.md) — PostgreSQL schema and migration ownership.
- [Runtime](runtime.md) — configuration, Hono, CORS, and process lifecycle.
- [Testing](testing.md) — verification tiers and local service requirements.

```text
Bun → Hono → BetterAuth → Kysely/pg → PostgreSQL auth schema
```

Keep the service thin around BetterAuth. Add Churchbase-owned identity behavior only when a real product rule requires it.
