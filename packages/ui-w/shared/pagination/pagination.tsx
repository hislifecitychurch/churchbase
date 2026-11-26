"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function Pagination({
  className,
  render,
  ...props
}: useRender.ComponentProps<"nav">): React.ReactElement {
  return useRender({
    defaultTagName: "nav",
    props: mergeProps<"nav">(
      Object.assign({
        "aria-label": "pagination",
        className: cn("mx-auto flex w-full justify-center", className),
        "data-slot": "pagination",
      }),
      props,
    ),
    render,
  })
}
