import { ApiError, apiRequest } from "@/api/client"
import { ministryTypes, type WorkspaceType } from "@/data/ministry-types"
import { accessCapabilities, type AccessCapability } from "@/lib/access-capabilities"

export type GlobalRole = "admin" | "staff"

type AccessContextRole = "admin" | "staff" | "lead" | "member" | "global_admin" | "global_staff"

export type AccessContext = {
  id: string
  church_id: string
  kind: "church" | "ministry"
  type: WorkspaceType
  name: string
  church_name: string
  role: AccessContextRole
  capabilities: AccessCapability[]
}

export type CurrentAccessContexts = {
  global_roles: GlobalRole | null
  contexts: AccessContext[]
}

const capabilitySet = new Set<string>(accessCapabilities)
const uuidPattern = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i
const ministryTypeSet = new Set<string>(ministryTypes)

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
    type,
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
    typeof type !== "string" ||
    (kind === "church" && (type !== "churchbase" || id !== churchID)) ||
    (kind === "ministry" && !ministryTypeSet.has(type)) ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof churchName !== "string" ||
    !churchName.trim() ||
    typeof role !== "string" ||
    !["admin", "staff", "lead", "member", "global_admin", "global_staff"].includes(role) ||
    !Array.isArray(capabilities) ||
    capabilities.some((capability) => typeof capability !== "string")
  ) {
    return null
  }

  const globalRole = role === "global_admin" || role === "global_staff"
  const allowedRole =
    globalRole ||
    (kind === "church" && (role === "admin" || role === "staff")) ||
    (kind === "ministry" && (role === "lead" || role === "member"))
  if (!allowedRole) {
    return null
  }

  return {
    id,
    church_id: churchID,
    kind,
    type: type as WorkspaceType,
    name,
    church_name: churchName,
    role: role as AccessContextRole,
    capabilities: capabilities.filter((capability): capability is AccessCapability =>
      capabilitySet.has(capability),
    ),
  }
}

export async function getAccessContexts(): Promise<CurrentAccessContexts> {
  const data = await apiRequest<unknown>("/users/me/access-contexts")
  if (
    !isRecord(data) ||
    !(
      data.global_roles === null ||
      data.global_roles === "admin" ||
      data.global_roles === "staff"
    ) ||
    !Array.isArray(data.contexts)
  ) {
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
  return { global_roles: data.global_roles, contexts }
}
