# Churchbase repository instructions

## Scope and routing

These instructions apply across the repository. More specific `AGENTS.md` files take precedence within their directories. Add narrower instructions only when a part of the codebase needs distinct rules.

- Follow [`.agents/workflow.md`](.agents/workflow.md) for branch, commit, delivery, and promotion rules.
- Follow [`.agents/ui/AGENTS.md`](.agents/ui/AGENTS.md) for spacing and typography rules shared by every application.
- Follow [`.agents/app/AGENTS.md`](.agents/app/AGENTS.md) for `apps/app/` architecture and feature guidance.
- Follow [`.agents/identity/AGENTS.md`](.agents/identity/AGENTS.md) for `apps/identity/` structure, auth flow, and feature guidance.
- Follow [`.agents/api/AGENTS.md`](.agents/api/AGENTS.md) for `apps/api/` architecture and feature guidance.
- Follow [`.agents/auth/AGENTS.md`](.agents/auth/AGENTS.md) for `apps/auth/` architecture and identity guidance.
- `.agents/` contains agent instructions and workflow guidance; read relevant files explicitly.
- The root `package.json` declares the package manager and shared scripts; inspect package-level scripts before running checks.

## Repository map

- `.agents/` — agent instructions, shared UI rules, and API/App/Auth/Identity architecture guidance.
- `.agents/identity/` — Identity application instructions and architecture guidance.
- `apps/` — product applications.
- `apps/api/` — Go/Fiber business API.
- `apps/auth/` — Bun/Hono authentication service using BetterAuth.
- `apps/identity/` — shared sign-in UI and workspace routing for Churchbase applications.
- `apps/platform/` — authenticated deployment-wide workspace; church/ministry management is planned.
- `packages/ui-w/` — shared React UI components.
- `packages/eslint/` — shared ESLint configuration.
- `packages/metadata/` — shared Next.js metadata defaults and helpers.
- `packages/typescript/` — shared TypeScript configuration.
- `turbo.json` — Turborepo task graph and caching configuration.

This is a Bun workspace; use the version and scripts declared in the root configuration.

## Product and engineering rules

- Churchbase helps church teams organize their work, care for members, and coordinate ministries. Treat church, member, and ministry information as sensitive; follow existing authorization and data-handling boundaries, and do not expose it or send it to outside services without explicit authorization.
- Inspect existing code, package scripts, and nearby patterns before editing. Reuse existing dependencies and conventions; avoid abstractions, packages, or directories created only for symmetry or hypothetical future use.
- Keep product rules out of UI and transport layers where practical. Keep external services behind clear boundaries.
- Before changing Turborepo configuration or relying on Turbo CLI behavior, resolve the installed `turbo` package and consult its bundled documentation for that version.
- Update relevant documentation and example environment files when configuration contracts change.
- Preserve unrelated working-tree changes. Never commit secrets, `.env` files, credentials, build output, generated output, or local state.
- Prefer the smallest change that fully solves the requested problem.

## Verification

Run the narrowest relevant checks for each change and report the results. For documentation-only changes, check the changed documentation rather than running application builds. Inspect the root scripts before using them; in particular, the root `format` script writes formatting across TypeScript and Markdown files, so avoid running it blindly.
