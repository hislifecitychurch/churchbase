"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { createContext } from "react"
import type React from "react"

export type DrawerPosition = "right" | "left" | "top" | "bottom"

export const DrawerContext: React.Context<{ position: DrawerPosition }> = createContext<{
  position: DrawerPosition
}>({
  position: "bottom",
})

export const directionMap: Record<DrawerPosition, DrawerPrimitive.Root.Props["swipeDirection"]> = {
  bottom: "down",
  left: "left",
  right: "right",
  top: "up",
}
