"use client"

import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"
import { useWizardContext } from "@packages/ui-w/shared/wizard/wizard"

export function WizardHeader({
  className,
  ...props
}: React.ComponentProps<"section">): React.ReactElement | null {
  const { steps, currentStep } = useWizardContext()
  const step = steps[currentStep]
  const titleId = React.useId()

  if (!step) return null

  return (
    <section
      aria-labelledby={titleId}
      aria-live="polite"
      className={cn("space-y-1", className)}
      data-slot="wizard-header"
      {...props}
    >
      <h2 className="text-base font-semibold" id={titleId}>
        {step.heading ?? step.title}
      </h2>
      {step.description != null ? (
        <p className="text-muted-foreground text-sm">{step.description}</p>
      ) : null}
    </section>
  )
}
