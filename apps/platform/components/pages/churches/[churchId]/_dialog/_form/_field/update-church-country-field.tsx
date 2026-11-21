"use client"

import type * as React from "react"

import {
  ComboboxSearchInput,
  type ComboboxSearchInputItem,
} from "@packages/ui-w/shared/combobox-variant/combobox-search-input"
import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"

type UpdateChurchCountryFieldProps = {
  disabled: boolean
  emptyLabel: string
  items: ComboboxSearchInputItem[]
  onValueChange: (option: ComboboxSearchInputItem | null) => void
  value: ComboboxSearchInputItem | null
}

export function UpdateChurchCountryField({
  disabled,
  emptyLabel,
  items,
  onValueChange,
  value,
}: UpdateChurchCountryFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="church-country-code">Country</FieldLabel>
      <ComboboxSearchInput
        disabled={disabled}
        emptyLabel={emptyLabel}
        id="church-country-code"
        items={items}
        onValueChange={onValueChange}
        placeholder="Select a country"
        searchPlaceholder="Search countries..."
        value={value}
      />
    </Field>
  )
}
