"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"

type ChurchCountryCodeFieldProps = {
  disabled?: boolean
  onChange: (value: string) => void
  value: string
}

export function ChurchCountryCodeField({
  disabled,
  onChange,
  value,
}: ChurchCountryCodeFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="church-country-code">Country code</FieldLabel>
      <Input
        autoCapitalize="characters"
        autoComplete="off"
        disabled={disabled}
        id="church-country-code"
        maxLength={2}
        name="country_code"
        nativeInput
        onChange={(event) => onChange(event.target.value.toUpperCase())}
        placeholder="US"
        size="lg"
        value={value}
      />
    </Field>
  )
}
