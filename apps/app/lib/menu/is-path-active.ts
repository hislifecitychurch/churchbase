export function isPathActive(pathname: string, path: string): boolean {
  return path === "/" ? pathname === path : pathname === path || pathname.startsWith(`${path}/`)
}
