"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function TableCaption({
  className,
  render,
  ...props
}: useRender.ComponentProps<"caption">): React.ReactElement {
  return useRender({
    defaultTagName: "caption",
    props: mergeProps<"caption">(
      Object.assign({
        className: cn("text-muted-foreground mt-4 text-sm in-data-[variant=card]:my-4", className),
        "data-slot": "table-caption",
      }),
      props,
    ),
    render,
  })
}
