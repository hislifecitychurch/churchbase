"use client"

import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"
import type { MapMarkerLabelProps } from "@packages/ui-w/types/map"

export function MapMarkerLabel({
  children,
  className,
  position = "top",
  render,
  ...props
}: MapMarkerLabelProps & useRender.ComponentProps<"div">): React.ReactElement {
  const positionClasses = {
    top: "bottom-full mb-1",
    bottom: "top-full mt-1",
  }

  const defaultProps = {
    children,
    className: cn(
      "absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
      "text-foreground text-[10px] font-medium",
      positionClasses[position],
      className,
    ),
  }

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  })
}
