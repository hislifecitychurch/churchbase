"use client"

import * as React from "react"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@packages/ui-w/lib/utils"

export function AccordionPanel({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props): React.ReactElement {
  return (
    <AccordionPrimitive.Panel
      className="text-muted-foreground h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-200 ease-in-out data-ending-style:h-0 data-starting-style:h-0"
      data-slot="accordion-panel"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}
