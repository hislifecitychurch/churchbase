# Churchbase Identity instructions

## Required context

Before changing `apps/identity/`, read this file and [shared UI guidance](../ui/AGENTS.md). Keep route-specific references under `apps/identity/README.md` up to date when setup or behavior changes.

## Stack and commands

- Bun 1.3.14 workspace, React 19, vinext App Router, Tailwind CSS v4, and Cloudflare Workers.
- Run from the repository root:

```sh
bun run --cwd apps/identity dev
bun run --cwd apps/identity test
cd apps/identity && bunx tsc --noEmit
bun run --cwd apps/identity build
```

- Development uses port `36000`. Inspect the listener before restarting; do not stop unrelated processes. `deploy` publishes to Cloudflare and requires explicit authorization.

## Structure

- Keep routes and route groups under `app/`; `page.tsx` owns the page-level composition and route flow. Do not move a whole route into `components/pages/<page>/` solely to keep the route file small.
- Use `components/pages/<page>/` for meaningful supporting components. Nest fields specific to a form under that form's `_field/` folder inside `_form/<form>/`; avoid splitting markup without a meaningful component boundary.
- Keep API clients and endpoint functions in `api/`, React Query hooks in `hooks/api/`, route and security helpers in `lib/`, and providers in `providers/`. Keep tests under `test/`.
- Components should consume API hooks rather than call endpoint functions directly; API modules own `fetch` and response parsing. Mount the Query provider from `app/layout.tsx`.
- Use `@/` for Identity-local imports. Group imports in this order: external packages, API hooks, API modules, local helpers, shared UI, then page-local components. Separate groups with one blank line. Import shared primitives directly from `@packages/ui-w/`.

## Identity and routing boundaries

- BetterAuth owns credentials and sessions. The API owns Churchbase users, `platform_role`, and authorization.
- Use the API's `GET /api/v1/users/me` response for role-aware navigation; never infer Churchbase permissions from BetterAuth roles. Identity routing and the workspace chooser are presentation only—protected API operations must authorize server-side.
- Keep return targets restricted to the exact configured origins through `lib/return-url.ts`.
- Include the session cookie for browser API calls. Never log or commit credentials, cookies, tokens, or personal data; keep local values in ignored `.env` files and safe examples in `.env.example`.

## UI and verification

- Use shared `packages/ui-w` primitives before writing replacements, semantic color tokens, and the shared spacing and typography rules. Keep headings at `font-medium` or lighter and interactive targets at least 44px on touch.
- For visual changes, check the route at 390px and 1440px widths. Run the narrowest relevant tests, type-check, and build; check formatting only on changed files.
