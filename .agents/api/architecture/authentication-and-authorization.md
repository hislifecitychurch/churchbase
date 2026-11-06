# Authentication and authorization

BetterAuth in `apps/auth/` owns identity and sessions. The Go API owns business authorization for churches and ministries.

## Request flow

1. The browser authenticates with BetterAuth and sends its session cookie or supported authorization credential to the API.
2. API authentication middleware forwards only the incoming cookie and authorization headers to BetterAuth's `get-session` endpoint. It disables session refresh because the API does not relay BetterAuth's `Set-Cookie` response.
3. The adapter returns only the opaque BetterAuth user ID. Missing or invalid sessions produce `401`; an unavailable or malformed Auth response produces `503`.
4. Middleware places the validated ID into request context with `internal/shared/actor.WithID`. Ent audit fields read that context; they must never use an actor ID supplied by the browser. Requests without an authenticated actor (such as trusted system work) leave the `*_by` fields null.
5. API services use Churchbase-owned membership and permission data to authorize the requested church and ministry operation.

`GET /api/v1/me` validates the session, then resolves the API user and profile by the Auth ID; it returns only the API user ID, platform role, and profile names. The platform-user CLI may provision an Auth identity through the service-token-protected Auth operation, then create the API user and grant its platform role. The API must never access Auth storage directly or assign Churchbase roles in BetterAuth.

The API must not read BetterAuth's database directly, copy its credential/session data, or trust user IDs supplied by the browser. Its `User` record is a separate Churchbase business/directory entity, may exist without an Auth account, and stores Churchbase-owned profile data plus an optional opaque Auth ID link—not a duplicate authentication identity. Keep provider payloads and HTTP details inside the adapter. Keep Fiber context out of domain services.

## Authorization ownership

- BetterAuth answers who the caller is and whether their session is valid.
- Churchbase API data answers which churches and ministries the caller can access and what they may do there.
- API `User.platform_role` holds platform-operator roles `admin` or `staff`; null means the user has no platform-level grant. Only API users linked to a BetterAuth ID may hold one. These roles are separate from church membership roles (`admin`, `staff`, `member`) and ministry membership roles (`lead`, `member`); both membership types support `active` and `inactive` status. A church `staff` role does not implicitly grant admin-only operations. BetterAuth authenticates the account but does not own these application roles. Platform-operator endpoints must authorize against this field on every request.
- A ministry membership must link a ministry and a church membership from the same church. Validate this relationship in the API when assigning membership.
- Only a church admin may create ministries or manage church and ministry memberships. Ministry access requires both the church membership and ministry membership to be active.
- Check access on every request, including direct API calls. UI navigation is presentation only.
- Treat BetterAuth IDs as opaque strings; do not assume they are UUIDs or create cross-schema foreign keys to auth-owned records.
- A church admin may manage church memberships and ministry assignments according to the API's role rules. The ministry `lead` role does not imply access to pastoral care data.

## Failure semantics

- `401` means the session is missing, invalid, or expired.
- `403` means the authenticated caller lacks the required permission. Use `404` instead only where the product contract intentionally hides resource existence.
- `503` means a required authentication dependency is unavailable. Do not convert timeouts or provider errors into an anonymous caller.
- Rate limits return `429`; if a required shared limiter is unavailable, fail closed with `503`.

Never log credentials or return provider errors to clients.
