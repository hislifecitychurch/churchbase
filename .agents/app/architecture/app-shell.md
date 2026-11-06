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

- Keep main destinations in `data/menu/main.tsx` as `MainMenuItem[]` with `title`, `path`, and `icon`.
- Keep footer entries in `data/menu/footer.tsx`: Settings is a link, and the sidebar trigger is an action descriptor rendered by `FooterMenu`.
- Derive the active item from `usePathname` and `lib/menu/is-path-active.ts`. The root path matches only `/`; every other path also matches its descendants.
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
- Keep "All ministries" first in the list. It is the church-wide context, so the switcher adds scope instead of replacing the rest of the app.
- Show the user's role per ministry in the row (`detail`) and a check on the active item.

`AppSidebar` owns the selected ministry slug and passes it to the switcher. Selection is local demo state; it changes the header label, tile, and check mark, but does not route, persist, or authorize data. The ministry is not a tenant: one staff app serves every ministry, and scoping will be enforced by the API once roles and sessions exist.

## Deferred

- The footer user menu and logout require a session. Do not add them before authentication exists.
- Ministry-specific main menus belong in `data/menu/main.tsx`; their entries need real or placeholder routes before they are shown.
- Role filtering of ministry menus requires a role model and server-side authorization.
- Routing the switcher to `/ministries/[ministry]` and guarding it server-side require sessions and roles. The URL, not the switcher state, must become the source of truth.
- Scope analytics with the ministry id on the server. Never fetch church-wide numbers and filter them in the browser, and keep care data behind a separate permission from ministry leadership.
- Pending-navigation state is unnecessary until routes become slow enough to need it.
