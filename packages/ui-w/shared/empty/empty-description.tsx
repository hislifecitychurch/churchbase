"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function EmptyDescription({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      Object.assign({
        className: cn(
          "text-muted-foreground [&>a:hover]:text-primary text-sm [&>a]:underline [&>a]:underline-offset-4 [[data-slot=empty-title]+&]:mt-1",
          className,
        ),
        "data-slot": "empty-description",
      }),
      props,
    ),
    render,
  })
}
