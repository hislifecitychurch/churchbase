"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"

type ChurchStateOrProvinceFieldProps = {
  disabled?: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

export function ChurchStateOrProvinceField({
  disabled,
  onChange,
  value,
}: ChurchStateOrProvinceFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="church-state-or-province">State or province</FieldLabel>
      <Input
        autoComplete="address-level1"
        disabled={disabled}
        id="church-state-or-province"
        name="state_or_province"
        nativeInput
        onChange={onChange}
        placeholder="Illinois"
        size="lg"
        value={value}
      />
    </Field>
  )
}
