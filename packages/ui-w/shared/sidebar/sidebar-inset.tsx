"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function SidebarInset({
  className,
  render,
  ...props
}: useRender.ComponentProps<"main">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "bg-background relative flex w-full flex-1 flex-col",
      "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
      className,
    ),
    "data-slot": "sidebar-inset",
  }

  return useRender({
    defaultTagName: "main",
    props: mergeProps<"main">(defaultProps, props),
    render,
  })
}
