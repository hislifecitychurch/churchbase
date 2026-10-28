"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function TableCell({
  className,
  render,
  ...props
}: useRender.ComponentProps<"td">): React.ReactElement {
  return useRender({
    defaultTagName: "td",
    props: mergeProps<"td">(
      Object.assign({
        className: cn(
          "bg-clip-padding px-4 py-2 align-middle leading-none whitespace-nowrap in-data-[slot=table-footer]:py-3.5 in-data-[variant=card]:first:ps-[calc(--spacing(2.5)-1px)] in-data-[variant=card]:last:pe-[calc(--spacing(2.5)-1px)] has-[[role=checkbox]]:w-px first:has-[[role=checkbox]]:pe-0 last:has-[[role=checkbox]]:ps-0",
          className,
        ),
        "data-slot": "table-cell",
      }),
      props,
    ),
    render,
  })
}
