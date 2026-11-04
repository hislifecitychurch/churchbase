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
  detail: string
  icon: TablerIcon
}

export const ministries: [Ministry, ...Ministry[]] = [
  {
    slug: "churchbase",
    name: "Churchbase",
    detail: "All ministries",
    icon: IconBuildingChurch,
  },
  {
    slug: "broadcast",
    name: "Broadcast",
    detail: "Leader",
    icon: IconBroadcast,
  },
  {
    slug: "music",
    name: "Music",
    detail: "Member",
    icon: IconMusic,
  },
  {
    slug: "kids",
    name: "Kids",
    detail: "Member",
    icon: IconMoodKid,
  },
]
