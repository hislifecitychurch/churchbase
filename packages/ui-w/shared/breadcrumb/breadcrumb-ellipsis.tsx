"use client"

import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { IconDots } from "@tabler/icons-react"

export function BreadcrumbEllipsis({
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
            <IconDots className="size-4" />
            <span className="sr-only">More</span>
          </>
        ),
        className,
        "data-slot": "breadcrumb-ellipsis",
        role: "presentation",
      }),
      props,
    ),
    render,
  })
}
