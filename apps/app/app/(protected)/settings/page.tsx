import type { Metadata } from "next"
import type { JSX } from "react"

export const metadata: Metadata = {
  title: "Settings",
}

export default function SettingsPage(): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-foreground text-xl font-medium">Settings</h1>
      <p className="text-muted-foreground text-sm">Church settings will live here.</p>
    </div>
  )
}
