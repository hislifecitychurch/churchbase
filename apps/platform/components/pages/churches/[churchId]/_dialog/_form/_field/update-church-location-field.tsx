"use client"

import type * as React from "react"

import {
  ComboboxSearchInput,
  type ComboboxSearchInputItem,
} from "@packages/ui-w/shared/combobox-variant/combobox-search-input"
import { Button } from "@packages/ui-w/shared/button/button"
import { Field } from "@packages/ui-w/shared/field/field"
import { FieldLabel } from "@packages/ui-w/shared/field/field-label"
import { Input } from "@packages/ui-w/shared/input/input"

export type UpdateChurchLocationFieldProps = {
  disabled: boolean
  emptyLabel: string
  id: string
  items: ComboboxSearchInputItem[]
  label: string
  manual: boolean
  manualPlaceholder: string
  manualValue: string
  onManualChange: (value: string) => void
  onToggleManual: () => void
  onValueChange: (option: ComboboxSearchInputItem | null) => void
  pickerDisabled: boolean
  placeholder: string
  searchPlaceholder: string
  value: ComboboxSearchInputItem | null
}

export function UpdateChurchLocationField({
  disabled,
  emptyLabel,
  id,
  items,
  label,
  manual,
  manualPlaceholder,
  manualValue,
  onManualChange,
  onToggleManual,
  onValueChange,
  pickerDisabled,
  placeholder,
  searchPlaceholder,
  value,
}: UpdateChurchLocationFieldProps): React.ReactElement {
  return (
    <Field className="w-full">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Button
          aria-label={
            manual
              ? `Choose ${label.toLowerCase()} from the list`
              : `Enter ${label.toLowerCase()} manually`
          }
          disabled={disabled}
          onClick={onToggleManual}
          size="xs"
          type="button"
          variant="link"
        >
          {manual ? "Use list" : "Enter manually"}
        </Button>
      </div>
      {manual ? (
        <Input
          disabled={disabled}
          id={id}
          nativeInput
          onChange={(event) => onManualChange(event.currentTarget.value)}
          placeholder={manualPlaceholder}
          size="lg"
          value={manualValue}
        />
      ) : (
        <ComboboxSearchInput
          disabled={disabled || pickerDisabled}
          emptyLabel={emptyLabel}
          id={id}
          items={items}
          onValueChange={onValueChange}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          value={value}
        />
      )}
    </Field>
  )
}
