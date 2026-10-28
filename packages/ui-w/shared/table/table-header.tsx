"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function TableHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"thead">): React.ReactElement {
  return useRender({
    defaultTagName: "thead",
    props: mergeProps<"thead">(
      Object.assign({
        className: cn("border-border sticky top-0 z-10 [&_tr]:border-b", className),
        "data-slot": "table-header",
      }),
      props,
    ),
    render,
  })
}
