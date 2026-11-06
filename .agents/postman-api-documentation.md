# Postman API documentation

## Source of truth

Churchbase's public, versioned HTTP contract and runnable examples live in the native Postman resources under [`postman/collections/-v1/`](../postman/collections/-v1/). Keep this collection in sync with client-facing routes in both `apps/api/` and `apps/auth/`. Do not create a duplicate generated collection or treat an OpenAPI export as the source of truth unless the product explicitly requests one.

The repository's `.postman/resources.yaml` registers the `postman/` directory in Postman Local View. Keep collection, folder, request, and response-example files in this resource tree; do not publish them to a cloud workspace unless asked.

## Resource layout and route naming

Postman resource directories use a leading `-` to represent a resource name beginning with `/`:

```text
postman/collections/-v1/
├── .resources/definition.yaml          # collection name: /v1
├── -health/
│   ├── .resources/definition.yaml      # folder name: /health
│   ├── -live.request.yaml              # request name: /live
│   └── -ready.request.yaml             # request name: /ready
├── -auth/
│   ├── .resources/definition.yaml      # folder name: /auth
│   └── -sign-in/
│       ├── .resources/definition.yaml  # folder name: /sign-in
│       ├── -email.request.yaml         # request name: /email
│       └── -username.request.yaml      # request name: /username
└── -users/
    ├── .resources/definition.yaml      # folder name: /users
    └── -me.request.yaml                # request name: /me
```

Folders organize requests; they do not construct the request URL. Each request must state its complete URL using the service host variable and versioned path. `host-api` and `host-auth` are service roots ending in `/api`, so, for example, `{{host-api}}/v1/users/me` calls `/api/v1/users/me` and `{{host-auth}}/v1/auth/sign-in/email` calls `/api/v1/auth/sign-in/email`.

Keep the collection named `/v1`, folders named for route segments, and requests named for their final route segment. Put a new request in the existing collection rather than making another collection for a service or endpoint.

## What every request must document

For each public, versioned endpoint being introduced or changed, add or update its native `.request.yaml` file in the same change as the route:

- State the purpose, expected caller, authentication requirement, and important behavior in `description`.
- Include the exact HTTP method and full URL, `Accept` and `Content-Type` headers when applicable, and any query/path parameters.
- Include a body for operations that accept one. Use Postman variables for local credentials or other private input; explain required and optional fields and relevant constraints in the description.
- Set authentication deliberately. The sign-in requests are public. `GET /users/me` uses the Postman cookie jar populated by sign-in; keep Postman's request auth set to `noauth` and do not encode the cookie as an API-key header.
- Add saved response examples for successful responses and each important documented error status. Match the implemented HTTP status, JSON shape, stable error code, and response envelope exactly. Keep examples synthetic and safe to commit.

The Go API wraps JSON responses in its standard envelope (`success`, `message`, `data`, `filters`, `errors`, `pagination`, `metadata`, `log`). BetterAuth responses are not wrapped in that envelope. Do not expose sensitive profile fields such as date of birth, address, or emergency-contact information in examples. Use `example.test` addresses, synthetic identifiers, and redacted placeholders; never save real passwords, session tokens, cookies, service tokens, or member data in a collection or example.

## Current flow and endpoint notes

- `GET {{host-api}}/v1/health/live`: unauthenticated liveness check; no request body; returns `200` while the API process is running.
- `GET {{host-api}}/v1/health/ready`: unauthenticated readiness check; no request body; returns `200` when PostgreSQL and Redis are reachable or `503` when a required dependency is unavailable.
- `POST {{host-auth}}/v1/auth/sign-in/email`: JSON body requires `email` and `password`; `rememberMe` (default true) and `callbackURL` are optional. Uses an existing BetterAuth identity. A successful response sets a session cookie and returns the BetterAuth user/session response. Keep the actual cookie and token out of saved examples; Postman stores the live cookie in its cookie jar.
- `POST {{host-auth}}/v1/auth/sign-in/username`: JSON body requires `username` and `password`; `rememberMe` (default true) and `callbackURL` are optional. Username sign-in uses the configured BetterAuth username rules. A successful response sets the same kind of session cookie.
- `GET {{host-api}}/v1/users/me`: requires a valid BetterAuth session; no request body. The Postman flow signs in first, then relies on the cookie jar. The response contains only the Churchbase user ID, platform role, and first/last names. An Auth identity must also be provisioned as an API user; otherwise the endpoint returns `403`.

The Auth provisioning endpoint is privileged and service-token protected. Do not add it to the ordinary client sign-in flow or store its token in the collection. If its Postman operation is explicitly needed, isolate and label it as internal and use only a local environment variable for the token.

## Editing and verification

1. Verify the route, request validation, authentication, response status, and response shape in the owning API/Auth implementation and tests; do not infer the contract from the UI.
2. Update the request file and its saved examples under that request's `.resources/<request>.resources/examples/` directory. Update the folder definition only when its display name or description changes.
3. Keep local hosts and test credentials in a Git-ignored Postman environment. The versioned resource tree contains variable references only.
4. Validate the local collection with `postman collection lint postman/collections/-v1` and the registered resources with `postman workspace lint`. Do not run requests against non-local or production targets as part of a documentation change without explicit authorization.
