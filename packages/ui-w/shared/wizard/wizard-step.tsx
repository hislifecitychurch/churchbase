"use client"

import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"
import { useWizardContext } from "@packages/ui-w/shared/wizard/wizard"

export type WizardStepProps = React.ComponentProps<"div"> & {
  index: number
}

export function WizardStep({
  index,
  className,
  ...props
}: WizardStepProps): React.ReactElement | null {
  const { currentStep } = useWizardContext()
  if (index !== currentStep) return null

  return <div className={cn("space-y-4", className)} data-slot="wizard-step" {...props} />
}
