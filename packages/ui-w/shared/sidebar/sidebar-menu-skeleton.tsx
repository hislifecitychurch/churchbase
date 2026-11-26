"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function SidebarMenuSkeleton({
  className,
  showIcon = false,
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  showIcon?: boolean
}): React.ReactElement {
  const width = React.useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, [])

  const defaultProps = {
    children: (
      <>
        {showIcon && (
          <div
            className="bg-sidebar-accent/50 size-4 animate-pulse rounded-xl"
            data-sidebar="menu-skeleton-icon"
          />
        )}
        <div
          className="h-4 max-w-(--skeleton-width) flex-1"
          data-sidebar="menu-skeleton-text"
          style={
            {
              "--skeleton-width": width,
            } as React.CSSProperties
          }
        >
          <div className="bg-sidebar-accent/50 h-full w-full animate-pulse rounded-xl" />
        </div>
      </>
    ),
    className: cn("flex h-8 items-center gap-2 rounded-xl px-2", className),
    "data-slot": "sidebar-menu-skeleton",
    "data-sidebar": "menu-skeleton",
  }

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  })
}
