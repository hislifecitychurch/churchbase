import {
  IconBuildingChurch,
  IconLayoutDashboard,
  IconUsersGroup,
  type TablerIcon,
} from "@tabler/icons-react"

export type PlatformMenuItem = {
  title: string
  href: string
  icon: TablerIcon
}

export const platformMenuItems: PlatformMenuItem[] = [
  { title: "Overview", href: "/", icon: IconLayoutDashboard },
  { title: "Churches", href: "/churches", icon: IconBuildingChurch },
  { title: "Ministries", href: "/ministries", icon: IconUsersGroup },
]
