# Churchbase API instructions

## Scope

This application will host the Go/Fiber business API. BetterAuth identity and session behavior lives in `apps/auth/`; API-owned church and ministry data lives here. Read [`.agents/api/AGENTS.md`](../../.agents/api/AGENTS.md) and its relevant architecture reference before making API changes.

## Stack and boundaries

- Go with Fiber for HTTP.
- PostgreSQL with Ent for runtime persistence; Atlas is the planned migration owner.
- BetterAuth is a separate Hono service. Validate its sessions through an adapter; never query its database or duplicate its identity tables.
- Redis is reserved for a concrete shared ephemeral need; it is not the source of truth for church data.
- Keep the API as a modular monolith. Add feature directories when the first real feature file exists; do not create empty folders to match a diagram.

## Data and authorization

The API owns churches, ministries, membership, ministry roles, and ministry feature data. Treat member, attendance, care, and ministry records as sensitive. Resolve the caller from a valid BetterAuth session and enforce church/ministry access server-side for every operation; frontend menus do not grant access.

## Configuration and verification

When runtime configuration is introduced, keep `.env.example` as its safe contract and never commit `.env`, generated Ent code, credentials, build output, or local database state. Keep unit tests independent of live services; mark PostgreSQL and external-service tests explicitly.

The API runtime and its Makefile/package scripts have not been scaffolded yet. Once present, use the commands declared there for formatting, Ent generation, tests, lint/vet, and builds. Do not add runtime packages or services solely to make this instruction file executable.
