import type { JSX, ReactNode } from "react"

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return <main className="relative min-h-svh w-full">{children}</main>
}
