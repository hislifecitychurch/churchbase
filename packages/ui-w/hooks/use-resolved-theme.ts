import * as React from "react"

import { getDocumentTheme } from "@packages/ui-w/helpers/map/get-document-theme"
import { getSystemTheme, type Theme } from "@packages/ui-w/helpers/map/get-system-theme"

export function useResolvedTheme(themeProp?: "light" | "dark"): Theme {
  const [detectedTheme, setDetectedTheme] = React.useState<Theme>(
    () => getDocumentTheme() ?? getSystemTheme(),
  )

  React.useEffect(() => {
    if (themeProp) return

    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme()
      if (docTheme) {
        setDetectedTheme(docTheme)
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!getDocumentTheme()) {
        setDetectedTheme(e.matches ? "dark" : "light")
      }
    }
    mediaQuery.addEventListener("change", handleSystemChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener("change", handleSystemChange)
    }
  }, [themeProp])

  return themeProp ?? detectedTheme
}
