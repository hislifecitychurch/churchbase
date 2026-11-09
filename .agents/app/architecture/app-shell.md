# App shell

## Composition

The protected shell lives in `app/(protected)/layout.tsx` and is composed in one place:

- `SidebarProvider` owns the open state and persists it in the `sidebar_state` cookie.
- `AppSidebar` renders the ministry switcher, main menu, and footer collapse trigger.
- `SidebarInset` is the single `<main>` for protected routes and carries the page gutter.
- `MobileNavTrigger` opens the sidebar sheet below the `md` breakpoint.

`Sidebar` uses `variant="floating"` and `collapsible="icon"`. Keep the icon-collapsed layout working: hide text with `group-data-[collapsible=icon]:hidden` and let the library render the tooltip.

## One `<main>` per page

The root layout must not render `<main>`. `(auth)/layout.tsx` provides `<main>` for unauthenticated screens, and `SidebarInset` provides it for protected screens. Nesting `<main>` inside `<main>` is invalid HTML.

## Navigation

- Keep main and footer navigation definitions in `data/menu.tsx`. Main destinations are `MainMenuItem[]` lists keyed by context slug, each declaring the API capability required to display it; Church-wide routes stay global and ministry routes live under `/ministries/[ministry]`.
- Footer links may also declare a required capability; the sidebar-collapse action is always available.
- Derive the active item from `usePathname` and `lib/menu/is-path-active.ts`. The root path matches only `/`; other paths match descendants unless the menu item sets `exact: true` (used for ministry Overview routes).
- Leave sidebar icons at the primitive default `size-4`. A 16px icon fits the collapsed 32px button with `p-2` exactly (8px each side), so it is centered in both the button and the 66px rail. A larger icon such as `size-5!` overflows the 16px content box and sits right of center.
- Do not add `group-data-[collapsible=icon]:justify-center`. The button transitions its own width, so centering applied at collapse throws the icon to the right before the width catches up. The symmetric padding already centers a `size-4` icon, so no override is needed.
- Keep `SidebarTrigger` on the same default icon size; it renders through `SidebarMenuButton` and needs no per-caller sizing override.
- Keep the mobile trigger outside `Sidebar`. The sidebar itself renders as a sheet below `md`, so a trigger inside it would be unreachable.
- Every menu destination needs a real or placeholder route; do not ship a nav item that 404s.

## Ministry switcher

`MinistrySwitcher` replaces the static logo row in the sidebar header. It is the app's context control, modeled on shadcn's `team-switcher` but built only from `ui-w` pieces.

- Keep the ministry list in `data/ministries.tsx` as a non-empty tuple (`[Ministry, ...Ministry[]]`) so the first item is always available under `noUncheckedIndexedAccess`.
- Render the switcher with `Menu`, `MenuTrigger`, `MenuPopup`, and `MenuItem`; do not import `@base-ui/react` or a dropdown primitive directly.
- Pass `render={<SidebarMenuButton size="lg" />}` to `MenuTrigger` and leave `tooltip` off. A tooltip-enabled `SidebarMenuButton` renders a tooltip root instead of a button, which breaks the trigger.
- Hide the name, role line, and `IconSelector` with `group-data-[collapsible=icon]:hidden`. The tile stays visible in the collapsed rail, so the header still shows the active ministry.
- Open the popup at `right` on desktop and `bottom` on mobile (`useSidebar().isMobile`), with `align="start"` and `sideOffset={4}`. Keep the popup at `w-56`; the primitive's default `min-w-32` is skipped when a width class is present.
- Keep "Church-wide" first in the list, labeled "Admin" to indicate its scope; the switcher adds scope instead of replacing the rest of the app.
- Show the user's role per ministry in the row (`detail`) and a check on the active item.

`AppSidebar` loads the authenticated user's contexts from `GET /users/me/access-contexts`, displays only those contexts, and filters menu entries by the returned capabilities. The selected context ID is kept in the `context_id` query parameter so refreshes and deep links retain scope, including when ministry slugs repeat across churches. `WorkspaceAccessGate` checks that the selected context exposes the current route and redirects to an accessible overview otherwise. This is a UI guard only: every API data operation must still validate the session, tenant, membership, and required capability server-side.

## Deferred

- The footer user menu and logout require a session. Do not add them before authentication exists.
- Explicit permission grants are not modeled yet. Care, Kids check-in/safety, and Church-wide Ministries for staff remain hidden until a grant mechanism exists.
- The App route guard is presentation only. Implement data endpoints only after the API can independently authorize the selected church/ministry and each required capability. Never infer authorization from the URL or filter tenant data in the browser.
- Pending-navigation state is unnecessary until routes become slow enough to need it.
