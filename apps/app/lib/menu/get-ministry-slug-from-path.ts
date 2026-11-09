import { ministries } from "@/data/ministries"

export function getMinistrySlugFromPath(pathname: string): string {
  if (!pathname.startsWith("/ministries/")) {
    return "churchbase"
  }
  const slug = pathname.split("/")[2]
  return (
    ministries.find((ministry) => ministry.slug === slug && ministry.slug !== "churchbase")?.slug ??
    ""
  )
}
