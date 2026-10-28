"use client"

import * as React from "react"
import { IconDots } from "@tabler/icons-react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@packages/ui-w/lib/utils"

export function PaginationEllipsis({
  className,
  render,
  ...props
}: useRender.ComponentProps<"span">): React.ReactElement {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      Object.assign({
        "aria-hidden": true,
        children: (
          <>
            <IconDots className="size-5 sm:size-4" />
            <span className="sr-only">More pages</span>
          </>
        ),
        className: cn("flex min-w-7 justify-center", className),
        "data-slot": "pagination-ellipsis",
      }),
      props,
    ),
    render,
  })
}
