"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@packages/ui-w/lib/utils"
import { useSidebar } from "@packages/ui-w/hooks/use-sidebar"
import { sidebarMenuButtonVariants } from "@packages/ui-w/shared/variants"

import { Tooltip } from "@packages/ui-w/shared/tooltip/tooltip"
import { TooltipPopup } from "@packages/ui-w/shared/tooltip/tooltip-popup"
import { TooltipTrigger } from "@packages/ui-w/shared/tooltip/tooltip-trigger"

export function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipPopup>
} & VariantProps<typeof sidebarMenuButtonVariants>): React.ReactElement {
  const Comp = asChild ? Slot.Root : "button"
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  const tooltipProps = typeof tooltip === "string" ? { children: tooltip } : tooltip

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipPopup
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltipProps}
      />
    </Tooltip>
  )
}
