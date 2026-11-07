import type { Metadata } from "next"
import type { JSX } from "react"

import { WorkspaceGate } from "@/components/pages/workspace/workspace-gate"
import { getConfiguredReturnURL } from "@/lib/return-url"

export const metadata: Metadata = {
  title: "Workspace",
}

type WorkspacePageProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>
}

export default async function WorkspacePage({
  searchParams,
}: WorkspacePageProps): Promise<JSX.Element> {
  const params = await searchParams
  const returnTo = getConfiguredReturnURL(
    typeof params.returnTo === "string" ? params.returnTo : undefined,
  )

  return <WorkspaceGate returnTo={returnTo} />
}
