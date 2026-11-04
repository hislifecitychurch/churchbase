"use client"

import type * as React from "react"

import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"

type EmailFieldProps = {
  disabled?: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

export function EmailField({ disabled, onChange, value }: EmailFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel className="sr-only" htmlFor="email">
        Email
      </FieldLabel>
      <Input
        autoComplete="email"
        disabled={disabled}
        id="email"
        name="email"
        nativeInput
        onChange={onChange}
        placeholder="Enter your email"
        required
        size="lg"
        spellCheck={false}
        type="email"
        value={value}
      />
    </Field>
  )
}
