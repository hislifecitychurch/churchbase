"use client"

import { useMemo, useState } from "react"

import { useCurrentUser } from "@/hooks/api/users/use-current-user"
import { useChurches } from "@/hooks/api/churches/use-churches"
import type { Church } from "@/api/churches/list"
import { getDataTableEmptyState } from "@/lib/data-table/empty-state"

import { DataTable } from "@packages/ui-w/shared/data-table/data-table"
import { Dialog } from "@packages/ui-w/shared/dialog/dialog"

import { ChurchesEmptyState } from "@/components/pages/churches/_data-table/_empty/churches-empty-state"
import { ChurchesErrorState } from "@/components/pages/churches/_data-table/_empty/churches-error-state"
import { ChurchesLoadingState } from "@/components/pages/churches/_data-table/_empty/churches-loading-state"
import { ChurchesNotFoundState } from "@/components/pages/churches/_data-table/_empty/churches-not-found-state"
import { ChurchesDataTableActions } from "./actions"
import { getChurchesDataTableColumns } from "./columns"
import { UpdateChurchDialog } from "@/components/pages/churches/_dialog/update-church-dialog"
import { churchesDataTableSearch, filterChurchesByName } from "./filters"

export function ChurchesDataTable(): React.ReactElement {
  const [search, setSearch] = useState("")
  const [pageIndex, setPageIndex] = useState(0)
  const [isManualRefreshing, setIsManualRefreshing] = useState(false)
  const [editingChurch, setEditingChurch] = useState<Church | null>(null)
  const currentUser = useCurrentUser()
  const canUpdateChurch = currentUser.data?.global_roles === "admin"
  const columns = useMemo(
    () => getChurchesDataTableColumns((church) => setEditingChurch(church), canUpdateChurch),
    [canUpdateChurch],
  )
  const churches = useChurches()
  const hasCachedRows = (churches.data?.length ?? 0) > 0
  const filteredChurches = filterChurchesByName(
    isManualRefreshing ? [] : (churches.data ?? []),
    search,
  )
  const hasNoRows = filteredChurches.length === 0
  const isUnfilteredEmpty = !search.trim() && churches.data !== undefined && !hasCachedRows

  async function refreshChurches(): Promise<void> {
    setIsManualRefreshing(true)
    try {
      await churches.refetch()
    } finally {
      setIsManualRefreshing(false)
    }
  }

  const emptyState = {
    loading: <ChurchesLoadingState />,
    error: <ChurchesErrorState onRetry={() => void churches.refetch()} />,
    "not-found": (
      <ChurchesNotFoundState
        onClear={() => {
          setSearch("")
          setPageIndex(0)
        }}
      />
    ),
    empty: <ChurchesEmptyState />,
  }[
    getDataTableEmptyState({
      isFetching: isManualRefreshing || (churches.isFetching && hasNoRows),
      hasError: Boolean(churches.error && !hasCachedRows),
      isUnfilteredEmpty,
    })
  ]

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-8">
      {churches.error && hasCachedRows && !isManualRefreshing ? (
        <p aria-live="polite" className="text-destructive text-sm" role="alert">
          The latest church list couldn't be loaded. Showing the last successful results.
        </p>
      ) : null}
      <Dialog
        onOpenChange={(open) => {
          if (!open) setEditingChurch(null)
        }}
        open={editingChurch !== null}
      >
        {editingChurch ? (
          <UpdateChurchDialog
            key={editingChurch.id}
            church={editingChurch}
            onUpdated={() => setEditingChurch(null)}
          />
        ) : null}
      </Dialog>
      <DataTable
        columns={columns}
        data={filteredChurches}
        emptyMessage={emptyState}
        getRowId={(church) => church.id}
        isLoading={churches.isPending}
        isRefreshing={isManualRefreshing || (churches.isFetching && !churches.isPending)}
        onPageIndexChange={setPageIndex}
        onRefresh={() => void refreshChurches()}
        onSearch={(value) => {
          setSearch(value.trim())
          setPageIndex(0)
        }}
        pageIndex={pageIndex}
        refreshLabel="Refresh churches"
        searchColumnId={churchesDataTableSearch.columnId}
        searchDisabled={churches.isPending}
        searchPlaceholder={churchesDataTableSearch.placeholder}
        searchValue={search}
        showSelectionCount={false}
        toolbarActions={<ChurchesDataTableActions />}
      />
    </div>
  )
}
