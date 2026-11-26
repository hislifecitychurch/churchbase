"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function TableRow({
  className,
  render,
  ...props
}: useRender.ComponentProps<"tr">): React.ReactElement {
  return useRender({
    defaultTagName: "tr",
    props: mergeProps<"tr">(
      Object.assign({
        className: cn(
          "border-border relative border-b not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-black)_2%)] not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-black)_4%)] dark:not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-white)_2%)] dark:not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-white)_4%)]",
          className,
        ),
        "data-slot": "table-row",
      }),
      props,
    ),
    render,
  })
}
