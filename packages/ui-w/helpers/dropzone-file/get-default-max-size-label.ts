export function getDefaultMaxSizeLabel(maxSize: number): string {
  return `Max ${Math.round(maxSize / 1024 / 1024)}MB`
}
