# Local development ports

These ports are configured for Churchbase local development. A port is not expected to be listening unless its corresponding service is running.

| Service            |    Port | Local address            | Configuration                                                 |
| ------------------ | ------: | ------------------------ | ------------------------------------------------------------- |
| Identity portal    | `36000` | <http://localhost:36000> | `apps/identity/package.json`, `apps/identity/vite.config.ts`  |
| Platform workspace | `36001` | <http://localhost:36001> | `apps/platform/package.json`, `apps/platform/vite.config.ts`  |
| Staff application  | `36002` | <http://localhost:36002> | `apps/app/package.json`, `apps/app/vite.config.ts`            |
| API                | `36080` | <http://localhost:36080> | `apps/api/.env.example`, `apps/api/internal/config/config.go` |
| Auth               | `36081` | <http://localhost:36081> | `apps/auth/.env.example`, `apps/auth/config/app.ts`           |

Identity, Platform, and App use ports `36000`, `36001`, and `36002` for development and preview. The API defaults to `36080`, and Auth defaults to `36081`; both can be overridden through their `PORT` environment variable.

## Port ranges

- `3600X` (`36000`–`36009`) is for user-facing applications and frontends.
- `3608X` (`36080`–`36089`) is for backend services.
