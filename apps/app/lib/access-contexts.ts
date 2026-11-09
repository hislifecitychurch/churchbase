import type { AccessContext, GlobalRole } from "@/api/access-contexts"
import { getMainMenuItems, mainMenuItemsByMinistry } from "@/data/menu"
import { getMinistrySlugFromPath } from "@/lib/menu/get-ministry-slug-from-path"
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

  const slug = getMinistrySlugFromPath(pathname)
  if (!slug) {
    return null
  }
  const kind = slug === "churchbase" ? "church" : "ministry"
  const candidates = contexts.filter((context) => context.kind === kind && context.slug === slug)
  return contextID
    ? (candidates.find((context) => context.id === contextID) ??
        (globalRole ? (candidates[0] ?? null) : null))
    : (candidates[0] ?? null)
}

export function isConfiguredAccessPath(pathname: string): boolean {
  if (pathname === "/settings") {
    return true
  }
  const slug = getMinistrySlugFromPath(pathname)
  return (mainMenuItemsByMinistry[slug] ?? []).some((item) => item.path === pathname)
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
  return getMainMenuItems(context.slug, context.capabilities).some((item) =>
    isPathActive(pathname, item.path, item.exact),
  )
}

export function contextHomePath(context: AccessContext): string {
  return context.kind === "church" ? "/" : `/ministries/${context.slug}`
}

export function pathWithContext(path: string, contextID: string, currentQuery = ""): string {
  const query = new URLSearchParams(currentQuery)
  query.set(ACCESS_CONTEXT_QUERY_PARAM, contextID)
  return `${path}?${query.toString()}`
}
