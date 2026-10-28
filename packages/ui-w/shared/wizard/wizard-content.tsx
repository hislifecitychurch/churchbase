"use client"

import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

export function WizardContent({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return <div className={cn("w-full", className)} data-slot="wizard-content" {...props} />
}
