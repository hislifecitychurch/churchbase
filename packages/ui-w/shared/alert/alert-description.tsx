"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function AlertDescription({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      Object.assign({
        className: cn("text-muted-foreground flex flex-col gap-2.5 [svg~&]:col-start-2", className),
        "data-slot": "alert-description",
      }),
      props,
    ),
    render,
  })
}
