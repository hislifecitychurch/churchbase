# Churchbase Platform

The deployment-wide workspace for global administrators and staff. This first slice uses the shared Identity sign-in flow and verifies access through the API's `GET /api/v1/users/me`; church and ministry management is not implemented yet. UI gating is not an authorization boundary—future data operations must enforce access in the API.

## Local development

Copy the safe configuration and run from the repository root:

```sh
cp apps/platform/.env.example apps/platform/.env
bun run --cwd apps/platform dev
```

Platform runs at <http://localhost:36001>. Identity must allow that exact return origin, and the API must allow it for credentialed requests. Use the existing Identity credentials; Platform does not create accounts.

Build and preview with:

```sh
bun run --cwd apps/platform build
bun run --cwd apps/platform preview
```
