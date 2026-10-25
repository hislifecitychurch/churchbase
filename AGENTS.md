# Churchbase repository instructions

## Scope and routing

These instructions apply across the repository. More specific `AGENTS.md` files take precedence within their directories. Add narrower instructions only when a part of the codebase needs distinct rules.

- Follow [`.agents/workflow.md`](.agents/workflow.md) for branch, commit, delivery, and promotion rules.
- `.agents/` contains agent instructions and workflow guidance; read relevant files explicitly.
- The root `package.json` declares the package manager and shared scripts; inspect package-level scripts before running checks.

## Repository map

- `apps/` — product applications.
- `packages/ui/` — shared React UI components.
- `packages/eslint-config/` — shared ESLint configuration.
- `packages/typescript-config/` — shared TypeScript configuration.
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

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": true` in the root `turbo.json` or `turbo.jsonc` to opt in; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
