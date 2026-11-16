import type { Metadata } from "next"
import type { JSX, ReactNode } from "react"

import { BrandHeader } from "@/components/shared/brand-header"

export const metadata: Metadata = {
  title: "Workspace",
}

export default function WorkspaceLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <>
      <BrandHeader />
      {children}
    </>
  )
}
