import type { SessionVerificationAction } from "@/lib/auth/_types"

export function getSessionVerificationAction(retryAttempts: number): SessionVerificationAction {
  return retryAttempts >= 3 ? "sign-in" : "retry"
}
