# Identity and boundaries

BetterAuth is the canonical identity owner. It stores users, credential hashes, accounts, sessions, verification records, and opaque identity IDs. The Go API consumes a validated BetterAuth user ID and owns business data and authorization.

Email/password sign-in remains available, and BetterAuth's username plugin adds a separate username/password sign-in endpoint. Usernames are identity data; church and ministry roles remain API-owned business data.

```text
Hono HTTP/CORS boundary → BetterAuth → Kysely/pg → PostgreSQL auth schema
```

- HTTP code handles transport and delegates authentication behavior to BetterAuth.
- BetterAuth configuration does not contain church or ministry workflows.
- The API must not query the auth schema or copy credentials, authentication sessions, or auth-owned identity fields. Its `User` is a separate Churchbase business/directory record and may reference an Auth user through an opaque ID.
- Church and ministry membership roles remain API-owned, scope-specific business data. BetterAuth roles are reserved for a separately defined platform-wide authorization need.
- The UI and ministry switcher do not authorize access; the API checks every protected operation.
- Keep BetterAuth IDs opaque strings; do not assume a UUID format.
- Do not copy Mnemora's platform-access or invitation management routes. Churchbase account provisioning needs its own explicit product and API contract.
