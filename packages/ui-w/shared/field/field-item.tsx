"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"

import { cn } from "@packages/ui-w/lib/utils"

export function FieldItem({ className, ...props }: FieldPrimitive.Item.Props): React.ReactElement {
  return <FieldPrimitive.Item className={cn("flex", className)} data-slot="field-item" {...props} />
}
