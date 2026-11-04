import Link from "next/link"

import { SidebarMenuButton } from "@packages/ui-w/shared/sidebar/sidebar-menu-button"

export function AppLogo(): React.ReactElement {
  return (
    <SidebarMenuButton
      asChild
      className="hover:bg-transparent active:bg-transparent"
      size="lg"
      tooltip="Churchbase"
    >
      <Link href="/" prefetch={false}>
        <span
          aria-hidden
          className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-medium"
        >
          C
        </span>
        <span className="group-data-[collapsible=icon]:hidden">Churchbase</span>
      </Link>
    </SidebarMenuButton>
  )
}
