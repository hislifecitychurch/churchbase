"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function AlertDialogPanel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      Object.assign(
        { className: cn("flex flex-col gap-4 px-4 pb-4", className) },
        { "data-slot": "alert-dialog-panel" },
      ),
      props,
    ),
    render,
  })
}
