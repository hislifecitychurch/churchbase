"use client"

import { type Row } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"

import { Button } from "@packages/ui-w/shared/button/button"
import { Menu, MenuSub } from "@packages/ui-w/shared/menu/menu"
import { MenuGroup } from "@packages/ui-w/shared/menu/menu-group"
import { MenuGroupLabel } from "@packages/ui-w/shared/menu/menu-group-label"
import { MenuItem } from "@packages/ui-w/shared/menu/menu-item"
import { MenuPopup } from "@packages/ui-w/shared/menu/menu-popup"
import { MenuRadioGroup } from "@packages/ui-w/shared/menu/menu-radio-group"
import { MenuRadioItem } from "@packages/ui-w/shared/menu/menu-radio-item"
import { MenuSeparator } from "@packages/ui-w/shared/menu/menu-separator"
import { MenuShortcut } from "@packages/ui-w/shared/menu/menu-shortcut"
import { MenuSubPopup } from "@packages/ui-w/shared/menu/menu-sub-popup"
import { MenuSubTrigger } from "@packages/ui-w/shared/menu/menu-sub-trigger"
import { MenuTrigger } from "@packages/ui-w/shared/menu/menu-trigger"

type IconComponent = React.ComponentType<{ className?: string }>
export type DataTableRowActionRow<TData> = Pick<Row<TData>, "id" | "original">

export type DataTableRowActionItem<TData> =
  | {
      type?: "item"
      label: React.ReactNode
      icon?: IconComponent
      shortcut?: React.ReactNode
      variant?: "default" | "destructive"
      disabled?: boolean | ((row: DataTableRowActionRow<TData>) => boolean)
      hidden?: boolean | ((row: DataTableRowActionRow<TData>) => boolean)
      onSelect?: (row: DataTableRowActionRow<TData>) => void
    }
  | {
      type: "separator"
      hidden?: boolean | ((row: DataTableRowActionRow<TData>) => boolean)
    }
  | {
      type: "group"
      label: React.ReactNode
      children: DataTableRowActionItem<TData>[]
      hidden?: boolean | ((row: DataTableRowActionRow<TData>) => boolean)
    }
  | {
      type: "submenu"
      label: React.ReactNode
      icon?: IconComponent
      children: DataTableRowActionItem<TData>[]
    }
  | {
      type: "radio-group"
      label: React.ReactNode
      value?: string
      items: Array<{
        label: React.ReactNode
        value: string
      }>
      onValueChange?: (value: string, row: DataTableRowActionRow<TData>) => void
    }

interface DataTableRowActionsProps<TData> {
  row: DataTableRowActionRow<TData>
  items: DataTableRowActionItem<TData>[]
  triggerLabel?: string
}

function renderActionItem<TData>(
  item: DataTableRowActionItem<TData>,
  row: DataTableRowActionRow<TData>,
  key: React.Key,
): React.ReactNode {
  if (item.type === "separator") {
    if (typeof item.hidden === "function" ? item.hidden(row) : item.hidden) {
      return null
    }
    return <MenuSeparator key={key} />
  }

  if (item.type === "group") {
    if (typeof item.hidden === "function" ? item.hidden(row) : item.hidden) {
      return null
    }

    return (
      <MenuGroup key={key}>
        <MenuGroupLabel>{item.label}</MenuGroupLabel>
        {item.children.map((child, index) =>
          renderActionItem(child, row, `${String(key)}-${index}`),
        )}
      </MenuGroup>
    )
  }

  if (item.type === "submenu") {
    const Icon = item.icon

    return (
      <MenuSub key={key}>
        <MenuSubTrigger>
          {Icon ? <Icon className="size-4" /> : null}
          {item.label}
        </MenuSubTrigger>
        <MenuSubPopup>
          {item.children.map((child, index) =>
            renderActionItem(child, row, `${String(key)}-${index}`),
          )}
        </MenuSubPopup>
      </MenuSub>
    )
  }

  if (item.type === "radio-group") {
    return (
      <MenuSub key={key}>
        <MenuSubTrigger>{item.label}</MenuSubTrigger>
        <MenuSubPopup>
          <MenuRadioGroup
            value={item.value}
            onValueChange={(value) => {
              item.onValueChange?.(value, row)
            }}
          >
            {item.items.map((radioItem) => (
              <MenuRadioItem key={radioItem.value} value={radioItem.value}>
                {radioItem.label}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuSubPopup>
      </MenuSub>
    )
  }

  const Icon = item.icon

  if (typeof item.hidden === "function" ? item.hidden(row) : item.hidden) {
    return null
  }

  return (
    <MenuItem
      key={key}
      variant={item.variant}
      disabled={typeof item.disabled === "function" ? item.disabled(row) : item.disabled}
      onClick={() => item.onSelect?.(row)}
    >
      {Icon ? <Icon className="size-4" /> : null}
      {item.label}
      {item.shortcut ? <MenuShortcut>{item.shortcut}</MenuShortcut> : null}
    </MenuItem>
  )
}

export function DataTableRowActions<TData>({
  row,
  items,
  triggerLabel = "Open row actions",
}: DataTableRowActionsProps<TData>) {
  if (items.length === 0) {
    return null
  }

  const trigger = (
    <Button variant="ghost" size="icon" className="data-popup-open:bg-muted size-8">
      <IconDotsVertical className="size-4" />
      <span className="sr-only">{triggerLabel}</span>
    </Button>
  )

  return (
    <Menu>
      <MenuTrigger render={trigger} />
      <MenuPopup align="end" className="w-44">
        {items.map((item, index) => renderActionItem(item, row, `${row.id}-${index}`))}
      </MenuPopup>
    </Menu>
  )
}
