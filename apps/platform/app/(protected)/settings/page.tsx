import type { JSX } from "react"

export default function SettingsPage(): JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-foreground text-2xl font-medium">Settings</h1>
      <p className="text-muted-foreground text-sm">Platform settings will be added here.</p>
    </section>
  )
}
