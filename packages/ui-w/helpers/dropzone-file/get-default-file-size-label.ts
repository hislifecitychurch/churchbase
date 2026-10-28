export function getDefaultFileSizeLabel(size: number): string {
  return `${(size / 1024).toFixed(1)} KB`
}
