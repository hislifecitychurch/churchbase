import type { Metadata } from "next"
import type { JSX, ReactNode } from "react"

import { BrandHeader } from "@/components/shared/_header/brand-header"
import { WorkspaceUserMenu } from "@/components/pages/workspace/_menu/workspace-user-menu"

export const metadata: Metadata = {
  title: "Workspace",
}

export default function WorkspaceLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <>
      <BrandHeader />
      <WorkspaceUserMenu />
      {children}
    </>
  )
}
