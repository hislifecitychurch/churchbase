import { describe, expect, it } from "bun:test"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { Wizard } from "../../shared/wizard/wizard"
import { WizardContent } from "../../shared/wizard/wizard-content"
import { WizardFooter } from "../../shared/wizard/wizard-footer"
import { WizardHeader } from "../../shared/wizard/wizard-header"
import { WizardProgress } from "../../shared/wizard/wizard-progress"
import { WizardStep } from "../../shared/wizard/wizard-step"

const steps = [
  { title: "Client", heading: "Client information", description: "Client details." },
  { title: "Business", heading: "Business information", description: "Business details." },
]

describe("Wizard", () => {
  it("renders the active step and progress from its definitions", () => {
    const markup = renderToStaticMarkup(
      <Wizard steps={steps} currentStep={1}>
        <WizardProgress />
        <WizardHeader />
        <WizardContent>
          <WizardStep index={0}>Client form</WizardStep>
          <WizardStep index={1}>Business form</WizardStep>
        </WizardContent>
        <WizardFooter>Actions</WizardFooter>
      </Wizard>,
    )

    expect(markup).toContain('aria-current="step"')
    expect(markup).toContain("Business information")
    expect(markup).toContain("Business form")
    expect(markup).not.toContain("Client form")
    expect(markup).toContain('data-slot="wizard-footer"')
  })
})
