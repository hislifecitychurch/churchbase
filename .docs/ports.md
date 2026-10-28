# Local development ports

These are the ports reserved for Churchbase local development. A port is not expected to be listening unless its corresponding service is running.

| Service           |    Port | Local address            | Configuration                                      |
| ----------------- | ------: | ------------------------ | -------------------------------------------------- |
| Staff application | `36002` | <http://localhost:36002> | `apps/app/package.json`, `apps/app/vite.config.ts` |
| API (reserved)    | `36080` | <http://localhost:36080> | Reserved; service not configured yet               |
| Auth (reserved)   | `36081` | <http://localhost:36081> | Reserved; service not configured yet               |

The staff application's development and preview commands both use `36002`.

## Port ranges

- `3600X` (`36000`–`36009`) is for user-facing applications and frontends.
- `3608X` (`36080`–`36089`) is for backend services.

API and Auth use the first two backend ports. Database and cache ports are not assigned yet.
