import { z } from "zod"

export const envSchema = z.object({
  NEXT_PUBLIC_AUTH_URL: z.url().default("http://localhost:36081"),
  NEXT_PUBLIC_API_URL_V1: z.url().default("http://localhost:36080/api/v1"),
  NEXT_PUBLIC_PLATFORM_URL: z.url().default("http://localhost:36001"),
  NEXT_PUBLIC_IDENTITY_ALLOWED_RETURN_ORIGINS: z
    .string()
    .default("http://localhost:36002,http://localhost:36001")
    .transform((origins) =>
      origins
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.url()).min(1)),
  NEXT_PUBLIC_IDENTITY_DEFAULT_RETURN_URL: z.url().default("http://localhost:36002/"),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  NEXT_PUBLIC_API_URL_V1: process.env.NEXT_PUBLIC_API_URL_V1,
  NEXT_PUBLIC_PLATFORM_URL: process.env.NEXT_PUBLIC_PLATFORM_URL,
  NEXT_PUBLIC_IDENTITY_ALLOWED_RETURN_ORIGINS:
    process.env.NEXT_PUBLIC_IDENTITY_ALLOWED_RETURN_ORIGINS,
  NEXT_PUBLIC_IDENTITY_DEFAULT_RETURN_URL: process.env.NEXT_PUBLIC_IDENTITY_DEFAULT_RETURN_URL,
})
