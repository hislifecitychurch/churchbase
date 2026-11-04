import { IconSettings, type TablerIcon } from "@tabler/icons-react"

export type FooterMenuItem =
  { type: "link"; title: string; path: string; icon: TablerIcon } | { type: "sidebar-trigger" }

export const footerMenuItems: FooterMenuItem[] = [
  {
    type: "link",
    title: "Settings",
    path: "/settings",
    icon: IconSettings,
  },
  { type: "sidebar-trigger" },
]
