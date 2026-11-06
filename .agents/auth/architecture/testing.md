# Verification

Keep pure configuration checks independent of PostgreSQL. HTTP boundary checks should cover health and exact-origin CORS; auth-flow checks should use an isolated test database or BetterAuth's supported in-memory setup. Live database work must use an explicit, disposable integration environment rather than developer data.

Keep Auth tests under `apps/auth/test/`. For service changes, run the package tests and narrowest package checks:

```sh
cd apps/auth
bun test
bun run check-types
bun run build
```

Never put passwords, cookies, session tokens, or secrets in test output or fixtures.
