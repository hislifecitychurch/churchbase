"use client"

import type * as React from "react"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function GroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "relative inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-input bg-muted not-dark:bg-clip-padding px-[calc(--spacing(3)-1px)] text-base text-muted-foreground shadow-xs/5 outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[0_1px_--theme(--color-black/6%)] sm:text-sm dark:bg-input/64 dark:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5 [&_svg]:shrink-0",
      className,
    ),
    "data-slot": "group-text",
  }
  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  })
}
