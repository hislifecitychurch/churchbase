import "@packages/ui-w/styles/globals.css"

import type { Metadata } from "next"
import type { JSX, ReactNode } from "react"

import { createMetadata } from "@packages/metadata"
import { geistMono, geistSans } from "@packages/ui-w/lib/fonts"
import { ThemeProvider } from "@packages/ui-w/providers/theme-provider"
import { ToastProvider } from "@packages/ui-w/providers/toast-provider"
import { TooltipProvider } from "@packages/ui-w/providers/tooltip-provider"

import { QueryProvider } from "@/providers/query-provider"

export const metadata: Metadata = createMetadata({
  name: "Churchbase",
})

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden font-sans tracking-tight antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider position="bottom-left">
            <TooltipProvider delay={0}>
              <QueryProvider>
                <main className="relative min-h-svh w-full overflow-x-hidden">{children}</main>
              </QueryProvider>
            </TooltipProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
