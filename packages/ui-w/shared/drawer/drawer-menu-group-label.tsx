"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function DrawerMenuGroupLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("px-2 py-1.5 font-medium text-muted-foreground text-xs", className),
    "data-slot": "drawer-menu-group-label",
  }

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  })
}
