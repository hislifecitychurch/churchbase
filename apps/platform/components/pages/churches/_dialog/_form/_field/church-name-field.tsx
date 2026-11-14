"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"

type ChurchNameFieldProps = {
  disabled?: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

export function ChurchNameField({
  disabled,
  onChange,
  value,
}: ChurchNameFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="church-name">Church name</FieldLabel>
      <Input
        autoComplete="organization"
        disabled={disabled}
        id="church-name"
        name="name"
        nativeInput
        onChange={onChange}
        placeholder="Enter the church name"
        required
        size="lg"
        value={value}
      />
    </Field>
  )
}
