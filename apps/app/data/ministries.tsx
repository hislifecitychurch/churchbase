import {
  IconBroadcast,
  IconBuildingChurch,
  IconMoodKid,
  IconMusic,
  type TablerIcon,
} from "@tabler/icons-react"

import type { WorkspaceType } from "@/data/ministry-types"

export type Ministry = {
  type: WorkspaceType
  name: string
  icon: TablerIcon
}

export const ministries: [Ministry, ...Ministry[]] = [
  {
    type: "churchbase",
    name: "Church-wide",
    icon: IconBuildingChurch,
  },
  {
    type: "broadcast",
    name: "Broadcast",
    icon: IconBroadcast,
  },
  {
    type: "music",
    name: "Music",
    icon: IconMusic,
  },
  {
    type: "kids",
    name: "Kids",
    icon: IconMoodKid,
  },
]
