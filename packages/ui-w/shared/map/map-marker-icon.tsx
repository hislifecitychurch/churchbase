"use client"

import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

export function MapMarkerIcon({
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: "relative h-4 w-4 rounded-full border-2 border-white bg-blue-500",
      },
      props,
    ),
    render,
  })
}
