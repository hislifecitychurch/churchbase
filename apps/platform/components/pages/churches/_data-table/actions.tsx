import { IconArchive, IconEditCircle, IconEye } from "@tabler/icons-react"

import type { Church } from "@/api/churches/list"

import type { DataTableRowActionItem } from "@packages/ui-w/shared/data-table/data-table-row-actions"

export { AddChurchButton as ChurchesDataTableActions } from "@/components/pages/churches/_button/add-church-button"

export function getChurchRowActions(
  onUpdate: (church: Church) => void,
  canUpdate: boolean,
): DataTableRowActionItem<Church>[] {
  return [
    { label: "View", icon: IconEye, disabled: true },
    {
      label: "Update",
      icon: IconEditCircle,
      hidden: !canUpdate,
      onSelect: ({ original }) => onUpdate(original),
    },
    { type: "separator" },
    { label: "Archive", icon: IconArchive, variant: "destructive", disabled: true },
  ]
}
