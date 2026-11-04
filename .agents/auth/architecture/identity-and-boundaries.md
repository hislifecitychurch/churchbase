# Identity and boundaries

BetterAuth is the canonical identity owner. It stores users, credential hashes, accounts, sessions, verification records, and opaque identity IDs. The Go API consumes a validated BetterAuth user ID and owns business data and authorization.

```text
Hono HTTP/CORS boundary → BetterAuth → Kysely/pg → PostgreSQL auth schema
```

- HTTP code handles transport and delegates authentication behavior to BetterAuth.
- BetterAuth configuration does not contain church or ministry workflows.
- The API must not query the auth schema or copy credentials, users, or sessions.
- Ministry membership and ministry roles remain API-owned business data.
- The UI and ministry switcher do not authorize access; the API checks every protected operation.
- Keep BetterAuth IDs opaque strings; do not assume a UUID format.
- Do not copy Mnemora's platform-access or invitation management routes. Churchbase account provisioning needs its own explicit product and API contract.
