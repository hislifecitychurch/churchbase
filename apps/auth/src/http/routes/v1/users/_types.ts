import type { z } from "zod"

import type { provisionUserSchema } from "@/http/routes/v1/users/_schema"

export type ProvisionUserInput = z.output<typeof provisionUserSchema>
export type ProvisionUser = (input: ProvisionUserInput) => Promise<string>
