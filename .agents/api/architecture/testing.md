# Testing

Use the smallest test that proves the behavior. Keep Go tests under `apps/api/test/`; do not add `_test.go` files beside production packages under `internal/`, `cmd/`, or `ent/`.

## Placement

```text
apps/api/test/
├── unit/
│   └── domain/<schema>/service/<operation>_test.go
├── integration/
│   └── adapter/postgres/repository/<schema>/<operation>_test.go
└── e2e/           complete HTTP/application flows
```

Keep tests under `test/` and mirror the schema domain and operation they cover. Put service unit tests beside the corresponding operation path under `test/unit/`; put PostgreSQL repository tests under `test/integration/` and use only an explicit disposable database.

Add directories with their first test rather than creating empty test trees. Use external test packages where practical so tests cover public package behavior.

## Test by responsibility

- Domain rules and services: table-driven tests with fake repository and external-service ports.
- Handlers and routes: Fiber's test facilities for status, response mapping, and middleware.
- PostgreSQL repositories and Atlas migrations: explicit integration tests against disposable test databases.
- Redis: fakes for unit behavior and integration tests for behavior that depends on the real server.
- BetterAuth adapter: controlled HTTP fakes for valid/invalid sessions, timeouts, and upstream failures.
- Authorization: test cross-church and cross-ministry denial as well as allowed access.

Do not use production data, developer credentials, or real email/SMS delivery in unit tests.

## Checks

Once the Go module is scaffolded, run checks from `apps/api/` using its declared Makefile targets or the equivalent `go test ./...`, `go vet ./...`, and `go build ./...`. Run PostgreSQL integration tests only with an explicit disposable test database.
