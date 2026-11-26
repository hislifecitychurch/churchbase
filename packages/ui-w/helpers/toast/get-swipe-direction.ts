import { ToastPosition } from "@packages/ui-w/providers/toast-provider"

export type SwipeDirection = "up" | "down" | "left" | "right"

export function getSwipeDirection(position: ToastPosition): SwipeDirection[] {
  const verticalDirection: SwipeDirection = position.startsWith("top") ? "up" : "down"

  if (position.includes("center")) {
    return [verticalDirection]
  }

  if (position.includes("left")) {
    return ["left", verticalDirection]
  }

  return ["right", verticalDirection]
}
