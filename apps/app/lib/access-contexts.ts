import type { AccessContext, GlobalRole } from "@/api/access-contexts"
import { getMainMenuItems, mainMenuItemsByMinistry } from "@/data/menu"
import { getMinistryTypeFromPath } from "@/lib/menu/get-ministry-type-from-path"
import { isPathActive } from "@/lib/menu/is-path-active"

export const ACCESS_CONTEXT_QUERY_PARAM = "context_id"

export function getAccessContextForPath(
  contexts: readonly AccessContext[],
  pathname: string,
  contextID: string | null,
  globalRole: GlobalRole | null = null,
): AccessContext | null {
  if (pathname === "/settings") {
    return contexts.find((context) => context.id === contextID) ?? contexts[0] ?? null
  }

  const type = getMinistryTypeFromPath(pathname)
  if (!type) {
    return null
  }
  const kind = type === "churchbase" ? "church" : "ministry"
  const candidates = contexts.filter((context) => context.kind === kind && context.type === type)
  return contextID
    ? (candidates.find((context) => context.id === contextID) ??
        (globalRole ? (candidates[0] ?? null) : null))
    : (candidates[0] ?? null)
}

export function isConfiguredAccessPath(pathname: string): boolean {
  if (pathname === "/settings") {
    return true
  }
  const type = getMinistryTypeFromPath(pathname)
  return type ? mainMenuItemsByMinistry[type].some((item) => item.path === pathname) : false
}

export function canAccessPath(
  contexts: readonly AccessContext[],
  pathname: string,
  contextID: string | null,
  globalRole: GlobalRole | null = null,
): boolean {
  if (pathname === "/settings") {
    return true
  }
  if (globalRole) {
    return isConfiguredAccessPath(pathname)
  }
  const context = getAccessContextForPath(contexts, pathname, contextID)
  if (!context) {
    return false
  }
  return getMainMenuItems(context.type, context.capabilities).some((item) =>
    isPathActive(pathname, item.path, item.exact),
  )
}

export function contextHomePath(context: AccessContext): string {
  return context.kind === "church" ? "/" : `/ministries/${context.type}`
}

export function pathWithContext(path: string, contextID: string, currentQuery = ""): string {
  const query = new URLSearchParams(currentQuery)
  query.set(ACCESS_CONTEXT_QUERY_PARAM, contextID)
  return `${path}?${query.toString()}`
}
