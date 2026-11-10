import type { JSX, ReactNode } from "react"

import { PlatformAccessGate } from "@/components/shared/platform-access-gate"

export default function ProtectedLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return <PlatformAccessGate>{children}</PlatformAccessGate>
}
