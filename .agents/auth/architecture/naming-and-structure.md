# Naming and structure

```text
apps/auth/
├── AGENTS.md
├── .env.example
├── README.md
├── config/          validated environment configuration
├── db/              explicit BetterAuth migration command
├── lib/             small shared config loading
└── src/
    ├── auth.ts      BetterAuth and PostgreSQL composition
    ├── http.ts      Hono routes and CORS
    └── server.ts    Bun lifecycle
```

Create a directory only when its first real responsibility exists. Do not copy the Go API's domain/application/repository layers into this service or create invitation, email, OTP, or platform-access features for symmetry with Mnemora.
