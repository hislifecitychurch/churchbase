type ReturnURLConfig = {
  allowedOrigins: string[]
  defaultReturnURL: string
}

function parseOrigin(value: string): string {
  const url = new URL(value)

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    url.origin !== value ||
    url.username !== "" ||
    url.password !== ""
  ) {
    throw new Error("Return URL origins must be exact HTTP origins")
  }

  return url.origin
}

export function getSafeReturnURL(candidate: string | undefined, config: ReturnURLConfig): string {
  const allowedOrigins = new Set(config.allowedOrigins.map(parseOrigin))
  const defaultURL = new URL(config.defaultReturnURL)

  if (
    (defaultURL.protocol !== "http:" && defaultURL.protocol !== "https:") ||
    defaultURL.username !== "" ||
    defaultURL.password !== "" ||
    !allowedOrigins.has(defaultURL.origin)
  ) {
    throw new Error("Default return URL must use an allowed origin")
  }

  if (!candidate) {
    return defaultURL.toString()
  }

  try {
    const target = new URL(candidate)

    if (
      (target.protocol !== "http:" && target.protocol !== "https:") ||
      target.username !== "" ||
      target.password !== "" ||
      !allowedOrigins.has(target.origin)
    ) {
      return defaultURL.toString()
    }

    return target.toString()
  } catch {
    return defaultURL.toString()
  }
}
