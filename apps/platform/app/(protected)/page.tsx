import type { JSX } from "react"

export default function PlatformPage(): JSX.Element {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-3 px-6 py-12">
      <h1 className="text-foreground text-2xl font-medium">Platform</h1>
      <p className="text-muted-foreground text-sm">
        Sign-in and platform access are connected. Platform management will be added here.
      </p>
    </main>
  )
}
