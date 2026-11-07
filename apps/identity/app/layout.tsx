import "@packages/ui-w/styles/globals.css"

import type { Metadata } from "next"
import type { JSX, ReactNode } from "react"

import { createMetadata } from "@packages/metadata"
import { geistMono, geistSans, geistSerif } from "@packages/ui-w/lib/fonts"
import { ThemeProvider } from "@packages/ui-w/providers/theme-provider"

export const metadata: Metadata = createMetadata({
  name: "Churchbase",
})

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${geistSerif.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden font-sans tracking-tight antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="relative min-h-svh w-full overflow-x-hidden">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
