# Configuration and infrastructure

Load configuration at the application boundary and pass it into concrete clients through `internal/app/`.

## Rules

- Parse environment variables in `internal/config/`; do not scatter `os.Getenv` through feature code.
- Keep secrets in ignored local `.env` files or deployment secret stores. Maintain `.env.example` as the safe configuration contract when runtime configuration is introduced.
- Validate required production configuration at startup. Development defaults may cover non-sensitive values such as the port.
- Bound network timeouts for PostgreSQL, Redis, and BetterAuth calls.
- Fail closed when authentication or another security-critical dependency is unavailable.
- Keep CORS origins explicit and allow credentials only for the intended app origins.
- Do not add Redis as a source of truth. It is connected for readiness and reserved for a concrete shared ephemeral use case.

## Composition root

`internal/app/` constructs configuration, PostgreSQL/Ent and Redis clients, external clients, repository adapters, services, middleware, and routes. Feature packages must not create global clients.

## Process and hosting

The app frontend is configured as a Cloudflare Worker. The Go/Fiber API is a separate service and should be called over HTTPS; its deployment platform and production port remain undecided. The local API port is `34080`.

Keep liveness cheap and unauthenticated. The initial readiness endpoint checks PostgreSQL and Redis with a bounded timeout. The API process owns graceful shutdown and closes all clients it opens. Schema migrations are a separate release/development command, never an application startup side effect.

Local API defaults are port `34080` and frontend origin `http://localhost:36002`. PostgreSQL and Redis can be started with `make infra` from `apps/api/`; their ports bind to loopback only.
