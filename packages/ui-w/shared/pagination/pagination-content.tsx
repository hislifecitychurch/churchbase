"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function PaginationContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"ul">): React.ReactElement {
  return useRender({
    defaultTagName: "ul",
    props: mergeProps<"ul">(
      Object.assign({
        className: cn("flex flex-row items-center gap-1", className),
        "data-slot": "pagination-content",
      }),
      props,
    ),
    render,
  })
}
