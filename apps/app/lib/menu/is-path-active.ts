export function isPathActive(pathname: string, path: string, exact = false): boolean {
  return exact || path === "/"
    ? pathname === path
    : pathname === path || pathname.startsWith(`${path}/`)
}
