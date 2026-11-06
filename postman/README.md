# API documentation and local Postman workflow

`specs/churchbase-api-v1.yaml` is the OpenAPI 3.1 contract for the Go API. The local `Churchbase API v1` collection is generated from that spec and adds BetterAuth sign-in requests for the local end-to-end flow. `.postman/workflows.yaml` links the spec and collection for Postman CLI sync.

The API runs at `http://localhost:36080`; local BetterAuth runs at `http://localhost:36081`. Create a Postman environment named **Churchbase Local** with `baseUrl`, `authBaseUrl`, `email`, `username`, and `password`. Set the first two to those local URLs and keep credentials only in the local environment. Files under `postman/environments/*.environment.yaml` are Git-ignored because they may contain credentials.

## Try the current-user flow

1. Use a disposable local database and provision a test API user with `make -C apps/api cli/user/platform`. Provisioning writes an Auth identity and a Churchbase platform admin; never run it against production or data you cannot safely modify.
2. Set the test account's email or username and password in the local Postman environment. Do not put credentials or service tokens in the collection or commit them.
3. Run either sign-in request in the collection's **Authentication** folder. Postman stores BetterAuth's `Set-Cookie` response in its cookie jar.
4. Run `GET /api/v1/users/me` in **API v1**. Postman sends the local session cookie; the response contains the Churchbase user ID, platform role, and profile names only.

The API's liveness and readiness probes are unauthenticated. Readiness returns `503` when PostgreSQL or Redis is unavailable. The examples use synthetic profile data.

## Keeping the collection in sync

After changing the spec, run `postman spec sync collection postman/specs/churchbase-api-v1.yaml --force`. Postman CLI currently maps OpenAPI cookie security to an API-key header, which this API does not accept. Keep the current-user request's auth set to `none` so Postman's cookie jar sends the BetterAuth cookie; remove the unused `apiKey` variable from the collection definition after syncing.
