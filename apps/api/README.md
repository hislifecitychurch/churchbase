# Churchbase API

Go/Fiber business API. BetterAuth owns identity and sessions; this service owns church and ministry data in PostgreSQL through Ent. Readiness checks PostgreSQL and Redis; Redis is reserved for shared ephemeral data. The API does not run migrations on startup.

## Local development

The example intentionally leaves values blank. Set `RL_DB_URL` and `KV_DB_URL` to reachable services before running migrations or starting the API. `make infra` starts local dependencies when you are not using managed services.

```sh
cp .env.example .env
make infra # optional local PostgreSQL and Redis
make atlas/validate
make atlas/apply
make dev
```

The API listens on `:36080`. Liveness is `GET /api/v1/health/live`; readiness is `GET /api/v1/health/ready` and returns `503` until PostgreSQL and Redis respond. `make infra-down` stops the local dependencies.

Run `make generate` after changing an Ent schema. Use `make build` and `make lint` before delivery. Atlas migrations are explicit commands and must be reviewed before applying them to a shared database.

`make atlas/apply` reads the PostgreSQL connection string from `RL_DB_URL` in `.env`.
