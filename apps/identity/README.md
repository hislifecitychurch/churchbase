# Churchbase Identity

Shared sign-in UI for Churchbase applications. The login form is currently presentation-only; BetterAuth sign-in, session handling, and cross-app redirects are not wired up yet.

## Development

Run from the repository root:

```sh
bun run --cwd apps/identity dev
```

The development server uses <http://localhost:36003>. Build and preview with:

```sh
bun run --cwd apps/identity build
bun run --cwd apps/identity preview
```
