"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function EmptyHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      Object.assign({
        className: cn("flex max-w-sm flex-col items-center text-center", className),
        "data-slot": "empty-header",
      }),
      props,
    ),
    render,
  })
}
