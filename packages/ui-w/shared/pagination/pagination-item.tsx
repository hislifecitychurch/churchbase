"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

export function PaginationItem({
  render,
  ...props
}: useRender.ComponentProps<"li">): React.ReactElement {
  return useRender({
    defaultTagName: "li",
    props: mergeProps<"li">(Object.assign({ "data-slot": "pagination-item" }), props),
    render,
  })
}
