# Postman API documentation

The native Postman resources in [`collections/-v1/`](collections/-v1/) document Churchbase's public, versioned API and Auth sign-in flow. The collection tree is organized by route segment; every request contains its full URL, authentication notes, body when applicable, and saved response examples. Keep this resource tree as the single source of truth rather than generating a separate collection.

Read [the shared authoring guide](../.agents/postman-api-documentation.md) before adding or changing requests. The collection is automatically registered in Postman Local View by `.postman/resources.yaml`.

## Local environment

Use a disposable local database and local services only. Select or create a Git-ignored Postman environment with these values:

| Variable | Local value / purpose |
| --- | --- |
| `host-api` | `http://localhost:36080/api` |
| `host-auth` | `http://localhost:36081/api` |
| `email` | Email for a disposable local Auth identity |
| `username` | Username for that identity, if configured |
| `password` | Password for that identity |

Keep actual credentials and tokens in the local environment, never in collection resources or saved examples. Files under `postman/environments/*.environment.yaml` are Git-ignored.

## Try the current-user flow

1. Start the API and Auth against disposable local data. Do not use a shared or production database for this flow.
2. Provision a local Churchbase user with the API's platform-admin CLI, or use an already-provisioned disposable local identity.
3. Run **`/email`** or **`/username`** under `/auth/sign-in`. BetterAuth sets the session cookie; Postman stores it in the cookie jar.
4. Run **`/me`** under `/users`. Postman sends the session cookie to the API. An Auth identity without a Churchbase API user returns `403`.
5. Use `/health/live` and `/health/ready` under `/health` to check API liveness and dependency readiness; neither requires authentication.

Saved response examples use synthetic data and redacted session values. Do not replace them with real credentials, cookies, or member information.

## Validate local resources

```sh
postman collection lint postman/collections/-v1
postman workspace lint
```

If collection execution is unavailable because the Postman CLI is not logged in, use Postman Local View. Do not publish or run these requests against a non-local target without explicit authorization.
