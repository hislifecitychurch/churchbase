"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function SidebarMenuSub({
  className,
  render,
  ...props
}: useRender.ComponentProps<"ul">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className,
    ),
    "data-slot": "sidebar-menu-sub",
    "data-sidebar": "menu-sub",
  }

  return useRender({
    defaultTagName: "ul",
    props: mergeProps<"ul">(defaultProps, props),
    render,
  })
}
