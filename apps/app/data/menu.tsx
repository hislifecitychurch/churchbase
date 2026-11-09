import {
  IconBuildingChurch,
  IconCalendarEvent,
  IconDeviceTv,
  IconHeartHandshake,
  IconLayoutDashboard,
  IconListDetails,
  IconMusic,
  IconSchool,
  IconSettings,
  IconShieldCheck,
  IconUserCheck,
  IconUsers,
  IconUsersGroup,
  type TablerIcon,
} from "@tabler/icons-react"

import type { AccessCapability } from "@/lib/access-capabilities"

export type MainMenuItem = {
  title: string
  path: string
  icon: TablerIcon
  capability: AccessCapability
  exact?: boolean
}

export type FooterMenuItem =
  | { type: "link"; title: string; path: string; icon: TablerIcon; capability?: AccessCapability }
  | { type: "sidebar-trigger" }

export const mainMenuItemsByMinistry: Record<string, MainMenuItem[]> = {
  churchbase: [
    { title: "Overview", path: "/", icon: IconLayoutDashboard, capability: "church.overview.read" },
    { title: "People", path: "/people", icon: IconUsers, capability: "church.people.read" },
    {
      title: "Ministries",
      path: "/ministries",
      icon: IconBuildingChurch,
      capability: "church.ministries.read",
    },
    { title: "Care", path: "/care", icon: IconHeartHandshake, capability: "care.read" },
  ],
  broadcast: [
    {
      title: "Overview",
      path: "/ministries/broadcast",
      icon: IconLayoutDashboard,
      capability: "broadcast.overview.read",
      exact: true,
    },
    {
      title: "Services",
      path: "/ministries/broadcast/services",
      icon: IconCalendarEvent,
      capability: "broadcast.services.read",
    },
    {
      title: "Media",
      path: "/ministries/broadcast/media",
      icon: IconDeviceTv,
      capability: "broadcast.media.read",
    },
    {
      title: "Team",
      path: "/ministries/broadcast/team",
      icon: IconUsersGroup,
      capability: "broadcast.team.read",
    },
  ],
  music: [
    {
      title: "Overview",
      path: "/ministries/music",
      icon: IconLayoutDashboard,
      capability: "music.overview.read",
      exact: true,
    },
    {
      title: "Songs & Setlists",
      path: "/ministries/music/songs-and-setlists",
      icon: IconListDetails,
      capability: "music.songs.read",
    },
    {
      title: "Rehearsals",
      path: "/ministries/music/rehearsals",
      icon: IconMusic,
      capability: "music.rehearsals.read",
    },
    {
      title: "Team",
      path: "/ministries/music/team",
      icon: IconUsersGroup,
      capability: "music.team.read",
    },
  ],
  kids: [
    {
      title: "Overview",
      path: "/ministries/kids",
      icon: IconLayoutDashboard,
      capability: "kids.overview.read",
      exact: true,
    },
    {
      title: "Classes",
      path: "/ministries/kids/classes",
      icon: IconSchool,
      capability: "kids.classes.read",
    },
    {
      title: "Check-in",
      path: "/ministries/kids/check-in",
      icon: IconUserCheck,
      capability: "kids.check-in.read",
    },
    {
      title: "Volunteers & Safety",
      path: "/ministries/kids/volunteers-and-safety",
      icon: IconShieldCheck,
      capability: "kids.safety.read",
    },
  ],
}

export const footerMenuItems: FooterMenuItem[] = [
  { type: "link", title: "Settings", path: "/settings", icon: IconSettings },
  { type: "sidebar-trigger" },
]

export function getMainMenuItems(
  ministrySlug: string,
  capabilities: readonly AccessCapability[],
): MainMenuItem[] {
  return (mainMenuItemsByMinistry[ministrySlug] ?? []).filter((item) =>
    capabilities.includes(item.capability),
  )
}
