"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { type VariantProps } from "class-variance-authority"

import { cn } from "@packages/ui-w/lib/utils"
import { alertVariants } from "@packages/ui-w/shared/variants"

export function Alert({
  className,
  variant,
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof alertVariants>): React.ReactElement {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      Object.assign({
        className: cn(alertVariants({ variant }), className),
        "data-slot": "alert",
        role: "alert",
      }),
      props,
    ),
    render,
  })
}
