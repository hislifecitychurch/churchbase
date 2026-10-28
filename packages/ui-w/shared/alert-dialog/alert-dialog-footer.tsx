"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function AlertDialogFooter({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  variant?: "default" | "bare"
}): React.ReactElement {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      Object.assign({
        className: cn(
          "border-border flex flex-col-reverse gap-2 rounded-b-xl px-4 sm:flex-row sm:justify-end",
          variant === "default" && "bg-muted/72 border-t py-4",
          variant === "bare" && "pb-4",
          className,
        ),
        "data-slot": "alert-dialog-footer",
      }),
      props,
    ),
    render,
  })
}
