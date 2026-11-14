"use client"

import type { Church } from "@/api/churches/list"
import { useChurches } from "@/hooks/api/churches/use-churches"

import { Button } from "@packages/ui-w/shared/button/button"
import type { ColumnDef } from "@packages/ui-w/shared/data-table/data-table"
import { DataTable } from "@packages/ui-w/shared/data-table/data-table"
import { DataTableColumnHeader } from "@packages/ui-w/shared/data-table/data-table-column-header"

const columns: ColumnDef<Church>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Church" />,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "slug",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.slug}</span>,
  },
]

export function ChurchesTable(): React.ReactElement {
  const churches = useChurches()

  if (churches.isError && churches.data === undefined) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-muted-foreground text-sm" role="alert">
          {churches.error instanceof Error
            ? churches.error.message
            : "We couldn't load churches. Please try again."}
        </p>
        <Button onClick={() => void churches.refetch()} type="button" variant="outline">
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {churches.isError ? (
        <p className="text-muted-foreground text-sm" role="alert">
          The church list may be out of date. Refresh to try again.
        </p>
      ) : null}
      <DataTable
        columns={columns}
        data={churches.data ?? []}
        emptyMessage={
          churches.isPending ? "Loading churches..." : "No churches have been created yet."
        }
        filteredEmptyMessage="No churches match that name."
        getRowId={(church) => church.id}
        isLoading={churches.isPending}
        isRefreshing={churches.isFetching && !churches.isPending}
        onRefresh={() => void churches.refetch()}
        refreshLabel="Refresh churches"
        searchColumnId="name"
        searchPlaceholder="Search church names..."
        searchDisabled={churches.isPending}
        showSelectionCount={false}
      />
    </div>
  )
}
