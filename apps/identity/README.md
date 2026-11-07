# Churchbase Identity

Shared email-or-username sign-in UI for Churchbase applications. Identity authenticates with BetterAuth at `NEXT_PUBLIC_AUTH_URL`, includes session cookies, and returns only to origins listed in `NEXT_PUBLIC_IDENTITY_ALLOWED_RETURN_ORIGINS`. The default destination is `NEXT_PUBLIC_IDENTITY_DEFAULT_RETURN_URL`. The App's `/login` route forwards users here and preserves a validated return target. These `NEXT_PUBLIC_*` values are public build-time configuration; set them per deployment and never place secrets in them.

## Local development

Copy the safe local configuration, then run from the repository root:

```sh
cp apps/identity/.env.example apps/identity/.env
bun run --cwd apps/identity dev
```

The development server uses <http://localhost:36000>. BetterAuth must allow the Identity and App origins with credentials; the API must allow the App origin for the session-backed `GET /api/v1/users/me` request. The protected layout uses that API response to gate the UI, but authorization remains the API's responsibility.

Run the return-URL security tests with:

```sh
bun run --cwd apps/identity test
```

Build and preview with:

```sh
bun run --cwd apps/identity build
bun run --cwd apps/identity preview
```
