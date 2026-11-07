# Churchbase Identity

Shared email-or-username sign-in and workspace chooser for Churchbase applications. Identity authenticates with BetterAuth at `NEXT_PUBLIC_AUTH_URL`, then reads the Churchbase `platform_role` from the API using the session cookie. Admins and staff see `/workspace`, where App is available and Platform is disabled until it exists; regular users go directly to their validated App return URL. These `NEXT_PUBLIC_*` values are public build-time configuration; set them per deployment and never place secrets in them.

## Local development

Copy the safe local configuration, then run from the repository root:

```sh
cp apps/identity/.env.example apps/identity/.env
bun run --cwd apps/identity dev
```

The development server uses <http://localhost:36000>. BetterAuth must allow the Identity and App origins with credentials; the API must allow both origins for the session-backed `GET /api/v1/users/me` request. The workspace chooser is only a navigation decision; API authorization remains server-side.

Run the return-URL security tests with:

```sh
bun run --cwd apps/identity test
```

Build and preview with:

```sh
bun run --cwd apps/identity build
bun run --cwd apps/identity preview
```
