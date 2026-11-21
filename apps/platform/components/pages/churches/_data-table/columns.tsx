import Link from "next/link"

import type { ChurchSummary } from "@/api/churches/types"

import type { ColumnDef } from "@tanstack/react-table"
import type { LegacyFeatures } from "@tanstack/react-table/legacy"

export const churchesDataTableColumns: ColumnDef<LegacyFeatures, ChurchSummary>[] = [
  {
    accessorKey: "name",
    size: 260,
    header: "Church",
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col gap-0.5">
        <Link
          className="block truncate font-medium hover:underline"
          href={`/churches/${row.original.id}`}
        >
          {row.original.name}
        </Link>
        {row.original.bio ? (
          <span className="text-muted-foreground block truncate text-xs" title={row.original.bio}>
            {row.original.bio}
          </span>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "slug",
    size: 180,
    header: "Slug",
    cell: ({ row }) => (
      <span className="text-muted-foreground block truncate font-mono text-xs">
        {row.original.slug}
      </span>
    ),
  },
  {
    accessorKey: "active_member_count",
    size: 130,
    header: "Active members",
    cell: ({ row }) => <span>{row.original.active_member_count.toLocaleString()}</span>,
  },
  {
    id: "location",
    size: 220,
    header: "Location",
    cell: ({ row }) => {
      const location = [
        row.original.city,
        row.original.state_or_province,
        row.original.country_code,
      ]
        .filter(Boolean)
        .join(", ")
      return <span className="text-muted-foreground block truncate">{location || "—"}</span>
    },
  },
  {
    accessorKey: "timezone",
    size: 190,
    header: "Time zone",
    cell: ({ row }) => (
      <span className="text-muted-foreground block truncate">{row.original.timezone || "—"}</span>
    ),
  },
]
