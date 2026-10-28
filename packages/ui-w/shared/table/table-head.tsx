"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function TableHead({
  className,
  render,
  ...props
}: useRender.ComponentProps<"th">): React.ReactElement {
  return useRender({
    defaultTagName: "th",
    props: mergeProps<"th">(
      Object.assign({
        className: cn(
          "text-muted-foreground bg-background supports-[backdrop-filter]:bg-background/95 sticky top-0 h-10 px-4 py-2 text-left align-middle leading-none font-medium whitespace-nowrap has-[[role=checkbox]]:w-px first:has-[[role=checkbox]]:pe-0 last:has-[[role=checkbox]]:ps-0",
          className,
        ),
        "data-slot": "table-head",
      }),
      props,
    ),
    render,
  })
}
