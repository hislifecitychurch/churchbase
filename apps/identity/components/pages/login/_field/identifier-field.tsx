"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"

type IdentifierFieldProps = {
  disabled?: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

export function IdentifierField({
  disabled,
  onChange,
  value,
}: IdentifierFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel className="sr-only" htmlFor="identifier">
        Email or username
      </FieldLabel>
      <Input
        autoComplete="username"
        disabled={disabled}
        id="identifier"
        name="identifier"
        nativeInput
        onChange={onChange}
        placeholder="Enter your email or username"
        required
        size="lg"
        spellCheck={false}
        type="text"
        value={value}
      />
    </Field>
  )
}
