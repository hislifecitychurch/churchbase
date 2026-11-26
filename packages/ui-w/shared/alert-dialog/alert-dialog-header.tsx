"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function AlertDialogHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      Object.assign({
        className: cn("flex flex-col gap-2 p-4 text-center sm:text-left", className),
        "data-slot": "alert-dialog-header",
      }),
      props,
    ),
    render,
  })
}
