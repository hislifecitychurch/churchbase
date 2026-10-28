"use client"

import { useState } from "react"
import { IconSearch, IconX } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { Button } from "@packages/ui-w/shared/button/button"
import { Combobox } from "@packages/ui-w/shared/combobox/combobox"
import { ComboboxEmpty } from "@packages/ui-w/shared/combobox/combobox-empty"
import { ComboboxInput } from "@packages/ui-w/shared/combobox/combobox-input"
import { ComboboxItem } from "@packages/ui-w/shared/combobox/combobox-item"
import { ComboboxList } from "@packages/ui-w/shared/combobox/combobox-list"
import { ComboboxPopup } from "@packages/ui-w/shared/combobox/combobox-popup"

export type ComboboxMultipleStackedChipsItem = {
  description?: string
  label: string
  value: string
}

export function ComboboxMultipleStackedChips({
  className,
  disabled = false,
  emptyLabel = "No options found.",
  isLoading = false,
  items,
  onInputValueChange,
  onValueChange,
  placeholder = "Search options...",
  value,
}: {
  className?: string
  disabled?: boolean
  emptyLabel?: string
  isLoading?: boolean
  items: ComboboxMultipleStackedChipsItem[]
  onInputValueChange: (value: string) => void
  onValueChange: (value: ComboboxMultipleStackedChipsItem[]) => void
  placeholder?: string
  value: ComboboxMultipleStackedChipsItem[]
}): React.ReactElement {
  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <Combobox
        filter={null}
        isItemEqualToValue={(item, selected) => item.value === selected.value}
        itemToStringLabel={(item) => item?.label ?? ""}
        items={items}
        multiple
        inputValue={inputValue}
        onOpenChange={setOpen}
        onInputValueChange={(next) => {
          setInputValue(next)
          onInputValueChange(next)
        }}
        onValueChange={(next) => {
          const nextItems = next as ComboboxMultipleStackedChipsItem[]
          const counts = new Map<string, number>()
          nextItems.forEach((item) => counts.set(item.value, (counts.get(item.value) ?? 0) + 1))
          onValueChange(nextItems.filter((item) => counts.get(item.value) === 1))
          setInputValue("")
          onInputValueChange("")
          setOpen(true)
        }}
        open={open}
        value={value}
      >
        <ComboboxInput
          disabled={disabled}
          placeholder={placeholder}
          showTrigger={false}
          startAddon={<IconSearch />}
        />
        <ComboboxPopup>
          {isLoading ? (
            <span className="text-muted-foreground p-4 text-sm">Searching options…</span>
          ) : (
            <>
              <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
              <ComboboxList>
                {(item: ComboboxMultipleStackedChipsItem) => (
                  <ComboboxItem key={item.value} value={item}>
                    <span className="block truncate">
                      <span className="font-medium">{item.label}</span>
                      {item.description ? (
                        <span className="text-muted-foreground font-mono text-xs">
                          {" "}
                          · {item.description}
                        </span>
                      ) : null}
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </>
          )}
        </ComboboxPopup>
      </Combobox>
      {value.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {value.map((item) => (
            <li
              className="border-input flex min-w-0 items-center gap-4 rounded-xl border p-2"
              key={item.value}
            >
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium">{item.label}</span>
                {item.description ? (
                  <span className="text-muted-foreground font-mono text-xs">
                    {" "}
                    · {item.description}
                  </span>
                ) : null}
              </span>
              <Button
                aria-label={`Remove ${item.label}`}
                disabled={disabled}
                onClick={() =>
                  onValueChange(value.filter((selected) => selected.value !== item.value))
                }
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <IconX />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
