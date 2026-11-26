"use client"

import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function BreadcrumbList({
  className,
  render,
  ...props
}: useRender.ComponentProps<"ol">): React.ReactElement {
  return useRender({
    defaultTagName: "ol",
    props: mergeProps<"ol">(
      Object.assign({
        className: cn(
          "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word",
          className,
        ),
        "data-slot": "breadcrumb-list",
      }),
      props,
    ),
    render,
  })
}
