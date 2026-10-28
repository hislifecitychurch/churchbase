"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { IconRefresh, IconSearch } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { Button, type ButtonProps } from "@packages/ui-w/shared/button/button"
import { Input } from "@packages/ui-w/shared/input/input"
import {
  DataTableFacetedFilter,
  type DataTableFacetedFilterGroup,
} from "@packages/ui-w/shared/data-table/data-table-faceted-filter"
import { Select } from "@packages/ui-w/shared/select/select"
import { SelectItem } from "@packages/ui-w/shared/select/select-item"
import { SelectPopup } from "@packages/ui-w/shared/select/select-popup"
import { SelectTrigger } from "@packages/ui-w/shared/select/select-trigger"
import { SelectValue } from "@packages/ui-w/shared/select/select-value"
import { Tooltip } from "@packages/ui-w/shared/tooltip/tooltip"
import { TooltipPopup } from "@packages/ui-w/shared/tooltip/tooltip-popup"
import { TooltipTrigger } from "@packages/ui-w/shared/tooltip/tooltip-trigger"

export type DataTableToolbarFilter<TData> = {
  columnId: string
} & Pick<
  DataTableFacetedFilterGroup<TData>,
  "title" | "options" | "emptyLabel" | "searchPlaceholder"
>

export type DataTableToolbarButtonActionProps = {
  label: React.ReactNode
}

export type DataTableToolbarButton = Omit<ButtonProps, "children"> &
  DataTableToolbarButtonActionProps & {
    id?: string
    action?: React.ComponentType<DataTableToolbarButtonActionProps>
  }

export type DataTableToolbarSelectOption = {
  label: React.ReactNode
  value: string
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumnId?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  searchDisabled?: boolean
  facetedFilters?: DataTableToolbarFilter<TData>[]
  facetedFilterValues?: Record<string, string[]>
  onFacetedFilterChange?: (columnId: string, values: string[]) => void
  onFacetedFilterClear?: () => void
  filtersDisabled?: boolean
  filtersLabel?: React.ReactNode
  filtersClearLabel?: React.ReactNode
  buttons?: DataTableToolbarButton[]
  selector?: React.ReactNode
  selectOptions?: DataTableToolbarSelectOption[]
  selectValue?: string
  selectPlaceholder?: string
  selectAriaLabel?: string
  onSelectValueChange?: (value: string) => void
  selectDisabled?: boolean
  leadingActions?: React.ReactNode
  actions?: React.ReactNode
  onRefresh?: () => void
  refreshLabel?: React.ReactNode
  isLoading?: boolean
  isRefreshing?: boolean
}

export function DataTableToolbar<TData>({
  table,
  searchColumnId,
  searchPlaceholder = "Filter...",
  searchValue: controlledSearchValue,
  onSearch,
  searchDisabled = false,
  facetedFilters = [],
  facetedFilterValues,
  onFacetedFilterChange,
  onFacetedFilterClear,
  filtersDisabled = false,
  filtersLabel,
  filtersClearLabel,
  buttons = [],
  selector,
  selectOptions = [],
  selectValue,
  selectPlaceholder = "Select view",
  selectAriaLabel = "Select view",
  onSelectValueChange,
  selectDisabled = false,
  leadingActions,
  actions,
  onRefresh,
  refreshLabel = "Refresh",
  isLoading = false,
  isRefreshing = false,
}: DataTableToolbarProps<TData>) {
  const searchColumn = searchColumnId ? table.getColumn(searchColumnId) : undefined
  const refreshID =
    typeof refreshLabel === "string"
      ? `data-table-refresh-${refreshLabel.toLowerCase().replace(/\s+/g, "-")}`
      : "data-table-refresh"
  const [inputSearchValue, setInputSearchValue] = React.useState<string>(
    controlledSearchValue ?? "",
  )

  const filterGroups = facetedFilters.map((filter) => ({
    id: filter.columnId,
    column: table.getAllColumns().find((column) => column.id === filter.columnId),
    title: filter.title,
    options: filter.options,
    emptyLabel: filter.emptyLabel,
    searchPlaceholder: filter.searchPlaceholder,
  }))

  const isRefreshDisabled = isLoading || isRefreshing

  React.useEffect(() => {
    if (!searchColumn) {
      setInputSearchValue("")
      return
    }

    if (searchDisabled) {
      return
    }

    if (controlledSearchValue === undefined) {
      setInputSearchValue(((searchColumn.getFilterValue() as string) ?? "").toString())
    }
  }, [controlledSearchValue, searchColumn, searchDisabled])

  React.useEffect(() => {
    if (controlledSearchValue !== undefined) {
      setInputSearchValue(controlledSearchValue)
    }
  }, [controlledSearchValue])

  const applySearch = React.useCallback(() => {
    if (!searchColumn || searchDisabled) {
      return
    }

    if (onSearch) {
      onSearch(inputSearchValue)
      return
    }

    searchColumn.setFilterValue(inputSearchValue)
  }, [inputSearchValue, onSearch, searchColumn, searchDisabled])

  if (
    !searchColumn &&
    !searchDisabled &&
    facetedFilters.length === 0 &&
    buttons.length === 0 &&
    !selector &&
    selectOptions.length === 0 &&
    !leadingActions &&
    !actions &&
    !onRefresh
  ) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {searchColumn || searchDisabled ? (
          <div className="flex w-full max-w-80 items-center gap-2">
            <Input
              id={`data-table-search-${searchColumnId ?? "default"}`}
              placeholder={searchPlaceholder}
              value={inputSearchValue}
              onChange={
                searchDisabled ? undefined : (event) => setInputSearchValue(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  applySearch()
                }
              }}
              className="w-full"
              size="lg"
              nativeInput
              disabled={searchDisabled}
            />
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              disabled={searchDisabled}
              aria-label="Search"
              onClick={applySearch}
            >
              <IconSearch className="size-4" />
            </Button>
          </div>
        ) : null}
        {filterGroups.length > 0 ? (
          <DataTableFacetedFilter
            filters={filterGroups}
            values={facetedFilterValues}
            onValueChange={onFacetedFilterChange}
            onClear={onFacetedFilterClear}
            label={filtersLabel}
            clearLabel={filtersClearLabel}
            disabled={filtersDisabled}
          />
        ) : null}
        {leadingActions}
      </div>
      <div className="flex items-center gap-2">
        {selector}
        {!selector && selectOptions.length > 0 && onSelectValueChange ? (
          <Select
            value={selectValue ?? null}
            disabled={selectDisabled}
            onValueChange={(value) => {
              if (value) {
                onSelectValueChange(value)
              }
            }}
          >
            <SelectTrigger
              size="lg"
              className="border-border min-w-32"
              aria-label={selectAriaLabel}
            >
              <SelectValue placeholder={selectPlaceholder} />
            </SelectTrigger>
            <SelectPopup align="end">
              {selectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        ) : null}
        {onRefresh ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  id={refreshID}
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  disabled={isRefreshDisabled}
                  aria-label={typeof refreshLabel === "string" ? refreshLabel : "Refresh"}
                  onClick={onRefresh}
                >
                  <IconRefresh className={cn("size-4", isRefreshing && "animate-spin")} />
                </Button>
              }
            />
            <TooltipPopup side="top" align="center">
              {refreshLabel}
            </TooltipPopup>
          </Tooltip>
        ) : null}
        {buttons.map(({ action: Action, id, label, ...buttonProps }, index) =>
          Action ? (
            <Action key={id ?? index} label={label} />
          ) : (
            <Button key={id ?? index} {...buttonProps}>
              {label}
            </Button>
          ),
        )}
        {actions}
      </div>
    </div>
  )
}
