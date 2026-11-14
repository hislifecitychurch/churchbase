import type { Church } from "@/api/churches/list"

import type { ColumnDef } from "@packages/ui-w/shared/data-table/data-table"
import { DataTableColumnHeader } from "@packages/ui-w/shared/data-table/data-table-column-header"
import { DataTableRowActions } from "@packages/ui-w/shared/data-table/data-table-row-actions"

import { getChurchRowActions } from "./actions"

export const churchesDataTableColumns: ColumnDef<Church>[] = [
  {
    accessorKey: "name",
    size: 320,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Church" />,
    cell: ({ row }) => <span className="block truncate font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "slug",
    size: 240,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground block truncate font-mono text-sm">
        {row.original.slug}
      </span>
    ),
  },
  {
    id: "actions",
    size: 64,
    header: () => null,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DataTableRowActions
          items={getChurchRowActions()}
          row={row}
          triggerLabel={`Actions for ${row.original.name}`}
        />
      </div>
    ),
  },
]
