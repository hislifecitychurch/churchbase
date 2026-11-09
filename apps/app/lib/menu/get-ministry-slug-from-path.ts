import { ministries } from "@/data/ministries"

export function getMinistrySlugFromPath(pathname: string): string {
  const slug = pathname.split("/")[2]
  return ministries.find((ministry) => ministry.slug === slug)?.slug ?? ministries[0].slug
}
