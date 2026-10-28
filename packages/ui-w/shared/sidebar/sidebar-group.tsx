"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function SidebarGroup({
  className,
  render,
  variant = "default",
  ...props
}: useRender.ComponentProps<"div"> & {
  variant?: "default" | "compact"
}): React.ReactElement {
  const defaultProps = {
    className: cn(
      "relative flex w-full min-w-0 flex-col p-2",
      variant === "compact" && "group-data-[collapsible=icon]:py-0",
      className,
    ),
    "data-slot": "sidebar-group",
    "data-sidebar": "group",
  }

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  })
}
