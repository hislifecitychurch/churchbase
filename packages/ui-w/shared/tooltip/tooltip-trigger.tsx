"use client"

import * as React from "react"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

export function TooltipTrigger(props: TooltipPrimitive.Trigger.Props): React.ReactElement {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}
