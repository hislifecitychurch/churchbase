import { IconAlertTriangle, IconCircleCheck, IconInfoCircle } from "@tabler/icons-react"

/**
 * Sidebar
 */
export const SIDEBAR_COOKIE_NAME = "sidebar_state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "3rem"
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"
/**
 * Toast
 */
export const TOAST_ICONS = {
  error: IconAlertTriangle,
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
} as const

/**
 * Chart
 */
export const THEMES = { light: "", dark: ".dark" } as const
export const INITIAL_DIMENSION = { width: 320, height: 200 } as const
