"use client"

import * as React from "react"

import { SidebarContextProps, SidebarContext } from "@repo/ui-w/contexts/sidebar-context"

export function useSidebar(): SidebarContextProps {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}
