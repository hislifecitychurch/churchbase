"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function TableBody({
  className,
  render,
  ...props
}: useRender.ComponentProps<"tbody">): React.ReactElement {
  return useRender({
    defaultTagName: "tbody",
    props: mergeProps<"tbody">(
      Object.assign({
        className: cn(
          "in-data-[variant=card]:*:[tr]:*:[td]:bg-card border-border relative before:pointer-events-none before:absolute before:inset-px before:rounded-none not-in-data-[variant=card]:before:hidden in-data-[variant=card]:rounded-none [&_tr:last-child]:border-0 in-data-[variant=card]:*:[tr]:border-0 in-data-[variant=card]:*:[tr]:*:[td]:border-b in-data-[variant=card]:*:[tr]:first:*:[td]:first:rounded-none in-data-[variant=card]:*:[tr]:*:[td]:first:border-s in-data-[variant=card]:*:[tr]:first:*:[td]:border-t in-data-[variant=card]:*:[tr]:last:*:[td]:last:rounded-none in-data-[variant=card]:*:[tr]:*:[td]:last:border-e in-data-[variant=card]:*:[tr]:first:*:[td]:last:rounded-none in-data-[variant=card]:*:[tr]:last:*:[td]:first:rounded-none in-data-[variant=card]:*:[tr]:hover:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] in-data-[variant=card]:*:[tr]:data-[state=selected]:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_4%)] dark:in-data-[variant=card]:*:[tr]:hover:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)] dark:in-data-[variant=card]:*:[tr]:data-[state=selected]:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_4%)]",
          className,
        ),
        "data-slot": "table-body",
      }),
      props,
    ),
    render,
  })
}
