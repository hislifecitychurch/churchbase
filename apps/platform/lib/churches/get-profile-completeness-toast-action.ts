export type ProfileCompletenessToastAction = {
  label: string
  mode: "view" | "update"
}

export function getProfileCompletenessToastAction(
  profileComplete: boolean,
  canUpdateProfile: boolean,
): ProfileCompletenessToastAction | null {
  if (profileComplete) return null

  return canUpdateProfile
    ? { label: "Complete profile", mode: "update" }
    : { label: "View profile", mode: "view" }
}
