export type Environment = Readonly<Record<string, string | undefined>>

export type ApplicationConfig = {
  allowEmailSignUp: boolean
  environment: "development" | "staging" | "production"
  port: number
}

export type BetterAuthConfig = {
  cookieDomain: string | undefined
  secret: string
  serviceToken: string | undefined
  url: string
}

export type CorsConfig = {
  allowedHeaders: string[]
  allowedMethods: string[]
  allowedOrigins: string[]
  allowCredentials: boolean
  exposedHeaders: string[]
}

export type DatabaseConfig = {
  url: string
}
