"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function MenuShortcut({
  className,
  render,
  ...props
}: useRender.ComponentProps<"kbd">): React.ReactElement {
  return useRender({
    defaultTagName: "kbd",
    props: mergeProps<"kbd">(
      Object.assign({
        className: cn(
          "text-muted-foreground/72 ms-auto font-sans text-xs font-medium tracking-widest",
          className,
        ),
        "data-slot": "menu-shortcut",
      }),
      props,
    ),
    render,
  })
}
