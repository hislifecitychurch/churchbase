export function isAcceptedFile(file: File, accept?: string): boolean {
  const tokens = (accept ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  if (tokens.length === 0) {
    return true
  }

  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()

  return tokens.some((token) => {
    if (token.startsWith(".")) {
      return fileName.endsWith(token)
    }

    if (token.endsWith("/*")) {
      return fileType.startsWith(token.slice(0, -1))
    }

    return fileType === token
  })
}
