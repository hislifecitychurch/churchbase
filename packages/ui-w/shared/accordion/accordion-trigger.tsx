"use client"

import * as React from "react"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { IconChevronDown } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props): React.ReactElement {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "focus-visible:ring-ring group flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-xl py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-64",
          className,
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <span className="pointer-events-none inline-flex size-4 shrink-0 translate-y-0.5 items-center justify-center">
          <IconChevronDown
            aria-hidden="true"
            className="size-4 opacity-80 transition-transform duration-200 ease-in-out group-data-panel-open:rotate-180"
            data-slot="accordion-indicator"
          />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}
