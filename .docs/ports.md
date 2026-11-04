# Local development ports

These ports are configured for Churchbase local development. A port is not expected to be listening unless its corresponding service is running.

| Service           |    Port | Local address            | Configuration                                                 |
| ----------------- | ------: | ------------------------ | ------------------------------------------------------------- |
| Staff application | `36002` | <http://localhost:36002> | `apps/app/package.json`, `apps/app/vite.config.ts`            |
| API               | `36080` | <http://localhost:36080> | `apps/api/.env.example`, `apps/api/internal/config/config.go` |
| Auth              | `36081` | <http://localhost:36081> | `apps/auth/.env.example`, `apps/auth/config/app.ts`           |

The staff application's development and preview commands both use `36002`. The API defaults to `36080`, and Auth defaults to `36081`; both can be overridden through their `PORT` environment variable.

## Port ranges

- `3600X` (`36000`–`36009`) is for user-facing applications and frontends.
- `3608X` (`36080`–`36089`) is for backend services.
