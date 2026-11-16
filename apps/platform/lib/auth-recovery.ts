export type SessionVerificationAction = "retry" | "sign-in"

export function getSessionVerificationAction(retryAttempts: number): SessionVerificationAction {
  return retryAttempts >= 3 ? "sign-in" : "retry"
}
