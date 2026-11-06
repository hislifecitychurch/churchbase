"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"

type PasswordFieldProps = {
  disabled?: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

export function PasswordField({
  disabled,
  onChange,
  value,
}: PasswordFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel className="sr-only" htmlFor="password">
        Password
      </FieldLabel>
      <Input
        autoComplete="current-password"
        disabled={disabled}
        id="password"
        name="password"
        nativeInput
        onChange={onChange}
        placeholder="Enter your password"
        required
        size="lg"
        type="password"
        value={value}
      />
    </Field>
  )
}
