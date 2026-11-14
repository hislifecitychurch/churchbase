"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldDescription } from "@packages/ui-w/shared/field/field-description"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"

type ChurchSlugFieldProps = {
  disabled?: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

export function ChurchSlugField({
  disabled,
  onChange,
  value,
}: ChurchSlugFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="church-slug">Church slug</FieldLabel>
      <Input
        autoCapitalize="none"
        autoComplete="off"
        disabled={disabled}
        id="church-slug"
        name="slug"
        nativeInput
        onChange={onChange}
        placeholder="e.g. hope-community"
        required
        size="lg"
        spellCheck={false}
        value={value}
      />
      <FieldDescription>A unique identifier used in church links.</FieldDescription>
    </Field>
  )
}
