"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"

type UpdateChurchWebsiteFieldProps = {
  disabled: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

export function UpdateChurchWebsiteField({
  disabled,
  onChange,
  value,
}: UpdateChurchWebsiteFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="church-website">Website</FieldLabel>
      <Input
        disabled={disabled}
        id="church-website"
        nativeInput
        onChange={onChange}
        placeholder="https://example.org"
        size="lg"
        type="url"
        value={value}
      />
    </Field>
  )
}
