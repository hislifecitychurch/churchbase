"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { Combobox } from "@packages/ui-w/shared/combobox/combobox"
import { ComboboxChip } from "@packages/ui-w/shared/combobox/combobox-chip"
import { ComboboxChips } from "@packages/ui-w/shared/combobox/combobox-chips"
import { ComboboxChipsInput } from "@packages/ui-w/shared/combobox/combobox-chips-input"
import { ComboboxEmpty } from "@packages/ui-w/shared/combobox/combobox-empty"
import { ComboboxItem } from "@packages/ui-w/shared/combobox/combobox-item"
import { ComboboxList } from "@packages/ui-w/shared/combobox/combobox-list"
import { ComboboxPopup } from "@packages/ui-w/shared/combobox/combobox-popup"
import { ComboboxValue } from "@packages/ui-w/shared/combobox/combobox-value"

export type ComboboxMultipleSelectionItem = {
  value: string
  label: string
  isNew?: boolean
}

export function ComboboxMultipleSelection({
  items,
  value,
  onValueChange,
  onCreateValue,
  onRemoveValue,
  showExistingItems = true,
  placeholder = "Add a value...",
  disabled = false,
}: {
  items: ComboboxMultipleSelectionItem[]
  value: ComboboxMultipleSelectionItem[]
  onValueChange?: (value: ComboboxMultipleSelectionItem[]) => void
  onCreateValue?: (value: string) => void
  onRemoveValue?: (value: ComboboxMultipleSelectionItem) => void
  showExistingItems?: boolean
  placeholder?: string
  disabled?: boolean
}): React.ReactElement {
  const [selected, setSelected] = useState(value)
  const [inputValue, setInputValue] = useState("")
  const createdValues = useRef(new Set<string>())
  useEffect(() => setSelected(value), [value])
  const normalizedInput = inputValue.trim()
  const canCreate =
    normalizedInput.length > 0 &&
    !items.some((item) => item.label.toLowerCase() === normalizedInput.toLowerCase())
  const displayItems = useMemo(() => {
    const existingItems =
      showExistingItems || normalizedInput
        ? items.filter(
            (item) =>
              !normalizedInput || item.label.toLowerCase().includes(normalizedInput.toLowerCase()),
          )
        : []
    return canCreate
      ? [...existingItems, { value: `new:${normalizedInput}`, label: normalizedInput, isNew: true }]
      : existingItems
  }, [canCreate, items, normalizedInput, showExistingItems])

  return (
    <Combobox
      items={displayItems}
      filter={null}
      multiple
      value={selected}
      itemToStringLabel={(item) => item?.label ?? ""}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      onValueChange={(next) => {
        const nextItems = next as ComboboxMultipleSelectionItem[]
        selected
          .filter((item) => !nextItems.some((nextItem) => nextItem.value === item.value))
          .forEach((item) => onRemoveValue?.(item))
        nextItems
          .filter((item) => item.isNew && !createdValues.current.has(item.label.toLowerCase()))
          .forEach((item) => {
            createdValues.current.add(item.label.toLowerCase())
            onCreateValue?.(item.label)
          })
        setSelected(nextItems)
        onValueChange?.(nextItems)
        setInputValue("")
      }}
      disabled={disabled}
    >
      <ComboboxChips>
        <ComboboxValue>
          {(current: ComboboxMultipleSelectionItem[]) => (
            <>
              {current.map((item) => (
                <ComboboxChip aria-label={item.label} key={item.value}>
                  {item.label}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                aria-label="Attribute values"
                placeholder={current.length > 0 ? undefined : placeholder}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      {showExistingItems || normalizedInput ? (
        <ComboboxPopup>
          <ComboboxEmpty>No values found.</ComboboxEmpty>
          <ComboboxList>
            {(item: ComboboxMultipleSelectionItem) => (
              <ComboboxItem key={item.value} value={item}>
                {item.isNew ? `Add value “${item.label}”` : item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      ) : null}
    </Combobox>
  )
}
