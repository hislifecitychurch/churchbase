"use client"

import type * as React from "react"

import {
  ComboboxSearchInput,
  type ComboboxSearchInputItem,
} from "@packages/ui-w/shared/combobox-variant/combobox-search-input"
import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"

type UpdateChurchTimezoneFieldProps = {
  disabled: boolean
  emptyLabel: string
  items: ComboboxSearchInputItem[]
  onValueChange: (option: ComboboxSearchInputItem | null) => void
  value: ComboboxSearchInputItem | null
}

export function UpdateChurchTimezoneField({
  disabled,
  emptyLabel,
  items,
  onValueChange,
  value,
}: UpdateChurchTimezoneFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="church-timezone">Time zone</FieldLabel>
      <ComboboxSearchInput
        disabled={disabled}
        emptyLabel={emptyLabel}
        id="church-timezone"
        items={items}
        onValueChange={onValueChange}
        placeholder="Select a time zone"
        searchPlaceholder="Search time zones..."
        value={value}
      />
    </Field>
  )
}
