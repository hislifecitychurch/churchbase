# Verification

Keep pure configuration checks independent of PostgreSQL. HTTP boundary checks should cover health and exact-origin CORS; auth-flow checks should use an isolated test database or BetterAuth's supported in-memory setup. Live database work must use an explicit, disposable integration environment rather than developer data.

For service changes, run the narrowest package checks:

```sh
bun run --cwd apps/auth check-types
bun run --cwd apps/auth build
```

Never put passwords, cookies, session tokens, or secrets in test output or fixtures.
