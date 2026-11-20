import { z } from "zod"

export const envSchema = z.object({
  NEXT_PUBLIC_IDENTITY_URL: z.url().optional(),
  NEXT_PUBLIC_PLATFORM_URL: z.url().optional(),
  NEXT_PUBLIC_API_URL_V1: z.url().default("http://localhost:36080/api/v1"),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_IDENTITY_URL: process.env.NEXT_PUBLIC_IDENTITY_URL,
  NEXT_PUBLIC_PLATFORM_URL: process.env.NEXT_PUBLIC_PLATFORM_URL,
  NEXT_PUBLIC_API_URL_V1: process.env.NEXT_PUBLIC_API_URL_V1,
})
