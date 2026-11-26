"use client"

import * as React from "react"

import { cn } from "@packages/ui-w/lib/utils"
import { useWizardContext } from "@packages/ui-w/shared/wizard/wizard"

export function WizardProgress({
  className,
  ...props
}: React.ComponentProps<"nav">): React.ReactElement {
  const { steps, currentStep } = useWizardContext()

  return (
    <nav
      aria-label="Wizard progress"
      className={cn("w-full", className)}
      data-slot="wizard-progress"
      {...props}
    >
      <ol className="flex w-full items-center">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep
          const isComplete = index < currentStep

          return (
            <li
              key={index}
              aria-current={isCurrent ? "step" : undefined}
              className={cn("flex min-w-0 items-center", index < steps.length - 1 && "flex-1")}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : isComplete
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "ms-2 min-w-0 truncate text-xs font-medium sm:text-sm",
                  isCurrent || isComplete ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="sm:hidden">{step.shortTitle ?? step.title}</span>
                <span className="hidden sm:inline">{step.title}</span>
              </span>
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-3 h-px min-w-4 flex-1",
                    isComplete ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
