# Churchbase API

Go/Fiber business API. BetterAuth owns identity and sessions; this service owns church and ministry data in PostgreSQL through Ent. Readiness checks PostgreSQL and Redis; Redis is reserved for shared ephemeral data. The API does not run migrations on startup.

## Local development

The example intentionally leaves values blank. Set `RL_DB_URL`, `KV_DB_URL`, and `AUTH_BASE_URL` before starting the API. For local Auth, use `ENVIRONMENT=development` and `AUTH_BASE_URL=http://localhost:36081`. `make infra` starts local PostgreSQL and Redis when you are not using managed services.

```sh
cp .env.example .env
make infra # optional local PostgreSQL and Redis
make atlas/validate
make atlas/apply
make dev
```

The API listens on `:36080`. Liveness is `GET /api/v1/health/live`; readiness is `GET /api/v1/health/ready` and returns `503` until PostgreSQL and Redis respond. `GET /api/v1/me` requires a valid BetterAuth session and returns the Churchbase user ID, platform role, and profile names. It does not expose date of birth, address, or emergency-contact details. `make infra-down` stops the local dependencies.

## API response format

JSON responses use the shared `apps/api/pkg/response` envelope. `data` contains the endpoint payload; errors include stable codes, and metadata carries the request ID and UTC timestamp. `log.user_id`, when present, is the Churchbase user ID—not the BetterAuth ID.

```json
{
  "success": true,
  "message": "Current user retrieved",
  "data": { "id": "...", "platform_role": "admin", "profile": {} },
  "filters": null,
  "errors": [],
  "pagination": null,
  "metadata": { "request_id": "...", "timestamp": "..." },
  "log": { "event": "me.retrieved", "user_id": "...", "status": "info" }
}
```

Run `make generate` after changing an Ent schema. Use `make build` and `make lint` before delivery. Atlas migrations are explicit commands and must be reviewed before applying them to a shared database.

`make atlas/apply` reads the PostgreSQL connection string from `RL_DB_URL` in `.env`.

## Platform admin bootstrap

The CLI creates an API user linked to a BetterAuth identity, its empty user profile, and `platform_role=admin` atomically in the API database; it does not create a church membership. Use an existing Auth identity, or let the CLI create one through Auth's protected provisioning operation. For new identities, configure `AUTH_BASE_URL` and the same 32+ character `AUTH_SERVICE_TOKEN` in both services, then run `bun run --cwd apps/auth db:migrate` to add the BetterAuth admin-plugin fields.

From the repository root, run `bun run --cwd apps/api cli:admin:platform` to launch the interactive prompts. From `apps/api/`, you can also run `make cli/user/platform`. Passwords are masked, the confirmation must match, and the final action defaults to no. For automation, flags require `--yes`; `--password-stdin` reads the password and confirmation from two lines of a protected input file, never from command arguments.

```sh
# Link an existing Auth identity.
make cli/user/platform ARGS='--auth-user-id=existing-auth-id --yes'

# Or create a new identity; the secure file contains the password twice, one per line.
make cli/user/platform ARGS='--email=admin@example.org --first-name=Ada --last-name=Lovelace --password-stdin --yes' < /path/to/secure-password-file
```

If the API write fails after Auth creates the identity, the error includes its Auth user ID so you can retry with `--auth-user-id`. Session validation uses `AUTH_BASE_URL`; the API does not require the internal service token for this. The CLI provisioning operation requires `AUTH_SERVICE_TOKEN`. HTTP Auth URLs are accepted only when `ENVIRONMENT=development`; use HTTPS otherwise.
