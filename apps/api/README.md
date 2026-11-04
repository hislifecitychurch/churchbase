# Churchbase API

Go/Fiber business API. BetterAuth owns identity and sessions; this service owns church and ministry data in PostgreSQL through Ent. Readiness checks PostgreSQL and Redis; Redis is reserved for shared ephemeral data. The API does not run migrations on startup.

## Local development

```sh
cp .env.example .env
make infra # waits for PostgreSQL and Redis health checks
make atlas/validate
make atlas/apply
make dev
```

The API listens on `:36080`. Liveness is `GET /api/v1/health/live`; readiness is `GET /api/v1/health/ready` and returns `503` until PostgreSQL and Redis respond. `make infra-down` stops the local dependencies.

Run `make generate` after changing an Ent schema. Use `make build` and `make lint` before delivery. Atlas migrations are explicit commands and must be reviewed before applying them to a shared database.

Set `RL_DB_URL` to the PostgreSQL connection string in `.env`; `make atlas/apply` uses this value.
