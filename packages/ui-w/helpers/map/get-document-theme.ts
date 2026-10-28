import type { Theme } from "./get-system-theme"

export function getDocumentTheme(): Theme | null {
  if (typeof document === "undefined") return null
  if (document.documentElement.classList.contains("dark")) return "dark"
  if (document.documentElement.classList.contains("light")) return "light"
  return null
}
