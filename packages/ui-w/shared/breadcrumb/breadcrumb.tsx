"use client"

import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

export function Breadcrumb({
  render,
  ...props
}: useRender.ComponentProps<"nav">): React.ReactElement {
  return useRender({
    defaultTagName: "nav",
    props: mergeProps<"nav">(
      Object.assign({ "aria-label": "breadcrumb", "data-slot": "breadcrumb" }),
      props,
    ),
    render,
  })
}
