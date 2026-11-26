"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function EmptyContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      Object.assign({
        className: cn(
          "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
          className,
        ),
        "data-slot": "empty-content",
      }),
      props,
    ),
    render,
  })
}
