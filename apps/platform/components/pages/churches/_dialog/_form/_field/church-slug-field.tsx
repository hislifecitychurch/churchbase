"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldDescription } from "@packages/ui-w/shared/field/field-description"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"

type ChurchSlugFieldProps = {
  disabled?: boolean
  value: string
}

export function ChurchSlugField({ disabled, value }: ChurchSlugFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="church-slug">Church slug</FieldLabel>
      <Input
        disabled={disabled}
        id="church-slug"
        name="slug"
        nativeInput
        readOnly
        size="lg"
        value={value}
      />
      <FieldDescription>A simple name that identifies this church.</FieldDescription>
    </Field>
  )
}
