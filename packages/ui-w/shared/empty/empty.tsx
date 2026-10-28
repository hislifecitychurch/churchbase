"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function Empty({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      Object.assign({
        className: cn(
          "flex min-w-0 flex-1 flex-col items-center justify-center gap-4 p-6 text-center text-balance md:py-20",
          className,
        ),
        "data-slot": "empty",
      }),
      props,
    ),
    render,
  })
}
