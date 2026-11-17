import { ministryTypes, type WorkspaceType } from "@/data/ministry-types"

export function getMinistryTypeFromPath(pathname: string): WorkspaceType | "" {
  if (!pathname.startsWith("/ministries/")) {
    return "churchbase"
  }
  const type = pathname.split("/")[2]
  return ministryTypes.find((ministryType) => ministryType === type) ?? ""
}
