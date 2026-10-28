"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useContext } from "react"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

import { DrawerContext, type DrawerPosition } from "@packages/ui-w/contexts/drawer-context"

export function DrawerBar({
  className,
  position: positionProp,
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  position?: DrawerPosition
}): React.ReactElement {
  const { position: contextPosition } = useContext(DrawerContext)
  const position = positionProp ?? contextPosition
  const horizontal = position === "left" || position === "right"
  const defaultProps = {
    "aria-hidden": true as const,
    className: cn(
      "absolute flex touch-none items-center justify-center p-3 before:rounded-full before:bg-input",
      horizontal ? "inset-y-0 before:h-12 before:w-1" : "inset-x-0 before:h-1 before:w-12",
      position === "top" && "bottom-0",
      position === "bottom" && "top-0",
      position === "left" && "right-0",
      position === "right" && "left-0",
      className,
    ),
    "data-slot": "drawer-bar",
  }

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  })
}
