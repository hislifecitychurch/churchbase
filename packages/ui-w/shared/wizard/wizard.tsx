"use client"

import * as React from "react"

import { cn } from "@repo/ui-w/lib/utils"

export type WizardStepDefinition = {
  title: React.ReactNode
  shortTitle?: React.ReactNode
  heading?: React.ReactNode
  description?: React.ReactNode
}

type WizardContextValue = {
  steps: readonly WizardStepDefinition[]
  currentStep: number
}

const WizardContext = React.createContext<WizardContextValue | null>(null)

export function useWizardContext(): WizardContextValue {
  const context = React.useContext(WizardContext)
  if (!context) throw new Error("Wizard components must be used inside a Wizard.")
  return context
}

export type WizardProps = React.ComponentProps<"div"> & {
  steps: readonly WizardStepDefinition[]
  currentStep: number
}

export function Wizard({
  steps,
  currentStep,
  className,
  ...props
}: WizardProps): React.ReactElement {
  const activeStep = Math.max(0, Math.min(currentStep, steps.length - 1))

  return (
    <WizardContext.Provider value={{ steps, currentStep: activeStep }}>
      <div className={cn("flex w-full flex-col gap-6", className)} data-slot="wizard" {...props} />
    </WizardContext.Provider>
  )
}
