import {
  IconBroadcast,
  IconBuildingChurch,
  IconMoodKid,
  IconMusic,
  type TablerIcon,
} from "@tabler/icons-react"

export type Ministry = {
  slug: string
  name: string
  icon: TablerIcon
}

export const ministries: [Ministry, ...Ministry[]] = [
  {
    slug: "churchbase",
    name: "Church-wide",
    icon: IconBuildingChurch,
  },
  {
    slug: "broadcast",
    name: "Broadcast",
    icon: IconBroadcast,
  },
  {
    slug: "music",
    name: "Music",
    icon: IconMusic,
  },
  {
    slug: "kids",
    name: "Kids",
    icon: IconMoodKid,
  },
]
