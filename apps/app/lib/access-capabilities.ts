export const accessCapabilities = [
  "church.overview.read",
  "church.people.read",
  "church.ministries.read",
  "care.read",
  "broadcast.overview.read",
  "broadcast.services.read",
  "broadcast.media.read",
  "broadcast.team.read",
  "music.overview.read",
  "music.songs.read",
  "music.rehearsals.read",
  "music.team.read",
  "kids.overview.read",
  "kids.classes.read",
  "kids.check-in.read",
  "kids.safety.read",
] as const

export type AccessCapability = (typeof accessCapabilities)[number]
