"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"

type ChurchCityFieldProps = {
  disabled?: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

export function ChurchCityField({
  disabled,
  onChange,
  value,
}: ChurchCityFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="church-city">City</FieldLabel>
      <Input
        autoComplete="address-level2"
        disabled={disabled}
        id="church-city"
        name="city"
        nativeInput
        onChange={onChange}
        placeholder="Springfield"
        size="lg"
        value={value}
      />
    </Field>
  )
}
