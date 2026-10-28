"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Table as ReactTable,
  type Row,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table"

import { Table } from "@packages/ui-w/shared/table/table"
import { TableBody } from "@packages/ui-w/shared/table/table-body"
import { TableCell } from "@packages/ui-w/shared/table/table-cell"
import { TableHead } from "@packages/ui-w/shared/table/table-head"
import { TableHeader } from "@packages/ui-w/shared/table/table-header"
import { TableRow } from "@packages/ui-w/shared/table/table-row"
import { DataTablePagination } from "@packages/ui-w/shared/data-table/data-table-pagination"
import {
  DataTableToolbar,
  type DataTableToolbarButton,
  type DataTableToolbarFilter,
  type DataTableToolbarSelectOption,
} from "@packages/ui-w/shared/data-table/data-table-toolbar"

export type { ColumnDef, FilterFn } from "@tanstack/react-table"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  emptyMessage?: React.ReactNode
  filteredEmptyMessage?: React.ReactNode
  tableContainerClassName?: string
  initialPageSize?: number
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
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
  toolbarButtons?: DataTableToolbarButton[]
  toolbarSelector?: React.ReactNode
  toolbarSelectOptions?: DataTableToolbarSelectOption[]
  toolbarSelectValue?: string
  toolbarSelectPlaceholder?: string
  toolbarSelectAriaLabel?: string
  onToolbarSelectValueChange?: (value: string) => void
  toolbarSelectDisabled?: boolean
  toolbarLeadingActions?: React.ReactNode
  toolbarActions?: React.ReactNode
  paginationActions?: React.ReactNode
  onRefresh?: () => void
  refreshLabel?: React.ReactNode
  isLoading?: boolean
  isRefreshing?: boolean
  showToolbar?: boolean
  showPagination?: boolean
  showSelectionCount?: boolean
  enableRowSelection?: boolean
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string
  onSelectionChange?: (selectedRows: TData[]) => void
  renderContent?: (table: ReactTable<TData>) => React.ReactNode
  pageIndex?: number
  onPageIndexChange?: (pageIndex: number) => void
  pagination?: {
    page: number
    pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "No results.",
  filteredEmptyMessage,
  tableContainerClassName,
  initialPageSize = 25,
  pageSizeOptions,
  showPageSizeSelector = false,
  searchColumnId,
  searchPlaceholder,
  searchValue,
  onSearch,
  searchDisabled = false,
  facetedFilters = [],
  facetedFilterValues,
  onFacetedFilterChange,
  onFacetedFilterClear,
  filtersDisabled = false,
  toolbarButtons = [],
  toolbarSelector,
  toolbarSelectOptions = [],
  toolbarSelectValue,
  toolbarSelectPlaceholder,
  toolbarSelectAriaLabel,
  onToolbarSelectValueChange,
  toolbarSelectDisabled = false,
  toolbarLeadingActions,
  toolbarActions,
  paginationActions,
  onRefresh,
  refreshLabel,
  isLoading = false,
  isRefreshing = false,
  showToolbar = true,
  showPagination = true,
  showSelectionCount = true,
  enableRowSelection = false,
  getRowId,
  onSelectionChange,
  renderContent,
  pageIndex,
  onPageIndexChange,
  pagination: externalPagination,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: pageIndex ?? 0,
    pageSize: initialPageSize,
  })

  const pagination = React.useMemo<PaginationState>(
    () => ({
      pageIndex: pageIndex ?? internalPagination.pageIndex,
      pageSize: internalPagination.pageSize,
    }),
    [internalPagination.pageIndex, internalPagination.pageSize, pageIndex],
  )

  const handlePaginationChange = React.useCallback(
    (updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
      const nextPagination = typeof updater === "function" ? updater(pagination) : updater

      setInternalPagination(nextPagination)

      if (onPageIndexChange && nextPagination.pageIndex !== pagination.pageIndex) {
        onPageIndexChange(nextPagination.pageIndex)
      }
    },
    [onPageIndexChange, pagination],
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      pagination,
    },
    manualPagination: Boolean(externalPagination),
    pageCount: externalPagination?.pages,
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    autoResetPageIndex: false,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: handlePaginationChange,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  React.useEffect(() => {
    if (pageIndex === undefined) {
      return
    }

    setInternalPagination((current) =>
      current.pageIndex === pageIndex ? current : { ...current, pageIndex },
    )
  }, [pageIndex])

  React.useEffect(() => {
    if (externalPagination) {
      return
    }

    const pageCount = table.getPageCount()
    if (pageCount > 0 && pagination.pageIndex > pageCount - 1) {
      table.setPageIndex(pageCount - 1)
    }
  }, [externalPagination, pagination.pageIndex, table])

  React.useEffect(() => {
    if (!onSelectionChange) {
      return
    }

    onSelectionChange(table.getSelectedRowModel().rows.map((row) => row.original))
  }, [onSelectionChange, rowSelection, table])

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {showToolbar ? (
        <DataTableToolbar
          table={table}
          searchColumnId={searchColumnId}
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearch={onSearch}
          searchDisabled={searchDisabled}
          facetedFilters={facetedFilters}
          facetedFilterValues={facetedFilterValues}
          onFacetedFilterChange={onFacetedFilterChange}
          onFacetedFilterClear={onFacetedFilterClear}
          filtersDisabled={filtersDisabled}
          buttons={toolbarButtons}
          selector={toolbarSelector}
          selectOptions={toolbarSelectOptions}
          selectValue={toolbarSelectValue}
          selectPlaceholder={toolbarSelectPlaceholder}
          selectAriaLabel={toolbarSelectAriaLabel}
          onSelectValueChange={onToolbarSelectValueChange}
          selectDisabled={toolbarSelectDisabled}
          leadingActions={toolbarLeadingActions}
          actions={toolbarActions}
          onRefresh={onRefresh}
          refreshLabel={refreshLabel}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
        />
      ) : null}
      {renderContent ? (
        renderContent(table)
      ) : (
        <div className="border-border overflow-hidden rounded-xl border">
          <Table className="table-fixed" containerClassName={tableContainerClassName}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnSize = header.column.columnDef.size

                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={
                          typeof columnSize === "number"
                            ? { minWidth: columnSize, width: columnSize }
                            : undefined
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => {
                      const columnSize = cell.column.columnDef.size

                      return (
                        <TableCell
                          key={cell.id}
                          style={
                            typeof columnSize === "number"
                              ? { minWidth: columnSize, width: columnSize }
                              : undefined
                          }
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {data.length > 0 && table.getState().columnFilters.length > 0
                      ? (filteredEmptyMessage ?? emptyMessage)
                      : emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {showPagination ? (
        <DataTablePagination
          table={table}
          pagination={externalPagination}
          onPageChange={externalPagination ? (page) => onPageIndexChange?.(page - 1) : undefined}
          pageSizeOptions={pageSizeOptions}
          showPageSizeSelector={showPageSizeSelector}
          showSelectionCount={showSelectionCount}
          actions={paginationActions}
        />
      ) : null}
    </div>
  )
}
