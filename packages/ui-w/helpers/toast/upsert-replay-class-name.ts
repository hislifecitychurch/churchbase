export function upsertReplayClassName(toast: {
  type?: string
  updateKey?: number
}): string | undefined {
  const k = toast.updateKey ?? 0
  if (k <= 0) return undefined
  const isEven = k % 2 === 0
  if (toast.type === "error") {
    return isEven ? "animate-toast-error-even" : "animate-toast-error-odd"
  }
  return isEven ? "animate-toast-success-even" : "animate-toast-success-odd"
}
