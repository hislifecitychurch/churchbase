# Persistence and migrations

The API persistence boundary is:

```text
domain service → repository port → repository adapter → Ent → PostgreSQL
```

## Ent ownership

- Keep Ent schemas under `apps/api/ent/schema/`.
- Generate Ent code from those schemas; never hand-edit generated output or commit it.
- Keep Ent types inside repository adapters. Map records to feature models at the repository boundary.
- Run Ent generation before building or testing code that imports generated packages.

## Migration ownership

Atlas is the planned migration tool for API-owned business tables. Keep versioned API migrations separate from BetterAuth migrations. Do not manage BetterAuth's schema from the API, enable Ent automatic schema creation against shared databases, or run migrations during app startup.

Churchbase has no imported API migration baseline yet. When the first schema is designed, decide and document the initial Atlas baseline before applying it to a shared database. Do not copy Mnemora's existing migration history or database-specific migration state.

## Repository behavior

Repositories own filtering, ordering, pagination, transaction details, and database error mapping. Transactions spanning multiple writes are coordinated by the service/use-case boundary.

BetterAuth IDs remain opaque strings. Church-owned records may reference them as external identity values, but the API does not create foreign keys into BetterAuth's schema.
