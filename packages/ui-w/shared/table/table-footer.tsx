"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function TableFooter({
  className,
  render,
  ...props
}: useRender.ComponentProps<"tfoot">): React.ReactElement {
  return useRender({
    defaultTagName: "tfoot",
    props: mergeProps<"tfoot">(
      Object.assign({
        className: cn(
          "border-border border-t bg-transparent font-medium not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] in-data-[variant=card]:border-none dark:not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)] [&>tr]:last:border-b-0",
          className,
        ),
        "data-slot": "table-footer",
      }),
      props,
    ),
    render,
  })
}
