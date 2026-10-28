"use client"

import type * as React from "react"

import { type VariantProps } from "class-variance-authority"

import { cn } from "@packages/ui-w/lib/utils"
import { groupVariants } from "@packages/ui-w/shared/variants"

export function Group({
  className,
  orientation,
  children,
  ...props
}: {
  className?: string
  orientation?: VariantProps<typeof groupVariants>["orientation"]
  children: React.ReactNode
} & React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(groupVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot="group"
      role="group"
      {...props}
    >
      {children}
    </div>
  )
}
