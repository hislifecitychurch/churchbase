import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Church details",
}

export default function ChurchDetailsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>
}
