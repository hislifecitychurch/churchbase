"use client"

import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function BreadcrumbItem({
  className,
  render,
  ...props
}: useRender.ComponentProps<"li">): React.ReactElement {
  return useRender({
    defaultTagName: "li",
    props: mergeProps<"li">(
      Object.assign({
        className: cn("inline-flex items-center gap-1.5", className),
        "data-slot": "breadcrumb-item",
      }),
      props,
    ),
    render,
  })
}
