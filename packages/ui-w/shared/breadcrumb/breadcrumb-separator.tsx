"use client"

import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function BreadcrumbSeparator({
  children,
  className,
  render,
  ...props
}: useRender.ComponentProps<"li">): React.ReactElement {
  return useRender({
    defaultTagName: "li",
    props: mergeProps<"li">(
      Object.assign({
        "aria-hidden": true,
        children: children ?? "/",
        className: cn("opacity-80", className),
        "data-slot": "breadcrumb-separator",
        role: "presentation",
      }),
      props,
    ),
    render,
  })
}
