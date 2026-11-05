# Persistence and migrations

The API persistence boundary is:

```text
domain service → repository port → repository adapter → Ent → PostgreSQL
```

## Ent ownership

- Keep Ent schemas under `apps/api/ent/schema/`.
- Generate Ent code from those schemas; never hand-edit generated output or commit it.
- Generate API-owned UUID identifiers as UUIDv7 in Go; migrations store them as PostgreSQL `uuid` values without a database-side UUIDv4 default.
- In every schema's `Fields()`, list all IDs first (primary, foreign-key, and external IDs), then add one blank line before non-ID fields.
- Keep Ent types inside repository adapters. Each persisted Ent schema has a matching domain package and Postgres repository package; map records to that domain's model at the repository boundary.
- Run Ent generation before building or testing code that imports generated packages.

The church, church-membership, ministry, ministry-membership, user, and user-profile schemas compose `Timestamps`, `Audit`, and `SoftDelete` from `ent/schema/mixin/`. API `User` is a Churchbase directory/business record that may exist without an Auth account; `first_name` and `last_name` are optional API-owned fields, `platform_role` grants operator access to `admin` or `staff` (null is an ordinary user) and is valid only when `auth_user_id` is present; `auth_user_id` is an optional opaque reference, not a copied identity. `created_by`, `updated_by`, and `deleted_by` store optional opaque BetterAuth user IDs with no cross-schema foreign keys. Set the actor from the validated request principal through `internal/shared/actor`; never accept it from request input.

The Postgres Ent client converts delete mutations into updates that set `deleted_at` and, when an actor is present, `deleted_by`. Soft-deleted rows are excluded from normal Ent queries. `mixin.IncludeDeleted(ctx)` is for trusted internal audit or recovery queries; it only includes deleted rows and never enables permanent deletion. Do not add a hard-delete bypass to normal API behavior. A soft delete retains the row; backups and retention policy remain separate concerns.

## Migration ownership

Atlas owns versioned migrations for API-owned business tables. Keep them separate from BetterAuth migrations. Do not manage BetterAuth's schema from the API, enable Ent automatic schema creation against shared databases, or run migrations during app startup.

The first Churchbase API migration creates the church tenant table. Follow-up migrations add memberships, ministries, users, and user profiles. The user migration backfills API users from existing church-membership Auth IDs before switching memberships to reference API user IDs; later migrations add the optional platform role, normalize church/ministry membership role values, and backfill missing user profiles. Runtime user-creation workflows create the user and its profile atomically. This is a new local baseline; do not copy Mnemora's migration history or apply it to a shared database without review. Do not run migrations during application startup.

## Repository behavior

Each repository adapter owns filtering, ordering, pagination, and database error mapping for its own schema; it never calls another repository adapter. The domain service/use-case coordinates transactions that span multiple repository operations.

BetterAuth IDs remain opaque strings. Church-owned records may reference them as external identity values, but the API does not create foreign keys into BetterAuth's schema.
