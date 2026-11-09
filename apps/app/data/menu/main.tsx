import {
  IconBuildingChurch,
  IconCalendarEvent,
  IconDeviceTv,
  IconHeartHandshake,
  IconLayoutDashboard,
  IconListDetails,
  IconMoodKid,
  IconMusic,
  IconSchool,
  IconShieldCheck,
  IconUserCheck,
  IconUsers,
  IconUsersGroup,
  type TablerIcon,
} from "@tabler/icons-react"

export type MainMenuItem = {
  title: string
  path: string
  icon: TablerIcon
  exact?: boolean
}

const churchWideMenuItems: MainMenuItem[] = [
  { title: "Overview", path: "/", icon: IconLayoutDashboard },
  { title: "People", path: "/people", icon: IconUsers },
  { title: "Ministries", path: "/ministries", icon: IconBuildingChurch },
  { title: "Care", path: "/care", icon: IconHeartHandshake },
]

export const mainMenuItemsByMinistry: Record<string, MainMenuItem[]> = {
  churchbase: churchWideMenuItems,
  broadcast: [
    { title: "Overview", path: "/ministries/broadcast", icon: IconLayoutDashboard, exact: true },
    { title: "Services", path: "/ministries/broadcast/services", icon: IconCalendarEvent },
    { title: "Media", path: "/ministries/broadcast/media", icon: IconDeviceTv },
    { title: "Team", path: "/ministries/broadcast/team", icon: IconUsersGroup },
  ],
  music: [
    { title: "Overview", path: "/ministries/music", icon: IconLayoutDashboard, exact: true },
    {
      title: "Songs & Setlists",
      path: "/ministries/music/songs-and-setlists",
      icon: IconListDetails,
    },
    { title: "Rehearsals", path: "/ministries/music/rehearsals", icon: IconMusic },
    { title: "Team", path: "/ministries/music/team", icon: IconUsersGroup },
  ],
  kids: [
    { title: "Overview", path: "/ministries/kids", icon: IconLayoutDashboard, exact: true },
    { title: "Classes", path: "/ministries/kids/classes", icon: IconSchool },
    { title: "Check-in", path: "/ministries/kids/check-in", icon: IconUserCheck },
    {
      title: "Volunteers & Safety",
      path: "/ministries/kids/volunteers-and-safety",
      icon: IconShieldCheck,
    },
  ],
}

export function getMainMenuItems(ministrySlug: string): MainMenuItem[] {
  return mainMenuItemsByMinistry[ministrySlug] ?? churchWideMenuItems
}
