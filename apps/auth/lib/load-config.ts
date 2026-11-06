import { z } from "zod"

import { environment } from "../config/env"
import type { Environment } from "../config/_types"

export function loadConfig<TSchema extends z.ZodType>(
  schema: TSchema,
  env: Environment = environment,
): z.output<TSchema> {
  try {
    return schema.parse(env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fields = [
        ...new Set(
          error.issues.flatMap(({ path }) => (typeof path[0] === "string" ? [path[0]] : [])),
        ),
      ]
      throw new Error(`Invalid auth configuration${fields.length ? `: ${fields.join(", ")}` : ""}`)
    }
    throw error
  }
}
