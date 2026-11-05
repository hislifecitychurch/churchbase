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

## Platform admin bootstrap

The CLI creates an API user linked to a BetterAuth identity and grants `platform_role=admin`; it does not create a church membership. Use an existing Auth identity, or let the CLI create one through Auth's protected provisioning operation. For new identities, configure `AUTH_BASE_URL` and the same 32+ character `AUTH_SERVICE_TOKEN` in both services, then run `bun run --cwd apps/auth db:migrate` to add the BetterAuth admin-plugin fields.

From the repository root, run `bun run --cwd apps/api cli:admin:platform` to launch the interactive prompts. From `apps/api/`, you can also run `make cli/user/platform`. Passwords are masked, the confirmation must match, and the final action defaults to no. For automation, flags require `--yes`; `--password-stdin` reads the password and confirmation from two lines of a protected input file, never from command arguments.

```sh
# Link an existing Auth identity.
make cli/user/platform ARGS='--auth-user-id=existing-auth-id --yes'

# Or create a new identity; the secure file contains the password twice, one per line.
make cli/user/platform ARGS='--email=admin@example.org --first-name=Ada --last-name=Lovelace --password-stdin --yes' < /path/to/secure-password-file
```

If the API write fails after Auth creates the identity, the error includes its Auth user ID so you can retry with `--auth-user-id`. HTTP Auth URLs are accepted only when `ENVIRONMENT=development`; use HTTPS otherwise.
