export type Environment = Readonly<Record<string, string | undefined>>

export type ApplicationConfig = {
  allowEmailSignUp: boolean
  environment: "development" | "staging" | "production"
  port: number
}

export type BetterAuthConfig = {
  cookieDomain: string | undefined
  secret: string
  url: string
}

export type CorsConfig = {
  allowedOrigins: string[]
}

export type DatabaseConfig = {
  url: string
}
