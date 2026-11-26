"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function SidebarMenuItem({
  className,
  render,
  ...props
}: useRender.ComponentProps<"li">): React.ReactElement {
  const defaultProps = {
    className: cn("group/menu-item relative", className),
    "data-slot": "sidebar-menu-item",
    "data-sidebar": "menu-item",
  }

  return useRender({
    defaultTagName: "li",
    props: mergeProps<"li">(defaultProps, props),
    render,
  })
}
