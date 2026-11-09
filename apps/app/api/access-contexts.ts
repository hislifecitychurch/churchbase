import { ApiError, apiRequest } from "@/api/client"
import { accessCapabilities, type AccessCapability } from "@/lib/access-capabilities"

export type AccessContext = {
  id: string
  church_id: string
  kind: "church" | "ministry"
  slug: string
  name: string
  church_name: string
  role: "admin" | "staff" | "lead" | "member"
  capabilities: AccessCapability[]
}

const capabilitySet = new Set<string>(accessCapabilities)
const uuidPattern = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseAccessContext(value: unknown): AccessContext | null {
  if (!isRecord(value)) {
    return null
  }
  const {
    id,
    church_id: churchID,
    kind,
    slug,
    name,
    church_name: churchName,
    role,
    capabilities,
  } = value
  if (
    typeof id !== "string" ||
    !uuidPattern.test(id) ||
    typeof churchID !== "string" ||
    !uuidPattern.test(churchID) ||
    (kind !== "church" && kind !== "ministry") ||
    typeof slug !== "string" ||
    !slugPattern.test(slug) ||
    (kind === "church" && (slug !== "churchbase" || id !== churchID)) ||
    (kind === "ministry" && slug === "churchbase") ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof churchName !== "string" ||
    !churchName.trim() ||
    typeof role !== "string" ||
    !["admin", "staff", "lead", "member"].includes(role) ||
    !Array.isArray(capabilities) ||
    capabilities.some((capability) => typeof capability !== "string")
  ) {
    return null
  }

  const allowedRole =
    (kind === "church" && (role === "admin" || role === "staff")) ||
    (kind === "ministry" && (role === "lead" || role === "member"))
  if (!allowedRole) {
    return null
  }

  return {
    id,
    church_id: churchID,
    kind,
    slug,
    name,
    church_name: churchName,
    role: role as AccessContext["role"],
    capabilities: capabilities.filter((capability): capability is AccessCapability =>
      capabilitySet.has(capability),
    ),
  }
}

export async function getAccessContexts(): Promise<AccessContext[]> {
  const data = await apiRequest<unknown>("/users/me/access-contexts")
  if (!isRecord(data) || !Array.isArray(data.contexts)) {
    throw new ApiError(502, "invalid_api_response", "The API returned invalid access contexts.")
  }

  const contexts: AccessContext[] = []
  for (const value of data.contexts) {
    const context = parseAccessContext(value)
    if (!context) {
      throw new ApiError(502, "invalid_api_response", "The API returned invalid access contexts.")
    }
    contexts.push(context)
  }
  return contexts
}
