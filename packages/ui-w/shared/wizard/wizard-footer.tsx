"use client"

import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"

export function WizardFooter({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("flex flex-wrap items-center justify-between gap-4 pt-4", className)}
      data-slot="wizard-footer"
      {...props}
    />
  )
}
