import type { SessionVerificationAction } from "./_types"

export function getSessionVerificationAction(retryAttempts: number): SessionVerificationAction {
  return retryAttempts >= 3 ? "sign-in" : "retry"
}
