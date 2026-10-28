"use client"

import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

export function MapControlGroup({
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className:
      "border-border bg-background [&>button:not(:last-child)]:border-border flex flex-col overflow-hidden rounded-xl border [&>button:not(:last-child)]:border-b",
  }

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  })
}
