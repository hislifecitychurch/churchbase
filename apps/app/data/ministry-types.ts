export const ministryTypes = ["broadcast", "music", "kids"] as const

export type MinistryType = (typeof ministryTypes)[number]
export type WorkspaceType = "churchbase" | MinistryType
