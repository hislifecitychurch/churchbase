"use client"

import { IconSearch } from "@tabler/icons-react"

import { Combobox } from "@packages/ui-w/shared/combobox/combobox"
import { ComboboxEmpty } from "@packages/ui-w/shared/combobox/combobox-empty"
import { ComboboxInput } from "@packages/ui-w/shared/combobox/combobox-input"
import { ComboboxItem } from "@packages/ui-w/shared/combobox/combobox-item"
import { ComboboxList } from "@packages/ui-w/shared/combobox/combobox-list"
import { ComboboxPopup } from "@packages/ui-w/shared/combobox/combobox-popup"
import { ComboboxTrigger } from "@packages/ui-w/shared/combobox/combobox-trigger"
import { ComboboxValue } from "@packages/ui-w/shared/combobox/combobox-value"
import { SelectButton } from "@packages/ui-w/shared/select/select-button"

export type ComboboxSearchInputItem = { label: string; value: string }

export function ComboboxSearchInput({
  disabled = false,
  emptyLabel = "No options found.",
  items,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search options...",
  value,
}: {
  disabled?: boolean
  emptyLabel?: string
  items: ComboboxSearchInputItem[]
  onValueChange: (value: ComboboxSearchInputItem | null) => void
  placeholder?: string
  searchPlaceholder?: string
  value: ComboboxSearchInputItem | null
}): React.ReactElement {
  return (
    <Combobox
      items={items}
      itemToStringLabel={(item) => item?.label ?? ""}
      onValueChange={(next) => onValueChange(next as ComboboxSearchInputItem | null)}
      value={value}
    >
      <ComboboxTrigger render={<SelectButton disabled={disabled} />}>
        <ComboboxValue placeholder={placeholder} />
      </ComboboxTrigger>
      <ComboboxPopup>
        <div className="border-border border-b p-2">
          <ComboboxInput
            placeholder={searchPlaceholder}
            showTrigger={false}
            startAddon={<IconSearch />}
          />
        </div>
        <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
        <ComboboxList>
          {(item: ComboboxSearchInputItem) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  )
}
