# Local development ports

These ports are configured for Churchbase local development. A port is not expected to be listening unless its corresponding service is running.

| Service                   |    Port | Local address            | Configuration                                                    |
| ------------------------- | ------: | ------------------------ | ---------------------------------------------------------------- |
| Staff application         | `36002` | <http://localhost:36002> | `apps/app/package.json`, `apps/app/vite.config.ts`               |
| Cloudflare/Vite inspector |  `9232` | `localhost:9232`         | `apps/app/vite.config.ts` (development only)                     |
| API                       | `34080` | <http://localhost:34080> | `apps/api/.env.example`, `apps/api/internal/config/config.go`    |
| Auth                      | `34081` | <http://localhost:34081> | `apps/auth/.env.example`, `apps/auth/config/app.ts`              |
| PostgreSQL                |  `5432` | `127.0.0.1:5432`         | `apps/api/.env.example`, `apps/api/compose.yaml` (loopback only) |
| Redis                     |  `6379` | `127.0.0.1:6379`         | `apps/api/.env.example`, `apps/api/compose.yaml` (loopback only) |

The staff application's development and preview commands both use `36002`. The API defaults to `34080`, and Auth defaults to `34081`; both can be overridden through their `PORT` environment variable. PostgreSQL and Redis are started with `make infra` from `apps/api/` and stopped with `make infra-down`.

## Port ranges

- `3600X` (`36000`–`36009`) is for user-facing applications and frontends.
- `3408X` (`34080`–`34089`) is for backend services.
- PostgreSQL and Redis use their standard local development ports and bind to loopback only.
