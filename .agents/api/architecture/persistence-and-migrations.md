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

Atlas owns versioned migrations for API-owned business tables. Keep them separate from BetterAuth migrations. Do not manage BetterAuth's schema from the API, enable Ent automatic schema creation against shared databases, or run migrations during app startup.

The initial Churchbase API schema contains the church tenant table only, with a matching first Atlas migration. This is a new local baseline; do not copy Mnemora's migration history or apply it to a shared database without review. Do not run migrations during application startup.

## Repository behavior

Repositories own filtering, ordering, pagination, transaction details, and database error mapping. Transactions spanning multiple writes are coordinated by the service/use-case boundary.

BetterAuth IDs remain opaque strings. Church-owned records may reference them as external identity values, but the API does not create foreign keys into BetterAuth's schema.
