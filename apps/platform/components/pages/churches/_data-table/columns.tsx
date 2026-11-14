import type { Church } from "@/api/churches/list"

import type { ColumnDef } from "@tanstack/react-table"
import type { LegacyFeatures } from "@tanstack/react-table/legacy"
import { DataTableColumnHeader } from "@packages/ui-w/shared/data-table/data-table-column-header"
import { DataTableRowActions } from "@packages/ui-w/shared/data-table/data-table-row-actions"

import { getChurchRowActions } from "./actions"

export function getChurchesDataTableColumns(
  onUpdateChurch: (church: Church) => void,
  canUpdate: boolean,
): ColumnDef<LegacyFeatures, Church>[] {
  return [
    {
      accessorKey: "name",
      size: 300,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Church" />,
      cell: ({ row }) => (
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="block truncate font-medium">{row.original.name}</span>
          <span className="text-muted-foreground block truncate font-mono text-xs">
            {row.original.slug}
          </span>
          {row.original.bio ? (
            <span className="text-muted-foreground block truncate text-xs" title={row.original.bio}>
              {row.original.bio}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "active_member_count",
      size: 130,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Active members" />,
      cell: ({ row }) => <span>{row.original.active_member_count.toLocaleString()}</span>,
    },
    {
      accessorKey: "website",
      size: 220,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Website" />,
      cell: ({ row }) =>
        row.original.website ? (
          <a
            aria-label={`Visit ${row.original.name} website`}
            className="text-muted-foreground block truncate hover:underline"
            href={row.original.website}
            rel="noopener noreferrer"
            target="_blank"
          >
            {row.original.website}
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: "timezone",
      size: 190,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Time zone" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground block truncate">{row.original.timezone || "—"}</span>
      ),
    },
    {
      id: "actions",
      size: 64,
      header: () => null,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableRowActions
            items={getChurchRowActions(onUpdateChurch, canUpdate)}
            row={row}
            triggerLabel={`Actions for ${row.original.name}`}
          />
        </div>
      ),
    },
  ]
}
