"use client"

import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function BreadcrumbPage({
  className,
  render,
  ...props
}: useRender.ComponentProps<"span">): React.ReactElement {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      Object.assign({
        "aria-current": "page",
        className: cn("text-foreground font-normal", className),
        "data-slot": "breadcrumb-page",
      }),
      props,
    ),
    render,
  })
}
