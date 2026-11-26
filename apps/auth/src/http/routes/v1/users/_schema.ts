import { z } from "zod"

export const provisionUserSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  name: z.string().trim().min(1).max(255),
  password: z.string().min(12).max(128),
})
