# Churchbase app instructions

## Required context

Before changing `apps/app/`, read:

- [`.agents/app/AGENTS.md`](../../.agents/app/AGENTS.md) — App architecture index and feature guides.
- [`.agents/ui/AGENTS.md`](../../.agents/ui/AGENTS.md) — spacing and typography rules shared by every application.

Read the specific reference for the work: [component organization](../../.agents/app/architecture/component-organization.md) for structure and imports, [UI conventions](../../.agents/app/architecture/ui-conventions.md) for buttons, forms, tokens, and verification.

## Stack and commands

- Bun 1.3.14 workspace
- React 19
- vinext with the Next.js App Router on Vite
- Cloudflare Workers through `@vinext/cloudflare` and `cf/config`
- Tailwind CSS v4, configured in `packages/ui-w/styles/globals.css`
- TanStack Query

Run commands from the repository root:

```sh
bun install
bun run --cwd apps/app dev
bun run --cwd apps/app build
bun run --cwd apps/app start
bun run --cwd apps/app preview
```

`dev` runs on port `36002` with `strictPort` and opens the Cloudflare inspector on `9232`. If a port is held, identify the listener before stopping anything; do not kill unrelated user processes. `deploy` publishes to Cloudflare and requires explicit authorization.

## Structure

```text
app/
  layout.tsx          root shell: styles, fonts, providers
  (auth)/             unauthenticated screens
  (protected)/        authenticated screens
components/pages/     page-local composition
providers/            app-wide client providers
```

- Keep route files in `app/`. A route's `page.tsx` owns its composition.
- Keep page-local pieces under `components/pages/<page>/`, using private folders such as `_form/` and `_field/`.
- Keep reusable primitives in `packages/ui-w/`, not in the App. See [component organization](../../.agents/app/architecture/component-organization.md).
- Mount app-wide providers in `app/layout.tsx`. Keep `"use client"` on the provider, not on the layout.

## Imports

Keep imports in this order, with one blank line between groups:

1. File directive such as `"use client"`.
2. External packages.
3. `@packages/ui-w/...`.
4. `@/...` local modules.

The global stylesheet import in `app/layout.tsx` is the exception and stays first as a side-effect import.

Import shared UI from its module path, such as `@packages/ui-w/shared/button/button`. Do not import raw `radix-ui`, `@base-ui/react`, or `shadcn` components into this app.

## UI rules

- Use `packages/ui-w` components before writing markup from scratch. Do not hand-roll a primitive that the shared library already provides.
- Follow `.agents/ui/architecture/spacing.md` and `.agents/ui/architecture/typography.md`. In particular, headings never exceed `font-medium`.
- Use semantic color utilities (`text-foreground`, `text-muted-foreground`, `border-border`), never raw hex values.
- Light is the default theme; check dark mode when adding a color.

## Current auth state

The login screen is presentation only. It has no auth provider, session handling, middleware, or submit behavior; `LoginForm` prevents the default submit. Adding authentication is a product decision, not part of a visual change.

## Verification

Run the narrowest relevant checks and report the result:

```sh
bunx prettier --check <changed-files>
cd apps/app && bunx tsc --noEmit
bun run --cwd apps/app build
```

This app has no `lint`, `check-types`, or test script. For a visual change, load the route at 390px and 1440px widths and confirm both. Do not commit `.env` files, `.cloudflare/`, `.vinext/`, `.next/`, `dist/`, `worker-configuration.d.ts`, or other generated output.
