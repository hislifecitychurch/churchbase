"use client"

import * as React from "react"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@packages/ui-w/lib/utils"

export function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.Item.Props): React.ReactElement {
  return (
    <AccordionPrimitive.Item
      className={cn("border-border border-b last:border-b-0", className)}
      data-slot="accordion-item"
      {...props}
    />
  )
}
