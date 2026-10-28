import * as React from "react"
import { type Column } from "@tanstack/react-table"
import { IconSearch } from "@tabler/icons-react"

import { Badge } from "@packages/ui-w/shared/badge/badge"
import { Button } from "@packages/ui-w/shared/button/button"
import { Checkbox } from "@packages/ui-w/shared/checkbox/checkbox"
import { Popover } from "@packages/ui-w/shared/popover/popover"
import { PopoverPopup } from "@packages/ui-w/shared/popover/popover-popup"
import { PopoverTrigger } from "@packages/ui-w/shared/popover/popover-trigger"
import { ScrollArea } from "@packages/ui-w/shared/scroll-area/scroll-area"
import { Separator } from "@packages/ui-w/shared/separator/separator"
import { InputGroup } from "@packages/ui-w/shared/input-group/input-group"
import { InputGroupAddon } from "@packages/ui-w/shared/input-group/input-group-addon"
import { InputGroupInput } from "@packages/ui-w/shared/input-group/input-group-input"

export interface DataTableFacetedFilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}

export interface DataTableFacetedFilterGroup<TData, TValue = unknown> {
  id?: string
  column?: Column<TData, TValue>
  title?: string
  options: DataTableFacetedFilterOption[]
  emptyLabel?: React.ReactNode
  searchPlaceholder?: string
}

export interface DataTableFacetedFilterProps<TData> {
  filters: DataTableFacetedFilterGroup<TData>[]
  values?: Record<string, string[]>
  onValueChange?: (columnId: string, values: string[]) => void
  onClear?: () => void
  label?: React.ReactNode
  clearLabel?: React.ReactNode
  disabled?: boolean
}

export function DataTableFacetedFilter<TData>({
  filters,
  values,
  onValueChange,
  onClear,
  label = "Filters",
  clearLabel = "Clear filters",
  disabled = false,
}: DataTableFacetedFilterProps<TData>) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    if (disabled) {
      setOpen(false)
    }
  }, [disabled])

  const totalSelected = filters.reduce((acc, f) => {
    const selected = new Set(
      values?.[f.id ?? f.column?.id ?? ""] ?? (f.column?.getFilterValue() as string[]),
    )
    return acc + selected.size
  }, 0)

  const clearAll = () => {
    if (onClear) {
      onClear()
      setQuery("")
      return
    }

    filters.forEach((f) => {
      if (onValueChange && f.column) onValueChange(f.column.id, [])
      else f.column?.setFilterValue(undefined)
    })
    setQuery("")
  }

  const normalizedQuery = query.trim().toLowerCase()

  const visibleFilters = filters
    .map((filter) => ({
      ...filter,
      matchedOptions: filter.options.filter((o) => o.label.toLowerCase().includes(normalizedQuery)),
    }))
    .filter((f) => f.matchedOptions.length > 0 || normalizedQuery === "")

  const triggerButton = (
    <Button variant="outline" size="lg" className="[&>span]:gap-1" disabled={disabled}>
      {label}
      {totalSelected > 0 ? (
        <Badge variant="secondary" className="ml-1 rounded-xl px-1 font-normal">
          {totalSelected}
        </Badge>
      ) : null}
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={triggerButton} />
      <PopoverPopup
        className="w-64 p-0 **:data-[slot=popover-viewport]:p-0"
        align="end"
        sideOffset={6}
      >
        <div className="border-border border-b p-2">
          <InputGroup>
            <InputGroupAddon aria-hidden="true">
              <IconSearch />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search filters..."
              aria-label="Search filters"
            />
          </InputGroup>
        </div>

        <ScrollArea className="max-h-80">
          {visibleFilters.length > 0 ? (
            visibleFilters.map((filter, index) => {
              const key = filter.title ?? String(index)
              const selectedValues = new Set(
                values?.[filter.id ?? filter.column?.id ?? ""] ??
                  (filter.column?.getFilterValue() as string[]),
              )

              const updateSelection = (value: string) => {
                const next = new Set(selectedValues)
                if (next.has(value)) {
                  next.delete(value)
                } else {
                  next.add(value)
                }
                if (onValueChange && (filter.id ?? filter.column?.id)) {
                  onValueChange(filter.id ?? filter.column!.id, Array.from(next))
                } else {
                  filter.column?.setFilterValue(next.size > 0 ? Array.from(next) : undefined)
                }
              }

              return (
                <React.Fragment key={key}>
                  {index > 0 ? <Separator /> : null}
                  <div className="p-1.5">
                    {filter.title ? (
                      <p className="text-muted-foreground mb-1 px-2 py-1 text-xs font-medium tracking-wide uppercase">
                        {filter.title}
                      </p>
                    ) : null}
                    <div className="space-y-0.5">
                      {filter.matchedOptions.map((option) => {
                        const isSelected = selectedValues.has(option.value)
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateSelection(option.value)}
                            className="hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm transition-colors"
                            data-selected={isSelected || undefined}
                          >
                            <Checkbox
                              checked={isSelected}
                              aria-hidden="true"
                              tabIndex={-1}
                              className="pointer-events-none"
                            />
                            {option.icon ? (
                              <option.icon className="text-muted-foreground size-4" />
                            ) : null}
                            <span className="min-w-0 flex-1 truncate">{option.label}</span>
                            {option.count !== undefined ? (
                              <Badge variant="secondary" className="rounded-xl px-1 font-normal">
                                {option.count}
                              </Badge>
                            ) : null}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </React.Fragment>
              )
            })
          ) : (
            <p className="text-muted-foreground px-2 py-4 text-center text-sm">No results found.</p>
          )}
        </ScrollArea>

        {totalSelected > 0 ? (
          <>
            <Separator />
            <div className="p-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-center rounded-xl"
                onClick={clearAll}
              >
                {clearLabel}
              </Button>
            </div>
          </>
        ) : null}
      </PopoverPopup>
    </Popover>
  )
}
