"use client"

import * as React from "react"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

export function Accordion(props: AccordionPrimitive.Root.Props): React.ReactElement {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}
