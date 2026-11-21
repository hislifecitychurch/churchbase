"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Textarea } from "@packages/ui-w/shared/textarea/textarea"

type UpdateChurchBioFieldProps = {
  disabled: boolean
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  value: string
}

export function UpdateChurchBioField({
  disabled,
  onChange,
  value,
}: UpdateChurchBioFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="church-bio">About this church</FieldLabel>
      <Textarea
        disabled={disabled}
        id="church-bio"
        name="bio"
        onChange={onChange}
        rows={4}
        value={value}
      />
    </Field>
  )
}
