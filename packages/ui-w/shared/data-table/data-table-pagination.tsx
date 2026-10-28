import { type Table } from "@tanstack/react-table"

import { Pagination } from "@packages/ui-w/shared/pagination/pagination"
import { PaginationContent } from "@packages/ui-w/shared/pagination/pagination-content"
import { PaginationEllipsis } from "@packages/ui-w/shared/pagination/pagination-ellipsis"
import { PaginationItem } from "@packages/ui-w/shared/pagination/pagination-item"
import { PaginationLink } from "@packages/ui-w/shared/pagination/pagination-link"
import { PaginationNext } from "@packages/ui-w/shared/pagination/pagination-next"
import { PaginationPrevious } from "@packages/ui-w/shared/pagination/pagination-previous"
import { Select } from "@packages/ui-w/shared/select/select"
import { SelectButton } from "@packages/ui-w/shared/select/select-button"
import { SelectItem } from "@packages/ui-w/shared/select/select-item"
import { SelectPopup } from "@packages/ui-w/shared/select/select-popup"
import { SelectValue } from "@packages/ui-w/shared/select/select-value"

interface DataTablePaginationProps<TData> {
  table?: Table<TData>
  pagination?: {
    page: number
    pages: number
    has_next: boolean
    has_prev: boolean
  }
  onPageChange?: (page: number) => void
  onPreviousPage?: () => void
  onNextPage?: () => void
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showSelectionCount?: boolean
  actions?: React.ReactNode
}

function getPageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total]
  if (current >= total - 3)
    return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total]
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total]
}

export function DataTablePagination<TData>({
  table,
  pagination,
  onPageChange,
  onPreviousPage,
  onNextPage,
  pageSizeOptions = [10, 20, 25, 30, 40, 50],
  showPageSizeSelector = false,
  showSelectionCount = true,
  actions,
}: DataTablePaginationProps<TData>) {
  const filteredRowCount = table?.getFilteredRowModel().rows.length ?? 0

  if (!table && !pagination) {
    return null
  }

  if (!pagination && table && filteredRowCount === 0) {
    return null
  }

  if (pagination && table && table.getRowModel().rows.length === 0) {
    return null
  }

  const currentPage = pagination?.page ?? (table ? table.getState().pagination.pageIndex + 1 : 1)
  const pageCount = pagination?.pages ?? table?.getPageCount() ?? 0
  const pages = getPageRange(currentPage, pageCount)
  const canPreviousPage = pagination?.has_prev ?? table?.getCanPreviousPage() ?? false
  const canNextPage = pagination?.has_next ?? table?.getCanNextPage() ?? false

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-center gap-4">
        {actions}
        {table && showSelectionCount ? (
          <p className="text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of {filteredRowCount} row(s) selected.
          </p>
        ) : null}

        {table && showPageSizeSelector ? (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectButton className="border-border h-9 w-fit rounded-xl px-3">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectButton>
              <SelectPopup alignItemWithTrigger={false}>
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </div>
        ) : null}
      </div>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (!canPreviousPage) return
                if (pagination) {
                  onPageChange?.(currentPage - 1)
                } else if (table) {
                  table.previousPage()
                } else {
                  onPreviousPage?.()
                }
              }}
              aria-disabled={!canPreviousPage}
              className={!canPreviousPage ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>

          {pages.map((page, i) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  className={page === currentPage ? "border-border" : undefined}
                  onClick={() => {
                    if (pagination) {
                      onPageChange?.(page)
                    } else if (table) {
                      table.setPageIndex(page - 1)
                    } else {
                      onPageChange?.(page)
                    }
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (!canNextPage) return
                if (pagination) {
                  onPageChange?.(currentPage + 1)
                } else if (table) {
                  table.nextPage()
                } else {
                  onNextPage?.()
                }
              }}
              aria-disabled={!canNextPage}
              className={!canNextPage ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
