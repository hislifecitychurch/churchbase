# Component organization

## Imports

Keep imports in this order:

1. A file directive such as `"use client"`, when needed.
2. External libraries and packages (`react`, `next/*`, `@tanstack/*`, and similar).
3. Shared workspace UI from `@packages/ui-w/...`.
4. Local App modules from `@/...`.

Use one blank line between groups. Keep type-only imports in the group for the module they import from.

The root `app/layout.tsx` is the one exception: the global stylesheet import, `import "@packages/ui-w/styles/globals.css"`, stays first because it is a side-effect import that must run before layout styles.

Use the configured `@/` alias for cross-directory App imports; it maps to `apps/app/*`. Same-directory relative imports are fine for small supporting modules. Avoid `..` traversal between App components.

## Placement

- Keep route files under `app/` and organize them with route groups: `(auth)` for unauthenticated screens and `(protected)` for authenticated ones.
- Keep route-specific composition in `page.tsx`. Do not add a whole-page component under `components/pages/<page>/` solely for its route to render.
- Put page-local pieces under `components/pages/<page>/` when they are reused or the extraction creates a meaningful boundary.
- Put shared App shell pieces under `components/shared/`, with focused groups such as `_sidebar/` and `_header/`. Keep navigation data in `data/menu/` and small path or formatting helpers in `lib/`.
- Use private underscored folders such as `_form/` and `_field/` for focused page-local implementation pieces.
- Keep route metadata in the server `page.tsx` or `layout.tsx`. Add `"use client"` only to the component that needs state, effects, or browser APIs.
- Put app-wide providers under `providers/` and mount them in `app/layout.tsx`.
- Put reusable primitives in `packages/ui-w/shared/<component>/`. Do not create an App-local copy of a component that belongs in the shared library.
- Import shared primitives directly from their module path, such as `@packages/ui-w/shared/button/button`. Do not import raw `radix-ui`, `@base-ui/react`, or `shadcn` components into `apps/app/`.

## Shared UI

`packages/ui-w/` is the design system for every Churchbase application. It owns:

- Primitives under `shared/` (buttons, fields, inputs, dialogs, tables, and similar).
- Global styles and design tokens under `styles/`.
- Providers under `providers/`.
- Font exports under `lib/fonts.ts`.

Change a primitive in the shared package when the behavior should apply everywhere. Keep page-specific composition in `apps/app/`; do not fork a primitive to make one screen look different.
