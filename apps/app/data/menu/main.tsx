import {
  IconBuildingChurch,
  IconHeartHandshake,
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
  type TablerIcon,
} from "@tabler/icons-react"

export type MainMenuItem = {
  title: string
  path: string
  icon: TablerIcon
}

export const mainMenuItems: MainMenuItem[] = [
  {
    title: "Overview",
    path: "/",
    icon: IconLayoutDashboard,
  },
  {
    title: "People",
    path: "/people",
    icon: IconUsers,
  },
  {
    title: "Ministries",
    path: "/ministries",
    icon: IconBuildingChurch,
  },
  {
    title: "Care",
    path: "/care",
    icon: IconHeartHandshake,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: IconSettings,
  },
]
