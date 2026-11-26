import type { MapStyleOption } from "@packages/ui-w/types/map"

export const defaultMapStyles: Readonly<Record<"dark" | "light", MapStyleOption>> = {
  dark: "https://tiles.openfreemap.org/styles/dark",
  light: "https://tiles.openfreemap.org/styles/bright",
}
