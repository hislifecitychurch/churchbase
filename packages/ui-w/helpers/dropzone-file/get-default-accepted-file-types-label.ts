export function getDefaultAcceptedFileTypesLabel(acceptedFileTypes: string[]): string {
  return acceptedFileTypes.includes("*") ? "All file types" : acceptedFileTypes.join(", ")
}
