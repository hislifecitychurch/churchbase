import { betterAuth } from "better-auth"
import { username } from "better-auth/plugins"

import type { config } from "../../config/_index"
import type { createPostgresDatabase } from "../database/postgres"
import { userModel } from "../models/user"

type AuthConfig = typeof config
type AuthDatabase = ReturnType<typeof createPostgresDatabase>["authDatabase"]

export function createAuth(authDatabase: AuthDatabase, config: AuthConfig) {
  return betterAuth({
    appName: "Churchbase",
    baseURL: config.betterAuth.url,
    basePath: "/api/v1/auth",
    secret: config.betterAuth.secret,
    trustedOrigins: config.cors.allowedOrigins,
    advanced: {
      cookiePrefix: "churchbase",
      useSecureCookies: config.application.environment !== "development",
      ...(config.betterAuth.cookieDomain
        ? {
            crossSubDomainCookies: {
              enabled: true,
              domain: config.betterAuth.cookieDomain.replace(/^\./, ""),
            },
          }
        : {}),
    },
    database: {
      db: authDatabase,
      type: "postgres",
      schemaName: "auth",
    },
    user: userModel,
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      fields: {
        createdAt: "created_at",
        expiresAt: "expires_at",
        ipAddress: "ip_address",
        updatedAt: "updated_at",
        userAgent: "user_agent",
        userId: "user_id",
      },
    },
    account: {
      fields: {
        accessToken: "access_token",
        accessTokenExpiresAt: "access_token_expires_at",
        accountId: "account_id",
        createdAt: "created_at",
        idToken: "id_token",
        providerId: "provider_id",
        refreshToken: "refresh_token",
        refreshTokenExpiresAt: "refresh_token_expires_at",
        updatedAt: "updated_at",
        userId: "user_id",
      },
    },
    verification: {
      fields: {
        createdAt: "created_at",
        expiresAt: "expires_at",
        updatedAt: "updated_at",
      },
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: !config.application.allowEmailSignUp,
      requireEmailVerification: false,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    disabledPaths: ["/is-username-available"],
    plugins: [username({ displayUsername: false })],
    rateLimit: {
      enabled: config.application.environment !== "development",
      storage: "database",
    },
  })
}
