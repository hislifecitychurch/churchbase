export function isCSVFile(file: File): boolean {
  return file.name.toLowerCase().endsWith(".csv") || file.type.toLowerCase() === "text/csv"
}
